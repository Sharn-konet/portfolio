---
slug: iam-scoping-url-signing
title: scoping iam for url-signing only — a counter-pattern
date: 2026-01-22
description: when "least privilege" makes things harder to operate, push back.
draft: true
---

> draft. content to come.

least privilege is a good default, but every default is wrong somewhere. this is a note about a place where the default makes the system harder to operate without making it meaningfully more secure.

the specific case: a service that needs to sign urls for a single bucket. the textbook answer is a tightly scoped role. the actually-better answer, in our case, was different.
