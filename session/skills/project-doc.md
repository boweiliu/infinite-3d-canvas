# Project b: Infinite 3D Canvas (project specialty)

## Goal and scope
An experimental dependency-free 3D draggable infinite canvas. It's parked as of 2026-10-06 at the user's request.

## Important files
- `infinite-3d-canvas/` (project root): git repo with index.html, hark.css/js assets, Playwright tests (tests/controls.spec.js, 18 tests), docs/ (controls, architecture, known-issues), package.json.
- The live Page is "Infinite 3D Canvas" (website project 7bb7e8fe-9eb9-479f-81c0-a50a41d70a2b).
- There's also a Home panel, "3D Art Gallery" (card c84862dc-da8d-4636-b111-7d8ef70275d1), which refreshes daily.

## Workflows
- When editing the canvas, run `CHROMIUM_PATH=/usr/bin/chromium npx playwright test` in the repo before claiming anything works. Install system chromium via sudo apt if it's missing; Playwright's own download 403s on arm64. Tests need the --proxy-server=direct:// arg (already in config).
- Commit changes with author "Hark". Never invent the user's surname.

## Open threads
- The user reported in manual use that card lifting and most rotation fail, but the tests pass. Cause unknown (trackpad or iframe suspected).
- Public sharing: the user won't connect GitHub or enter cards into Hark. Temporary shares went up on litterbox (72h links).

## Conventions
- Verify every claim with evidence before stating it.
