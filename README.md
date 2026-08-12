# diagdent.github.io — historia zmian

Public changelog for the DiagDent system, published to GitHub Pages.

- **`/`** — Doctor Page: doctor-audience entries of the web platform only.
- **`/admin/`** — Admin Page: all published entries (web + consent app), admin entries badged.
- **`/rss.xml`** — full feed of every published release.
- **`/feed/doctor.json`** — JSON feed: web releases, doctor entries only (newest-first, max 20).
- **`/feed/admin.json`** — JSON feed: all products, all entries (newest-first, max 20).

GitHub Pages serves `Access-Control-Allow-Origin: *`, so the app can fetch the
JSON feeds cross-origin without any extra configuration.

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
  # Optional per-entry extras (no release uses them yet — sample only):
  # - text: Nowa wyszukiwarka badań.
  #   audience: doctor
  #   media:
  #     type: clip                          # or image
  #     src: /media/2026.8.5/search.webm    # site-absolute, must start with /media/
  #     poster: /media/2026.8.5/search.jpg  # optional still frame (clips)
  #     alt: Nagranie nowej wyszukiwarki    # optional
  #   spotlight:
  #     route: /studies                     # in-app route the feature lives on
  #     anchor: study-search                # element anchor to highlight in-app
---
```

Per-entry optional fields:

- **`media`** — screenshot (`type: image`) or short clip (`type: clip`,
  `.webm`/`.mp4`, rendered as a muted loop that autoplays while ≥50 % visible;
  under `prefers-reduced-motion` it gets manual controls instead). Drop the
  files in `public/media/<version>/` and reference them site-absolute
  (`/media/<version>/…`) — the schema enforces the `/media/` prefix. The JSON
  feeds resolve these paths to absolute URLs.
- **`spotlight`** — in-app target (`route` + `anchor`) the app can use to
  highlight the released feature; not rendered on this site.

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
