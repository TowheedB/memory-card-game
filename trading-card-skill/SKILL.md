---
name: trading-card-skill
description: Create sleek, polished trading-card UI components for requested subjects. Use when the user asks for a trading card, collectible card, character card, item card, or similar card design with artwork, stats, rarity, and description.
---

# Trading Card Skill

Build a complete, responsive trading-card component for the requested subject. Match the project’s existing stack and conventions, and preserve unrelated user changes.

## Required card anatomy

- A prominent name banner across the top.
- A large image/artwork area. Use a provided image when available; otherwise use a suitable emoji or tasteful CSS/gradient treatment.
- A rarity badge in the top-right area: exactly `Common`, `Rare`, `Mythic`, or `Legendary`.
- Three visible stats labeled `HP`, `Power`, and `Card Magnification`.
  - `HP`: 0–500 maximum.
  - `Power`: 0–300 maximum.
  - `Card Magnification`: 0–100 maximum, shown as an out-of-100 value.
- A concise description of the card subject.
- A sleek, polished frame with clear hierarchy, depth, and collectible-card character.

## Visual and interaction guidance

Use a refined palette, layered borders, subtle shadows/glows, rounded or clipped corners, and strong typography. Keep artwork dominant and stats scannable. Ensure the layout works on narrow screens. Any buttons or interactive controls need obvious hover and focus states plus accessible labels. Never invent or include real personal information.

## Implementation workflow

1. Inspect the current page and identify appropriate component/file boundaries.
2. Choose subject-specific values within all stat limits and an allowed rarity if unspecified.
3. Implement with the project’s existing technology, using semantic HTML and accessible text.
4. Add responsive behavior and hover/focus states.
5. Verify all required fields exist and values stay within bounds.

When editing an existing card, retain the required anatomy unless the user explicitly asks to remove or replace a field.
