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
- No backend, no storage — all state is React state in `App.jsx` (`tabs`, `currentUser`, `knownPeople`). Closing the tab clears everything by design. `src/data/appState.js` holds only pure helpers (`settlementsForTab`, `totalOwedToUser`, `displayName`) — no seeded/mock data lives in the repo.
- Navigation is in-memory (`navigate(screen, data)` state switch in `App.jsx`, no react-router).

## Information Architecture
Flow: **Welcome → "What should we call you?" (sets `currentUser`) → Home**, then bottom nav (5 items): **Home | Tabs | Add Bill | History | Profile**
- A **Tab** (not "Split") groups multiple bills for a trip/event/shared account (e.g. "Goa Trip").
- **Add Bill** is the primary action: Scan Bill (placeholder in this prototype) or Enter Manually → type-to-add participants (chip input, remembers names via `knownPeople` for one-tap re-add) → choose split method → add to an existing Tab or create a new one.
- Split methods: **Equally** or **Custom** (Custom supports flat per-person amounts or by-items, so a person who only had one item can be charged just for that item).
- The current user always renders as **"You"** in participant-facing lists (via `displayName()`), but keeps their real name for Avatar initials — never swap the name passed to `Avatar`, only the label text.
- Renaming yourself in Profile cascades through every existing tab/bill (`App.jsx`'s `handleRename`) so old data doesn't reference a stale name.

## Design Tokens (`src/index.css` `@theme`)
- Primary `#4F46E5` / Primary Dark `#3730A3`
- Background `#F8FAFC` / Surface `#FFFFFF`
- Text `#111827` / Secondary Text `#6B7280` / Border `#E5E7EB`
- Success `#16A34A` (semantic only) / Error `#DC2626` (destructive only)
- Fonts: Poppins (headings), Inter (body)
- Radius: sm 8 / md 10 / lg 12 / full 9999
- **Screen margin: 20px** (`px-5`) left/right on every screen's outer content container — don't use `px-4`/`px-6`/`px-8` for a screen's edge padding.
- **Section gutter: 20px** (`gap-5`/`mt-5`/`mb-5`) between distinct sections stacked vertically on a screen (e.g. header → summary card → list → CTA). This does NOT apply to tight component-internal spacing (chip gaps, badge padding, list-item spacing between cards of the same kind) — those stay at their smaller, intentional values (`gap-2`/`gap-3`).

## Type Scale (Figma "Visual Direction" page, "Type Section" — canonical, don't invent new sizes)
| Token | Size | Weight | Use |
|---|---|---|---|
| Display Amount | 32px | Bold (700) | The ₹ amount, always — strongest hierarchy on any screen |
| H1 | 24px | Bold (700) | Screen titles |
| H2 | 20px | SemiBold (600) | Section headers |
| Body | 16px | Regular (400) | Default text |
| Body Medium | 16px | Medium (500) | Emphasized body |
| Caption | 14px | Regular (400) | Metadata |
| Small | 12px | Medium (500) | Labels, tags |

The spec that defines this scale states **"Inter only, one typeface for the whole product"** — this conflicts with this file's own "Fonts: Poppins (headings), Inter (body)" line above and with existing Poppins usage in the code (Welcome screen wordmark, Logo-adjacent text). That conflict hasn't been resolved with the user — don't unilaterally strip Poppins from the product screens without asking, but don't add new Poppins usage either until it's settled.

## Component Conventions
Shared components live in `src/components/` (Button, Input, AmountInput, Avatar, Logo, ParticipantRow, SplitMethodSelector, TabCard, SettlementRow, SummaryCard, StatusBadge, EmptyState, ErrorMessage, BottomNav, TopBar, PhoneFrame). `ParticipantRow` is a documented Design System component not currently consumed by any screen (Add Bill uses a chip-input instead) — that's fine, don't delete it as "unused." Screens live in `src/screens/`.

Status/state must always be communicated with text or an icon, never color alone (accessibility).

## Companion Figma File
The full UX case study (personas, journeys, IA, wireframes, visual direction, design system) lives in Figma file **"VMock Split Up App"**. Component names and copy in code should stay consistent with that file's Design System page.

## Workflow Rules
1. Keep terminology consistent with the established IA above ("Tab" not "Split", "Add Bill" not "Add Expense").
2. Don't introduce gradients, glassmorphism, excessive shadows, or decorative illustrations — the visual direction is intentionally restrained.
3. Run `npm run lint` and `npm run build` before considering a change done.
4. Commit message format: `feat:`, `fix:`, `refactor:`, `design:`
