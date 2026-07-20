# Jivana — an AI-built Indian wellness storefront

Jivana is a responsive teaching project for a modern Indian pantry shop. It presents Sooth (dry ginger), Pepramul (ganthoda), Ajma (carom seeds), and Variyali (fennel) with product search, a bag counter, and a newsletter form backed by persistent SQLite-compatible storage.

> Educational concept only. Product descriptions describe culinary tradition, not medical advice.

## What is included

- Next.js 16 App Router and React 19
- Responsive and accessible editorial storefront
- Original AI-generated hero photography
- Search, mobile navigation, bag feedback, and newsletter states
- `/api/subscribe` using Turso/libSQL
- Vercel-ready framework defaults
- This complete AI → GitHub → Vercel lesson

## The important architecture decision

Vercel Functions do not offer a durable local filesystem. A SQLite file written inside a deployed function can disappear when an instance is recycled, and different instances do not share it.

The production-safe interpretation of “persistent SQLite on Vercel” is **Turso/libSQL**. It keeps SQLite semantics and uses a SQLite-compatible protocol while storing data durably outside the function. Local development can still use a literal file with `TURSO_DATABASE_URL=file:local.db`.

```mermaid
flowchart LR
    V[Visitor] --> N[Next.js on Vercel]
    N --> A[POST /api/subscribe]
    A --> T[(Turso / libSQL)]
    G[GitHub repo] -->|deploy| N
```

## Quick start

Prerequisites: Node 22+, Git, GitHub, Vercel, and an optional free Turso database.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. For a local SQLite file, use:

```dotenv
TURSO_DATABASE_URL=file:local.db
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

The local database is ignored by Git. Before deploying, replace this with the hosted Turso URL and token.

## Lesson: ask AI to build the whole project

### 1. Start with a complete brief

Describe the business, audience, content, visual feeling, key functions, constraints, and finish line. Treat other sites as inspiration—not something to clone.

```text
Build a premium online Indian wellness pantry for U.S. customers.

Purpose: make hard-to-find Indian culinary botanicals easy to understand and use. Feature Sooth (dry ginger), Pepramul (ganthoda), Ajma (carom seeds), and Variyali (fennel). Emphasize raw, natural sourcing without making medical promises.

Visual direction: modern Indian editorial, deep forest green, turmeric gold, clay, and warm cream. Use purposeful food photography, excellent typography, generous whitespace, and tactile product cards. Responsive and accessible.

Functionality: product search, add-to-bag interaction, mobile menu, newsletter signup, and persistent SQLite-compatible storage. Deploy on Vercel's free plan. Put the project in GitHub and write a complete lesson showing how it was made.

References for information architecture and merchandising patterns:
- https://thedesifood.com/collections/mouth-freshener
- https://www.desiclik.com/mukhwas-mouth-freshener.html
- https://vamukh.com/

Implement, validate, publish to GitHub, and deploy to Vercel. Explain platform constraints honestly and choose the closest production-safe solution.
```

Why it works: this prompt defines the outcome, brand voice, exact products, interactions, technical requirements, and “done.”

### 2. Give AI the right capabilities

In Codex, capabilities come from skills, plugins, connected apps, and local tools. Names change, so describe the job when an exact capability is unavailable.

| Need | Capability | Job |
| --- | --- | --- |
| Site | Sites building / Next.js | Layout, content, responsiveness, interactions |
| Imagery | Image generation | One art-directed hero when stock is not distinctive |
| Hosting | Vercel deployment | Link, deploy, inspect, return live URL |
| Data | Vercel storage + Turso/libSQL | Durable SQLite-compatible records |
| Source | GitHub | Repository, commits, push, review |
| QA | Browser verification | Desktop/mobile and interaction checks |

Helpful follow-up:

```text
Use the site-building, image, GitHub, and Vercel capabilities available. Verify the result in a browser. Keep credentials out of the repository.
```

### 3. Force an honest storage decision

```text
Before implementing storage, explain whether a local SQLite file is durable on Vercel Functions. If not, use a free SQLite-compatible hosted option and document local and production setup.
```

A strong agent should reject `/tmp` as “persistent” and recommend a hosted SQLite-compatible database such as Turso/libSQL.

### 4. Use outcome-based checkpoints

```text
Continue until the production build passes. Test desktop and mobile layouts, product search, mobile navigation, add-to-bag feedback, and success/failure states of signup.
```

```text
Review the copy for health-claim risk. Rewrite promises to diagnose, treat, cure, or prevent conditions. Preserve culinary-wellness positioning.
```

```text
Inspect the Git diff before committing. Exclude secrets, local databases, build output, and unrelated files.
```

### 5. Configure persistent SQLite-compatible storage

Create a free database using current instructions at [Turso](https://turso.tech/). Copy `.env.example` to `.env.local`:

```dotenv
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-secret-token
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

