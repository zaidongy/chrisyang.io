---
title: "ServiceNow Performance & Technical Debt: A Practical Guide to Fixing the Mess"
description: "How to diagnose performance problems, categorize technical debt, and build a sustainable refactoring strategy."
date: "2026-02-14T12:00:00-08:00"
categories: ["ServiceNow Best Practices"]
tags: ["Performance", "Technical Debt", "Refactoring", "Architecture", "Optimization"]
showToc: true
TocOpen: true
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

# ServiceNow Performance & Technical Debt: A Practical Guide to Fixing the Mess

Every ServiceNow instance accumulates technical debt. It's inevitable. What separates well-run platforms from chaotic ones is how you manage that debt—when to pay it down, when to tolerate it, and how to prevent new debt from spiraling.

At PayPal, I've seen what happens when debt goes unchecked. I've also learned which battles are worth fighting. Here's my practical framework.

---

## Recognizing the Warning Signs

### User-Facing Symptoms

- **List views taking >5 seconds to load**
- **Form load times exceeding 3 seconds**
- **"Transaction cancelled: maximum execution time exceeded" errors**
- **Intermittent timeouts during peak hours**
- **Users complaining about "the system being slow"**

### Backend Indicators

- **Script timeout logs** increasing week-over-week
- **Database connection pool exhaustion**
- **Node health degrading during business hours**
- **Scheduled jobs failing or running long**

**Rule of thumb:** If users notice, you've already waited too long.

---

## Diagnosing Performance Problems

### Tool 1: Performance Analytics

Enable it. Use it. Trust it.

**System Properties:**
- `glide.perf_analytics.debug` = true
- `glide.perf_analytics.logging` = true

**What to look for:**
- Scripts > 500ms execution time
- Database queries > 100ms
- Business rules firing unexpectedly
- Client scripts blocking UI

### Tool 2: System Diagnostics

Navigate to **System Diagnostics > Stats > Transactions**.

Filter by:
- Slowest transactions
- Most frequent transactions
- Error rates

### Tool 3: Debug Mode

Add `?sysparm_debug=true` to any URL. Shows:
- Business rule execution times
- Script include calls
- Query counts

**Pro tip:** Look for the N+1 query pattern—queries inside loops show up as repeated similar queries with different parameters.

### Tool 4: Database Indexes

Check **System Definition > Tables > [Table] > Database Indexes**.

Common missing indexes:
- Reference fields used in queries
- Date fields used for filtering
- Fields used in orderBy

---

## The Three Types of Technical Debt

### 1. Data Debt

**What it is:** Bad data structure, orphan records, inconsistent references

**Examples:**
- Reference fields pointing to deleted records
- Duplicate user accounts
- Inconsistent categorization
- Orphaned attachments

**Impact:** Query performance degrades, reports become unreliable

**Fix strategy:**
- Data cleanup scripts (run during maintenance windows)
- Business rules to prevent new bad data
- Regular data quality audits

### 2. Script Debt

**What it is:** Bad code patterns, spaghetti logic, copy-paste programming

**Examples:**
- 500-line business rules
- GlideRecord queries in loops
- Hardcoded sys_ids
- Global business rules with table filtering
- Duplicate logic across script includes

**Impact:** Hard to maintain, slow to execute, prone to breaking

**Fix strategy:**
- Refactor incrementally (one script at a time)
- Extract reusable logic to script includes
- Add unit tests with ATF
- Code review all new scripts

### 3. Configuration Debt

**What it is:** Unnecessary customizations, unused features, over-engineering

**Examples:**
- 50 custom fields on Incident, 30 unused
- Workflows with 100+ activities
- Catalog items duplicating standard functionality
- Custom apps that should use OOTB features

**Impact:** Upgrade complexity, user confusion, maintenance burden

**Fix strategy:**
- Audit customizations quarterly
- Deprecate unused features
- Simplify workflows
- Challenge new customizations: "Can OOTB do this?"

---

## Refactoring Strategies

### The Incremental Approach (Recommended)

**When to use:** Debt is widespread but not causing outages

**How it works:**
1. Identify the highest-impact, lowest-risk fix
2. Refactor one component
3. Test thoroughly
4. Deploy to production
5. Measure improvement
6. Repeat

**Example:**
- Week 1: Fix the slowest business rule
- Week 2: Add missing indexes
- Week 3: Refactor one script include
- Week 4: Optimize a heavily-used client script

**Pros:** Low risk, continuous improvement, measurable progress
**Cons:** Takes longer, requires discipline

### The Big Bang Rewrite

**When to use:** Legacy implementation is fundamentally broken

