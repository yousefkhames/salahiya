// Real-browser click-through. Usage: BASE=https://... node tests/e2e.js  (default: local server)
const puppeteer = require('puppeteer-core'); const assert = require('node:assert/strict'); const fs = require('fs');
(async () => {
  let server, base = process.env.BASE;
  if (!base) { server = await require('./server.js')(); base = 'http://localhost:' + server.address().port + '/'; }
  const shots = process.env.SHOTS || ''; if (shots) fs.mkdirSync(shots, { recursive: true });
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox','--lang=ar'], headless: 'new' });
  const p = await b.newPage(); await p.evaluateOnNewDocument(() => Object.defineProperty(navigator,'language',{get:()=>'ar-EG'})); await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  const errors = []; p.on('pageerror', e => errors.push(String(e))); p.on('dialog', d => d.accept());
  const TODAY = '2026-11-26';
  await p.goto(base + '?today=' + TODAY, { waitUntil: 'networkidle0' });
  await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'networkidle0' });
  const txt = s => p.$eval(s, e => e.textContent.trim());
  const count = () => p.$$eval('#list .card', e => e.length);
  const step = async (n, f) => { await f(); console.log('ok -', n); };
  const shot = async n => { if (shots) await p.screenshot({ path: shots + '/' + n + '.png' }); };

  await step('defaults to Arabic RTL', async () => { assert.equal(await p.$eval('html', e => e.dir), 'rtl'); assert.equal(await txt('.brand b'), 'صلاحية'); });
  await step('empty state shown', async () => { assert.equal(await count(), 0); assert.equal(await p.$eval('#empty', e => e.hidden), false); await shot('01-empty-ar'); });
  await step('switch to English LTR', async () => { await p.click('#langBtn'); assert.equal(await p.$eval('html', e => e.dir), 'ltr'); assert.equal(await txt('.brand b'), 'Salahiya'); });
  await step('validation blocks empty form', async () => { await p.click('#addBtn'); await p.click('#saveBtn'); assert.equal(await p.$eval('#formErr', e => e.hidden), false); assert.match(await txt('#formErr'), /name/i); });
  await step('add item with preset', async () => {
    await p.type('#fName', 'Fresh milk'); await p.click('#presets button[data-p="p1w"]');
    assert.equal(await p.$eval('#fExpiry', e => e.value), '2026-12-03');
    await p.type('#fPlace', 'Fridge'); await p.click('#saveBtn'); assert.equal(await count(), 1);
    assert.equal(await p.$eval('#list .card', e => e.dataset.status), 'soon'); assert.equal(await txt('.stamp b'), '7');
  });
  await step('demo data loads and counters add up', async () => {
    await p.click('#menuBtn'); await p.click('#demoBtn'); assert.equal(await count(), 7);
    assert.equal(await txt('#nExpired'), '1'); assert.equal(await txt('#nSoon'), '3'); assert.equal(await txt('#nOk'), '3');
    assert.equal(await p.$eval('#menuDlg', e => e.open), false); await shot('02-list-en');
  });
  await step('sorted: expired first, hero warns', async () => {
    assert.equal(await p.$eval('#list .card', e => e.dataset.status), 'expired'); assert.ok(await p.$eval('#hero', e => e.classList.contains('bad'))); assert.match(await txt('#hero h2'), /Yogurt/);
  });
  await step('tile filter: soon', async () => { await p.click('.t-soon'); assert.equal(await count(), 3); assert.ok((await p.$$eval('#list h3', e => e.map(x => x.textContent))).includes('Cough syrup')); await p.click('#clearFilter'); assert.equal(await count(), 7); });
  await step('category + place + search filters', async () => {
    await p.click('#catChips [data-cat="medicine"]'); assert.equal(await count(), 3);
    await p.select('#placeSel', 'Medicine drawer'); assert.equal(await count(), 3);
    await p.type('#q', 'eye'); assert.equal(await count(), 1); await p.click('#clearFilter'); assert.equal(await count(), 7);
  });
  await step('use one with undo', async () => {
    await p.evaluate(() => { const c = [...document.querySelectorAll('.card')].find(x => x.querySelector('h3').textContent === 'Rice'); c.querySelector('[data-act=use]').click(); });
    assert.equal(await count(), 6); assert.match(await txt('#waste'), /1/); await p.click('#toast button'); assert.equal(await count(), 7);
  });
  await step('opened-today sets shorter shelf life', async () => {
    await p.evaluate(() => { const c = [...document.querySelectorAll('.card')].find(x => x.querySelector('h3').textContent === 'Eye drops'); c.querySelector('[data-act=open]').click(); });
    await p.type('#fUseWithin', '5'); await p.click('#saveBtn');
    const d = await p.evaluate(() => { const c = [...document.querySelectorAll('.card')].find(x => x.querySelector('h3').textContent === 'Eye drops'); return [c.dataset.status, c.querySelector('.stamp b').textContent]; });
    assert.deepEqual(d, ['soon', '5']);
  });
  await step('edit item', async () => {
    await p.evaluate(() => document.querySelector('.card [data-act=edit]').click());
    await p.$eval('#fName', e => e.value = ''); await p.type('#fName', 'Yogurt big'); await p.click('#saveBtn');
    assert.ok((await p.$$eval('#list h3', e => e.map(x => x.textContent))).includes('Yogurt big'));
  });
  await step('discard + undo', async () => {
    await p.evaluate(() => document.querySelector('.card [data-act=del]').click()); assert.equal(await count(), 6); await p.click('#toast button'); assert.equal(await count(), 7);
  });
  await step('data persists across reload', async () => { await p.reload({ waitUntil: 'networkidle0' }); assert.equal(await count(), 7); assert.equal(await txt('.brand b'), 'Salahiya'); });
  await step('threshold setting changes soon count', async () => { await p.click('#menuBtn'); await p.select('#soonSel', '30'); await p.click('#closeMenu'); assert.equal(Number(await txt('#nSoon')), 4); await p.click('#menuBtn'); await p.select('#soonSel', '7'); await p.click('#closeMenu'); });
  await step('import JSON file (valid + invalid rows)', async () => {
    fs.writeFileSync('/tmp/imp.json', JSON.stringify({ items: [{ name: 'Honey', expiry: '2027-05-05', cat: 'food' }, { name: '', expiry: 'x' }] }));
    await p.click('#menuBtn'); const inp = await p.$('#impFile'); await inp.uploadFile('/tmp/imp.json'); await p.waitForFunction(() => document.querySelectorAll('#list .card').length === 8, { timeout: 3000 });
    assert.match(await txt('#toast'), /1 skipped/);
  });
  await step('export JSON/CSV produce files', async () => {
    const dl = await p.evaluate(async () => { let n = []; const o = HTMLAnchorElement.prototype.click; HTMLAnchorElement.prototype.click = function () { n.push(this.download); }; document.querySelector('#menuBtn').click(); }).then(() => p.evaluate(() => { const n = []; const o = HTMLAnchorElement.prototype.click; HTMLAnchorElement.prototype.click = function () { n.push(this.download); }; document.querySelector('#expJson').click(); document.querySelector('#expCsv').click(); HTMLAnchorElement.prototype.click = o; return n; }));
    assert.deepEqual(dl.map(x => x.split('.').pop()), ['json', 'csv']); await p.click('#closeMenu');
  });
  await step('Arabic layout with digits', async () => { await p.click('#langBtn'); assert.equal(await p.$eval('html', e => e.dir), 'rtl'); assert.match(await txt('#nOk'), /[٠-٩]/); await shot('03-list-ar'); });
  await step('no horizontal overflow at 320px', async () => { await p.setViewport({ width: 320, height: 700 }); assert.ok(await p.evaluate(() => document.documentElement.scrollWidth <= 320)); await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 }); });
  await step('wipe clears all', async () => { await p.click('#menuBtn'); await p.click('#wipeBtn'); assert.equal(await count(), 0); });
  assert.deepEqual(errors, [], 'page errors: ' + errors.join('|'));
  await b.close(); if (server) server.close(); console.log('E2E PASS');
})().catch(e => { console.error('E2E FAIL', e); process.exit(1); });
