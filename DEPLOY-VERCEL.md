# Enrichify — Vercel Deployment Handoff

Everything needed to deploy this site to Vercel and point **enrichifydata.com** at it. Written for a developer with Vercel experience.

---

## 1. What this is

A static, dependency-free marketing site. Plain HTML/CSS/JS — **no build step, no framework, no package install.**

```
enrichify-site/
├── index.html        # Home
├── about.html        # About Us
├── contact.html      # Contact (mailto form)
├── css/styles.css    # All styling
├── js/main.js        # Mobile nav + footer year
├── assets/downloads/ # Capabilities + Case Studies PDFs (served as static downloads)
├── README.md         # General notes (incl. AWS path, if ever needed)
└── DEPLOY-VERCEL.md  # This file
```

Output directory = the project root (the folder containing `index.html`). No framework preset — set the Vercel framework to **"Other"** and leave build/output commands empty.

## 2. Account

- Vercel team / scope: **`rsmith-1338's projects`** (slug `rsmith-1338s-projects`)
- The owner (Roosevelt) will grant you access to this account/team.
- Deploy the project under this team so the domain and billing live in the right place.

## 3. Deploy — pick one

### Option A — Vercel CLI (quickest one-off)

```bash
cd enrichify-site
npm i -g vercel        # if not already installed
vercel login           # use the account you've been granted
vercel                 # creates the project, deploys a preview
vercel --prod          # promotes to production
```

When prompted:
- Set up and deploy → **Yes**
- Scope → **rsmith-1338's projects**
- Link to existing project → **No** (first time)
- Project name → `enrichify` (or your preference)
- Directory with code → `./`
- Override build settings → **No**

### Option B — Git integration (recommended for ongoing updates)

1. Push this folder to a Git repo (GitHub/GitLab/Bitbucket) under, or shared with, the owner's account.
2. Vercel dashboard → **Add New → Project → Import** the repo.
3. Framework preset → **Other**. Build command → empty. Output directory → `./` (root).
4. Deploy. Every push to the production branch auto-deploys; PRs get preview URLs.

Either way you'll get a `*.vercel.app` URL to verify before the custom domain is live.

## 4. Custom domain — enrichifydata.com

**Registrar / DNS:** Dynadot. **Email:** Google Workspace (lives on MX + TXT records — see the warning below).

### In Vercel
1. Project → **Settings → Domains → Add**.
2. Add **both**:
   - `enrichifydata.com` (set as primary)
   - `www.enrichifydata.com` (redirects to apex — Vercel configures this automatically)
3. Vercel will display the exact records to create. They will match what's below.

### In Dynadot (DNS Settings → "Dynadot DNS")
Add these two records:

| Type  | Host / Subdomain | Value                  |
|-------|------------------|------------------------|
| A     | `@` (or blank)   | `76.76.21.21`          |
| CNAME | `www`            | `cname.vercel-dns.com` |

> Confirm the current values against Vercel's Domains panel at deploy time — Vercel occasionally updates the recommended apex IP / CNAME target. Use whatever Vercel shows if it differs.

### ⚠️ Do NOT touch — this keeps Google Workspace email alive
Leave every existing **MX** and **TXT** record in place when you save:
- **MX** → Google (`smtp.google.com`, or the legacy `ASPMX.L.GOOGLE.COM` set)
- **TXT** → SPF (`v=spf1 include:_spf.google.com ~all`), DKIM, DMARC, and any Google site-verification record

Dynadot saves the whole DNS table at once, so verify the MX/TXT rows are still present before hitting save. We are only **adding** the A and CNAME rows above.

### SSL & propagation
Vercel issues the TLS certificate automatically once DNS resolves — typically minutes, up to ~24h for full propagation. No manual cert work.

## 5. Contact form

`contact.html` uses a `mailto:` action → opens the visitor's mail client pre-addressed to **rsmith@enrichifydata.com**. Works immediately, no backend.

To make submissions arrive automatically (no visitor mail app), swap the form `action`:
- **Formspree:** `action="https://formspree.io/f/{id}"`, `method="POST"`, remove `enctype`.
- **Serverless:** a Vercel Function (`/api/contact`) that sends via your provider (Resend, SendGrid, SES). Post the form as JSON; return a thank-you redirect.

## 6. Optional polish (developer's discretion)
- Add a `favicon.ico` / `apple-touch-icon.png` (header currently uses an inline SVG mark).
- Drop in analytics (Vercel Web Analytics is one toggle, or GA4/Plausible before `</head>`).
- If you prefer extensionless URLs (`/about` vs `/about.html`), add a `vercel.json` with `"cleanUrls": true` and update the internal links — not required; current `.html` links work as-is.

## 7. One content flag
The pitch deck listed the second trusted partner as **"Nielsen"** (logo read "Nelson, since 1949"). I used **Nielsen** on Home and About. If it should be a different company, it's a quick text edit in `index.html` and `about.html`.
