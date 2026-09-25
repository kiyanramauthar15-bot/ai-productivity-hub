# AI Workplace Productivity Assistant

## Goal
Build a polished, responsive, frontend-only productivity workspace with simulated, input-aware AI outputs and temporary browser storage.

## What I’ll build
- A responsive app shell with desktop sidebar and compact mobile navigation for Dashboard, Email Generator, Meeting Summarizer, Task Planner, and Settings.
- A dashboard with productivity overview metrics, recent activity, quick actions, useful empty states, and a Responsible AI reminder.
- Smart Email Generator inputs for recipient, purpose, key points, and tone; contextual generation, editable output, copy, and regenerate controls.
- Meeting Notes Summarizer with editable structured results for Summary, Action Items, Decisions, and Deadlines, plus section-aware copying.
- AI Task Planner with task entry, priority and time inputs, daily/weekly modes, timeline-style generated schedules, and editable results.
- Polished loading transitions, validation feedback, copy confirmations, and browser-local persistence where it improves continuity.

## Visual direction
- Crisp professional workspace using Tiffany blue as the primary action colour and deep coral/red for emphasis.
- White surfaces, restrained neutral backgrounds, rounded cards, subtle shadows, modern typography, clear hierarchy, and consistent line icons.
- Responsive layouts tailored for desktop, tablet, and mobile without reducing core functionality.

## Technical details
- Keep all generation local and deterministic enough to feel contextual while varying wording based on user inputs and regeneration count.
- Use React state and browser storage only; no backend, authentication, database, external API, or API keys.
- Define semantic colour, typography, shadow, and motion tokens in the global design system.
- Add route-specific page metadata and preserve the existing TanStack application structure.
- Verify the primary flows and visual layout in the running preview at desktop and mobile sizes.
