---
slug: orphaned-edges
title: orphaned edges and the four-part fix
date: 2026-02-08
description: a graph traversal bug that took a week to find and an afternoon to write up.
draft: true
---

> draft. content to come.

we had a graph traversal bug. nodes were reachable, edges were valid, but a small subset of edges was being dropped from the materialised view. it took a week to find and an afternoon to write up.

the short version: the producer and consumer disagreed about what counted as a "live" edge. the long version is below.
