# Specification - Viral Loop CTA

## Overview
Implement a non-intrusive, high-conversion Call-to-Action (CTA) on the public resume view (`/r/[slug]`) to encourage visitors to create their own resume using TidyResume.

## User Stories
- As a **visitor** viewing someone else's resume, I want to see a subtle invitation to create my own resume so that I can easily try the tool.
- As a **visitor**, I want the CTA to be helpful but not distracting, so I can still focus on the content of the resume I am viewing.
- As a **resume owner**, I don't want to see this CTA on my own resume page, as it is redundant for me.

## Functional Requirements
- **Owner Detection:** Use the `useOwnerCheck` hook to determine if the current viewer is the owner. The CTA must ONLY be visible to non-owners.
- **Delayed Appearance:** The CTA must appear exactly 2 seconds after the page has finished mounting.
- **Slide-up Animation:** The component must slide up smoothly from the bottom-right of the screen.
- **Direct Link:** Clicking the CTA must open the TidyResume editor (`/edit`) in a new browser tab.
- **Hover States:** Include a subtle tooltip or popover message: "It's free and takes minutes".

## Design Requirements
- **Style:** Horizontal Pill-shaped button.
- **Colors:** Primary Indigo (`#6366f1`) background with white/foreground text and icons.
- **Shadow:** Elevated shadow (`shadow-lg`) to distinguish from resume content.
- **Typography:** Clear, bold text "Tidy up your resume".
- **Icon:** Use a relevant Phosphor Icon (e.g., `PencilSimpleIcon` or `MagicWandIcon`).

## Technical Constraints
- Must be implemented as a client-side component to handle `useOwnerCheck` and timing logic.
- Must not interfere with the print layout (must be hidden in `@media print`).
- Must follow the existing `@base-ui/react` and Tailwind v4 conventions.
