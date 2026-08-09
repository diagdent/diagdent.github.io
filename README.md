# diagdent.github.io — historia zmian

Public changelog for the DiagDent system, published to GitHub Pages.

- **`/`** — Doctor Page: doctor-audience entries of the web platform only.
- **`/admin/`** — Admin Page: all published entries (web + consent app), admin entries badged.
- **`/rss.xml`** — full feed of every published release.

## How releases get here

One **Release File** per release under `releases/<product>/<version>.md`:

```markdown
---
product: web            # or consent-app
version: 2026.8.1
date: 2026-08-14
entries:
  - text: Polish, user-facing sentence.
    audience: doctor    # shown to everyone
  - text: Admin-only detail.
    audience: admin     # admin page only
---
```

`internal` changes are never committed here — this repo is public; classification
happens during release review (see the `release-changelog` skill in the diagdent
workspace and ADR 0002 in `namimed-api`).

Web releases are written by the Release Skill; consent-app releases by its
`release.py`. Pushing to `main` triggers the GitHub Action that builds the Astro
site and deploys Pages — no manual build step.

## Local preview

```sh
npm install
npm run dev
```
