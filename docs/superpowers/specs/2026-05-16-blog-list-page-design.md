# Blog List Page Design

## Overview

Add a standalone `/posts/` page that lists all blog posts in a vertical list. Update the homepage to link to this page, and update individual post pages to link back to the list instead of the homepage slider.

## Approach

**Option chosen**: Standalone page (Option 1 from brainstorming)

Create `src/pages/posts/index.astro` as a self-contained page. No new shared components or layout wrappers — keep it simple for this small site.

## Changes

### 1. New file: `src/pages/posts/index.astro`

- Fetch all posts with `getCollection('posts')`, sort by `pubDate` descending (newest first)
- Same HTML structure as other pages: nav, content, footer
- Nav: `~/chrisyang` brand linking to `/`, links to `/#services` and `/#about`
- Heading: `/posts` (same style as homepage section headings)
- Vertical list of all posts, each showing:
  - Tag (`// servicenow`)
  - Title (h3)
  - Publish date (formatted)
  - Description paragraph
  - "read post →" link to `/posts/[id]`
- Footer: same as other pages

### 2. Homepage update: `src/pages/index.astro`

- Add a "see all →" link next to the `/posts` section heading (line 71)
- This link points to `/posts/` and lets users jump to the full list
- Keep the existing post slider unchanged (one post at a time with prev/next controls)

### 3. Post page update: `src/pages/posts/[id].astro`

- Change the "← back to posts" link from `href="/#posts"` to `href="/posts/"`
- This ensures navigating back from a post goes to the list page, not the homepage slider

### 4. Styling: `src/styles/global.css`

Add new CSS rules (no new CSS file):

- `.posts-list` — container for vertical list: `display: flex; flex-direction: column; gap: 2rem;`
- `.post-list-item` — each post item with vertical spacing
- `.post-list-item h3` — reuse homepage `.work-card h3` sizing
- `.post-list-item .work-type` — reuse existing `.work-type` style
- `.post-list-item time` — small, muted date text
- `.post-list-item .work-link` — reuse existing `.work-link` style
- `.posts-heading-wrapper` — to place "see all →" on same line as homepage `/posts` heading

## Data Flow

1. `posts/index.astro` calls `getCollection('posts')` at build time
2. Posts sorted by `pubDate` descending
3. Each post rendered as a list item with link to `/posts/[id]`
4. No client-side JS needed — pure static HTML

## Scope

- 1 new file: `src/pages/posts/index.astro`
- 1 modified file: `src/pages/index.astro` (add "see all" link)
- 1 modified file: `src/pages/posts/[id].astro` (change back link)
- 1 modified file: `src/styles/global.css` (add new rules)
