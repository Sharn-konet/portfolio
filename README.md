# sharnko.net

Personal site for Sharn-Konet Reitsma. Styled as a CRT terminal using SvelteKit 2 + Svelte 5.

Live at [sharnko.net](https://sharnko.net).

## Stack

- **SvelteKit 2 + Svelte 5** with `@sveltejs/adapter-static`
- **mdsvex** for markdown content (work entries, writing posts, about)
- **Vanilla CSS** with design tokens in `src/lib/tokens.css`
- **Web Audio API** for the CRT bed, click, kachunk, etc.

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
