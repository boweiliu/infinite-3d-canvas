// End-to-end tests for every control the README documents.
const { test, expect } = require('@playwright/test');

const URL = 'http://localhost:4173/index.html';
const cam = (page) => page.evaluate(() => ({ ...window.__canvas.cam }));
const settle = (page, ms = 600) => page.waitForTimeout(ms);

async function open(page) {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__canvas && window.__canvas.hits.length > 0);
  await settle(page, 300);
}

// Drag with the mouse from (x0,y0) by (dx,dy).
async function drag(page, x0, y0, dx, dy, { button = 'left', modifiers = [] } = {}) {
  for (const m of modifiers) await page.keyboard.down(m);
  await page.mouse.move(x0, y0);
  await page.mouse.down({ button });
  for (let i = 1; i <= 10; i++) await page.mouse.move(x0 + (dx * i) / 10, y0 + (dy * i) / 10);
  await page.mouse.up({ button });
  for (const m of modifiers) await page.keyboard.up(m);
}

// A point on empty space (no card under it).
async function emptyPoint(page) {
  return page.evaluate(() => {
    const hits = window.__canvas.hits;
    for (let y = 200; y < innerHeight - 60; y += 37)
      for (let x = 60; x < innerWidth - 60; x += 41)
        if (document.elementFromPoint(x, y)?.id === 'c' && !hits.some((h) => x >= h.x0 && x <= h.x0 + h.w && y >= h.y0 && y <= h.y0 + h.h)) return { x, y };
    return { x: 20, y: innerHeight - 20 };
  });
}

// Centre of the front-most card.
async function cardPoint(page) {
  return page.evaluate(() => {
    const h = window.__canvas.hits[window.__canvas.hits.length - 1];
    return { x: h.x0 + h.w / 2, y: h.y0 + h.h / 2, id: h.c.id, c: { x: h.c.x, y: h.c.y, z: h.c.z } };
  });
}
const cardById = (page, id) =>
  page.evaluate((id) => {
    const p = window.__canvas.pinned.get(id);
    return p ? { x: p.x, y: p.y, z: p.z } : null;
  }, id);

test.beforeEach(async ({ page }) => open(page));

test.describe('camera', () => {
  test('left-drag pans the camera on x/z', async ({ page }) => {
    const before = await cam(page); const p = await emptyPoint(page);
    await drag(page, p.x, p.y, 200, 120); await settle(page);
    const after = await cam(page);
    expect(Math.hypot(after.tx - before.tx, after.tz - before.tz)).toBeGreaterThan(20);
  });

  test('wheel zooms (changes distance)', async ({ page }) => {
    const before = await cam(page); const p = await emptyPoint(page);
    await page.mouse.move(p.x, p.y); await page.mouse.wheel(0, -600); await settle(page);
    expect((await cam(page)).dist).toBeLessThan(before.dist);
  });

  test('shift-drag rotates yaw', async ({ page }) => {
    const before = await cam(page); const p = await emptyPoint(page);
    await drag(page, p.x, p.y, 250, 0, { modifiers: ['Shift'] }); await settle(page);
    expect(Math.abs((await cam(page)).yaw - before.yaw)).toBeGreaterThan(0.3);
  });

  test('shift-drag vertical tilts pitch', async ({ page }) => {
    const before = await cam(page); const p = await emptyPoint(page);
    await drag(page, p.x, p.y, 0, 150, { modifiers: ['Shift'] }); await settle(page);
    expect(Math.abs((await cam(page)).pitch - before.pitch)).toBeGreaterThan(0.2);
  });

  test('right-drag rotates yaw', async ({ page }) => {
    const before = await cam(page); const p = await emptyPoint(page);
    await drag(page, p.x, p.y, 250, 0, { button: 'right' }); await settle(page);
    expect(Math.abs((await cam(page)).yaw - before.yaw)).toBeGreaterThan(0.3);
  });

  test('pitch can go below the floor plane (negative)', async ({ page }) => {
    const p = await emptyPoint(page);
    for (let i = 0; i < 3; i++) await drag(page, p.x, 400, 0, -250, { modifiers: ['Shift'] });
    await settle(page);
    expect((await cam(page)).pitch).toBeLessThan(0);
  });

  test('Pan/Rotate toggle makes plain drag rotate', async ({ page }) => {
    await page.click('#dragmode');
    expect(await page.evaluate(() => window.__canvas.dragMode)).toBe('rot');
    const before = await cam(page); const p = await emptyPoint(page);
    await drag(page, p.x, p.y, 250, 0); await settle(page);
    const after = await cam(page);
    expect(Math.abs(after.yaw - before.yaw)).toBeGreaterThan(0.3);
  });

  test('Q moves up, E moves down', async ({ page }) => {
    { const p = await emptyPoint(page); await page.mouse.click(p.x, p.y); }
    const y0 = (await cam(page)).ty;
    await page.keyboard.down('q'); await page.waitForTimeout(500); await page.keyboard.up('q'); await settle(page, 300);
    const y1 = (await cam(page)).ty;
    expect(y1).toBeGreaterThan(y0 + 10);
    await page.keyboard.down('e'); await page.waitForTimeout(1000); await page.keyboard.up('e'); await settle(page, 300);
    expect((await cam(page)).ty).toBeLessThan(y1 - 10);
  });

  test('WASD moves the camera', async ({ page }) => {
    { const p = await emptyPoint(page); await page.mouse.click(p.x, p.y); }
    const b = await cam(page);
    await page.keyboard.down('w'); await page.waitForTimeout(500); await page.keyboard.up('w'); await settle(page, 300);
    const a = await cam(page);
    expect(Math.hypot(a.tx - b.tx, a.tz - b.tz)).toBeGreaterThan(10);
  });

  test('alt-drag moves the camera up/down', async ({ page }) => {
    const before = await cam(page); const p = await emptyPoint(page);
    await drag(page, p.x, p.y, 0, -200, { modifiers: ['Alt'] }); await settle(page);
    expect(Math.abs((await cam(page)).ty - before.ty)).toBeGreaterThan(10);
  });

  test('middle-drag moves the camera up/down', async ({ page }) => {
    const before = await cam(page); const p = await emptyPoint(page);
    await drag(page, p.x, p.y, 0, -200, { button: 'middle' }); await settle(page);
    expect(Math.abs((await cam(page)).ty - before.ty)).toBeGreaterThan(10);
  });

  test('Home returns the camera to origin', async ({ page }) => {
    const p = await emptyPoint(page);
    await drag(page, p.x, p.y, 300, 200);
    await drag(page, p.x, p.y, 200, 0, { modifiers: ['Shift'] });
    await page.click('#home'); await page.waitForTimeout(2500);
    const c = await cam(page);
    expect(Math.abs(c.tx)).toBeLessThan(5); expect(Math.abs(c.tz)).toBeLessThan(5);
    expect(Math.abs(c.ty)).toBeLessThan(5); expect(Math.abs(c.yaw - 0.6)).toBeLessThan(0.05);
  });
});

