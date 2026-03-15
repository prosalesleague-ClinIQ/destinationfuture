# Destination Future

Privacy-first, gamified insight platform combining astrology, numerology, personality psychology, relationship compatibility, location alignment, and personal growth.

## Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Mapbox, Recharts
- **Backend:** Express, TypeScript, Prisma, PostgreSQL, Redis, BullMQ
- **AI Layer:** Modular prompt orchestration, deterministic rules engine + LLM narrative
- **Monorepo:** Turborepo with npm workspaces

## Project Structure

```
destination-future/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Express API server
├── packages/
│   ├── core/         # Types, engines (numerology, astrology, XP)
│   ├── prompts/      # Prompt templates, validators, section configs
│   ├── ui/           # Shared React component library
│   └── config/       # App configuration and constants
```

## Setup

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis (optional, for caching)

### Install

```bash
npm install
```

### Environment

```bash
cp .env.example .env
# Edit .env with your database URL, JWT secret, and API keys
```

### Database

```bash
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:seed        # Seed demo data
```

### Development

```bash
npm run dev            # Start all apps in dev mode
```

- Web: http://localhost:3000
- API: http://localhost:4000
- API Health: http://localhost:4000/api/health

### Demo Account

After seeding:
- Email: `demo@destinationfuture.app`
- Password: `demo1234`

## Product Modes

1. **Single User** — Personal insight reports with modular section selection
2. **Dual User** — Compatibility analysis (romantic, friendship, family, collaboration)
3. **Demo Mode** — Generalized profiles for preview
4. **Free Mode** — Limited sections and features
5. **Premium Mode** — Full access to all modules

## Key Features

- 22 modular report sections, each independently selectable
- 6 report presets (Quick Read, Love Focus, Career Focus, Relocation Focus, Reinvention Focus, Full Report)
- Deterministic numerology engine with full math display
- Solar astrology engine (graceful degradation without birth time)
- Location recommendations across California, USA, and worldwide
- XP, levels, streaks, quests, and badges
- Shadow work engine (CBT-first, practical)
- Fashion system with hex color palettes
- Music and frequency guide (educational only)
- Privacy-first: optional anonymity, encryption, GDPR/CCPA aligned

## Architecture

### Report Generation Flow

1. User selects sections (or chooses preset)
2. Deterministic engines run first (numerology, solar astrology, XP)
3. Prompt context built from user profile + engine outputs
4. Each section generated independently via LLM
5. Output validated against JSON schema
6. Sections cached and stored independently
7. User can regenerate individual sections

### Gamification

- **Levels 1-5**: Seeker → Explorer → Navigator → Architect → Visionary
- **XP Sources**: Onboarding, reflections, quests, report generation
- **Quests**: Journaling, habits, city research, style, playlist, confidence, creativity
- **Badges**: Pattern Breaker, City Explorer, Shadow Worker, and more

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all apps |
| `npm run build` | Build all apps |
| `npm run lint` | Lint all apps |
| `npm run test` | Run all tests |
| `npm run db:push` | Push Prisma schema |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Open Prisma Studio |
