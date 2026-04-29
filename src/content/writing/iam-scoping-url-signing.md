---
slug: iam-scoping-url-signing
title: Scoping IAM for URL-Signing Only — a Counter-Pattern
date: 2026-01-22
description: When "least privilege" makes things harder to operate, push back.
draft: true
---

> Draft. Content to come.

Least privilege is a good default, but every default is wrong somewhere. This is a note about a place where the default makes the system harder to operate without making it meaningfully more secure.

The specific case: a service that needs to sign URLs for a single bucket. The textbook answer is a tightly scoped role. The actually-better answer, in our case, was different.
