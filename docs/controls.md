# Controls reference

## Camera model

The camera orbits a **target point** `(tx, ty, tz)` at distance `dist`, with angles `yaw` (unbounded) and `pitch` (clamped to about −1.5 to 1.5 rad, so you can look up from below the floor).

| Input | Effect |
|---|---|
| Left-drag on empty space | Pan the target across x/z (or rotate, when the **Pan / Rotate** toggle is set to Rotate) |
| Shift-drag, or right-drag | Rotate: horizontal changes yaw, vertical changes pitch |
| Alt/Option-drag, or middle-drag | Move the target up/down (ty) |
| Wheel / trackpad pinch | Zoom (changes `dist`, from 160 to 6000) |
| W A S D / arrows | Move the target across the plane, relative to where you're facing |
| Q or Space / E or C | Move the target up / down |
| Release after a drag | Momentum carries the motion and then decays |

Keyboard input needs the canvas to have focus. The canvas takes focus on load, on click, and after any HUD button. When the page is embedded in an iframe, the browser may need one click on the canvas first.

## Cards

| Input | Effect |
|---|---|
| Hover | Highlights the card |
| Drag | Moves the card across x/z at its current height |
| Shift- or Alt-drag | Moves the card up/down (y) |

A card you move becomes "pinned". It stays where you put it even after its chunk unloads, until you press **New seed**.

## Touch

| Gesture | Effect |
|---|---|
| One finger | Pan (always, whatever the Pan/Rotate toggle says) |
| Two-finger pinch | Zoom |
| Two-finger twist | Turn (yaw) |
| Two fingers moving vertically together | Tilt (pitch) |
| Three-finger vertical drag | Up/down |

## HUD

- **Coordinates:** the target's x, y, z, plus the current chunk, zoom and seed.
- **Home:** flies back to the origin and resets yaw, pitch, height and zoom.
- **Pan / Rotate:** sets what a plain left-drag does.
- **New seed:** regenerates the whole world and clears pinned cards.
