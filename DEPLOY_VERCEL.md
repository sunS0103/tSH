# Deploy to Vercel (0 Serverless Functions)

The workflow builds the static export and deploys the `out/` folder **directly to Vercel** (no push to a GitHub branch), so you get **0 serverless functions** and no 12-function limit.

## 1. Create a Vercel token

1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens).
2. Create a token (e.g. name: `github-actions`).
3. Copy the token.

## 2. Add the token as a repo secret

1. GitHub repo → **Settings** → **Secrets and variables** → **Actions**.
2. **New repository secret**.
3. Name: **`VERCEL_TOKEN`**
4. Value: paste the token → **Add secret**.

## 3. (Optional) Link to an existing Vercel project

If you want deployments to go to your existing Vercel project:

1. Locally run once: `npx vercel link` in the project root and choose your org/project.
2. That creates `.vercel/project.json` with `orgId` and `projectId`. Commit and push it so the Action uses the same project.

If you skip this, the first run may create a new Vercel project; you can then set the production URL in Vercel.

## 4. Run the workflow

- Push to **main** (the workflow runs automatically), or
- **Actions** → **Deploy static to Vercel** → **Run workflow**.

The Action will:

1. Run `npm ci` and `npm run build` (static export → `out/`).
2. Deploy `out/` to Vercel with `vercel deploy --prod`.

No GitHub branch is pushed, so branch protection does not matter. Deployments are static only, so **0 serverless functions**.
