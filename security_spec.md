# Security Specification & Test Suite

## 1. Data Invariants

1. **User Identity Isolation**: A user can ONLY read, create, update, or delete their own user document (`/users/{userId}`) and subcollections (`/users/{userId}/...`). Cross-user document tampering or reading is strictly forbidden.
2. **Schema & Length Boundaries**:
   - `date` field in daily logs must match `YYYY-MM-DD`.
   - `dailyNote` maximum length is 1000 characters.
   - `uid` & document path variable `{userId}` must match `request.auth.uid`.
3. **Timestamp Integrity**: Updates and creations track valid timestamps or ISO date strings.

## 2. The "Dirty Dozen" Payloads

1. **Payload 1 (Cross-User Read/Write)**: Attempt to read `/users/victim_uid/daily_logs/2026-11-06` as `attacker_uid`. -> REJECTED
2. **Payload 2 (User ID Poisoning)**: Attempt to create `/users/{1.5KB_JUNK_STRING}` with invalid characters. -> REJECTED
3. **Payload 3 (Unauthenticated Read)**: Attempt to fetch daily logs without `request.auth`. -> REJECTED
4. **Payload 4 (Identity Spoofing)**: Attempt to write `uid: "victim_id"` while logged in as `attacker_id`. -> REJECTED
5. **Payload 5 (Overly Long Note)**: Attempt to write `dailyNote` with 50,000 characters (Denial of Wallet). -> REJECTED
6. **Payload 6 (Shadow Update)**: Attempt to inject `isAdmin: true` into `users/{userId}`. -> REJECTED
7. **Payload 7 (Invalid Date Format)**: Attempt to write `date: "not-a-date"`. -> REJECTED
8. **Payload 8 (Invalid Mood Enum)**: Attempt to set `mood: "hacked"`. -> REJECTED
9. **Payload 9 (PII Leak Prevention)**: Attempt to list all documents under `/users` as non-admin user. -> REJECTED
10. **Payload 10 (Impersonated Subcollection Write)**: Attempt to write to `/users/other_user/settings/reminders`. -> REJECTED
11. **Payload 11 (Unverified Email Write)**: Write attempt when `email_verified` is false (where email verification is mandated). -> REJECTED
12. **Payload 12 (Corrupted Object Shape)**: Payload missing required `date` field. -> REJECTED
