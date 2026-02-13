---
title: "The Complete ServiceNow Query Guide: From Basic to Best Practice"
description: "Master GlideRecord querying with proven patterns that keep your instance fast and maintainable."
date: "2026-02-13T12:00:00-08:00"
categories: ["ServiceNow Best Practices"]
tags: ["GlideRecord", "Querying", "Performance", "Scripting", "SQL"]
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

# The Complete ServiceNow Query Guide: From Basic to Best Practice

If there's one skill that separates good ServiceNow developers from great ones, it's querying. Get it wrong, and you'll timeout scripts, anger users, and create technical debt that lasts years. Get it right, and your code is fast, readable, and maintainable.

This guide covers everything from basic GlideRecord patterns to advanced optimization techniques I use in production at PayPal.

---

## The Fundamentals

### The Basic Pattern

Every GlideRecord query follows this pattern:

```javascript
var gr = new GlideRecord('incident');
gr.addQuery('priority', 1);  // Filter
gr.query();                   // Execute
while (gr.next()) {           // Iterate
    gs.print(gr.number);
}
```

**Key insight:** `query()` doesn't return data—it prepares the query. Data flows when you call `next()`.

### get() vs. query()

Use `get()` when you know the sys_id:

```javascript
// Good: Single record lookup
var inc = new GlideRecord('incident');
if (inc.get('sys_id_here')) {
    gs.print(inc.number);
}
```

Use `query()` when searching:

```javascript
// Good: Search with conditions
var inc = new GlideRecord('incident');
inc.addQuery('priority', 1);
inc.addQuery('state', '!=', 6);  // Not resolved
inc.query();
```

**Anti-pattern:** Using `query()` when `get()` works:

```javascript
// Don't do this
var inc = new GlideRecord('incident');
inc.addQuery('sys_id', 'abc123...');
inc.query();
if (inc.next()) {
    // unnecessary overhead
}
```

---

## Selective Querying

### The Power of addQuery

Every `addQuery` adds a WHERE clause. Chain them for precision:

```javascript
var gr = new GlideRecord('incident');
gr.addQuery('priority', 1);
gr.addQuery('assignment_group', myGroupSysId);
gr.addQuery('opened_at', '>=', gs.daysAgo(7));
gr.query();
```

This generates efficient SQL. The database does the filtering, not your script.

### addEncodedQuery for Complex Logic

When you need OR conditions or complex grouping:

```javascript
var gr = new GlideRecord('incident');
var query = 'priority=1^ORpriority=2^assignment_group=' + myGroup;
query += '^opened_at>=javascript:gs.daysAgoStart(7)';
gr.addEncodedQuery(query);
gr.query();
```

**Pro tip:** Build complex queries in the list view, right-click the query breadcrumb, and copy the encoded query string.

### addOrCondition for Simple ORs

```javascript
var gr = new GlideRecord('incident');
var orCondition = gr.addQuery('priority', 1);
orCondition.addOrCondition('priority', 2);
gr.query();
```

---

## Limits and Pagination

### The setLimit() Safety Net

Always set limits on queries that could return many rows:

```javascript
var gr = new GlideRecord('sys_user');
gr.setLimit(100);  // Safety first
gr.query();
```

**Why:** A runaway query on a table with 100k+ records will timeout your script.

### Pagination with chooseWindow()

For list views or APIs:

```javascript
var gr = new GlideRecord('incident');
gr.chooseWindow(0, 20);  // Records 0-19 (first page)
gr.query();

// Next page
gr.chooseWindow(20, 40);
gr.query();
```

### orderBy and orderByDesc

Control result ordering:

```javascript
var gr = new GlideRecord('incident');
gr.orderByDesc('sys_created_on');  // Newest first
gr.setLimit(10);
gr.query();
```

**Index tip:** Fields you `orderBy` should be indexed for performance.

---

## Query Performance

### The getRowCount() Anti-Pattern

```javascript
// Don't do this
var gr = new GlideRecord('incident');
gr.query();
if (gr.getRowCount() > 0) {  // Loads ALL rows into memory!
    while (gr.next()) {
        // process
    }
}
```

**Why it's bad:** `getRowCount()` iterates through the entire result set to count. Then your `while` loop iterates again. Double work.

### Use hasNext() Instead

```javascript
// Good
var gr = new GlideRecord('incident');
gr.setLimit(1);  // We only need to know if ANY exist
gr.query();

if (gr.hasNext()) {
    gs.print('Found incidents');
}
```

For checking existence, `hasNext()` is O(1) vs. O(n) for `getRowCount()`.

### The N+1 Query Problem

**The problem:**

