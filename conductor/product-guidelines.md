# Product Guidelines - Viral Loop CTA

These guidelines ensure the "Build your resume" call-to-action remains tasteful, high-performing, and consistent with the TidyResume brand.

## Visual Identity
- **Component Shape:** Use a horizontal "Pill" style button. It should have rounded ends and enough horizontal padding to comfortably house text and an icon.
- **Color Palette:**
  - **Background:** TidyResume Primary Indigo (`#6366f1`).
  - **Text/Icon:** White (`#ffffff`) or `primary-foreground`.
- **Shadows:** Use a `shadow-lg` or similar to provide depth and ensure it floats clearly over the resume content without merging with the text.

## Interaction & Behavior
- **Visibility:** 
  - **Delay:** Button MUST NOT appear immediately. Wait for a **2-second delay** after page mount.
  - **Owner Exclusion:** The button MUST be hidden for the owner of the resume (detected via the `useOwnerCheck` hook or similar).
- **Animation:** Use a **Slide Up** entry animation from the bottom of the viewport. It should be smooth and transition over roughly 300-500ms.
- **Tooltip:** On hover, display a subtle, small-font tooltip with the message: "It's free and takes minutes".

## Messaging
- **Primary Text:** "Tidy up your resume"
- **Tone:** Encouraging, clever, and slightly playful while maintaining professional credibility.

## Accessibility
- **ARIA Labels:** Ensure the button has a descriptive `aria-label` (e.g., "Create your own resume with TidyResume").
- **Contrast:** The indigo-on-white (or vice-versa) must meet WCAG AA standards for readability.
