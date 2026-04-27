# Apple-Style Scroll Animations

## Overview

Add pinned, animated section entrances to the portfolio landing page using GSAP ScrollTrigger. Each section pins in place when scrolled into view, plays its entrance animation with scroll locked, then releases. Sections snap to the nearest section boundary when scrolling stops. Each section has a unique animation style tailored to its content.

## Architecture

A single `src/scripts/scroll-animations.js` module initializes GSAP + ScrollTrigger on page load. Each section gets its own ScrollTrigger config with `pin: true`, snap behavior, and a GSAP timeline of entrance animations.

### Dependencies

- `gsap` — animation engine
- `gsap/ScrollTrigger` — pinning, scroll locking, snap, and scroll-based triggering

Added to `package.json` as production dependencies.

### Integration

- `scroll-animations.js` loaded via `<script>` tag in `index.astro`
- Initializes after the terminal intro animation completes (respects `intro-seen` session storage)
- Removes existing CSS scroll-snap rules — ScrollTrigger handles snap instead

## Scroll Behavior

- **Pinning**: Each section pins when scrolled into view and stays pinned for the duration of its entrance animation timeline
- **Snap**: Proximity-based snap — when the user stops scrolling near a section boundary, the viewport snaps to it. Does not force snap if the user scrolls past the midpoint, avoiding the feeling of being trapped
- **Easing**: All animations use smooth deceleration eases (`power2.out` or `power3.out`) so motion feels controlled and intentional
- **Smooth scroll**: Retain existing `scroll-behavior: smooth` CSS as a baseline

## Per-Section Animations

### Hero — Character Clip-In

- Each character of "chrisyang" clips in from top to bottom with a slight vertical offset and opacity transition
- Tagline and role descriptors fade up from below in a stagger
- Green accent letters ("yang") glow in last with a text-shadow pulse

### Services — Alternating Cascade

- Cards slide in from alternating sides: card 1 from left, card 2 from right, card 3 from left, card 4 from right
- Each card enters with a staggered delay (~0.15s between cards)
- The green left-border accent on each card draws in as the card settles

### Posts — Horizontal Slide-In

- Post cards slide in from the right one after another, matching the existing horizontal slider direction
- Slider navigation (prev/next arrows) fades in last
- Cards animate in sequence with ~0.1s stagger

### About — Rising Stagger

- Bio text lines rise up from below with staggered timing
- Social links (LinkedIn, GitHub, Email) rise up after the bio
- Social links glow green as they settle into place
- Gentle and personal — the final section feels like a quiet landing

## Accessibility

- **Reduced motion**: All scroll animations wrapped in a `prefers-reduced-motion` check. When enabled, sections snap into place instantly with no animation — content is visible immediately
- Follows the existing `prefers-reduced-motion` pattern already in `terminal.js` and `global.css`
- Keyboard navigation unaffected — sections remain reachable via tab order and skip links
- No auto-playing content that requires user intervention to stop

## Mobile Behavior

- Same pin + animation behavior on mobile viewports
- Shorter animation durations on smaller viewports (detected via `window.matchMedia('(max-width: 767px)')`)
- Touch momentum scroll and rubber-banding handled by ScrollTrigger's built-in normalization
- Service cards stack vertically on mobile — animation adjusts to slide in from one direction instead of alternating sides

## Files Modified

| File | Change |
|------|--------|
| `package.json` | Add `gsap` dependency |
| `src/pages/index.astro` | Add `<script>` import for `scroll-animations.js`, remove CSS scroll-snap rules |
| `src/scripts/scroll-animations.js` | New file — GSAP + ScrollTrigger initialization, per-section timelines |
| `src/styles/global.css` | Remove `scroll-snap-type` and `scroll-snap-align` rules |

## Out of Scope

- No changes to the terminal intro animation
- No changes to the existing post slider interaction (prev/next buttons)
- No scroll-triggered parallax or background effects
- No new sections or content changes
