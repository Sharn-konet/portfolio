// Data load lives in +page.server.ts (it reads image dimensions at build
// time so the renderer can stamp width/height on each <img>, which keeps
// the masonry columns from reflowing as photos load in).
export const prerender = true;
