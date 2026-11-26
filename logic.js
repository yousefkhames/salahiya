/* Salahiya core logic: pure functions, no DOM. Works in browser and Node. */
(function (root) {
  'use strict';
  var DAY = 86400000;

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function toISO(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parseISO(s) {
    if (typeof s !== 'string') return null;
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (!m) return null;
    var y = +m[1], mo = +m[2], d = +m[3];
    var t = Date.UTC(y, mo - 1, d);
    var c = new Date(t);
    if (c.getUTCFullYear() !== y || c.getUTCMonth() !== mo - 1 || c.getUTCDate() !== d) return null;
    return t;
  }
  function diffDays(fromISO, toISOs) {
    var a = parseISO(fromISO), b = parseISO(toISOs);
    if (a === null || b === null) return null;
    return Math.round((b - a) / DAY);
  }
  function addDays(iso, n) {
    var t = parseISO(iso);
    if (t === null) return null;
    var d = new Date(t + n * DAY);
    return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate());
  }
  function addMonths(iso, n) {
    var t = parseISO(iso);
    if (t === null) return null;
    var d = new Date(t);
    var y = d.getUTCFullYear(), m = d.getUTCMonth() + n, day = d.getUTCDate();
    var last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
    var r = new Date(Date.UTC(y, m, Math.min(day, last)));
    return r.getUTCFullYear() + '-' + pad(r.getUTCMonth() + 1) + '-' + pad(r.getUTCDate());
  }

  /* Effective expiry: the earlier of the printed date and (opened date + use-within days). */
  function effectiveExpiry(item) {
    var exp = item.expiry && parseISO(item.expiry) !== null ? item.expiry : null;
    if (item.openedOn && item.useWithin > 0 && parseISO(item.openedOn) !== null) {
      var byOpen = addDays(item.openedOn, Math.floor(item.useWithin));
      if (!exp || parseISO(byOpen) < parseISO(exp)) return byOpen;
    }
    return exp;
  }
  function daysLeft(item, todayISO) {
    var e = effectiveExpiry(item);
    return e ? diffDays(todayISO, e) : null;
  }
  /* status: expired | today | soon | ok */
  function status(item, todayISO, soonDays) {
    var d = daysLeft(item, todayISO);
    if (d === null) return 'ok';
    if (d < 0) return 'expired';
    if (d === 0) return 'today';
    if (d <= soonDays) return 'soon';
    return 'ok';
  }
  function validateItem(it) {
    var errors = [];
    if (!it || typeof it.name !== 'string' || !it.name.trim()) errors.push('name');
    if (!it || parseISO(it.expiry) === null) errors.push('expiry');
    if (it && it.openedOn && parseISO(it.openedOn) === null) errors.push('openedOn');
    if (it && it.qty !== undefined && !(Number(it.qty) >= 1 && Number(it.qty) <= 9999)) errors.push('qty');
    return errors;
  }
  function normalizeItem(it, id) {
    var cats = ['food', 'medicine', 'other'];
    return {
      id: it.id || id,
      name: String(it.name).trim().slice(0, 80),
      cat: cats.indexOf(it.cat) >= 0 ? it.cat : 'food',
      place: String(it.place || '').trim().slice(0, 40),
      qty: Math.max(1, Math.min(9999, Math.floor(Number(it.qty) || 1))),
      expiry: it.expiry,
      openedOn: it.openedOn || '',
      useWithin: it.openedOn ? Math.max(0, Math.floor(Number(it.useWithin) || 0)) : 0,
      note: String(it.note || '').trim().slice(0, 200),
      added: it.added || ''
    };
  }
  function sortItems(items, mode, todayISO) {
    var arr = items.slice();
    var key = function (i) { var d = daysLeft(i, todayISO); return d === null ? 1e9 : d; };
    if (mode === 'name') arr.sort(function (a, b) { return a.name.localeCompare(b.name); });
    else if (mode === 'added') arr.sort(function (a, b) { return String(b.added).localeCompare(String(a.added)) || (b.id > a.id ? 1 : -1); });
    else arr.sort(function (a, b) { return key(a) - key(b) || a.name.localeCompare(b.name); });
    return arr;
  }
  function filterItems(items, o, todayISO, soonDays) {
    var q = (o.q || '').trim().toLowerCase();
    return items.filter(function (i) {
      if (o.cat && o.cat !== 'all' && i.cat !== o.cat) return false;
      if (o.place && o.place !== 'all' && i.place !== o.place) return false;
      if (o.status && o.status !== 'all') {
        var s = status(i, todayISO, soonDays);
        if (o.status === 'soon') { if (s !== 'soon' && s !== 'today') return false; }
        else if (s !== o.status) return false;
      }
      if (q && (i.name + ' ' + i.place + ' ' + i.note).toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
  }
  function stats(items, todayISO, soonDays) {
    var r = { expired: 0, soon: 0, ok: 0, total: items.length };
    items.forEach(function (i) {
      var s = status(i, todayISO, soonDays);
      if (s === 'expired') r.expired++; else if (s === 'soon' || s === 'today') r.soon++; else r.ok++;
    });
    return r;
  }
  function places(items) {
    var set = {};
    items.forEach(function (i) { if (i.place) set[i.place] = 1; });
    return Object.keys(set).sort();
  }
  function csvCell(v) { v = String(v == null ? '' : v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
  function toCSV(items, todayISO) {
    var head = ['name', 'category', 'place', 'qty', 'expiry', 'opened_on', 'use_within_days', 'days_left', 'note'];
    var rows = [head.join(',')];
    items.forEach(function (i) {
      rows.push([i.name, i.cat, i.place, i.qty, i.expiry, i.openedOn, i.useWithin, daysLeft(i, todayISO), i.note].map(csvCell).join(','));
    });
    return '\ufeff' + rows.join('\n');
  }
  /* Import: accepts {items:[...]} or [...]; returns {items, skipped}. */
  function parseImport(text, existingIds) {
    var data;
    try { data = JSON.parse(text); } catch (e) { return { error: 'json' }; }
    var list = Array.isArray(data) ? data : (data && Array.isArray(data.items) ? data.items : null);
    if (!list) return { error: 'shape' };
    var out = [], skipped = 0, seen = {};
    (existingIds || []).forEach(function (x) { seen[x] = 1; });
    list.forEach(function (raw, idx) {
      if (validateItem(raw).length) { skipped++; return; }
      var id = raw.id && !seen[raw.id] ? raw.id : 'i' + Date.now().toString(36) + idx + Math.random().toString(36).slice(2, 5);
      seen[id] = 1;
      var rc = Object.assign({}, raw, { id: id }); out.push(normalizeItem(rc, id));
    });
    return { items: out, skipped: skipped };
  }
  /* Quick presets: shelf life counted from today. */
  var PRESETS = [
    { key: 'p3d', days: 3 }, { key: 'p1w', days: 7 }, { key: 'p2w', days: 14 },
    { key: 'p1m', months: 1 }, { key: 'p3m', months: 3 }, { key: 'p6m', months: 6 }, { key: 'p1y', months: 12 }
  ];
  function applyPreset(p, todayISO) { return p.months ? addMonths(todayISO, p.months) : addDays(todayISO, p.days); }

  var api = { toISO: toISO, parseISO: parseISO, diffDays: diffDays, addDays: addDays, addMonths: addMonths,
    effectiveExpiry: effectiveExpiry, daysLeft: daysLeft, status: status, validateItem: validateItem,
    normalizeItem: normalizeItem, sortItems: sortItems, filterItems: filterItems, stats: stats, places: places,
    toCSV: toCSV, parseImport: parseImport, PRESETS: PRESETS, applyPreset: applyPreset };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.SalahiyaLogic = api;
})(typeof self !== 'undefined' ? self : this);
