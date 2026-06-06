# chrisyang.io - Claude Guidance

## Page Layout Pattern

All pages must use the shared `Layout` component (`src/layouts/Layout.astro`). It provides the HTML boilerplate, `<head>` with meta tags, favicon, and **Google Analytics tracking** (`G-W48ETPHDBB`).

### How to create a new page

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="Page Title — chrisyang.io">
  <!-- your page content -->
</Layout>
```

**Do NOT** write a standalone `<!doctype html>`, `<html>`, `<head>`, or `<body>` in a new page — that's all handled by `Layout.astro`.

### Why

The `Layout` component centralizes shared elements (favicon, viewport meta, charset, GA tag). Adding them manually to each page means they can be forgotten or go out of sync when the tracking ID changes.
