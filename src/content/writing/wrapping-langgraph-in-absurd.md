---
slug: wrapping-langgraph-in-absurd
title: Wrapping LangGraph in Absurd — a Durable-Execution Post-Mortem
date: 2026-03-14
description: What we got right and wrong wrapping LangGraph in a durable execution layer.
draft: true
---

> Draft. Content to come.

When we picked LangGraph for the agent layer at Survesy, the question that immediately surfaced was: how do we make this *durable*? LangGraph itself is happy to run an agent end-to-end in memory, but production demands the ability to survive a restart, retry a step, and replay deterministically.

This post walks through the pattern we landed on — wrapping each LangGraph node as an Absurd activity — and the three things I'd do differently next time.
