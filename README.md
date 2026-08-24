# FlyBeta

Gamified learning platform for Data Science, AI, and Cloud Computing.

## Repository Structure

```
flybeta-project/
├── SPEC.md           # System architecture & build plan
├── DESIGN.md         # Design system (Neo-Brutalism tokens)
├── CONTEXT.md        # Current project state & phase tracking
├── README.md         # This file
├── backend/          # Django DRF API server
│   ├── README.md     # Backend-specific setup & docs
│   ├── flybeta/      # Django config
│   ├── accounts/     # User profiles & gamification
│   ├── learn/        # Content & progress models
│   ├── api/          # DRF endpoints (Phase 2)
│   └── content/      # JSON curriculum data
└── frontend/         # React + Tailwind UI (Stitch prototypes)
```

## Quick Start

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend
> React Vite setup planned for Phase 2. Currently contains Stitch HTML prototypes.

## Build Phases
1. ✅ Django DRF Models, Auth, SQLite
2. ✅ React Vite Setup, Global UI Shell
3. ✅ Gamification Logic, Theme Switcher
4. ✅ AI Features (Project Architect & Code Reviewer)
5. ✅ Vision Suite UI Scaffold
6. ✅ Real AI API integration (Gemini 2.5)
7. ✅ Beginner Curriculum Upgrade (30 Levels & Boss Quiz)
8. ⬜ Phase 8 (TBD)
