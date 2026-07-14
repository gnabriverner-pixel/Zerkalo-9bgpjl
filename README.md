# Premium Visual Passport Prototype — DONOR / FROZEN

This repository contains an experimental React Native / Expo implementation of a premium visual passport experience.

## Current status

- **Not a production source of truth for Digital Code.**
- **Frozen as a donor/prototype unless explicitly reactivated.**
- The canonical Digital Code runtime is `gnabriverner-pixel/digital-code-system`.
- The canonical current Mini App lives inside `digital-code-system/webapp`.
- The canonical public site is `gnabriverner-pixel/Zerkalo`.

## Why this repository is kept

The history contains real visual work, including Premium Visual Passport iterations. Unique interaction patterns, layout ideas or components may still be useful as donor material.

Before reusing anything:

1. compare it with the current canonical Mini App;
2. extract only clearly superior, still-relevant components;
3. preserve current product contracts and data boundaries;
4. do not replace the canonical production surface by assumption.

## Agent rule

Do not:

- treat this repository as the current Digital Code app;
- deploy it over the production Mini App;
- revive old OnSpace architecture without a current product decision;
- infer current product status from this repository's history.

Do:

- use it as a visual donor when a task explicitly asks for prototype research or component extraction;
- keep it frozen when no donor task exists.

## Local development

This project is based on React Native / Expo. Inspect `package.json` for the exact current scripts and package-manager contract before running it.

The previous generic OnSpace README was removed because it obscured the repository's real role in the Digital Code ecosystem.
