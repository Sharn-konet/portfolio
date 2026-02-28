# Rive Skills Interaction — Implementation Guide

This document describes how to add click-event-driven skill details to the Technical Skills section. The Svelte code is already wired up and ready — you just need to add events to the `.riv` file.

## Overview

When a user clicks a skill ball in the Rive animation, a drawer slides in from the right showing detailed experience for that skill (years, proficiency, highlights).

## What's Already Built

### 1. `src/data/skillExperience.ts`
Pre-populated data file with all 19 skills mapped to experience info:
- **name**: Display name (e.g., "Python")
- **riveEventName**: The Rive event name to listen for (e.g., `"skill_python_clicked"`)
- **category**: `"language"` | `"tool"` | `"platform"`
- **proficiency**: `"expert"` | `"advanced"` | `"intermediate"`
- **years**: Number of years experience
- **description**: One-line summary
- **highlights**: Array of bullet points

### 2. `src/components/SkillDetail.svelte`
Drawer component that slides in from the right with:
- Skill name in Bombing font
- Proficiency badge (color-coded: green/blue/amber)
- Category badge
- Years of experience
- Description paragraph
- Highlights list
- Close button + Escape key + backdrop click to dismiss
- SketchyBox wrapper for hand-drawn aesthetic

### 3. `src/components/RiveAnimation.svelte`
Updated with:
- `onRiveEvent` callback prop
- `EventType.RiveEvent` listener that fires the callback with the event name
- Listens after `.riv` file loads

### 4. `src/routes/sections/Tools.svelte`
Wired up with:
- `handleRiveEvent()` function that looks up the skill by event name
- Opens the SkillDetail drawer with the matched skill

## What You Need to Do in the Rive Editor

### Step 1: Open `tools.riv` in the Rive Editor

Go to [rive.app](https://rive.app) and open the `static/tools.riv` file.

### Step 2: Add Click Listeners to Each Skill Ball

For each of the 19 skill balls in the "Viewport" artboard:

1. Select the skill ball element (e.g., the Python ball)
2. In the **State Machine** editor ("Main State Machine"):
   - Add a **Listener** to the skill ball
   - Set the listener type to **Pointer Down** (click)
   - Add an **Action** of type **Fire Event**
   - Create a new **Event** (or reuse) with the exact name from the table below

### Step 3: Event Naming Convention

Each event MUST match the `riveEventName` in `src/data/skillExperience.ts`:

| Skill Ball | Event Name |
|-----------|-----------|
| Python | `skill_python_clicked` |
| Rust | `skill_rust_clicked` |
| Julia | `skill_julia_clicked` |
| Svelte | `skill_svelte_clicked` |
| Bash | `skill_bash_clicked` |
| R | `skill_r_clicked` |
| MATLAB | `skill_matlab_clicked` |
| Excel | `skill_excel_clicked` |
| HTML | `skill_html_clicked` |
| CSS | `skill_css_clicked` |
| AWS | `skill_aws_clicked` |
| Snowflake | `skill_snowflake_clicked` |
| Kubernetes | `skill_kubernetes_clicked` |
| Docker | `skill_docker_clicked` |
| New Relic | `skill_newrelic_clicked` |
| Sumo Logic | `skill_sumologic_clicked` |
| Netlify | `skill_netlify_clicked` |
| Git | `skill_git_clicked` |
| TeamCity | `skill_teamcity_clicked` |

### Step 4: Export and Replace

1. Export the updated `.riv` file from the Rive editor
2. Replace `static/tools.riv` with the new file
3. Test: `npm run dev` → click a skill ball → drawer should appear

## Testing

1. Run `npm run dev`
2. Navigate to the homepage
3. Scroll to "Technical Skills" section
4. Click any skill ball in the Rive animation
5. Verify:
   - The drawer slides in from the right
   - Correct skill information is displayed
   - Close button, Escape key, and backdrop click all dismiss the drawer
   - Clicking a different skill while drawer is open switches the content

## Customizing Skill Data

Edit `src/data/skillExperience.ts` to update:
- Descriptions and highlights for any skill
- Add new skills (also add to the Rive file)
- Change proficiency levels or years
- Modify categories

## Architecture

```
User clicks skill ball in Rive
  → Rive fires EventType.RiveEvent with event name
  → RiveAnimation.svelte calls onRiveEvent(eventName)
  → Tools.svelte looks up skill via getSkillByEvent()
  → Sets selectedSkill and opens SkillDetail drawer
  → SkillDetail.svelte renders skill info in sliding drawer
```
