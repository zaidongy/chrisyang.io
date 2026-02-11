# CLAUDE.MD - Project Context for chrisyang.io

This file contains contextual information about the chrisyang.io website project for AI assistant reference.

---

## 📋 Project Overview

**Name:** chrisyang.io  
**Type:** Personal blog/portfolio site  
**Owner:** Chris Yang (ServiceNow Architect at PayPal)  
**Purpose:** Professional branding, ServiceNow knowledge sharing, establishing thought leadership  
**Domain:** https://chrisyang.io  
**Repo:** https://github.com/zaidongy/chrisyang.io

---

## 🛠️ Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| SSG | Hugo | 0.133.1 |
| Theme | PaperMod | Latest (git submodule) |
| Hosting | Netlify | - |
| Analytics | Google Analytics 4 | G-W48ETPHDBB |
| Build | Hugo CLI | `hugo --gc --minify` |

---

## 📁 Directory Structure

```
chrisyang.io/
├── archetypes/           # Content templates
│   ├── default.md       # Basic template (+++ TOML)
│   └── posts.md         # Post template (YAML frontmatter)
├── content/             # Site content
│   └── posts/           # Blog posts
│       ├── first-post.md        # Demo post (DRAFT)
│       ├── md-guide.md          # Markdown guide (DRAFT)
│       └── mrvs/                # MRVS tutorial (PUBLISHED)
│           ├── index.md
│           └── *.png (8 images)
├── static/              # Static assets
│   └── favicon.ico      # Site favicon
├── themes/              # Hugo themes (submodule)
│   └── PaperMod/        # Currently EMPTY - needs `git submodule update --init`
├── hugo.yaml            # Production config
├── hugo-dev.yaml        # Development config
├── netlify.toml         # Netlify build settings
├── .gitmodules          # Git submodule config
└── CLAUDE.MD           # This file
```

---

## ⚙️ Configuration Details

### Production Config (hugo.yaml)

**Base URL:** https://chrisyang.io  
**Pagination:** 3 posts per page  
**Theme:** PaperMod  
**Build:** Minified, no drafts, robots.txt enabled

**Profile Mode Settings:**
- Enabled: Yes
- Title: "Chris Yang"
- Subtitle: "ServiceNow | Tennis | Music"
- Image: NOT SET (empty imageUrl)
- Buttons: Posts only

**Features Enabled:**
- Reading time display
- Post navigation links
- Breadcrumbs
- Code copy buttons
- Word count
- RSS button
- Table of contents
- Fuse.js search (JSON output)
- Dark/light mode toggle

**Features Disabled:**
- Share buttons
- Comments
- Special 1st post styling

**Social Links:**
- LinkedIn: https://www.linkedin.com/in/zaidongy/
- GitHub: https://github.com/zaidongy/
- Email: mailto:chris@chrisyang.io

**Navigation Menu:**
1. Categories (/categories/)
2. Tags (/tags/)

**Analytics:**
- Google Analytics 4: G-W48ETPHDBB

### Development Config (hugo-dev.yaml)

**Base URL:** Google Cloud Workstations dev URL  
**Pagination:** 4 posts per page  
**Build Drafts:** Yes (for local development)

---

## 📝 Content Architecture

### Post Frontmatter Template (YAML)

```yaml
---
title: "Post Title"
date: "2024-01-01T00:00:00Z"
description: "SEO description"
categories: ["Service Catalog", "Tech"]
tags: ["MRVS", "Scripting", "Notifications"]
showToc: false
TocOpen: false
draft: false
hidemeta: false
comments: false
disableShare: false
disableHLJS: false
hideSummary: false
searchHidden: false
ShowReadingTime: true
ShowBreadCrumbs: true
ShowPostNavLinks: true
ShowWordCount: true
ShowRssButtonInSectionTermList: true
UseHugoToc: true
---
```

### Content Organization

**Current Published Posts:** 1
- **MRVS Tutorial** (`content/posts/mrvs/`)
  - Title: "How to use multi-row variable set"
  - Date: 2024-09-07
  - Categories: Service Catalog
  - Tags: MRVS, Notifications, Scripting, Variable Sets
  - Has 8 screenshots
  - Includes JavaScript code blocks

