# Deploy to Vercel (0 Serverless Functions)

This project uses a **static-only** deploy to stay under Vercel Hobby's 12-function limit.

## How it works

1. **GitHub Action** (on push to `main`): runs `next build` (static export) and pushes the `out/` contents to branch **`vercel-static`**.
2. **Vercel** deploys from branch **`vercel-static`** with **no build** — only static files, so **0 serverless functions**.

## Vercel project settings

In your Vercel project → **Settings** → **Build & Development Settings**:

| Setting | Value |
|--------|--------|
| **Production Branch** | `vercel-static` |
| **Framework Preset** | **Other** |
| **Build Command** | *(leave empty — skip build)* |
| **Output Directory** | `.` (root) |
| **Install Command** | *(leave default or empty)* |

Save. Deployments from `vercel-static` will just serve the static files — no Next.js build on Vercel, no serverless functions.

## First-time setup

1. Push this repo (including `.github/workflows/deploy-static.yml`) to `main`.
2. Wait for the GitHub Action to run (Actions tab). It will create/update the `vercel-static` branch.
3. In Vercel: set **Production Branch** to **`vercel-static`** and the settings above.
4. Trigger a deploy (or push a small change to `main` to re-run the action and update `vercel-static`).

After that, every push to `main` will run the action, update `vercel-static`, and Vercel will auto-deploy that branch with 0 functions.
