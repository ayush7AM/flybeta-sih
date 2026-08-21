# FLYBETA — Project Context

## Overview
FlyBeta is a gamified, level-based learning platform for Data Science, AI, and Cloud Computing.
Decoupled architecture: Django DRF backend + React/Vite frontend (Tailwind CSS v4).

## Current Phase
**Phase 3 — Complete**: Gamification logic, mock auth, theme switcher all wired end-to-end.

### What's Done
- Django project scaffold (`flybeta` config) in `/backend`
- 3 Django apps: `accounts`, `learn`, `api`
- All models: `UserProfile`, `Domain`, `Level`, `Lesson`, `DomainProgress`, `LevelProgress`
- UserProfile auto-creation via post_save signal
- Admin registrations with filters, inlines, and search
- SQLite database created and migrated
- DRF read-only API at `/api/v1/` (domains, levels, lessons)
- Content pipeline: `python manage.py load_level_content` (JSON → DB)
- Sample data: Cloud Computing Level 1 (5 lessons)
- React + Vite + Tailwind v4 frontend in `/frontend`
- Design system: All DESIGN.md tokens mapped to CSS custom properties
- 3 pages: Track Selection, Track Roadmap, Lesson Runner
- 5 components: Navbar, Layout, TrackCard, LevelNode, MarkdownRenderer
- API service layer with Axios + Vite proxy
- Stitch prototypes preserved at `/design/stitch-reference/`
- Mock auth with dev user (`python manage.py create_dev_user`)
- `GET /api/v1/users/me/` — user gamification stats endpoint
- `POST /api/v1/lessons/{id}/complete/` — XP/coins award, streak logic, level completion
- `UserContext` — live gamification state in Navbar, reward flash on lesson complete
- `ThemeContext` — 2 themes (Neo-Brutalism, Doraemon Blue), CSS variable swapping, localStorage

### What's Next
- **Phase 4**: AI features (Project Architect & Code Reviewer endpoints)

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
