# Graph Report - /Users/chrisyang/code/chrisyang.io/.claude/worktrees/portfolio-revamp  (2026-05-03)

## Corpus Check
- 20 files · ~213,121 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 48 nodes · 60 edges · 8 communities detected
- Extraction: 83% EXTRACTED · 17% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.89)
- Token cost: 17,000 input · 19,472 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Scroll Animations Implementation|Scroll Animations Implementation]]
- [[_COMMUNITY_Scroll Locking & Pinned Entrance|Scroll Locking & Pinned Entrance]]
- [[_COMMUNITY_ServiceNow CICD & Flow|ServiceNow CI/CD & Flow]]
- [[_COMMUNITY_Integration Resilience|Integration Resilience]]
- [[_COMMUNITY_GSAP ScrollTrigger & Snap|GSAP ScrollTrigger & Snap]]
- [[_COMMUNITY_Mobile & Services Design|Mobile & Services Design]]
- [[_COMMUNITY_Accessibility & Posts|Accessibility & Posts]]
- [[_COMMUNITY_Hero Animation|Hero Animation]]

## God Nodes (most connected - your core abstractions)
1. `init()` - 6 edges
2. `Scroll Locking` - 6 edges
3. `Pinned Section Entrance` - 6 edges
4. `Reduced Motion Accessibility` - 5 edges
5. `Hero Character Clip-In` - 5 edges
6. `initHeroAnimation()` - 4 edges
7. `Services Alternating Cascade` - 4 edges
8. `Mobile Viewport Detection` - 3 edges
9. `Posts Horizontal Slide-In` - 3 edges
10. `About Rising Stagger` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Hero Character Clip-In Design` --semantically_similar_to--> `Hero Character Clip-In`  [INFERRED] [semantically similar]
  docs/superpowers/specs/2026-04-26-scroll-animations-design.md → docs/superpowers/plans/2026-04-26-scroll-animations.md
- `Scroll Animation Accessibility` --semantically_similar_to--> `Reduced Motion Accessibility`  [INFERRED] [semantically similar]
  docs/superpowers/specs/2026-04-26-scroll-animations-design.md → docs/superpowers/plans/2026-04-26-scroll-animations.md
- `Pinned Section Entrance` --semantically_similar_to--> `Scroll Locking`  [INFERRED] [semantically similar]
  docs/superpowers/specs/2026-04-26-scroll-animations-design.md → docs/superpowers/plans/2026-04-26-scroll-animations.md
- `Proximity-Based Snap Behavior` --semantically_similar_to--> `Proximity-Based Snap`  [INFERRED] [semantically similar]
  docs/superpowers/specs/2026-04-26-scroll-animations-design.md → docs/superpowers/plans/2026-04-26-scroll-animations.md
- `Mobile Scroll Animation Behavior` --semantically_similar_to--> `Mobile Viewport Detection`  [INFERRED] [semantically similar]
  docs/superpowers/specs/2026-04-26-scroll-animations-design.md → docs/superpowers/plans/2026-04-26-scroll-animations.md

## Hyperedges (group relationships)
- **Section Entrance Animation Pattern** — 2026_04_26_scroll_animations_hero_clip_in, 2026_04_26_scroll_animations_services_cascade, 2026_04_26_scroll_animations_posts_slide_in, 2026_04_26_scroll_animations_about_rising_stagger [EXTRACTED 1.00]
- **Integration Resilience Strategy** — resilient_integrations_retry_patterns, resilient_integrations_circuit_breaker, resilient_integrations_monitoring [EXTRACTED 1.00]
- **ServiceNow CI/CD Pipeline** — cicd_servicenow_guide_source_control, cicd_servicenow_guide_automated_testing, cicd_servicenow_guide_deployment_pipelines [EXTRACTED 1.00]

## Communities (11 total, 1 thin omitted)

### Community 0 - "Scroll Animations Implementation"
Cohesion: 0.36
Nodes (8): init(), initAboutAnimation(), initHeroAnimation(), initPostsAnimation(), initServicesAnimation(), initSnap(), lockScroll(), splitTextToChars()

### Community 1 - "Scroll Locking & Pinned Entrance"
Cohesion: 0.4
Nodes (6): About Rising Stagger, About Rising Stagger Design, Hero Character Clip-In Design, Pinned Section Entrance, Scroll Locking, GSAP ScrollTrigger

### Community 2 - "ServiceNow CI/CD & Flow"
Cohesion: 0.47
Nodes (6): Automated Testing for ServiceNow, Deployment Pipelines for ServiceNow, Source Control for ServiceNow, Flow Designer vs Workflow Decision Framework, Flow Designer, ServiceNow Workflow

### Community 4 - "Integration Resilience"
Cohesion: 0.5
Nodes (5): Circuit Breaker, Integration Monitoring, Retry Patterns, Expensive Prototype Anti-Pattern, Maintainable Platform Pattern

### Community 5 - "GSAP ScrollTrigger & Snap"
Cohesion: 0.5
Nodes (4): Proximity-Based Snap Behavior, GSAP, Proximity-Based Snap, GSAP ScrollToPlugin

### Community 6 - "Mobile & Services Design"
Cohesion: 0.5
Nodes (4): Mobile Scroll Animation Behavior, Services Alternating Cascade Design, Mobile Viewport Detection, Services Alternating Cascade

### Community 7 - "Accessibility & Posts"
Cohesion: 0.5
Nodes (4): Scroll Animation Accessibility, Posts Horizontal Slide-In Design, Posts Horizontal Slide-In, Reduced Motion Accessibility

## Knowledge Gaps
- **4 isolated node(s):** `portfolio-ready Event`, `Scroll Animation Accessibility`, `Mobile Scroll Animation Behavior`, `Expensive Prototype Anti-Pattern`
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Scroll Locking` connect `Scroll Locking & Pinned Entrance` to `Hero Animation`, `Mobile & Services Design`, `Accessibility & Posts`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Why does `Pinned Section Entrance` connect `Scroll Locking & Pinned Entrance` to `GSAP ScrollTrigger & Snap`, `Mobile & Services Design`, `Accessibility & Posts`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `Hero Character Clip-In` connect `Hero Animation` to `Scroll Locking & Pinned Entrance`, `Mobile & Services Design`, `Accessibility & Posts`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **What connects `portfolio-ready Event`, `Scroll Animation Accessibility`, `Mobile Scroll Animation Behavior` to the rest of the system?**
  _4 weakly-connected nodes found - possible documentation gaps or missing edges._