test.describe('cards', () => {
  test('dragging a card moves it on x/z', async ({ page }) => {
    const c = await cardPoint(page);
    await drag(page, c.x, c.y, 150, 60); await settle(page, 200);
    const after = await cardById(page, c.id);
    expect(after).not.toBeNull();
    expect(Math.hypot(after.x - c.c.x, after.z - c.c.z)).toBeGreaterThan(10);
  });

  test('shift-dragging a card lifts it on y', async ({ page }) => {
    const c = await cardPoint(page);
    await drag(page, c.x, c.y, 0, -150, { modifiers: ['Shift'] }); await settle(page, 200);
    const after = await cardById(page, c.id);
    expect(after).not.toBeNull();
    expect(Math.abs(after.y - c.c.y)).toBeGreaterThan(10);
  });

  test('alt-dragging a card lifts it on y', async ({ page }) => {
    const c = await cardPoint(page);
    await drag(page, c.x, c.y, 0, -150, { modifiers: ['Alt'] }); await settle(page, 200);
    const after = await cardById(page, c.id);
    expect(after).not.toBeNull();
    expect(Math.abs(after.y - c.c.y)).toBeGreaterThan(10);
  });
});

test.describe('world', () => {
  test('New seed regenerates the world', async ({ page }) => {
    const s0 = await page.evaluate(() => window.__canvas.seed);
    await page.click('#reseed');
    expect(await page.evaluate(() => window.__canvas.seed)).not.toBe(s0);
  });

  test('world is deterministic: same chunk returns same cards', async ({ page }) => {
    const sig = () => page.evaluate(() => JSON.stringify([...window.__canvas.chunks.entries()].filter(([k]) => k === '0,0').map(([, v]) => v.cards.map((c) => [Math.round(c.x), Math.round(c.z)]))));
    const a = await sig();
    const p = await emptyPoint(page);
    for (let i = 0; i < 6; i++) await drag(page, p.x, p.y, -400, 0);
    await page.click('#home'); await page.waitForTimeout(2500);
    expect(await sig()).toBe(a);
  });

  test('no console errors on load', async ({ page }) => {
    const errs = []; page.on('pageerror', (e) => errs.push(e.message));
    await open(page); expect(errs).toEqual([]);
  });
});
