# STAND MINES - Game Hub

## Overview

STAND MINES is a Minesweeper-style web game with a gold currency system, boost mechanics, and multi-language support (Russian/English). The application features a React frontend with shadcn/ui components, an Express backend, and PostgreSQL database with Drizzle ORM. The game includes a loading screen, grid-based mine gameplay, cashout system, and daily attempt limits.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for bundling
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **State Management**: TanStack React Query for server state
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI primitives wrapped with shadcn/ui styling

The frontend has two entry points:
1. `client/src/main.tsx` - React application entry
2. `client/index.html` - Standalone vanilla JS game (uses `app.js`, `mines.js`, `i18n.js`)

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **HTTP Server**: Node.js HTTP server wrapping Express
- **Development**: Vite dev server with HMR in development mode
- **Production**: Static file serving from built assets

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts`
- **Current Schema**: Users table with id, username, password fields
- **Client-side Storage**: localStorage for game state persistence (gold, attempts, boosts)

### Build System
- **Client Build**: Vite builds to `dist/public`
- **Server Build**: esbuild bundles server to `dist/index.cjs`
- **Build Script**: `script/build.ts` handles both builds

### Path Aliases
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets` → `attached_assets/`

## External Dependencies

### Database
- **PostgreSQL**: Required via `DATABASE_URL` environment variable
- **Drizzle Kit**: Database migrations stored in `./migrations`
- **Session Store**: connect-pg-simple for session persistence

### Third-Party Libraries
- **@tanstack/react-query**: Server state management
- **drizzle-orm** + **drizzle-zod**: Database ORM with Zod validation
- **express-session**: Session management
- **Radix UI**: Headless UI component primitives

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Error overlay in development
- **@replit/vite-plugin-cartographer**: Development tooling
- **@replit/vite-plugin-dev-banner**: Development mode indicator

### Fonts & Styling
- Google Fonts: Montserrat (400, 600, 700, 800 weights)
- CSS Variables for theming with dark mode support