# Known issues

- **Reported in manual use (2026-10-06):** lifting cards up/down and most rotation didn't work. The automated suite passes for all of these in headless Chromium, so the cause may be the environment rather than the logic. Possible causes:
  - **Mac trackpads** have no middle button, and right-drag needs a two-finger click-drag. Use Shift-drag, or set the toggle to Rotate.
  - **Embedded in an iframe:** the keyboard needs one click on the canvas first, and some hosts swallow right-click or Alt.
  - The tests check internal state, not rendered pixels. A bug where the state changes but the picture doesn't would get past them.
- Google Fonts load from the network. Offline, the HUD falls back to system fonts.
- `index.html` references `hark.css`, `hark-hero.css` and `hark.js` by relative path. Keep them next to it.