```javascript
var users = new GlideRecord('sys_user');
users.query();
while (users.next()) {
    var inc = new GlideRecord('incident');
    inc.addQuery('caller_id', users.sys_id);
    inc.query();  // Query inside loop = database nightmare
}
```

**The fix** — Use GlideRecord list or restructure:

```javascript
// Build a map first
var userIncidents = {};
var inc = new GlideRecord('incident');
inc.query();
while (inc.next()) {
    var userId = inc.caller_id.toString();
    if (!userIncidents[userId]) {
        userIncidents[userId] = [];
    }
    userIncidents[userId].push(inc.getValue('number'));
}

// Now process users with O(1) lookup
var users = new GlideRecord('sys_user');
users.query();
while (users.next()) {
    var userId = users.sys_id.toString();
    var incidents = userIncidents[userId] || [];
    gs.print(users.name + ' has ' + incidents.length + ' incidents');
}
```

---

## Debugging Queries

### gs.print with getEncodedQuery()

```javascript
var gr = new GlideRecord('incident');
gr.addQuery('priority', 1);
gr.addQuery('state', '!=', 6);
gr.query();

// See exactly what ServiceNow generated
gs.print('Query: ' + gr.getEncodedQuery());
// Output: priority=1^state!=6
```

### Performance Analytics

Enable **Performance Analytics** in System Properties:

1. `glide.perf_analytics.debug` = true
2. Check the transaction log for query times
3. Look for queries > 100ms

### GlideQueryAnalyzer

For deep diagnostics:

```javascript
var analyzer = new GlideQueryAnalyzer();
analyzer.analyzeTable('incident');
// Shows missing indexes, slow queries, recommendations
```

---

## Advanced Patterns

### GlideRecordSecure for ACLs

When you need records the user can actually see:

```javascript
var gr = new GlideRecordSecure('incident');
gr.query();
// Only returns records user has read access to
```

**Use case:** Client scripts, GlideAjax, any user-facing query.

### GlideAggregate for Counts

```javascript
var agg = new GlideAggregate('incident');
agg.addQuery('priority', 1);
agg.addAggregate('COUNT');
agg.query();

if (agg.next()) {
    var count = agg.getAggregate('COUNT');
    gs.print('High priority incidents: ' + count);
}
```

**Benefit:** Database does the counting. O(1) vs. O(n) for iterating.

### Query by Reference Fields

```javascript
// Good: Query by sys_id (indexed)
var gr = new GlideRecord('incident');
gr.addQuery('caller_id', userSysId);

// Also good: Dot-walk to query field
var gr = new GlideRecord('incident');
gr.addQuery('caller_id.department', 'IT');
gr.addQuery('caller_id.active', true);
```

**Note:** Dot-walking creates JOINs. Keep it shallow (1-2 levels).

---

## Common Mistakes Checklist

- [ ] Querying inside loops
- [ ] Using `getRowCount()` when `hasNext()` works
- [ ] Not setting limits on large tables
- [ ] Querying non-indexed fields without filters
- [ ] Loading massive datasets into memory
- [ ] Using `query()` when `get()` suffices
- [ ] Forgetting ACLs in user-facing scripts

---

## Quick Reference Card

| Task | Method | Example |
|------|--------|---------|
| Single record by sys_id | `get()` | `gr.get('abc123')` |
| Search with conditions | `query()` + `addQuery()` | `gr.addQuery('priority',1)` |
| Check if any exist | `hasNext()` | `if (gr.hasNext())` |
| Get total count | `getRowCount()` | `var c = gr.getRowCount()` |
| Limit results | `setLimit()` | `gr.setLimit(100)` |
| Paginate | `chooseWindow()` | `gr.chooseWindow(0,20)` |
| Aggregate data | `GlideAggregate` | `agg.addAggregate('COUNT')` |
| Respect ACLs | `GlideRecordSecure` | `new GlideRecordSecure('table')` |

---

## Final Thoughts

Query optimization isn't premature optimization—it's foundational. Every query you write affects instance performance, user experience, and your own sanity when debugging.

Start with these principles:
1. **Be selective** — Filter at the database, not in JavaScript
2. **Set limits** — Protect yourself from runaway queries
3. **Avoid loops** — Structure data to minimize iterations
4. **Measure** — Use Performance Analytics to find real bottlenecks

Questions? Find me on [LinkedIn](https://www.linkedin.com/in/zaidongy/) or check out other [ServiceNow posts](/categories/servicenow-best-practices/).

---

*Next up: [ServiceNow Anti-Patterns: 5 Mistakes That Come Back to Haunt You](/posts/servicenow-anti-patterns/)*
