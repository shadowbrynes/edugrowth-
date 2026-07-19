# Security Specification (security_spec.md)

This document details the security model, authorization matrix, schema rules, and threat vectors for the EduManage Academic Management System, integrated with Google Firebase (Authentication & Cloud Firestore).

## 1. Authentication and Identity Model
- **Primary Provider**: Google Sign-In (managed via Firebase Authentication).
- **Fallback / Developer Provider**: Local Developer simulation to bypass sandboxed iframe restrictions safely.
- **Session Rules**: Session tokens are cryptographically managed by Firebase with a 1-hour rolling expiry.
- **ID Poisoning Protection**: Document IDs are validated using path variables matches (`matches('^[a-zA-Z0-9_\\-]+$')`).

---

## 2. Authorization Matrix

| Collection | GET (Read One) | LIST (Read All) | CREATE (Write) | UPDATE (Write) | DELETE (Write) |
|---|---|---|---|---|---|
| `students` | Authenticated | Authenticated | Authenticated | Authenticated | Authenticated |
| `alerts` | Authenticated | Authenticated | Authenticated | Authenticated | Authenticated |
| `activities` | Authenticated | Authenticated | Authenticated | Authenticated | Authenticated |
| `children` | Authenticated | Authenticated | Authenticated | Authenticated | Authenticated |
| `transcripts` | Authenticated | Authenticated | Authenticated | Authenticated | Authenticated |

---

## 3. Structural Schemas & Invariants

### 3.1. Students Collection
- **Path**: `/students/{studentId}`
- **ID Constraints**: Must match `isValidId(studentId)`.
- **Invariants**:
  - `gpa` must be a valid float or int.
  - `name` size must be `<= 128`.
  - `status` must be a string under `64` characters.

### 3.2. Critical Alerts Collection
- **Path**: `/alerts/{alertId}`
- **ID Constraints**: Must match `isValidId(alertId)`.
- **Invariants**:
  - `type` must be exactly `attendance`, `grade_drop`, or `behavioral`.
  - `details` size must be `<= 512`.

### 3.3. System Activities Collection
- **Path**: `/activities/{activityId}`
- **Invariants**:
  - `type` must be one of `upload`, `user_add`, `payroll`, `alert`, `meeting`.
  - `user` and `action` must be string under `128` and `256` characters respectively.

---

## 4. Threat Defense & Mitigation (The Dirty Dozen Payloads)

1. **Malicious ID Poisoning**: Trying to write documents with paths containing `/` or special injection characters is blocked by `isValidId()`.
2. **Ghost Fields Injection**: Blocked via strict key length checks (`incomingKeys(data).size() == N`).
3. **GPA Manipulation (Type Confusion)**: Attempting to insert strings into GPA is rejected since GPA is strictly `float` or `int`.
4. **Massive Overloading Attack**: Strings are strictly limited (e.g., descriptions size `<= 512`, names `<= 128`).
5. **No Blanket/Unbounded Queries**: Prevented by enforcing authentication and strict document structure evaluations.