**How it works:**
1. Build new implementation in parallel
2. Migrate data
3. Cut over during maintenance window
4. Pray

**Example:** Rebuilding a custom app from scratch using modern patterns

**Pros:** Clean slate, can fix architecture
**Cons:** High risk, long timeline, potential data issues

### The "Stop the Bleeding" Strategy

**When to use:** Debt is actively causing production issues

**How it works:**
1. Immediate fixes for critical issues
2. Temporary workarounds where needed
3. Plan proper fixes for later

**Example:** Adding setLimit() to runaway queries while you refactor the logic

**Pros:** Stabilizes quickly
**Cons:** Accrues more short-term debt

---

## Building a Prevention Strategy

### Code Reviews

**Require reviews for:**
- All business rules
- Script includes
- Client scripts > 20 lines
- Any script touching core tables (Incident, Change, etc.)

**Review checklist:**
- [ ] Query performance (no loops, set limits)
- [ ] Error handling
- [ ] Reusability (extract common logic)
- [ ] Security (ACL checks, injection prevention)
- [ ] Documentation (comments, descriptions)

### Automated Testing

**ATF (Automated Test Framework):**
- Test critical business logic
- Run tests before deployments
- Catch regressions early

**What to test:**
- Business rule outcomes
- Script include functions
- Critical workflows
- UI policies

### Standards & Guidelines

Document and enforce:
- Naming conventions
- Script patterns
- Performance thresholds
- When to customize vs. use OOTB

**Example standard:** "All GlideRecord queries must use setLimit() unless paginating"

### Monitoring

**Set up alerts for:**
- Script timeouts > 10 per hour
- Transaction times > 5 seconds
- Error rates > 1%
- Scheduled job failures

**Review weekly:**
- Performance Analytics reports
- Error logs
- User complaints

---

## The ROI Question: When to Fix Debt

### Fix Immediately

- **Causing outages** — System stability trumps everything
- **Blocking upgrades** — Can't stay on old versions forever
- **Security risks** — Data exposure, injection vulnerabilities
- **Compliance violations** — Audit failures are expensive

### Fix This Quarter

- **User complaints** — Productivity impact is real
- **Performance degradation** — Trending worse
- **Developer productivity** — Hard to add features

### Fix This Year

- **Maintenance burden** — Takes longer than it should
- **Technical obsolescence** — Using deprecated patterns
- **Knowledge gaps** — Only one person understands it

### Tolerate (For Now)

- **Working well enough** — No complaints, not blocking
- **High refactor cost** — Would require major rewrite
- **Being replaced soon** — New version coming
- **Low usage** — Edge case functionality

---

## Measuring Success

### Performance Metrics

- **Average transaction time** (target: <2 seconds)
- **95th percentile transaction time** (target: <5 seconds)
- **Script timeout rate** (target: <0.1%)
- **Database query time** (target: <100ms average)

### Debt Metrics

- **Customizations vs. OOTB ratio**
- **Code complexity** (lines per script, cyclomatic complexity)
- **Test coverage percentage**
- **Time to implement new features** (trend over time)

### User Metrics

- **Support tickets related to performance**
- **User satisfaction scores**
- **Feature adoption rates**

---

## A Real-World Example

**The situation:** Incident list view taking 8+ seconds to load. Users complaining. Management asking questions.

**Diagnosis:**
1. Debug mode showed 47 queries executing
2. Root cause: Business rule querying related records for every row
3. N+1 query pattern on a list with 100+ incidents

**The fix:**
1. **Immediate:** Added setLimit(50) to reduce impact (stop the bleeding)
2. **Short-term:** Refactored business rule to use GlideAggregate for counts
3. **Long-term:** Added database index on frequently queried field

**Result:** List load time dropped to <2 seconds. User complaints stopped.

**Time investment:** 4 hours total.

---

## Final Thoughts

Technical debt isn't inherently bad—it's a trade-off. The problem is unmeasured, unmanaged debt that accumulates silently until it becomes a crisis.

**My rules:**
1. **Track it** — Know what debt you have
2. **Budget for it** — Allocate 20% of sprint time to debt reduction
3. **Prevent it** — Code reviews, standards, testing
4. **Be pragmatic** — Not all debt needs immediate fixing

ServiceNow is a powerful platform, but it won't stay fast and maintainable on its own. That requires intentional effort and a culture that values long-term health over short-term delivery.

---

**Want more?** Check out my [ServiceNow Query Guide](/posts/servicenow-query-guide/) for performance optimization at the code level.

Questions or war stories to share? [Connect on LinkedIn](https://www.linkedin.com/in/zaidongy/).

---

*This is part of my [ServiceNow Best Practices](/categories/servicenow-best-practices/) series.*
