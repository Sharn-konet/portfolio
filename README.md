# sharnko.net

Personal site for Sharn-Konet Reitsma. Lumon-inspired CRT terminal for the main site, Kodak Carousel projection room for the photos. SvelteKit 2 + Svelte 5, statically prerendered for Cloudflare Pages.

Live at [sharnko.net](https://sharnko.net).

## Stack

- **SvelteKit 2 + Svelte 5** with `@sveltejs/adapter-static`
- **mdsvex** for markdown content (work entries, writing posts, about)
- **Vanilla CSS** with design tokens in `src/lib/tokens.css` — no Tailwind
- **Web Audio API** for the CRT bed, click, kachunk, etc — synthesised, no audio files
- **Cloudflare Pages** hosting

## Layout

```
/                  → home (CRT — about pane)
/work              → CRT — experience and projects index
/work/[slug]       → CRT — entry detail
/writing           → CRT — writing index (links into /film as a documentary item)
/writing/[slug]    → CRT — post detail (mdsvex render)
/photos            → CRT pane that points at the projection room
/photos/[tray]     → projection room — different aesthetic; Kodak Carousel
/contact           → CRT — contact rows
/film              → minimal CRT chrome — embedded documentary

/cv.pdf            → static asset
/rss.xml           → writing feed
/sitemap.xml       → auto-generated
/robots.txt        → standard
```

## Content

Markdown in `src/content/`:

- `about.md` — frontmatter for identifier rows, body for prose
- `work/*.md` — schema in `src/lib/content.ts`
- `writing/*.md` — schema in `src/lib/content.ts`
- `photos/*.json` — tray definitions, schema in `src/lib/photos.ts`

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Keyboard

- `1`–`5` jump to tabs (about, work, writing, photos, contact)
- `j` / `k` (or arrow keys) move within list views
- `Esc` exits a detail view
- In the projection room: `←` / `→` advance, `f` focuses, `Esc` leaves

## Design notes

The aesthetic is the theme. There is no light mode, no cookie banner, no comment system, no analytics dashboard, no contact form. Sound is opt-in (off by default, persists in `localStorage`). All animations honour `prefers-reduced-motion: reduce`.
