# FLYBETA — Project Context

## Overview
FlyBeta is a gamified, level-based learning platform for Data Science, AI, and Cloud Computing.
Decoupled architecture: Django DRF backend + React/Vite frontend (Tailwind CSS).

## Current Phase
**Phase 1 — Complete**: Django DRF models, auth, SQLite database initialized.

### What's Done
- Django project scaffold (`flybeta` config) in `/backend`
- 3 Django apps: `accounts`, `learn`, `api`
- All models: `UserProfile`, `Domain`, `Level`, `Lesson`, `DomainProgress`, `LevelProgress`
- UserProfile auto-creation via post_save signal
- Admin registrations with filters, inlines, and search
- SQLite database created and migrated
- DRF + CORS configured
- API router stub at `/api/v1/`

### What's Next
- **Phase 2**: React Vite setup, global UI shell, integrate Stitch prototypes into components
- **Phase 3**: Gamification logic (XP/coin state updates), theme switcher
- **Phase 4**: AI features (Project Architect & Code Reviewer endpoints)

## Frontend
Located at `/frontend/stitch_flybeta_tactile_editorial_lab/`.
Contains Stitch-generated HTML/Tailwind prototypes — static mockups with multiple theme variants.
These are reference designs for the final React components (Phase 2).

## Design System
Neo-Brutalism / Retro-Tech / Blueprint aesthetic.
See `DESIGN.md` for full design tokens (colors, typography, elevation, micro-interactions).

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Backend | Django 5.2 + DRF 3.18 + SQLite (dev) |
| Frontend | React (Vite) + Tailwind CSS (planned) |
| Communication | JSON over REST API |
| Auth | Session/Basic (Phase 1), JWT (planned) |
