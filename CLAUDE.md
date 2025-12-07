# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run lint     # Run ESLint
npm run start    # Start production server
```

## Database (Atlas HCL)

Schema defined in `db/schema.hcl`. To load JSTOR article data:

```bash
./db/load_data.sh [connection_string] [jsonl_file]
# Defaults: postgres://postgres:pass@localhost:5432/snarkmark, filtered_20s.jsonl
```

## Architecture

**Next.js 16 App Router** with React 19, TypeScript, Tailwind CSS v4.

### Data Layer (`lib/data.ts`)

Currently uses mock data with a stub `api` object that logs calls. The API shape mirrors a real backend:
- `api.articles.list()` / `api.articles.get(id)` / `api.articles.create()`
- `api.reviews.list()` / `api.reviews.create()` / `api.reviews.filter()`
- `api.auth.me()` / `api.auth.redirectToLogin()`

### Component Structure

- `components/ui/` - Reusable UI primitives (button, input, dialog, badge, textarea)
- `components/common/` - Shared components (ArticleCard, StarRating)
- `components/reviews/` - Review-specific components (LogReviewModal)
- `components/Navigation.tsx` - Global nav

### Routes

- `/` - Home with popular articles and recent reviews feed
- `/articles` - Browse all papers with search
- `/articles/[id]` - Individual article detail page
- `/profile` - User profile

### Database Schema (PostgreSQL)

- `jstor_articles` - Academic articles from JSTOR (item_id, title, published_date, creators_string, url)
- `users` - User accounts (email, username)
- `marks` - User interactions with articles (rating, note, liked flag)

## Key Dependencies

- `framer-motion` - Animations (used in ArticleCard hover effects)
- `lucide-react` - Icons
- `date-fns` - Date formatting
