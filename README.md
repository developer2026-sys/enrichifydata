# Enrichify — Website

Static marketing site for Enrichify. Three pages: Home, About, Contact. No build step, no framework, no dependencies to install. Plain HTML/CSS/JS that any static host (especially AWS S3 + CloudFront) can serve as-is.

## File structure

```
enrichify-site/
├── index.html        # Home
├── about.html        # About Us
├── contact.html      # Contact (mailto form)
├── css/
│   └── styles.css    # All styling (single file)
├── js/
│   └── main.js       # Mobile nav toggle + footer year
├── assets/
│   └── downloads/    # Capabilities + Case Studies PDFs
└── README.md         # This file
```

That's the entire site. Nothing to compile. The only external request is Google Fonts (Inter); the layout falls back to system fonts if it's ever blocked.

## Run locally

Just open `index.html` in a browser. For an exact production preview, serve the folder:

```bash
cd enrichify-site
python3 -m http.server 8000
# visit http://localhost:8000
```

---

## Deploy to AWS

Pick one of the two paths below. The static files are identical either way. (For Vercel, see DEPLOY-VERCEL.md.)

### Option A — S3 + CloudFront (recommended, cheapest)

1. **Create an S3 bucket** (e.g. `enrichifydata.com`). Region of your choice.
2. **Upload the contents of `enrichify-site/`** to the bucket root — `index.html`, `about.html`, `contact.html`, and the `css/`, `js/`, and `assets/` folders. Keep the folder structure.
3. **Enable Static website hosting** (S3 → Properties) and set:
   - Index document: `index.html`
   - Error document: `index.html`
4. **Put CloudFront in front of the bucket** for HTTPS, caching, and a custom domain:
   - Origin: the S3 bucket (use Origin Access Control so the bucket stays private).
   - Default root object: `index.html`
   - Attach your ACM TLS certificate for `enrichifydata.com` (must be in `us-east-1`).
5. **Point DNS** (Dynadot) at the CloudFront distribution. Leave Google Workspace MX/TXT records untouched.
6. **Invalidate the cache** (`/*`) after each future update so visitors get the new files.

Quick CLI sync once the bucket exists:

```bash
aws s3 sync ./enrichify-site s3://YOUR_BUCKET_NAME --delete
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Option B — AWS Amplify Hosting (easiest ongoing updates)

1. Push this folder to a Git repo (GitHub, CodeCommit, etc.).
2. AWS Amplify → **Host web app** → connect the repo/branch.
3. Build settings: **no build needed** — set the output/artifact directory to the folder that holds `index.html`. A minimal `amplify.yml`:

   ```yaml
   version: 1
   frontend:
     phases:
       build:
         commands: []
     artifacts:
       baseDirectory: /
       files:
         - '**/*'
     cache:
       paths: []
   ```
4. Add your custom domain in Amplify → Domain management (it provisions the TLS cert automatically).
5. Every push to the connected branch redeploys automatically.

---

## Contact form

The contact form on `contact.html` uses a **`mailto:` action** — submitting it opens the visitor's email client with the message pre-filled to `rsmith@enrichifydata.com`. This needs no backend and works the moment the site is live.

If you later want submissions to arrive automatically without the visitor's mail app (i.e. a true server-side form), swap the form's `action` to a handler. Two easy options:

- **Formspree** (no backend work): replace `action="mailto:rsmith@enrichifydata.com"` with `action="https://formspree.io/f/YOUR_ID"` and `method="POST"`, remove the `enctype`.
- **AWS-native**: API Gateway → Lambda → SES. Post the form JSON to an API Gateway endpoint; the Lambda sends the email via SES. (SES must be out of sandbox to email arbitrary addresses.)

---

## Downloads

The Capabilities and Case Studies PDFs live in `assets/downloads/` and are linked from the home page "Resources" section and the footer on every page. Keep them in that folder so the download buttons resolve.

## Editing content

All copy lives directly in the three `.html` files — open them in any editor and edit the text between the tags. Brand colors and fonts are defined once at the top of `css/styles.css` under `:root` (e.g. `--blue: #1B4FB5`). Change them there and every page updates.

## One thing to confirm

The pitch deck shows the second trusted partner as **"Nielsen"** (logo read "Nelson, since 1949"). I used **Nielsen** on the site since that's the known data company. If the partner is actually a different firm, it's a quick text edit — it appears on `index.html` and `about.html`.

## Notes for the developer

- Fully responsive (desktop, tablet, mobile) with a hamburger menu under 640px.
- All internal links are relative, so the site works from any subpath or root.
- Favicon is the inline SVG logo in the header; add a `favicon.ico`/`apple-touch-icon` if desired.
- No analytics included — drop a Google Analytics / Plausible snippet before `</head>` if you want tracking.
