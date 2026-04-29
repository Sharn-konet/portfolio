---
slug: wrapping-langgraph-in-absurd
title: wrapping langgraph in absurd — a durable-execution post-mortem
date: 2026-03-14
description: what we got right and wrong wrapping langgraph in a durable execution layer.
draft: true
---

> draft. content to come.

when we picked langgraph for the agent layer at survesy, the question that immediately surfaced was: how do we make this *durable*? langgraph itself is happy to run an agent end-to-end in memory, but production demands the ability to survive a restart, retry a step, and replay deterministically.

this post walks through the pattern we landed on — wrapping each langgraph node as an absurd activity — and the three things i'd do differently next time.
