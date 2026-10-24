# 🛡️ findr.campus — Hackathon Technical Audit & Prioritized Implementation Plan

**Event**: Syntax Error 2026 (SDSLabs, IIT Roorkee) / National Level Hackathon  
**Target**: Transform prototype into a complete, secure, AI-powered campus recovery ecosystem.

---

## 1. Codebase Audit Findings

| Category | Component / Feature | Current Status | Issues & Vulnerabilities Identified |
| :--- | :--- | :--- | :--- |
| **Authentication** | `context/auth-context.tsx` | Partial (Local State + Mock API) | Session kept in `localStorage`, lacks server-side session tokens; hardcoded IDs fallback in API routes (`user-aarav`). |
| **Database Schema** | `prisma/schema.prisma` | Good foundation, incomplete | Missing `Match` model, missing `AuditLog`, missing item attributes (`brand`, `color`, `dateLostOrFound`, `itemType`), claim lacks expiry & attempt limits. |
| **Item Reports** | `ReportScreen.tsx` & `/api/items` | Working | Supports real image upload & Gemini auto-tagging, but public API leaked `lockerOtp` to all users! Needs itemType separation ('LOST' vs 'FOUND'). |
| **AI Matching** | `/api/ai/match` | Heuristic keyword overlap only | Does not perform true multi-signal semantic/attribute/spatial/temporal analysis. No persistence of matches, no explanation metadata. |
| **Claims & Verification** | `ClaimItemModal.tsx` & `/api/claims` | **CRITICAL SECURITY FLAW** | Auto-approved claims instantly! Did not require reporter review. Users could claim their own items. OTP exposed publicly. |
| **Locker Vault** | `LockerOtpModal.tsx` & `/api/lockers/verify` | Working | Verifies against DB, but lacked expiration check, rate limiting, and resolution audit trail. |
| **Match Details UI** | Missing | **Absent** | No explainable match interface showing why two items match, confidence breakdown, or side-by-side comparison. |
| **Analytics Dashboard**| `/api/stats` | Basic summary only | Lacked operational recovery metrics, median recovery time, matching latency, and live vs demo breakdown. |
| **Testing Suite** | Root | **Absent** | No automated tests for matching pipeline, security authorization, or claim lifecycle. |

---

## 2. Prioritized Implementation Plan

### Step 1: Schema & Security Hardening
- Extend `schema.prisma` with `Match`, `AuditLog`, and enriched item/claim attributes (`itemType`, `brand`, `color`, `dateLostOrFound`, `otpExpiresAt`, `attemptCount`).
- Run `prisma db push` to synchronize with Neon PostgreSQL.
- Fix public OTP leak: Remove `lockerOtp` from public `GET /api/items`. Only authorized claimants/reporters receive OTPs upon approved claims.

### Step 2: Multi-Signal AI Matching Engine (`lib/matching-engine.ts`)
- Implement an explainable multi-signal comparison pipeline:
  1. **Category Compatibility** (Hard filter / high weight)
  2. **Semantic & Attribute Similarity** (Brand, color, title, description keywords with Jaccard & Levenshtein string metrics)
  3. **Spatial Proximity** (Campus sector distance matrix & coordinate approximation)
  4. **Temporal Compatibility** (Loss date must precede discovery date; penalize large time gaps)
- Generate human-readable reasons (e.g. *"Compatible color: Black"*, *"Reported within 200m of Central Library"*, *"Discovered 45 mins after loss"*).
- Store matches in the `Match` table and prevent duplicate evaluations.

### Step 3: Explainable Match Center UI (`components/MatchCenterModal.tsx`)
- Side-by-side comparison of Lost item vs Found item.
- Radar / Progress breakdown of each signal (Appearance, Location, Time).
- Actions: *"Confirm Match & Request Handover"* or *"Dismiss as False Positive"*.

### Step 4: Two-Way Verified Claim & Handover Security (`app/api/claims`)
- Server-side validation:
  - User cannot claim their own reported items.
  - Submitting a claim puts it into `PENDING_REVIEW`.
  - Reporter / Campus Security reviews claimant's proof answer.
  - Upon approval, server generates a cryptographic 6-digit OTP with 24-hour expiration and 3-attempt limit.
  - Claimant gets the OTP in their dashboard.
  - Locker unlock verifies OTP, marks item `RECOVERED`, logs audit event, and credits Karma.

### Step 5: Real Recovery Intelligence Dashboard (`components/AnalyticsScreen.tsx`)
- Operational metrics: Active lost reports, found items, verified recoveries, true recovery rate, median resolution time, match accuracy rate.
- Clear distinction between live user activity and baseline campus records.

### Step 6: Automated Test Suite (`tests/matching.test.ts` & `tests/security.test.ts`)
- Automated test scripts validating:
  - Matching engine scoring and explanations.
  - Self-claim prevention and unauthorized OTP access.
  - Expired OTP and attempt limit enforcement.
  - Verification with `tsc --noEmit` and `next build`.

---
*Proceeding with Step 1 immediately.*