**Draft Posts:** 2
- First post (demo/testing)
- Markdown syntax guide (demo)

**Missing Content:**
- About page
- /now page
- ServiceNow series posts
- Author profile content

---

## 🎨 Theme Information

**Theme:** PaperMod by Aditya Telange  
**Repo:** https://github.com/adityatelange/hugo-PaperMod  
**Status:** Git submodule (currently empty in clone)

**To initialize theme:**
```bash
git submodule update --init --recursive
```

**PaperMod Features Used:**
- Profile mode homepage
- Dark/light theme toggle
- Search functionality (Fuse.js)
- Code syntax highlighting (Chroma/monokai)
- Responsive design
- SEO optimized

---

## 🚀 Deployment

**Platform:** Netlify  
**Build Command:** `hugo --gc --minify`  
**Publish Directory:** `public/`  
**Timezone:** America/Los_Angeles  

**Auto-deploy:** Enabled on push to main branch

---

## 📊 Current State Assessment

### ✅ What's Working
- Hugo + PaperMod setup is functional
- Custom domain (chrisyang.io) configured
- Google Analytics tracking installed
- One quality ServiceNow post published (MRVS)
- Social links configured
- Search functionality enabled
- RSS feed available

### ⚠️ Issues
- PaperMod theme submodule is empty (needs initialization)
- Profile image not set
- Site description is generic
- Only 1 published post
- No About page
- No /now page
- Missing favicon variants (16x16, 32x32)

### 🎯 Priority Improvements

**HIGH (Do First):**
1. Initialize PaperMod theme submodule
2. Add professional headshot to homepage
3. Write About page
4. Publish 2-3 more ServiceNow posts

**MEDIUM:**
5. Optimize site description for SEO
6. Create /now page
7. Add OpenGraph images for social sharing
8. Organize content into series

**LOW:**
9. Add newsletter signup
10. Implement comments (Giscus)
11. Create custom shortcodes
12. Add structured data (Schema.org)

---

## 📝 Content Ideas (ServiceNow Focus)

Based on Chris's role at PayPal, these topics would establish expertise:

**Now Assist Series:**
- Now Assist implementation at PayPal
- Configuring AI Search
- Custom skill development
- ROI measurement

**Architecture Deep Dives:**
- Multi-instance architecture patterns
- Integration Hub best practices
- Security model design
- Performance optimization

**Practical Tutorials:**
- Flow Designer error handling
- Catalog variable validation
- Scripted REST APIs
- ATF testing strategies

**Thought Leadership:**
- "Why ServiceNow projects fail"
- Build vs buy decision framework
- Platform roadmap reactions
- Career advice for SN developers

---

## 🔧 Common Commands

```bash
# Start dev server
hugo server -D --bind 0.0.0.0

# Build for production
hugo --gc --minify

# Create new post
hugo new posts/my-post/index.md

# Update theme submodule
git submodule update --remote
```

---

## 📚 Reference Files

- **Full improvement backlog:** `IMPROVEMENT_BACKLOG.md`
- **Daily suggestions config:** `daily-suggestions.json`
- **Hugo docs:** https://gohugo.io/documentation/
- **PaperMod wiki:** https://github.com/adityatelange/hugo-PaperMod/wiki

---

## 🐠 Notes for AI Assistant

**Context to Remember:**
- Chris is a ServiceNow Architect at PayPal
- Currently working on Now Assist (AI) projects
- Recovering from Achilles injury (limited mobility)
- Based in Henderson, NV
- Goals: Build professional brand, share SN knowledge, clean design

**Tone for Suggestions:**
- Practical and actionable
- Focus on ServiceNow expertise
- Professional but personal
- Quality over quantity

**When Making Changes:**
- Test locally with `hugo server -D` first
- Preview changes before committing
- Keep commits atomic and descriptive
- Update both hugo.yaml and hugo-dev.yaml when relevant

---

*Last updated: 2026-02-11 by Jimmy 🐠*
