# CLAUDE.md - Project Context

## Project Overview
TechSmartHire is a skill-first hiring platform connecting candidates and recruiters based on real skills via assessments. This is the frontend application.

## Tech Stack
- **Framework:** Next.js 16 (App Router), React 19, TypeScript 5
- **Styling:** Tailwind CSS 4, custom CSS variables (OKLch color space)
- **UI Components:** Shadcn/UI (Radix UI primitives), class-variance-authority
- **Icons:** lucide-react (primary), @iconify/react (secondary)
- **Forms:** react-hook-form + Zod 4 validation
- **HTTP:** axios with custom interceptors (token handling, 401 redirect)
- **Auth:** next-auth 4 (CredentialsProvider), Firebase Google OAuth
- **Animations:** framer-motion
- **Toasts:** sonner
- **Font:** Plus Jakarta Sans (400, 500, 600, 700)

## Project Structure
```
app/
  (landing)/       # Public pages (home, about, faqs, assessment/[slug], qa-job-fair, contact)
  (public)/        # Auth routes (authentication, sign-up)
  (private)/       # Protected routes (dashboard, assessments, jobs, profile, credits, talent-pool)
  api/auth/        # NextAuth route handler
api/               # API service functions (NOT Next.js API routes)
components/
  ui/              # Shadcn/UI base components (~37 files)
  landing/         # Landing page Header.tsx, Footer.tsx
  header.tsx       # Private/app header (sticky, role-based nav, mobile bottom nav)
  assessments/     # Assessment cards, lists, details
  dashboard/       # candidate-dashboard.tsx, recruiter-dashboard.tsx
  jobs/            # Job listing/detail (candidate-jobs/, recruiter-jobs/)
  talent-pool/     # Talent pool components (RECRUITER only)
  providers/       # Context providers (notification-provider, session-provider)
  common/          # Shared components
lib/               # Utilities (utils.ts with cn(), formatDuration, etc.)
types/             # TypeScript type definitions
validation/        # Zod validation schemas
```

## Route Groups & Layouts
- **Landing layout** (`(landing)/layout.tsx`): Landing Header + Footer. Used for public assessment pages (`/assessment/[slug]`).
- **Private layout** (`(private)/layout.tsx`): App Header + NotificationProvider + CandidateGuard. Wraps authenticated routes.
- **Public layout** (`(public)/layout.tsx`): Minimal wrapper for auth pages.
- **Root layout** (`app/layout.tsx`): Font loading, NextAuthSessionProvider, GTM (production), Razorpay script, Toaster.

## Authentication & Roles
- **Two roles:** `CANDIDATE` | `RECRUITER`
- **Cookie-based:** `token` (JWT), `user_role`, `profile_data`
- Auth flow: OTP-based email login OR Google OAuth via Firebase
- Axios interceptor auto-attaches Bearer token; 401 clears cookies and redirects to `/authentication`
- **CandidateGuard:** Enforces profile completion before accessing `/dashboard`, `/assessments`, `/jobs`

### Role-Specific Routes
- **RECRUITER only:** `/talent-pool`, `/credits`
- **Both:** `/dashboard`, `/assessments`, `/jobs`, `/profile`

### Role-Based Navigation (header.tsx)
- Desktop: horizontal nav, hidden on mobile (`hidden md:flex`)
- Mobile: bottom nav bar, only on specific routes per role

## API Layer
- **Location:** `/api/` directory (separate from Next.js API routes)
- **Client:** `/api/axios/index.ts` - base URL from `NEXT_PUBLIC_API_URL`, 30s timeout
- **Modules:** auth, profile, assessments, jobs/, recruiter/, candidate/, notifications, payment, settings, contact
- **Convention:** API fields use `snake_case`, functions use `camelCase`

## Styling Conventions
- **Primary color:** #5245e5 (purple-blue), palette: primary-50 to primary-900
- **Secondary color:** #9134ea (purple), palette: secondary-50 to secondary-900
- **Utility class:** `.max-container` = max-width: 1440px, centered
- **Class merging:** `cn()` from `lib/utils.ts` (clsx + tailwind-merge)
- **Breakpoints:** `md:` for desktop (768px+), mobile-first approach
- **Responsive patterns:** `hidden md:flex` (desktop only), `md:hidden` (mobile only)

## Key Components
- **`components/header.tsx`**: Private app header. Sticky top, role-based nav items, mobile bottom nav. Hides on `/authentication`.
- **`components/landing/Header.tsx`**: Landing page header. Fixed position, mobile hamburger menu, scroll-based styling.
- **`components/assessments/assessment-card.tsx`**: Assessment card with circular score indicator (ScoreCircle), color-coded score bands (Expert >75%, Experienced >60%, Intermediate >40%, Beginner <=40%).
- **`components/talent-pool/score-interpretation-popover.tsx`**: Reusable score bands tooltip.
- **`components/dashboard/candidate-dashboard.tsx`**: Candidate dashboard with stats cards, Completed Assessments, Recommended Assessments, Applied Jobs sections.

