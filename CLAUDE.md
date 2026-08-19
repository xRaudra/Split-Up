# Split Up

## Project Overview
Split Up is a mobile-first web app for splitting shared expenses (dinners, trips, rent, groceries, cabs) among friends. Target users: 20–35 year olds in India. Built as a polished product-design prototype (not a production financial product — no real payments/banking integration).

Product flow principle: **Fast → Fair → Transparent → Settled**
Core design principle: **Simple by default. Flexible when needed.**

## Tech Stack
- Framework: Vite + React 19
- Styling: Tailwind CSS v4 (via `@tailwindcss/vite`, tokens defined in `src/index.css` under `@theme`)
- Icons: lucide-react
- Deploy: Vercel (auto-deploys from GitHub `xRaudra/Split-Up`, `main`/`master` branch)
- No backend — all data lives in `src/data/mockData.js`; navigation is in-memory React state (no router)

## Information Architecture
Bottom nav (5 items): **Home | Tabs | Add Bill | History | Profile**
- A **Tab** (not "Split") groups multiple bills for a trip/event/shared account (e.g. "Goa Trip").
- **Add Bill** is the primary action: Scan Bill (placeholder in this prototype) or Enter Manually → choose participants → choose split method → add to an existing Tab or create a new one.
- Split methods: **Equally** or **Custom** (Custom supports flat per-person amounts or by-items, so a person who only had one item can be charged just for that item).

## Design Tokens (`src/index.css` `@theme`)
- Primary `#4F46E5` / Primary Dark `#3730A3`
- Background `#F8FAFC` / Surface `#FFFFFF`
- Text `#111827` / Secondary Text `#6B7280` / Border `#E5E7EB`
- Success `#16A34A` (semantic only) / Error `#DC2626` (destructive only)
- Fonts: Poppins (headings), Inter (body)
- Radius: sm 8 / md 10 / lg 12 / full 9999

## Component Conventions
Shared components live in `src/components/` (Button, Input, AmountInput, Avatar, ParticipantRow, SplitMethodSelector, TabCard, SettlementRow, SummaryCard, StatusBadge, EmptyState, ErrorMessage, BottomNav, TopBar, PhoneFrame). Screens live in `src/screens/`, one file per screen, composed in `App.jsx` via a `navigate(screen, data)` state switch — no react-router.

Status/state must always be communicated with text or an icon, never color alone (accessibility).

## Companion Figma File
The full UX case study (personas, journeys, IA, wireframes, visual direction, design system) lives in Figma file **"VMock Split Up App"**. Component names and copy in code should stay consistent with that file's Design System page.

## Workflow Rules
1. Keep terminology consistent with the established IA above ("Tab" not "Split", "Add Bill" not "Add Expense").
2. Don't introduce gradients, glassmorphism, excessive shadows, or decorative illustrations — the visual direction is intentionally restrained.
3. Run `npm run lint` and `npm run build` before considering a change done.
4. Commit message format: `feat:`, `fix:`, `refactor:`, `design:`
