# 🧭 findr.campus — AI-Powered Campus Recovery & Custody Network

> **Autonomous, explainable AI matching, zero-trust ownership verification, and smart locker handovers for university campuses.**  
> *Engineered for Syntax Error 2026 by SDSLabs, IIT Roorkee.*

---

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL_(Neon)-00E699?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-29_Passing-brightgreen?style=for-the-badge)](https://github.com/mridulvijay65/findr)

---

## 🌟 Executive Summary

Campus lost-and-found systems fail because of **fragmentation**, **lack of incentives**, and **vulnerable handover protocols**. Traditional security desks pile lost valuables into cardboard boxes, leaving students to search manually without privacy or proof.

**findr.campus** transforms campus recovery into an intelligent, decentralized mesh:
1. **Multi-Signal AI Matching Engine**: Evaluates item pairs across 5 independent signals with plain-English explainability, calibrated confidence tiers, and spatial sector adjacency.
2. **Zero-Trust Ownership Verification**: Two-way proof review prevents fraudulent claims. Cryptographic 6-digit OTPs are issued only after human confirmation by the finder or campus security.
3. **Contactless Smart Locker Mesh**: 24/7 retrieval through automated locker bays with automated attempt limits (max 5) and 24-hour expiration windows.
4. **Recovery Intelligence Dashboard**: Real-time operational analytics calculated directly from live database rows (median recovery hours, AI accuracy, sector heatmaps).
5. **Community Good Karma**: Incentivizes honest returns with campus perks and transparent leaderboards.

---

## 🧠 The 5-Signal AI Matching Pipeline

Unlike superficial keyword search, `findr.campus` implements a calibrated decision-fusion engine (`lib/matching-engine.ts`) combining five weighted signals:

$$\text{MatchScore} = 0.25 S_{\text{cat}} + 0.30 S_{\text{text}} + 0.20 S_{\text{attr}} + 0.15 S_{\text{spatial}} + 0.10 S_{\text{temporal}}$$

```mermaid
graph TD
    A[Lost Item Report] --> M[Multi-Signal Fusion Engine]
    B[Found Item Report] --> M
    M --> C[Category Compatibility - 25%]
    M --> D[Semantic Token Overlap - 30%]
    M --> E[Brand & Color Attributes - 20%]
    M --> F[Campus Spatial Adjacency - 15%]
    M --> G[Temporal Window Consistency - 10%]
    C & D & E & F & G --> H[Calibrated Score 0-100 & Confidence Tier]
    H --> I[Explainable Reasons & Discrepancy Warnings]
    I --> J[Match Table Persistence in PostgreSQL]
```

### Signal Specifications:
* **Category Match (25% Weight)**: Strict hierarchical taxonomy alignment with cross-category penalties.
* **Text & Token Semantics (30% Weight)**: Stopword-filtered Jaccard similarity across titles, detailed descriptions, and contextual room notes.
* **Brand & Color Extraction (20% Weight)**: Intelligent entity extraction (e.g. Sony, Apple, Hydro Flask, Matte Black, Sage Green) with agreement bonuses and mismatch penalties.
* **Campus Spatial Adjacency (15% Weight)**: Non-Euclidean topological distance graph modeling walking paths between campus sectors (e.g., Library Quad ↔ Engineering Cluster = 0.8, Library Quad ↔ Hostel Village = 0.3).
* **Temporal Consistency (10% Weight)**: Validates chronological sanity (e.g., penalties if an item was claimed found 48h before it was reported lost).

### Self-Match & Deduplication Guard:
* Automatically skips evaluating items with identical reporter IDs.
* Deduplicated in PostgreSQL using composite unique constraint: `@@unique([lostItemId, foundItemId])`.

---

## 🔒 Security & Custody Protocol

```mermaid
sequenceDiagram
    autonumber
    actor Claimant as Student (Claimant)
    actor Finder as Student / Security (Finder)
    participant Server as findr Backend (Next.js)
    participant DB as Neon PostgreSQL
    participant Locker as Safe Locker Vault

    Claimant->>Server: POST /api/claims (proofAnswer, itemId)
    Note over Server: Check 1: Prevent self-claim (claimant != reporter)<br/>Check 2: Prevent duplicate pending claims
    Server->>DB: INSERT Claim (status: 'pending', otp: null)
    Server->>DB: INSERT AuditLog ('CLAIM_SUBMITTED')
    Server-->>Claimant: Claim submitted for human review

    Finder->>Server: GET /api/claims?userId=finder_id
    Server-->>Finder: Incoming claims list (claimant answers, OTP masked)

    Finder->>Server: POST /api/claims/[id]/review (action: 'approve')
    Note over Server: Check 3: Authorization (reviewer == reporter OR role == 'security')
    Server->>Server: crypto.randomInt(100000, 999999)
    Server->>DB: UPDATE Claim (status: 'approved', otpExpiresAt: now + 24h)
    Server->>DB: UPDATE Item (status: 'Claimed')
    Server->>DB: INSERT AuditLog ('CLAIM_APPROVED')

    Claimant->>Server: GET /api/claims (My Claims)
    Server-->>Claimant: Reveal 6-digit Locker OTP

    Claimant->>Locker: Enter 6-Digit OTP at Kiosk
    Locker->>Server: POST /api/lockers/verify (otp)
    Note over Server: Check 4: Expiration (< 24h)<br/>Check 5: Max attempts (< 5)
    Server->>DB: UPDATE Item ('Recovered') & Claim ('collected')
    Server->>DB: INSERT AuditLog ('LOCKER_UNLOCKED')
    Server-->>Locker: Unlatch Solenoid Bay Door
```

### Key Security Safeguards:
* **Zero-Trust OTP Privacy**: `lockerOtp` is permanently stripped from all public `GET /api/items` responses.
* **Self-Claim Rejection**: Server strictly prohibits reporters from filing ownership claims against their own items.
* **Cryptographic Passcodes**: Node.js `crypto.randomInt(100000, 999999)` generates unguessable 6-digit one-time tokens.
* **Replay & Brute-Force Defense**: Claims track failed entry attempts (`attemptCount >= 5` triggers security lockout). Passcodes expire in 24 hours.
* **Immutable Audit Trail**: Every custody change, approval, rejection, and unlock attempt is recorded in `AuditLog`.

---

## 🚀 Quickstart & Setup Guide

### 1. Prerequisites
* **Node.js** v20+
* **npm** v10+
* **PostgreSQL Database** (Pre-configured with cloud Neon Serverless in `.env`)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/mridulvijay65/findr.git
cd findr

# Install dependencies
npm install
```

### 3. Environment Variables (`.env`)
Create or verify `.env` in the root directory:
```env
# Neon Serverless PostgreSQL Database Connection
DATABASE_URL="postgresql://neondb_owner:npg_F1LamkiWbI6N@ep-long-breeze-az4feurl-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Optional Gemini API Key for auto-filling item forms from images
GEMINI_API_KEY=""
```

### 4. Database Setup & Seeding
```bash
# Generate Prisma Client & push schema to cloud PostgreSQL
npm run db:push

# Seed initial campus items, locker stations, and users
npm run db:seed
```

### 5. Running Automated Tests
```bash
# Runs both Unit/Algorithmic and Database Integration Suites
npm test
```
*Output: 29 Passing Tests, 0 Failures.*

### 6. Start the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🎬 7-Step Hackathon Demonstration Script

Follow this exact walkthrough to demonstrate the full end-to-end functionality to hackathon judges:

| Step | Action | What Judges See |
|:---|:---|:---|
| **1. Switch Identity** | Click user badge in Navbar $\rightarrow$ select **"Aarav Verma (Student)"**. | Campus avatar and student profile activate. Aarav has reported lost headphones. |
| **2. AI Match Center** | Click **"AI Matches"** tab in top navigation. | Candidate pair between Aarav's lost Sony WH-1000XM4 and Priya's found headphones (79% Score). Shows 5-signal breakdown, matching brand, sector adjacency, and temporal timeline. |
| **3. Initiate Claim** | Click **"Initiate Ownership Claim"** $\rightarrow$ enter proof: *"Black case with blue zipper pull tag"* $\rightarrow$ select **"Safe Locker OTP"** $\rightarrow$ Submit. | Zero-trust enforcement: claim is set to **"pending"**. No OTP is leaked yet. |
| **4. Switch to Finder** | Click user badge $\rightarrow$ switch to **"Priya Nair (Finder)"**. | Priya is the student who deposited the found headphones. |
| **5. Review & Approve** | Go to **"My Claims"** $\rightarrow$ **"Incoming Claims to Review"** tab. Priya sees Aarav's submitted answer $\rightarrow$ clicks **"Approve & Generate Locker Pass"**. | Server generates cryptographic OTP, updates item status to `Claimed`, records `AuditLog`, and awards +50 Good Karma to Priya. |
| **6. Locker Unlock** | Switch back to **"Aarav"** $\rightarrow$ open **"My Claims"**. Active Locker Pass reveals OTP $\rightarrow$ click **"Unlock Bay"** $\rightarrow$ verify code. | Solenoid unlatches Bay #02 at Library Vault. Item state updates to `Recovered` in database. |
| **7. Operational Analytics** | Click **"Analytics"** tab in navigation. | Live telemetry displays updated Recovery Rate %, median recovery time, live audit logs, and smart locker status. |

---

## 📁 Repository File Structure

```
findr/
├── app/
│   ├── api/
│   │   ├── ai/
│   │   │   ├── analyze-image/     # Gemini Vision image auto-fill
│   │   │   └── match/             # Multi-signal similarity evaluator
│   │   ├── claims/                # Claim submission & retrieval
│   │   │   └── [id]/review/       # Two-way finder/security claim review
│   │   ├── items/                 # Item repository (zero-trust masked)
│   │   ├── lockers/verify/        # Cryptographic OTP validation & custody resolution
│   │   ├── matches/               # Persisted match queries, confirmations, & batch reindex
│   │   ├── stats/                 # Real DB operational metrics & telemetry
│   │   └── users/                 # Role switching & profile management
│   ├── layout.tsx                 # Root layout with AuthProvider
│   └── page.tsx                   # Main SPA tab router
├── components/
│   ├── AnalyticsScreen.tsx        # Recovery Intelligence Dashboard
│   ├── AuthModal.tsx              # 1-click campus role switcher
│   ├── CampusMapScreen.tsx        # Interactive campus sector hotspot map
│   ├── ClaimItemModal.tsx         # Zero-trust ownership proof modal
│   ├── LeaderboardScreen.tsx      # Good Karma rankings & redemption
│   ├── LiveFeedScreen.tsx         # Real-time lost & found search & filters
│   ├── LockerOtpModal.tsx         # Safe Locker keypad & door unlatch
│   ├── MatchCenterScreen.tsx      # Explainable AI Match Center & breakdown
│   ├── MyClaimsScreen.tsx         # Active claims, incoming reviews, & reports
│   ├── Navbar.tsx                 # Dynamic top navigation & sector dropdown
│   └── ReportScreen.tsx           # Multi-category lost/found report creator
├── context/
│   └── auth-context.tsx           # Campus user context & role state
├── lib/
│   ├── db.ts                      # Prisma client singleton
│   ├── matching-engine.ts         # 5-Signal AI decision-fusion engine & graph
│   └── campusData.ts              # Campus sectors, categories, & TypeScript interfaces
├── prisma/
│   ├── schema.prisma              # Relational schema (Item, Match, Claim, AuditLog, User)
│   └── seed.ts                    # Realistic demo records & credentials
├── tests/
│   ├── matching-and-security.test.ts # Unit & security authorization test suite
│   └── api-integration.test.ts       # Live database end-to-end integration test
└── README.md
```

---

## 🏆 Key Differentiators for Hackathon Judges

1. **Genuinely Functional AI Matching**:
   * Not mocked keyword strings. Uses a weighted mathematical model with topological campus graph adjacency, brand/color token analysis, and temporal delta sanity checks.
2. **Transparent Explainability**:
   * Every match surfaces plain-English justifications (e.g. *"Brand match: Sony"*, *"Same campus zone: Central Library"*) and explicit discrepancy warnings.
3. **Zero-Trust Security**:
   * Public APIs never expose passcodes. Solenoid locker bays only unlatch after human verification, expiration validation, and rate-limit checks.
4. **Live Operational Analytics**:
   * Metrics on the Recovery Intelligence screen are computed directly from database records, not static placeholder numbers.
5. **Architectural Polish**:
   * Clean separation of concerns, zero TypeScript compiler errors, and 29 passing automated test assertions.

---

## 📄 License
Licensed under the [MIT License](LICENSE). Built with pride for **Syntax Error 2026**, SDSLabs, IIT Roorkee.
