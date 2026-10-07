# Infinite 3D Canvas

An endless, explorable 3D space in a single `index.html`. No build step, no framework, no WebGL. It's vanilla JavaScript drawing to a Canvas2D with a hand-rolled perspective projection.

The world is generated procedurally in seeded chunks. You can pan, orbit, fly up and down, and zoom forever, and you can grab the floating cards and move them anywhere in 3D.

## Quick start

```bash
npm install          # only needed for the dev server and tests
npm start            # serves on http://localhost:4173
```

Or just open `index.html` in a browser. The page is fully static.

## Controls

| Action | Mouse / keyboard | Touch |
|---|---|---|
| Pan | Drag (in Pan mode) | One-finger drag |
| Rotate / tilt | Shift-drag, right-drag, or drag in Rotate mode | Two-finger twist (turn), two-finger vertical drag (tilt) |
| Zoom | Wheel / trackpad pinch | Pinch |
| Move | WASD / arrow keys | — |
| Up / down | Q or Space (up), E or C (down); Alt- or middle-drag | Three-finger vertical drag |
| Move a card | Drag it | Drag it |
| Lift a card (y) | Shift- or Alt-drag it | — |
| Back to origin | **Home** button | **Home** button |
| New universe | **New seed** button | **New seed** button |
| Switch drag mode | **Pan / Rotate** button | — |

More detail is in [docs/controls.md](docs/controls.md).

## Tests

End-to-end tests drive a real Chromium through every control listed above and check the camera and card state after each one.

```bash
npx playwright install chromium   # first time only
npm test
```

If Playwright can't download its own browser (for example on some arm64 Linux machines), install the system Chromium and point the suite at it:

```bash
CHROMIUM_PATH=/usr/bin/chromium npm test
```

Current status: **18/18 passing** (headless Chromium, 1280×800).

## Project layout

```
index.html            the whole app (markup, styles for the HUD, and script)
hark.css, hark-hero.css, hark.js   base styles and helpers the page loads
tests/controls.spec.js             Playwright end-to-end suite
playwright.config.js               test config (starts a local http-server)
docs/                              controls reference, architecture, known issues
```

## Docs

- [Controls](docs/controls.md)
- [Architecture](docs/architecture.md)
- [Known issues](docs/known-issues.md)

## License

MIT
