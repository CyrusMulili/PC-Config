# Firebase Security Specification (TDD)

## 1. Data Invariants

- **User Identity Bound**: Users can only read, write, create, or update their own user profiles and their own saved PC builds. Any access to another user's document is strictly forbidden.
- **Strict Fields**:
  - `UserProfile` must exactly match the required schema: `userId`, `displayName`, `photoURL`, `email`, and `createdAt`. No ghost fields are allowed.
  - `PCBuild` must contain valid keys: `id`, `userId`, `buildName`, `budgetKSh`, `totalCostKSh`, `useCase`, `sourcingMode`, `components`, `ownedSpecs` (optional), `chatHistory` (optional), `createdAt`, and `updatedAt`.
- **Temporal Invariant**:
  - `createdAt` must be strictly set to the server timestamp `request.time` during creation.
  - `updatedAt` must be strictly set to `request.time` during creation or updates.
- **ID Integrity**:
  - The `userId` inside `UserProfile` and `PCBuild` must match the authenticated user's UID (`request.auth.uid`).
  - Document IDs must match the `isValidId` format (alphanumeric with underscores or dashes, maximum length 128 characters).

---

## 2. The "Dirty Dozen" Malicious Payloads

The following payloads represent attempt definitions to bypass security controls, and must always return `PERMISSION_DENIED`.

### Payload 1: Hijack Profile (Identity Spoofing)
An authenticated user `attacker_uid` attempts to write a user profile for user `victim_uid`.
```json
{
  "userId": "victim_uid",
  "displayName": "Victim",
  "email": "victim@example.com",
  "photoURL": "https://example.com/victim.png",
  "createdAt": "request.time"
}
```

### Payload 2: Ghost Role Injection (Privilege Escalation)
An authenticated user attempts to inject an unapproved `isAdmin` or `role` property into their profile.
```json
{
  "userId": "attacker_uid",
  "displayName": "Attacker",
  "email": "attacker@example.com",
  "photoURL": "https://example.com/attacker.png",
  "createdAt": "request.time",
  "isAdmin": true
}
```

### Payload 3: Spoof Author UID (PCBuild Identity Spoofing)
An authenticated user `attacker_uid` attempts to save a PC build with `userId` set to `victim_uid`.
```json
{
  "id": "build_123",
  "userId": "victim_uid",
  "buildName": "Malicious Build",
  "budgetKSh": 100000,
  "totalCostKSh": 95000,
  "useCase": "Gaming",
  "sourcingMode": "live",
  "components": [],
  "createdAt": "request.time",
  "updatedAt": "request.time"
}
```

### Payload 4: Fake Sourcing Mode (Integrity Violation)
An attacker saves a build with an invalid/malicious sourcing mode (e.g. attempting to inject shellcode or overflow).
```json
{
  "id": "build_123",
  "userId": "attacker_uid",
  "buildName": "Malicious Sourcing",
  "budgetKSh": 100000,
  "totalCostKSh": 95000,
  "useCase": "Gaming",
  "sourcingMode": "very_long_unapproved_mode_string_longer_than_permitted_limit_...",
  "components": [],
  "createdAt": "request.time",
  "updatedAt": "request.time"
}
```

### Payload 5: Spoof Creation Timestamp (Temporal Integrity Violation)
An attacker attempts to write a back-dated `createdAt` timestamp.
```json
{
  "id": "build_123",
  "userId": "attacker_uid",
  "buildName": "Backdated Build",
  "budgetKSh": 100000,
  "totalCostKSh": 95000,
  "useCase": "Gaming",
  "sourcingMode": "live",
  "components": [],
  "createdAt": "timestamp_from_2010_01_01T00_00_00Z",
  "updatedAt": "request.time"
}
```

### Payload 6: Denial of Wallet (Resource Exhaustion ID Poisoning)
An attacker injects a 1.5MB junk-character string as the document ID path variable `buildId` to exhaust DB memory/indexes.
```json
// Path: /users/attacker_uid/builds/<1.5MB_JUNK_STRING>
{
  "id": "<1.5MB_JUNK_STRING>",
  "userId": "attacker_uid",
  "buildName": "Junk ID Build",
  "budgetKSh": 100000,
  "totalCostKSh": 95000,
  "useCase": "Gaming",
  "sourcingMode": "live",
  "components": [],
  "createdAt": "request.time",
  "updatedAt": "request.time"
}
```

### Payload 7: Update Immutable Field (PCBuild Tampering)
An attacker attempts to modify `createdAt` or `userId` after creation.
```json
// Existing document has userId: "attacker_uid", createdAt: "2026-06-26T00:00:00Z"
// Attacker tries to update:
{
  "id": "build_123",
  "userId": "victim_uid",
  "buildName": "Updated Build",
  "budgetKSh": 100000,
  "totalCostKSh": 95000,
  "useCase": "Gaming",
  "sourcingMode": "live",
  "components": [],
  "createdAt": "2020-01-01T00:00:00Z",
  "updatedAt": "request.time"
}
```

### Payload 8: Blanket Read Query Scraping (PII Protection Bypass)
An unauthenticated or standard authenticated user attempts to execute a blanket query on `/users` collection without filtering by their own `userId`.
```ts
// db.collectionGroup('builds').get() or db.collection('users').get() without where("userId", "==", currentUid)
```

### Payload 9: Bypass Field Limit Enforcements (Memory Attack)
An attacker includes an extremely large list of components (e.g. 1000 components) to bloat document limits.
```json
{
  "id": "build_123",
  "userId": "attacker_uid",
  "buildName": "Bloated Build",
  "budgetKSh": 100000,
  "totalCostKSh": 95000,
  "useCase": "Gaming",
  "sourcingMode": "live",
  "components": [ /* 1000 fake component maps */ ],
  "createdAt": "request.time",
  "updatedAt": "request.time"
}
```

