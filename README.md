<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/7733b3aa-7665-4cbb-a29b-d19eedd69a5f

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Configure `.env`:
   Ensure `DATABASE_URL="file:./dev.db"` is set (or connect your PostgreSQL/MySQL database).
3. Initialize and seed database:
   `npm run db:setup`
4. Run the development server:
   `npm run dev`

## Database & Backend Architecture

- **ORM & Database**: Prisma ORM with SQLite (swappable to PostgreSQL or MySQL via `DATABASE_URL` in `schema.prisma`).
- **Database Singleton**: [lib/db.ts](file:///Users/mridulvijay/Desktop/protobuild%20copy/lib/db.ts)
- **Prisma Schema**: [prisma/schema.prisma](file:///Users/mridulvijay/Desktop/protobuild%20copy/prisma/schema.prisma)
- **Seed Script**: [prisma/seed.ts](file:///Users/mridulvijay/Desktop/protobuild%20copy/prisma/seed.ts)

### Available Database Commands:
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Synchronize schema with database
- `npm run db:seed` - Seed initial campus items, users, lockers, stories, and notifications
- `npm run db:setup` - Push schema and seed in one command
- `npm run db:studio` - Open Prisma Studio web UI to view and edit database records visually

### REST API Endpoints:
- `GET /api/items` - List items with search, category, status, and sector query filters
- `POST /api/items` - Report a newly lost or found item
- `GET /api/items/[id]` - Retrieve single item details
- `PATCH /api/items/[id]` - Update item status, secret question, locker location, etc.
- `GET /api/claims` - View verification claims
- `POST /api/claims` - Submit ownership claim with proof answer and handover method (generates OTP code)
- `GET /api/lockers` - List smart locker stations, slots, and availability
- `POST /api/lockers/verify` - Verify 4-digit OTP to unlock locker slot and complete handover
- `POST /api/broadcasts` - Issue campus-wide peer radar broadcast alerts for urgent items
- `GET /api/leaderboard` - Community karma ranking and reunited count
- `GET /api/users/me` - Current student profile details and karma stats
- `PATCH /api/users/me/karma` - Redeem karma points for campus perks
- `GET /api/notifications` - Real-time alerts and updates
- `GET /api/stats` - Campus recovery rate, active items, and safe handover metrics
- `GET /api/recovery-stories` - Recent verified reunions community feed

### Client React Hooks (Backend Integration Ready):
Pre-built hooks are available in `hooks/` to connect any component directly to the live backend:
- [hooks/use-items.ts](file:///Users/mridulvijay/Desktop/protobuild%20copy/hooks/use-items.ts)
- [hooks/use-claims.ts](file:///Users/mridulvijay/Desktop/protobuild%20copy/hooks/use-claims.ts)
- [hooks/use-lockers.ts](file:///Users/mridulvijay/Desktop/protobuild%20copy/hooks/use-lockers.ts)
- [hooks/use-broadcasts.ts](file:///Users/mridulvijay/Desktop/protobuild%20copy/hooks/use-broadcasts.ts)
- [hooks/use-leaderboard.ts](file:///Users/mridulvijay/Desktop/protobuild%20copy/hooks/use-leaderboard.ts)
- [hooks/use-user.ts](file:///Users/mridulvijay/Desktop/protobuild%20copy/hooks/use-user.ts)
- [hooks/use-notifications.ts](file:///Users/mridulvijay/Desktop/protobuild%20copy/hooks/use-notifications.ts)
