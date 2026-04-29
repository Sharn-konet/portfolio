---
slug: orphaned-edges
title: Orphaned Edges and the Four-Part Fix
date: 2026-02-08
description: A graph traversal bug that took a week to find and an afternoon to write up.
draft: true
---

> Draft. Content to come.

We had a graph traversal bug. Nodes were reachable, edges were valid, but a small subset of edges was being dropped from the materialised view. It took a week to find and an afternoon to write up.

The short version: the producer and consumer disagreed about what counted as a "live" edge. The long version is below.