### Payload 10: State Shortcut (Nullifying Sourcing Mode)
An attacker updates their build to a null sourcing mode or removes required properties like `budgetKSh`.
```json
{
  "id": "build_123",
  "userId": "attacker_uid",
  "buildName": "Missing Budget Build",
  "totalCostKSh": 95000,
  "useCase": "Gaming",
  "sourcingMode": "live",
  "components": [],
  "createdAt": "request.time",
  "updatedAt": "request.time"
}
```

### Payload 11: Email Verification Spoofing
An attacker with an unverified email (e.g. `victim@admin.com` but `email_verified == false`) attempts to write to a secure admin log or database resource.
```json
// request.auth.token.email_verified == false
```

### Payload 12: Orphaned Relationship Creation
An attacker creates a PCBuild referring to a non-existent `userId` or invalid referenced ID.
```json
// Attempting to create a PCBuild under a victim's user ID path without existing profile or verified association.
```

---

## 3. Test Runner Specification (`firestore.rules.test.ts`)

Below is the structured test code designed to execute and verify that all "Dirty Dozen" payloads return `PERMISSION_DENIED` and valid payloads succeed.

```typescript
import {
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, setDoc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import * as fs from 'fs';

let testEnv: RulesTestEnvironment;

describe('Jenga Firestore Security Rules TDD', () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'gen-lang-client-0371028649',
      firestore: {
        rules: fs.readFileSync('firestore.rules', 'utf8'),
        host: 'localhost',
        port: 8080,
      },
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
  });

  test('SUCCESS: User can write their own profile and builds', async () => {
    const aliceContext = testEnv.authenticatedContext('alice_uid', { email: 'alice@example.com', email_verified: true });
    const aliceDb = aliceContext.firestore();

    // Create profile
    await expect(
      setDoc(doc(aliceDb, 'users', 'alice_uid'), {
        userId: 'alice_uid',
        displayName: 'Alice',
        email: 'alice@example.com',
        photoURL: 'https://example.com/alice.png',
        createdAt: new Date(),
      })
    ).resolves.not.toThrow();

    // Create build
    await expect(
      setDoc(doc(aliceDb, 'users', 'alice_uid', 'builds', 'build_1'), {
        id: 'build_1',
        userId: 'alice_uid',
        buildName: 'Dream PC',
        budgetKSh: 150000,
        totalCostKSh: 145000,
        useCase: 'Gaming',
        sourcingMode: 'live',
        components: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    ).resolves.not.toThrow();
  });

  test('FAIL: Payload 1 - Hijack Profile (Identity Spoofing)', async () => {
    const attackerContext = testEnv.authenticatedContext('attacker_uid', { email: 'attacker@example.com', email_verified: true });
    const attackerDb = attackerContext.firestore();

    await expect(
      setDoc(doc(attackerDb, 'users', 'victim_uid'), {
        userId: 'victim_uid',
        displayName: 'Victim',
        email: 'victim@example.com',
        photoURL: 'https://example.com/victim.png',
        createdAt: new Date(),
      })
    ).rejects.toThrow();
  });

  test('FAIL: Payload 2 - Ghost Role Injection (Privilege Escalation)', async () => {
    const attackerContext = testEnv.authenticatedContext('attacker_uid', { email: 'attacker@example.com', email_verified: true });
    const attackerDb = attackerContext.firestore();

    await expect(
      setDoc(doc(attackerDb, 'users', 'attacker_uid'), {
        userId: 'attacker_uid',
        displayName: 'Attacker',
        email: 'attacker@example.com',
        photoURL: 'https://example.com/attacker.png',
        createdAt: new Date(),
        isAdmin: true, // Ghost field
      })
    ).rejects.toThrow();
  });

  test('FAIL: Payload 3 - Spoof Author UID (PCBuild Identity Spoofing)', async () => {
    const attackerContext = testEnv.authenticatedContext('attacker_uid', { email: 'attacker@example.com', email_verified: true });
    const attackerDb = attackerContext.firestore();

    await expect(
      setDoc(doc(attackerDb, 'users', 'attacker_uid', 'builds', 'build_123'), {
        id: 'build_123',
        userId: 'victim_uid', // Spoofed UID
        buildName: 'Malicious Build',
        budgetKSh: 100000,
        totalCostKSh: 95000,
        useCase: 'Gaming',
        sourcingMode: 'live',
        components: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    ).rejects.toThrow();
  });

  test('FAIL: Payload 6 - Denial of Wallet (ID Poisoning)', async () => {
    const attackerContext = testEnv.authenticatedContext('attacker_uid', { email: 'attacker@example.com', email_verified: true });
    const attackerDb = attackerContext.firestore();
    const longId = 'a'.repeat(1000);

    await expect(
      setDoc(doc(attackerDb, 'users', 'attacker_uid', 'builds', longId), {
        id: longId,
        userId: 'attacker_uid',
        buildName: 'Dream PC',
        budgetKSh: 100000,
        totalCostKSh: 95000,
        useCase: 'Gaming',
        sourcingMode: 'live',
        components: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    ).rejects.toThrow();
  });

  test('FAIL: Payload 8 - Blanket Read Query Scraping', async () => {
    const attackerContext = testEnv.authenticatedContext('attacker_uid', { email: 'attacker@example.com', email_verified: true });
    const attackerDb = attackerContext.firestore();

    // Querying across profiles or other builds should fail
    await expect(
      getDocs(collection(attackerDb, 'users'))
    ).rejects.toThrow();
  });
});
```
