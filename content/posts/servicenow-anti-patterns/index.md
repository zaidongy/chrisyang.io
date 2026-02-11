---
title: "ServiceNow Anti-Patterns: 5 Mistakes That Come Back to Haunt You"
description: "Common ServiceNow mistakes I see in the wild—and how to avoid them before they become technical debt."
date: "2026-02-11T12:00:00-08:00"
categories: ["ServiceNow Best Practices"]
tags: ["Anti-Patterns", "Best Practices", "Technical Debt", "Performance", "Scripting"]
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

# ServiceNow Anti-Patterns: 5 Mistakes That Come Back to Haunt You

After years of cleaning up other people's ServiceNow implementations (and making my own mistakes), I've noticed some patterns that keep showing up. These anti-patterns seem like good ideas at the time but create headaches down the road.

Let's talk about five I see most often—and how to avoid them.

---

## 1. Business Logic in Client Scripts

**The Anti-Pattern:** Putting complex business logic, validation, or calculations in client scripts.

```javascript
// Don't do this
function onSubmit() {
    var total = 0;
    // Complex calculation that should be server-side
    for (var i = 0; i < someList.length; i++) {
        total += someList[i].cost * someList[i].quantity;
    }
    if (total > 10000) {
        alert('Approval required!');
        return false;
    }
}
```

**Why It's Bad:**
- Client scripts can be bypassed (maliciously or accidentally)
- Performance issues on slower devices
- Business rules become scattered and hard to maintain
- Testing is difficult

**The Fix:** Keep client scripts for UI behavior only. Move business logic to:
- **Business Rules** (before/after database operations)
- **Script Includes** (reusable server-side logic)
- **Flow Designer** (for complex approval workflows)

---

## 2. Overusing Global Business Rules

**The Anti-Pattern:** Creating global business rules that run on every insert/update, then adding conditions to limit them.

```javascript
// A business rule that runs on every update, everywhere
(function executeRule(current, previous) {
    if (current.getTableName() == 'incident' && 
        current.priority == 1 && 
        current.state == 2) {
        // Do something specific
    }
})(current, previous);
```

**Why It's Bad:**
- Performance killer—runs on every table, every operation
- Conditions are evaluated after the rule triggers
- Makes debugging a nightmare
- Scales poorly as instance grows

**The Fix:** Use the **When** field properly:
- Set "When" to **before/after** (not async for logic that needs to happen immediately)
- Use **Filter Conditions** instead of script-based filtering
- Create table-specific rules, not global ones
- If you must use global, add an early return: `if (current.getTableName() != 'incident') return;`

---

## 3. Hardcoding sys_ids

**The Anti-Pattern:** Copying sys_ids from prod to dev, or hardcoding them in scripts.

```javascript
// Don't do this
var inc = new GlideRecord('incident');
inc.addQuery('assignment_group', '5137153cc611227c0183e96598c4a');
inc.query();
```

**Why It's Bad:**
- sys_ids differ between instances (prod vs. dev vs. test)
- Creates "works on my instance" bugs
- Impossible to migrate/update
- Breaks when data is refreshed

**The Fix:** Query by unique, human-readable identifiers:

```javascript
// Do this instead
var inc = new GlideRecord('incident');
inc.addQuery('assignment_group.name', 'IT Support');
// or
inc.addQuery('assignment_group.manager.user_name', 'john.doe');
inc.query();
```

For system properties or configuration, use **System Properties** or **Script Includes** that query by name.

---

## 4. GlideRecord Queries in Loops

**The Anti-Pattern:** Querying the database inside a loop.

```javascript
// Performance nightmare
var users = new GlideRecord('sys_user');
users.query();
while (users.next()) {
    var incidents = new GlideRecord('incident');
    incidents.addQuery('caller_id', users.sys_id);
    incidents.query(); // N+1 query problem!
    while (incidents.next()) {
        // Process
    }
}
```

**Why It's Bad:**
- N+1 query problem—database gets hammered
- Script timeout risk on large datasets
- Linear scaling (10x data = 10x time)

**The Fix:** Use **GlideRecordAggregate** or restructure:

```javascript
// Better approach
var incidents = new GlideRecord('incident');
incidents.query();
while (incidents.next()) {
    // Process, or build a map for lookup
}

// Or use aggregate queries
var agg = new GlideAggregate('incident');
agg.groupBy('caller_id');
agg.addAggregate('COUNT');
agg.query();
```

Better yet, use **Reporting** or **Performance Analytics** for bulk operations.

---

## 5. Giant Script Includes with Everything

**The Anti-Pattern:** Creating one `globalUtils` script include that contains 50 unrelated functions.

```javascript
var globalUtils = Class.create();
globalUtils.prototype = {
    initialize: function() {},
    
    formatDate: function() { /* ... */ },
    sendEmail: function() { /* ... */ },
    validatePhone: function() { /* ... */ },
    calculateTax: function() { /* ... */ },
    generatePDF: function() { /* ... */ },
    // ... 45 more functions
    
    type: 'globalUtils'
};
```

**Why It's Bad:**
- Violates single responsibility principle
- Merge conflicts galore with multiple developers
- Can't version or test individual functions
- Performance impact (whole thing loads for one function)

**The Fix:** Create focused, single-purpose Script Includes:

```javascript
// DateUtil.js
var DateUtil = Class.create();
DateUtil.prototype = {
    initialize: function() {},
    formatDate: function(date, format) { /* ... */ },
    addBusinessDays: function(date, days) { /* ... */ },
    type: 'DateUtil'
};

// EmailService.js
var EmailService = Class.create();
EmailService.prototype = {
    initialize: function() {},
    sendNotification: function(template, recipient) { /* ... */ },
    type: 'EmailService'
};
```

---

## The Common Thread

All these anti-patterns share one thing: **short-term convenience at the cost of long-term maintainability.**

ServiceNow makes it easy to build fast. The challenge is building something that won't require a complete rewrite in 2 years.

**Questions to ask yourself:**
- Will the next developer understand this?
- What happens when we have 10x the data?
- Can this be tested?
- What if the requirements change?

---

## What's Your Anti-Pattern?

I've shared mine—what anti-patterns have you seen (or committed)? Drop me a note or connect on [LinkedIn](https://www.linkedin.com/in/zaidongy/) to swap war stories.

---

*Want more ServiceNow insights? [Subscribe to the RSS feed](/index.xml) for new posts.*