The API creates this table on the first valid signup:

```sql
CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Add the same values under Vercel → Project → Settings → Environment Variables. Never commit them.

### 6. Publish to GitHub

For a new private repository:

```bash
git init
git add .
git commit -m "Build Jivana wellness storefront"
gh repo create jivana-indian-wellness --private --source=. --remote=origin --push
```

For a branch and draft pull request in an existing repo:

```bash
git switch -c agent/jivana-storefront
git add app lib public .env.example README.md package.json package-lock.json
git commit -m "Build Jivana wellness storefront"
git push -u origin agent/jivana-storefront
gh pr create --draft --fill
```

AI prompt:

```text
Publish this as a private GitHub repository named jivana-indian-wellness. Inspect the working tree and .gitignore first. Commit only the finished site, lesson, lockfile, and safe configuration. Never commit .env files, tokens, or local database files.
```

### 7. Deploy on Vercel Free

Vercel detects Next.js automatically:

```bash
vercel
# after preview verification
vercel --prod
```

Alternatively import the GitHub repository in Vercel for automatic preview deployments and production deploys from the chosen branch.

AI prompt:

```text
Deploy this project to my logged-in Vercel account on the free plan. Use Next.js defaults. Add the Turso variables to Preview and Production without exposing them. Verify a 200 response and confirm a test signup persists.
```

### 8. Definition of done

- Production build passes.
- Phone, tablet, and desktop layouts work.
- Navigation is keyboard-usable.
- Search filters products and has an empty state.
- Bag count updates.
- Signup validates emails and tolerates duplicates.
- Production data remains after redeploy.
- No secrets or local database files are in Git.
- GitHub and Vercel URLs are returned.
- Wellness copy is framed as culinary tradition with a disclaimer.

## Project map

```text
app/
  api/subscribe/route.ts   newsletter API
  globals.css              responsive visual system
  layout.tsx               fonts and social metadata
  page.tsx                 route entry
  storefront.tsx           interactive storefront
lib/db.ts                  lazy libSQL client
public/hero-botanicals.jpg original hero art
.env.example               environment template
```

## Useful next prompts

```text
Add product detail pages with ingredients, preparation ideas, sourcing notes, and structured product metadata. Preserve the visual system.
```

```text
Replace the demo bag with Stripe Checkout. Keep prices server-side, validate quantities, add a webhook, and document test mode before live payments.
```

```text
Add an owner-only subscriber admin page. Protect it with authentication and never expose the Turso token to browser code.
```

```text
Create GitHub Actions that run the production build on pull requests. Let Vercel handle preview deployments through Git integration.
```

## Safety before a real launch

- Have final health and product copy reviewed for every market where you sell.
- Add shipping, returns, privacy, terms, contact, allergen, and origin information.
- Do not reuse competitor photos or copy; references should guide only structure and expectations.
- Add payments only after prices, tax, fulfillment, refunds, and webhook behavior are decided.

## Image-generation record

The built-in image generator created the hero from an art-directed prompt: amber jars and clay bowls containing dry ginger, ganthoda powder, and ajwain seeds; forest-green backdrop; warm stone; editorial morning light; no text, labels, people, medical props, or watermark.

## License

Use the code as a learning project. Confirm rights for names, claims, photographs, and packaging before commercial use.
