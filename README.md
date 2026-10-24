# 🧭 findr.campus

> **A smart, community-driven lost and found network for modern university campuses.**  
> Effortless reporting, secure ownership verification, and safe locker handovers with peer-to-peer radar alerts.

---

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge&logo=sqlite)](https://www.sqlite.org/)

---

## 🌟 Overview

**findr** transforms campus lost-and-found from cluttered security office boxes into a decentralized, trusted recovery ecosystem. Students and campus staff can quickly report missing or discovered items, prove ownership through secret verification questions, deposit items into automated smart locker stations, and earn community karma.

---

## ✨ Key Features

- **📡 Live Campus Lost & Found Feed**: Real-time filtering by campus sectors (Library, Engineering Cluster, Sports Complex, Dining Commons), item categories, and status tags.
- **🔐 Secret Verification & Anti-Theft Claims**: Claimants must answer secret questions set by the finder (e.g., sticker details, unique markings) before retrieval.
- **📦 Smart Locker Safe Drop & OTP Handover**: Integrated smart locker stations enable contactless, secure handovers with encrypted one-time verification pins (OTP).
- **🚨 Peer Radar Broadcasts**: High-urgency pings sent across campus quadrants for newly misplaced valuables.
- **🏆 Karma & Community Leaderboard**: Earn karma points for recovering and returning campus items; redeem points for campus perks (coffee vouchers, priority study rooms, tech rentals).
- **🗺️ Interactive Campus Map**: Visual heatmap and sector breakdown of lost and found activity across campus buildings.

---

## 🏗️ Architecture & Tech Stack

```
findr/
├── app/
│   ├── api/                     # RESTful API endpoints
│   │   ├── items/               # Item listing, filtering, and reporting
│   │   ├── claims/              # Verification claims & OTP generation
│   │   ├── lockers/             # Locker station tracking & OTP verification
│   │   ├── broadcasts/          # Peer radar alerts
│   │   ├── leaderboard/         # Karma rankings
│   │   ├── stats/               # Campus recovery dashboard metrics
│   │   └── users/               # Profiles & karma perk redemption
│   ├── layout.tsx               # Root application layout
│   └── page.tsx                 # Dynamic SPA dashboard
├── components/                  # UI modules (Modals, Feed, Map, Leaderboard)
├── hooks/                       # Custom React data-fetching hooks
├── lib/
│   ├── db.ts                    # Prisma Client singleton
│   └── campusData.ts            # Data models and fallbacks
├── prisma/
│   ├── schema.prisma            # Relational database schema
│   └── seed.ts                  # Database seeder with sample campus data
└── public/                      # Static assets and icons
```

### Stack Highlights:
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4, Lucide Icons, Framer Motion.
- **Backend**: Next.js Serverless Route Handlers (`app/api/*`).
- **Database**: Prisma ORM with SQLite (zero-config local setup; effortlessly switch to PostgreSQL or MySQL).

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.18 or higher recommended)
- `npm` or `pnpm`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mridulvijay65/findr.git
   cd findr
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   *(By default, `DATABASE_URL="file:./dev.db"` is configured for instant local SQLite)*

4. **Initialize & Seed the Database:**
   ```bash
   npm run db:setup
   ```
   This command creates all tables and seeds the database with initial campus items, locker stations, users, and community recovery stories.

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Database Scripts

| Command | Description |
| :--- | :--- |
| `npm run db:setup` | Pushes the Prisma schema to SQLite and seeds initial data |
| `npm run db:push` | Synchronizes `schema.prisma` changes with the database |
| `npm run db:seed` | Seeds initial sample data |
| `npm run db:studio` | Launches **Prisma Studio** GUI at `http://localhost:5555` to view/edit records |
| `npm run db:generate` | Regenerates the Prisma Client types |

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/items` | Query items with `search`, `category`, `status`, and `sector` |
| `POST` | `/api/items` | Report a lost or found item |
| `GET` | `/api/items/:id` | Get details of a specific item |
| `PATCH` | `/api/items/:id` | Update item status or locker location |
| `GET` | `/api/claims` | View user's submitted claims |
| `POST` | `/api/claims` | Submit an ownership claim and receive a 4-digit OTP |
| `GET` | `/api/lockers` | List campus safe lockers and slot availability |
| `POST` | `/api/lockers/verify` | Submit 4-digit OTP code to unlock a locker slot |
| `POST` | `/api/broadcasts` | Broadcast an urgent peer radar alert across campus |
| `GET` | `/api/leaderboard` | View karma rankings and recovery stats |
| `GET` | `/api/stats` | Aggregated dashboard metrics (recovery rate, active items) |
| `GET` | `/api/users/me` | Fetch active user profile and karma |
| `PATCH` | `/api/users/me/karma` | Redeem karma points for campus rewards |
| `GET` | `/api/notifications` | Fetch user alerts and claim updates |

---

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for more information.