## Naming Conventions
- **Files:** kebab-case (`assessment-card.tsx`)
- **Components:** PascalCase (`AssessmentCard`)
- **API functions:** camelCase (`getTakenAssessmentsList`)
- **API fields:** snake_case (`first_name`, `user_role`)
- **Routes:** lowercase with hyphens (`/profile-details`)

## Commands
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Environment Variables
- `NEXT_PUBLIC_APP_URL` - App base URL
- `NEXT_PUBLIC_API_URL` - Backend API base URL
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - Google reCAPTCHA key
- `NEXT_PUBLIC_ENV` - Environment (production/development)
- `NEXT_PUBLIC_AUTH_SECRET` - NextAuth secret

## Important Notes
- `reactStrictMode: false` in next.config
- Google Tag Manager: GTM-WFZ9226R (production only)
- Razorpay integration for payments/credits
- HTML sanitization via isomorphic-dompurify
- Two separate headers exist: landing (public) and app (private) - don't confuse them
- Assessment pages under `/assessment/[slug]` use landing layout; `/assessments/*` use private layout

## Assessment Details Flow (Private)
- Located in `components/assessment-details/`
- **5-step onboarding** before starting an assessment:
  1. **Introduction & Syllabus** - Topics grid, "Download Sample Questions" button, assessment stats cards
  2. **Exam Process** - How the exam works
  3. **Score Visibility & Privacy** - How scores are used, recruiter interpretation factors
  4. **Integrity & Code of Conduct** - Rules and guidelines
  5. **Final Start Section** - Payment cards, Start Now/Later dialogs
- Each step has a confirmation checkbox that must be checked before proceeding
- **`step-content-wrapper.tsx`** orchestrates which step content to show
- **`assessment-wrapper.tsx`** manages the overall flow, dialogs (Start Now, Start Later, Email Sent), and state

### Assessment Data Sources
- **Public landing pages** (`/assessment/[slug]`): Use static JSON files from `/app/(landing)/assessment/data/{slug}.json` with fields like `sampleQuestionsHref`, `skills`, `questions`, `minutes`
- **Private assessment details** (`/assessments/[id]`): All data fetched from backend API via `GET /candidate/assessment/{slug}` including `topics`, `sample_question_pdf_link`, `duration`, `total_questions`, `payment`, `can_repurchase`, etc.
- These are **separate data sources** - changing JSON files does NOT affect the authenticated assessment flow

### Payment Packages
- **FREE** - Free plan (when `is_free_plan_available` is true)
- **BASIC** - Paid, 30-day exam link validity
- **PREMIUM** - Currently hidden/commented out temporarily
- **PLATINUM** - Includes mentorship, OK-only dialog (no Start Now/Later choice)
- 30-day freeze period after purchase before retake allowed (`can_repurchase`, `can_purchase_in_days` fields)
- Payment via Razorpay, currency toggle: INR/USD

## Profile Onboarding Flow
- Multi-step profile completion at `/profile-details/edit-*` routes
- Steps: Account & Identity -> Personal & Social -> Employment -> Skills -> Education -> Location & Work Preferences
- **CandidateGuard** blocks access to dashboard/jobs/assessments until profile is 100% complete
- Profile completion percentage fetched from `GET /candidate/profile/completion-percentage`
- Account & Identity page has mandatory identity confirmation checkbox (Last Name + DOB must match government ID)
- Date of birth is mandatory, formatted as `MM-dd-yyyy`

## QA Job Fair (`/qa-job-fair`)
- Event page showing job listings with status badges:
  - **Live**: Green/emerald badge with pulsing dot animation
  - **Coming Soon**: Amber badge
- Redirects from old route `/qa-job-fair-feb` to `/qa-job-fair` via server redirect
- Client component: `QAJobFairClient.tsx`

## Proxy Middleware (`proxy.ts`)
- Public routes (no auth): `/authentication`, `/assessment`, `/faqs`, `/contact`, `/for-candidates`, `/for-recruiters`, `/qa-job-fair`, `/qa-job-fair-feb`, `/anticipation`
- Logged-in users accessing `/authentication` get redirected to `/dashboard`
- Protected routes set `Cache-Control: no-store, no-cache`
- Role-based access: RECRUITER-only routes (`/talent-pool`, `/credits`) redirect others to home
