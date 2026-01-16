# Specification: Security and Sync Hardening

## Overview
This track addresses several security vulnerabilities and stability issues identified during code review, including unsecured deletion, missing rate limiting on email endpoints, race conditions in slug assignment, and lack of sync persistence on failure.

## Functional Requirements

### 1. Secure Resume Deletion
-   **Claimed Resumes:** Update the `DELETE /api/resumes/[id]` endpoint to require a valid authentication token. The token must be verified against the resume owner's email.
-   **Anonymous Resumes:** Implement a `deleteSecret` mechanism.
    -   When an anonymous resume is created, generate a cryptographically secure `deleteSecret`.
    -   Return this secret to the client and store it in browser localStorage.
    -   The `DELETE` endpoint must require this secret if no owner email is associated with the resume.

### 2. Rate Limiting for Token Generation
-   Protect `POST /api/auth/generate-token` from abuse using Cloudflare's `rate-limit` binding.
-   Enforce limits on email generation (e.g., 3 requests per IP/email per hour) to prevent spam and quota exhaustion.

### 3. Robust Slug Uniqueness
-   Refactor the `publishResume` service to handle slug collisions gracefully.
-   Remove the pre-check `findFirst` and instead rely on catching the SQLite `UNIQUE constraint failed: resumes.slug` error (or corresponding D1 error code).
-   Return a `409 Conflict` status with a clear "Slug already taken" error message to the client.

### 4. Reliable Resume Sync
-   **Automatic Retry:** Update the `useResumeSync` hook to implement automatic retries with exponential backoff if a sync attempt fails (e.g., up to 3 retries).
-   **Manual Retry:** If automatic retries fail, display a "Retry" button in the editor footer next to the "Cloud sync error" status.

## Non-Functional Requirements
-   **Security:** Ensure no sensitive secrets (like `deleteSecret`) are logged or exposed in public views.
-   **Performance:** Rate limiting should be performed at the edge using Cloudflare's native capabilities.

## Acceptance Criteria
-   Unauthorized DELETE requests to `/api/resumes/[id]` return `401` or `403`.
-   Authorized DELETE requests succeed only with a valid token (claimed) or `deleteSecret` (anonymous).
-   `generate-token` endpoint returns `429 Too Many Requests` when limits are exceeded.
-   Concurrent requests for the same slug result in one success and one `409` error.
-   The editor UI shows a "Retry" button when sync fails after all automatic attempts.
-   Automatic retries trigger after a failed sync.

## Out of Scope
-   Account management or login screens (sticking to magic links).
-   Permanent DB cleanup chores.
