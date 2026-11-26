const test = require('node:test'); const assert = require('node:assert/strict');
const L = require('../logic.js');
const T = '2026-11-26';
test('parseISO rejects bad dates', () => { assert.equal(L.parseISO('2026-02-30'), null); assert.equal(L.parseISO('x'), null); assert.notEqual(L.parseISO('2028-02-29'), null); assert.equal(L.parseISO('2027-02-29'), null); });
test('diffDays and addDays', () => { assert.equal(L.diffDays(T, '2026-11-30'), 4); assert.equal(L.diffDays(T, '2026-11-25'), -1); assert.equal(L.addDays('2026-12-30', 3), '2027-01-02'); });
test('addMonths clamps month end', () => { assert.equal(L.addMonths('2026-01-31', 1), '2026-02-28'); assert.equal(L.addMonths('2026-11-26', 3), '2027-02-26'); assert.equal(L.addMonths('2026-11-26', 12), '2027-11-26'); });
test('status levels', () => {
  assert.equal(L.status({ expiry: '2026-11-25' }, T, 7), 'expired');
  assert.equal(L.status({ expiry: T }, T, 7), 'today');
  assert.equal(L.status({ expiry: '2026-12-03' }, T, 7), 'soon');
  assert.equal(L.status({ expiry: '2026-12-04' }, T, 7), 'ok');
});
test('opened shelf life shortens expiry', () => {
  const i = { expiry: '2027-06-01', openedOn: '2026-11-20', useWithin: 10 };
  assert.equal(L.effectiveExpiry(i), '2026-11-30');
  assert.equal(L.daysLeft(i, T), 4);
  const j = { expiry: '2026-11-28', openedOn: '2026-11-20', useWithin: 30 };
  assert.equal(L.effectiveExpiry(j), '2026-11-28');
});
test('validate and normalize', () => {
  assert.deepEqual(L.validateItem({ name: ' ', expiry: 'bad' }), ['name', 'expiry']);
  assert.deepEqual(L.validateItem({ name: 'a', expiry: T, qty: 0 }), ['qty']);
  const n = L.normalizeItem({ name: '  Milk ', expiry: T, cat: 'weird', qty: '2.7' }, 'x1');
  assert.equal(n.name, 'Milk'); assert.equal(n.cat, 'food'); assert.equal(n.qty, 2); assert.equal(n.id, 'x1');
});
const items = [
  { id: 'a', name: 'Milk', cat: 'food', place: 'Fridge', expiry: '2026-11-28', added: '2026-11-20', note: '' },
  { id: 'b', name: 'Panadol', cat: 'medicine', place: 'Drawer', expiry: '2027-05-01', added: '2026-11-21', note: 'headache' },
  { id: 'c', name: 'Yogurt', cat: 'food', place: 'Fridge', expiry: '2026-11-20', added: '2026-11-22', note: '' },
  { id: 'd', name: 'Rice', cat: 'food', place: 'Pantry', expiry: '2027-01-01', added: '2026-11-23', note: '' }
];
test('sort by expiry puts expired first', () => { assert.deepEqual(L.sortItems(items, 'expiry', T).map(i => i.id), ['c', 'a', 'd', 'b']); });
test('sort by name and added', () => { assert.deepEqual(L.sortItems(items, 'name', T).map(i => i.id), ['a', 'b', 'd', 'c'].sort((x, y) => items.find(i => i.id === x).name.localeCompare(items.find(i => i.id === y).name))); assert.equal(L.sortItems(items, 'added', T)[0].id, 'd'); });
test('filters', () => {
  assert.deepEqual(L.filterItems(items, { cat: 'medicine' }, T, 7).map(i => i.id), ['b']);
  assert.deepEqual(L.filterItems(items, { status: 'expired' }, T, 7).map(i => i.id), ['c']);
  assert.deepEqual(L.filterItems(items, { status: 'soon' }, T, 7).map(i => i.id), ['a']);
  assert.deepEqual(L.filterItems(items, { place: 'Pantry' }, T, 7).map(i => i.id), ['d']);
  assert.deepEqual(L.filterItems(items, { q: 'HEAD' }, T, 7).map(i => i.id), ['b']);
});
test('stats and places', () => { assert.deepEqual(L.stats(items, T, 7), { expired: 1, soon: 1, ok: 2, total: 4 }); assert.deepEqual(L.places(items), ['Drawer', 'Fridge', 'Pantry']); });
test('csv escapes', () => { const c = L.toCSV([{ name: 'A, "B"', cat: 'food', place: '', qty: 1, expiry: T, openedOn: '', useWithin: 0, note: '' }], T); assert.ok(c.includes('"A, ""B"""')); assert.ok(c.startsWith('\ufeffname')); });
test('import validates and dedupes ids', () => {
  const r = L.parseImport(JSON.stringify({ items: [{ id: 'a', name: 'X', expiry: T }, { name: '', expiry: T }, { name: 'Y', expiry: 'nope' }] }), ['a']);
  assert.equal(r.items.length, 1); assert.equal(r.skipped, 2); assert.notEqual(r.items[0].id, 'a');
  assert.equal(L.parseImport('{bad').error, 'json'); assert.equal(L.parseImport('{"a":1}').error, 'shape');
  assert.equal(L.parseImport('[{"name":"Z","expiry":"2026-12-01"}]').items.length, 1);
});
test('presets', () => { assert.equal(L.applyPreset(L.PRESETS[1], T), '2026-12-03'); assert.equal(L.applyPreset(L.PRESETS[3], T), '2026-12-26'); });
