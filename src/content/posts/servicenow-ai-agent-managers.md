---
title: "AI Driven Development in ServiceNow"
pubDate: 2026-05-16
description: "ServiceNow's Fluent SDK turns XML configs into code, letting AI tools like Claude Code drive development. Here's why that means hiring for ServiceNow is about to shift from developers to agent managers."
tag: "servicenow"
---

ServiceNow has enabled agent-based development through product features like external IDs and AI IDs, unlocking AI-driven development that lets LLMs interact directly with the ServiceNow platform. Their recent community article on [building apps via Claude Code and the ServiceNow SDK](https://www.servicenow.com/community/developer-advocate-blog/building-servicenow-apps-via-claude-code-and-the-servicenow-sdk/ba-p/3525677) is a short, practical guide.

## From XML to Code: Why Fluent Matters

ServiceNow's traditional metadata lives in XML. If you have ever tried to get an LLM to reason about an XML-based Business Rule or UI Policy, you know the pain. LLMs are good at code. They are not as good with XML.

The Fluent DSL, delivered through the ServiceNow SDK (Node.js/npm), replaces those XML configs with something that looks and feels like code. Pro developers can stay in their IDE of choice. More importantly, the LLM tooling stack — Claude Code, Cursor, ChatGPT Codex — can now read, write, and reason about ServiceNow metadata directly.

That is the real unlock.

## AI-Driven Development on ServiceNow

With Fluent in place, the entire AI coding toolchain can enter the ServiceNow ecosystem. You describe what you want, the agent writes the Fluent DSL, and the SDK deploys it. The Fluent SDK team is quickly expanding file coverage, but the foundation is already solid for most common metadata types.

The speedup is real. When execution is handled by agents, the repetitive busy work — tweaking forms, wiring up flows, writing boilerplate Script Includes — disappears. A single developer paired with the right agents can deliver at what used to be a team's output.

## The Hiring Shift: Agent Managers, Not Developers

Here is the part that matters most for organizations and individual careers: **the skill set required to be a successful ServiceNow professional is changing, fast.**

We are moving toward a world where organizations hire **agent managers** rather than traditional ServiceNow developers. The role shifts from:

- Writing individual scripts and configs → Designing system behavior
- Manual form/flow construction → Orchestrating agents to do it
- Debugging line-by-line → Oversight and architectural review

Knowledge workers across the platform are moving up the stack. The design perspective becomes the valuable skill. Execution is increasingly handed to AI agents.

If you are a ServiceNow developer today, ask yourself: are you building expertise that an agent can replicate, or are you building the judgment to direct agents effectively?

The market is already starting to differentiate. Traditional XML-tweaking skills are losing leverage. The ability to think in systems, design clean Fluent DSL structures, and manage agent workflows is gaining it.

## How to Get Started

The prerequisites are straightforward:

1. **Set up your IDE** — VS Code, Neovim, whatever you prefer.
2. **Install Claude Code** - (or your AI coding tool of choice).
3. **Install the ServiceNow SDK** - enable fluent DSL compilation
4. **Use build agent skills** - Provide your LLM with ServiceNow context.

## The Bottom Line

This is a stepping stone, not the destination. The Fluent SDK will keep adopting more file types. The agent tooling will keep getting better. But the direction is clear: ServiceNow development is becoming AI-augmented and design-led.

The window to adapt is open now. Once the skill gap widens, catching up gets harder.

Start experimenting.
