# FLYBETA — Project Context

## Overview
FlyBeta is a gamified, level-based learning platform for Data Science, AI, and Cloud Computing.
Decoupled architecture: Django DRF backend + React/Vite frontend (Tailwind CSS v4).

## Current Phase
**Phase 9 — Planned**: Next feature development TBD.

### What's Done
- Django project scaffold (`flybeta` config) in `/backend`
- 3 Django apps: `accounts`, `learn`, `api`
- All models: `UserProfile`, `Domain`, `Level`, `Lesson` (+ `illustration_url`), `DomainProgress`, `LevelProgress`
- UserProfile auto-creation via post_save signal
- Admin registrations with filters, inlines, and search
- SQLite database created and migrated
- DRF read-only API at `/api/v1/` (domains, levels, lessons)
- Content pipeline: `python manage.py load_level_content` (JSON → DB, supports `illustration_url`)
- **Full curriculum**: 3 tracks × 10 levels = 30 JSON content files loaded into DB
- React + Vite + Tailwind v4 frontend in `/frontend`
- Design system: All DESIGN.md tokens mapped to CSS custom properties
- 3 pages: Track Selection, Track Roadmap, Lesson Runner
- 5 components: Navbar, Layout, TrackCard, LevelNode, MarkdownRenderer
- **Interactive components**: `FlipCard` (3D Neo-Brutalist flip card, click-to-flip)
- **MarkdownRenderer upgrade**: `rehype-raw` plugin for custom HTML tag parsing (`<flipcard>` → `<FlipCard/>`)
- API service layer with Axios + Vite proxy
- Stitch prototypes preserved at `/design/stitch-reference/`
- Mock auth with dev user (`python manage.py create_dev_user`)
- `GET /api/v1/users/me/` — user gamification stats endpoint
- `POST /api/v1/lessons/{id}/complete/` — XP/coins award, streak logic, level completion
- `UserContext` — live gamification state in Navbar, reward flash on lesson complete
- `ThemeContext` — 5 themes with CSS variable swapping, localStorage persistence
- **Phase 4a**: Project Architect (Blueprint Lab) UI & mock endpoint (`POST /api/v1/ai/architect/`)
- **Phase 4b**: Code Reviewer (Code Drishti) UI & mock endpoint (`POST /api/v1/ai/reviewer/`)
- **Phase 4c**: Full curriculum expansion (Levels 1–7 for all 3 tracks)
- **Phase 4d**: Multi-theme system (5 themes with character images, backgrounds, overlays)
- **Phase 5**: Vision Suite UI Scaffold (Oracle Widget, Channel Feed, Synapse Engine, Video Detail 60/40 Split)
- **Phase 6**: Real AI API integration (Gemini 2.5 Flash for Oracle, Synapse, Architect, Code Review)
- **Phase 7 (Completed)**: Beginner Curriculum Upgrade 
  - Complete rewrite of 30 levels across all 3 tracks with strong metaphors.
  - Interactive `<FlipCard/>` components embedded in all lessons.
  - `LevelBossQuiz` gatekeeper (60% pass rate) implemented for all 30 levels.
  - Track Roadmap UI updated to enforce level locking based on user progress.
  - `pass_quiz` API endpoint added to unlock levels and award XP.
- **Phase 8 (Completed)**: The AI Evaluator (Level 10 Capstone)
  - Created `CapstoneSubmission` model and `CapstoneSubmissionViewSet` API.
  - Built GitHub service (`github_service.py`) to fetch repository contents via authenticated Github API.
  - Integrated Google Gemini API (`ai_evaluator.py`) using `gemini-pro` for automated code evaluation.
  - Developed `<CapstoneEvaluator/>` Neo-Brutalist frontend component with rich Markdown rendering and success/fail states.
  - Conditionally injected Capstone UI into `LessonRunnerPage` for Level 10.

### What's Next
- **Phase 9**: TBD


## Curriculum
| Track | Levels | Lessons | Content Directory |
|-------|--------|---------|-------------------|
| Cloud Computing | 10 (Foundations → Capstone) | ~40 | `backend/content/cloud/` |
| AI & Machine Learning | 10 (Foundations → Capstone) | ~40 | `backend/content/ai/` |
| Data Science | 10 (Foundations → Capstone) | ~40 | `backend/content/data/` |

## Theme System
5 registered themes in `ThemeContext.jsx`, switchable via navbar dropdown:

| Theme | Key | Primary | Borders/Shadows | Character Images | Background |
|-------|-----|---------|-----------------|------------------|------------|
| 🏗️ Neo-Brutalism | `neo-brutalism` | Crimson `#E52E2E` | Black `#111111` | Lucide icons | Grid pattern |
| 🤖 Doraemon Blue | `doraemon-blue` | Blue `#3182ce` | Blue `#2b6cb0` | Doraemon, Shizuka, Nobita | `doremon_flybeta.png` |
| 🖍️ Shinchan | `shinchan` | Yellow `#FDE047` | Red `#DC2626` | Shinchan, Bo-chan, Meni | `shinchan-theme-bg.png` |
| 👑 Princess | `princess` | Magenta `#A21CAF` | Purple `#A21CAF` | Rapunzel, Mulan, Belle | `bg-theme.jpeg` |
| ⚔️ Anime | `anime` | Orange `#F97316` | Ink Black `#0F172A` | Zoro, Luffy, Nami | `anime-theme.jpeg` |

**Architecture:**
- `THEME_IMAGES` map in `TrackCard.jsx` — per-theme domain→character mapping
- `THEME_BACKGROUNDS` map in `Layout.jsx` — per-theme background image paths
- 80% opacity cream overlay (`#F9F8F6`) for all themed backgrounds (readability)
- Content sits at `z-10` above the fixed background overlay
- Neo-Brutalism (default) uses no background image — just the `grid-bg` pattern

## Frontend
Located at `/frontend/`. React + Vite + Tailwind v4.
Design reference prototypes at `/design/stitch-reference/`.

## Design System
Neo-Brutalism / Retro-Tech / Blueprint aesthetic.
See `DESIGN.md` for full design tokens (colors, typography, elevation, micro-interactions).

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Backend | Django 5.2 + DRF 3.18 + SQLite (dev) |
| Frontend | React (Vite) + Tailwind CSS v4 |
| Communication | JSON over REST API (proxied in dev) |
| Auth | Session/Basic (Phase 1), JWT (planned) |

## How to Run

### Backend
```bash
cd backend && source venv/bin/activate
python manage.py runserver    # http://localhost:8000
```

### Frontend
```bash
cd frontend
npm run dev                   # http://localhost:5173
```

Both must run simultaneously. Vite proxies `/api` → Django backend.

## Key Asset Directories
```
frontend/public/
├── doremon-theme/        # Doraemon character PNGs + background
├── shinchan-theme/       # Shinchan character PNGs + background
├── disney-princess-thene/ # Princess character PNGs + background
└── anime-theme/          # Anime character PNGs + background
```

