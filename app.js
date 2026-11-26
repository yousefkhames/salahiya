(function () {
  'use strict';
  var L = window.SalahiyaLogic;
  var KEY = 'salahiya.v1';
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  var I18N = {
    ar: {
      appName: 'صلاحية', tagline: 'اعرف إيه هينتهي قبل ما يبوظ', skip: 'تخطي للقائمة', menu: 'القائمة',
      sExpired: 'منتهي', sOk: 'سليم', soonLbl: 'ينتهي خلال {n} أيام', search: 'ابحث عن صنف…',
      cAll: 'الكل', cFood: 'أكل', cMed: 'دواء', cOther: 'أخرى', place: 'المكان', sort: 'الترتيب',
      allPlaces: 'كل الأماكن', sortExp: 'الأقرب انتهاءً', sortName: 'الاسم', sortAdded: 'الأحدث إضافة',
      clearFilter: 'إلغاء الفلاتر', add: 'إضافة', addTitle: 'إضافة صنف', editTitle: 'تعديل الصنف',
      fName: 'اسم الصنف', fExpiry: 'تاريخ الانتهاء', fQty: 'الكمية', fPlace: 'المكان (ثلاجة، دُرج…)',
      fOpened: 'اتفتح بالفعل؟ (مدة الاستخدام بعد الفتح)', openedHint: 'لبن مفتوح أو قطرة عين لهم مدة أقصر من التاريخ المطبوع. لو حطيت المدة هنحسب الأقرب.',
      fOpenedOn: 'تاريخ الفتح', fUseWithin: 'يُستخدم خلال (يوم)', fNote: 'ملاحظة', cancel: 'إلغاء', save: 'حفظ',
      settings: 'الإعدادات', soonDays: 'نبّهني قبل الانتهاء بـ (أيام)', notif: 'تفعيل تنبيهات المتصفح', notifOn: 'التنبيهات مفعّلة (تظهر عند فتح التطبيق فقط)',
      notifOff: 'التنبيهات لا تعمل في الخلفية: بتظهر لما تفتح التطبيق.', notifDenied: 'المتصفح رفض التنبيهات.', notifNo: 'المتصفح لا يدعم التنبيهات.',
      expJson: 'تصدير JSON', expCsv: 'تصدير CSV', imp: 'استيراد JSON', demo: 'بيانات تجريبية', wipe: 'مسح كل البيانات', close: 'تم',
      privacy: 'بياناتك محفوظة في هذا المتصفح فقط. لا حساب ولا سيرفر. تنظيف بيانات المتصفح يمسحها، فاعمل تصدير من وقت لآخر.',
      used: 'استهلكت واحدة', opened: 'فتحتها اليوم', edit: 'تعديل', del: 'رمي', qty: '×{n}',
      dLeft: 'يوم', today: 'اليوم', expiredAgo: 'منتهي من {n} يوم', exp1: 'منتهي من أمس', in1: 'غدًا', inN: 'بعد {n} يوم', exps: 'ينتهي {d}',
      openedMeta: 'مفتوح {d}', limitOpen: 'لازم يخلص قبل {d}',
      heroEmptyT: 'ضيف أول صنف', heroEmptyP: 'سجّل الأدوية والأكل وهنقولك إيه يخلص الأول.',
      heroBadT: '{name} منتهي', heroBadP: '{when}. الأفضل ترميه.', heroWarnT: 'استخدم {name} الأول', heroWarnP: 'ينتهي {when}.',
      heroOkT: 'كله تمام', heroOkP: 'الأقرب انتهاءً: {name}، {when}.', heroLabel: 'الأولوية دلوقتي', show: 'اعرض',
      emptyT: 'مفيش حاجة هنا', emptyP: 'ضيف صنف بزر الإضافة.', noMatch: 'مفيش نتائج بالفلاتر دي.',
      toastAdded: 'تمت إضافة {n}', toastSaved: 'تم الحفظ', toastUsed: 'تم تسجيل الاستهلاك', toastDel: 'تم رمي {n}', toastOpened: 'تم تسجيل الفتح',
      undo: 'تراجع', errName: 'اكتب اسم الصنف.', errExpiry: 'اختار تاريخ انتهاء صحيح.', errQty: 'الكمية بين 1 و9999.', errOpen: 'تاريخ الفتح غير صحيح.',
      impOk: 'تم استيراد {n} صنف', impSkip: ' (تخطّينا {s})', impBad: 'الملف غير صالح.', confirmWipe: 'مسح كل الأصناف والإحصائيات؟ لا يمكن التراجع.',
      demoAdded: 'تمت إضافة بيانات تجريبية', waste: 'استهلكت <b>{u}</b> صنف قبل انتهائه ورميت <b>{t}</b>.',
      askUseWithin: 'اكتب عدد الأيام بعد الفتح.', notifTitle: 'صلاحية', notifBody: '{e} منتهي و{s} قريب الانتهاء',
      pre: { p3d: '3 أيام', p1w: 'أسبوع', p2w: 'أسبوعين', p1m: 'شهر', p3m: '3 شهور', p6m: '6 شهور', p1y: 'سنة' }, presetLbl: 'من اليوم:',
      demoItems: [['لبن', 'food', 'ثلاجة', 6], ['زبادي', 'food', 'ثلاجة', -2], ['بنادول', 'medicine', 'درج الأدوية', 200], ['شراب كحة', 'medicine', 'درج الأدوية', 3], ['أرز', 'food', 'مخزن', 150], ['قطرة عين', 'medicine', 'درج الأدوية', 40]]
    },
    en: {
      appName: 'Salahiya', tagline: 'Use it before you lose it', skip: 'Skip to list', menu: 'Menu',
      sExpired: 'Expired', sOk: 'Fine', soonLbl: 'Within {n} days', search: 'Search items…',
      cAll: 'All', cFood: 'Food', cMed: 'Medicine', cOther: 'Other', place: 'Place', sort: 'Sort',
      allPlaces: 'All places', sortExp: 'Expiring first', sortName: 'Name', sortAdded: 'Newest added',
      clearFilter: 'Clear filters', add: 'Add', addTitle: 'Add item', editTitle: 'Edit item',
      fName: 'Item name', fExpiry: 'Expiry date', fQty: 'Quantity', fPlace: 'Place (fridge, drawer…)',
      fOpened: 'Already opened? (use within)', openedHint: 'Opened milk or eye drops last less than the printed date. Set the days and we use whichever comes first.',
      fOpenedOn: 'Opened on', fUseWithin: 'Use within (days)', fNote: 'Note', cancel: 'Cancel', save: 'Save',
      settings: 'Settings', soonDays: 'Warn me this many days before', notif: 'Enable browser alerts', notifOn: 'Alerts on (shown only when you open the app)',
      notifOff: 'Alerts do not run in the background: they appear when you open the app.', notifDenied: 'The browser blocked notifications.', notifNo: 'This browser has no notifications.',
      expJson: 'Export JSON', expCsv: 'Export CSV', imp: 'Import JSON', demo: 'Load sample data', wipe: 'Erase all data', close: 'Done',
      privacy: 'Your data lives in this browser only. No account, no server. Clearing browser data erases it, so export now and then.',
      used: 'Used one', opened: 'Opened today', edit: 'Edit', del: 'Discard', qty: '×{n}',
      dLeft: 'days', today: 'today', expiredAgo: 'Expired {n}d ago', exp1: 'Expired yesterday', in1: 'Tomorrow', inN: 'In {n} days', exps: 'Expires {d}',
      openedMeta: 'Opened {d}', limitOpen: 'Finish by {d}',
      heroEmptyT: 'Add your first item', heroEmptyP: 'Log food and medicine and see what to use first.',
      heroBadT: '{name} has expired', heroBadP: '{when}. Best to throw it out.', heroWarnT: 'Use {name} first', heroWarnP: 'Expires {when}.',
      heroOkT: 'All good', heroOkP: 'Next to expire: {name}, {when}.', heroLabel: 'Priority now', show: 'Show',
      emptyT: 'Nothing here', emptyP: 'Add an item with the button.', noMatch: 'No results with these filters.',
      toastAdded: 'Added {n}', toastSaved: 'Saved', toastUsed: 'Use logged', toastDel: 'Discarded {n}', toastOpened: 'Opening logged',
      undo: 'Undo', errName: 'Enter an item name.', errExpiry: 'Pick a valid expiry date.', errQty: 'Quantity must be 1 to 9999.', errOpen: 'Opened date is not valid.',
      impOk: 'Imported {n} items', impSkip: ' ({s} skipped)', impBad: 'That file is not valid.', confirmWipe: 'Erase every item and the stats? This cannot be undone.',
      demoAdded: 'Sample data added', waste: 'You used <b>{u}</b> before they expired and discarded <b>{t}</b>.',
      askUseWithin: 'Enter days to use after opening.', notifTitle: 'Salahiya', notifBody: '{e} expired and {s} expiring soon',
      pre: { p3d: '3 days', p1w: '1 week', p2w: '2 weeks', p1m: '1 month', p3m: '3 months', p6m: '6 months', p1y: '1 year' }, presetLbl: 'From today:',
      demoItems: [['Milk', 'food', 'Fridge', 6], ['Yogurt', 'food', 'Fridge', -2], ['Panadol', 'medicine', 'Medicine drawer', 200], ['Cough syrup', 'medicine', 'Medicine drawer', 3], ['Rice', 'food', 'Pantry', 150], ['Eye drops', 'medicine', 'Medicine drawer', 40]]
    }
  };

  var state = load();
  var ui = { cat: 'all', status: 'all', place: 'all', q: '', sort: 'expiry', editId: null, fcat: 'food', undo: null };

  function today() {
    var m = /[?&]today=(\d{4}-\d{2}-\d{2})/.exec(location.search);
    return m && L.parseISO(m[1]) !== null ? m[1] : L.toISO(new Date());
  }
  function load() {
    var d = { items: [], lang: null, soon: 7, used: 0, tossed: 0, lastNotify: '' };
    try { var r = JSON.parse(localStorage.getItem(KEY)); if (r && Array.isArray(r.items)) d = Object.assign(d, r); } catch (e) {}
    if (!d.lang) d.lang = (navigator.language || '').toLowerCase().indexOf('en') === 0 ? 'en' : 'ar';
    return d;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { toast('⚠ storage'); } }
  function t(k, v) {
    var s = (I18N[state.lang][k] != null ? I18N[state.lang][k] : k);
    if (typeof s !== 'string') return s;
    if (v) Object.keys(v).forEach(function (x) { s = s.split('{' + x + '}').join(v[x]); });
    return s;
  }
  function num(n) { return Number(n).toLocaleString(state.lang === 'ar' ? 'ar-EG' : 'en-US'); }
  function fmtDate(iso) {
    var t0 = L.parseISO(iso); if (t0 === null) return '';
    return new Date(t0).toLocaleDateString(state.lang === 'ar' ? 'ar-EG' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function uid() { return 'i' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function when(d) { if (state.lang === 'ar' && Math.abs(d) === 2) return d < 0 ? 'منتهي من يومين' : 'بعد يومين'; return d < 0 ? (d === -1 ? t('exp1') : t('expiredAgo', { n: num(-d) })) : d === 0 ? t('today') : d === 1 ? t('in1') : t('inN', { n: num(d) }); }

  function applyLang() {
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
    document.title = state.lang === 'ar' ? 'صلاحية · Salahiya' : 'Salahiya · expiry tracker';
    $$('[data-i]').forEach(function (e) { e.textContent = t(e.getAttribute('data-i')); });
    $$('[data-i-ph]').forEach(function (e) { e.placeholder = t(e.getAttribute('data-i-ph')); });
    $$('[data-i-aria]').forEach(function (e) { e.setAttribute('aria-label', t(e.getAttribute('data-i-aria'))); });
    $('#langBtn').textContent = state.lang === 'ar' ? 'EN' : 'ع';
    $('#lblSoon').textContent = t('soonLbl', { n: num(state.soon) });
    $('#soonSel').value = String(state.soon);
    buildPresets();
  }
  function buildPresets() {
    var box = $('#presets'); box.innerHTML = '<small class="hint">' + esc(t('presetLbl')) + '</small>';
    L.PRESETS.forEach(function (p) {
      var b = document.createElement('button'); b.type = 'button'; b.dataset.p = p.key; b.textContent = t('pre')[p.key];
      b.addEventListener('click', function () { $('#fExpiry').value = L.applyPreset(p, today()); });
      box.appendChild(b);
    });
  }

  function render() {
    var td = today(), s = state.soon;
    var st = L.stats(state.items, td, s);
    $('#nExpired').textContent = num(st.expired); $('#nSoon').textContent = num(st.soon); $('#nOk').textContent = num(st.ok);
    $$('.tile').forEach(function (b) { b.classList.toggle('on', b.dataset.status === ui.status); b.setAttribute('aria-pressed', b.dataset.status === ui.status); });
    $$('#catChips button').forEach(function (b) { b.classList.toggle('on', b.dataset.cat === ui.cat); });
    // places
    var ps = L.places(state.items), sel = $('#placeSel');
    sel.innerHTML = '<option value="all">' + esc(t('allPlaces')) + '</option>' + ps.map(function (p) { return '<option value="' + esc(p) + '">' + esc(p) + '</option>'; }).join('');
    if (ps.indexOf(ui.place) < 0) ui.place = 'all';
    sel.value = ui.place;
    $('#placeHints').innerHTML = ps.map(function (p) { return '<option value="' + esc(p) + '">'; }).join('');
    $('#nameHints').innerHTML = Array.from(new Set(state.items.map(function (i) { return i.name; }))).map(function (p) { return '<option value="' + esc(p) + '">'; }).join('');
    $('#sortSel').value = ui.sort;
    var filtering = ui.cat !== 'all' || ui.status !== 'all' || ui.place !== 'all' || ui.q;
    $('#clearFilter').hidden = !filtering;

    renderHero(td);
    var shown = L.sortItems(L.filterItems(state.items, ui, td, s), ui.sort, td);
    var list = $('#list'); list.innerHTML = '';
    shown.forEach(function (it) { list.appendChild(card(it, td)); });
    var empty = $('#empty');
    empty.hidden = shown.length > 0;
    empty.innerHTML = state.items.length ? '<b>' + esc(t('noMatch')) + '</b>' : '<b>' + esc(t('emptyT')) + '</b>' + esc(t('emptyP'));
    var w = $('#waste'); w.hidden = !(state.used || state.tossed);
    w.innerHTML = t('waste', { u: num(state.used), t: num(state.tossed) });
  }

  function renderHero(td) {
    var h = $('#hero'), sorted = L.sortItems(state.items.filter(function (i) { return L.daysLeft(i, td) !== null; }), 'expiry', td);
    if (!sorted.length) { h.className = 'hero'; h.innerHTML = '<small>' + esc(t('heroLabel')) + '</small><h2>' + esc(t('heroEmptyT')) + '</h2><p>' + esc(t('heroEmptyP')) + '</p>'; return; }
    var it = sorted[0], d = L.daysLeft(it, td), s = L.status(it, td, state.soon), nm = esc(it.name), w = when(d);
    var cls = s === 'expired' ? 'bad' : (s === 'ok' ? '' : 'warn');
    var title = s === 'expired' ? t('heroBadT', { name: nm }) : s === 'ok' ? t('heroOkT') : t('heroWarnT', { name: nm });
    var p = s === 'expired' ? t('heroBadP', { when: w }) : s === 'ok' ? t('heroOkP', { name: nm, when: w }) : t('heroWarnP', { when: w });
    h.className = 'hero ' + cls;
    h.innerHTML = '<small>' + esc(t('heroLabel')) + '</small><h2>' + title + '</h2><p>' + p + '</p><button class="go" type="button" data-edit="' + esc(it.id) + '">' + esc(t('edit')) + '</button>';
  }

  function card(it, td) {
    var d = L.daysLeft(it, td), s = L.status(it, td, state.soon), eff = L.effectiveExpiry(it);
    var li = document.createElement('li'); li.className = 'card ' + s; li.dataset.id = it.id; li.dataset.status = s;
    var big = d === null ? '–' : (d === 0 ? '0' : num(Math.abs(d)));
    var sub = d === null ? '' : d < 0 ? t('sExpired') : d === 0 ? t('today') : t('dLeft');
    var catCls = it.cat === 'medicine' ? 'med' : it.cat === 'food' ? 'food' : '';
    var catName = it.cat === 'medicine' ? t('cMed') : it.cat === 'food' ? t('cFood') : t('cOther');
    var meta = '<span class="tag ' + catCls + '">' + esc(catName) + '</span>';
    if (it.place) meta += '<span class="tag">' + esc(it.place) + '</span>';
    if (it.qty > 1) meta += '<span class="tag">' + esc(t('qty', { n: num(it.qty) })) + '</span>';
    meta += '<span>' + esc(t('exps', { d: fmtDate(eff) })) + '</span>';
    if (it.openedOn) meta += '<span>' + esc(t('openedMeta', { d: fmtDate(it.openedOn) })) + '</span>';
    li.innerHTML = '<div class="stamp" aria-hidden="true"><b>' + big + '</b><span>' + esc(sub) + '</span></div><div><h3>' + esc(it.name) + '</h3><div class="meta">' + meta + '</div>' +
      (it.note ? '<p class="note">' + esc(it.note) + '</p>' : '') +
      '<div class="acts"><button class="use" data-act="use" type="button">' + esc(t('used')) + '</button>' +
      (it.openedOn ? '' : '<button data-act="open" type="button">' + esc(t('opened')) + '</button>') +
      '<button data-act="edit" type="button">' + esc(t('edit')) + '</button><button class="del" data-act="del" type="button">' + esc(t('del')) + '</button></div></div>';
    li.setAttribute('aria-label', it.name + ', ' + (d === null ? '' : when(d)));
    return li;
  }

  /* toast + undo */
  var toastTimer;
  function toast(msg, undo) {
    var el = $('#toast'); el.innerHTML = '<span></span>'; el.firstChild.textContent = msg;
    if (undo) { var b = document.createElement('button'); b.type = 'button'; b.textContent = t('undo'); b.addEventListener('click', function () { undo(); el.hidden = true; }); el.appendChild(b); }
    el.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.hidden = true; }, 6000);
  }
  function snapshot() { return JSON.stringify({ items: state.items, used: state.used, tossed: state.tossed }); }
  function restore(snap) { var o = JSON.parse(snap); state.items = o.items; state.used = o.used; state.tossed = o.tossed; save(); render(); }

  /* item dialog */
  function openDlg(id) {
    ui.editId = id || null;
    var it = id ? state.items.find(function (x) { return x.id === id; }) : null;
    $('#dlgTitle').textContent = t(it ? 'editTitle' : 'addTitle');
    $('#fName').value = it ? it.name : ''; $('#fExpiry').value = it ? it.expiry : '';
    $('#fQty').value = it ? it.qty : 1; $('#fPlace').value = it ? it.place : (ui.place !== 'all' ? ui.place : '');
    $('#fOpenedOn').value = it ? it.openedOn : ''; $('#fUseWithin').value = it && it.useWithin ? it.useWithin : '';
    $('#fNote').value = it ? it.note : ''; setCat(it ? it.cat : (ui.cat !== 'all' ? ui.cat : 'food'));
    $('#openBox').open = !!(it && it.openedOn);
    $('#formErr').hidden = true;
    $('#itemDlg').showModal(); $('#fName').focus();
  }
  function setCat(c) { ui.fcat = c; $$('#fCat button').forEach(function (b) { b.classList.toggle('on', b.dataset.v === c); }); }
  function submitForm(e) {
    e.preventDefault();
    var o = { name: $('#fName').value, cat: ui.fcat, expiry: $('#fExpiry').value, qty: $('#fQty').value || 1, place: $('#fPlace').value,
      openedOn: $('#fOpenedOn').value, useWithin: $('#fUseWithin').value, note: $('#fNote').value };
    var errs = L.validateItem(o), msg = '';
    if (errs.indexOf('name') >= 0) msg = t('errName'); else if (errs.indexOf('expiry') >= 0) msg = t('errExpiry');
    else if (errs.indexOf('qty') >= 0) msg = t('errQty'); else if (errs.indexOf('openedOn') >= 0) msg = t('errOpen');
    else if (o.openedOn && !(Number(o.useWithin) >= 1)) msg = t('askUseWithin');
    if (msg) { var er = $('#formErr'); er.textContent = msg; er.hidden = false; return; }
    var snap = snapshot();
    if (ui.editId) {
      var idx = state.items.findIndex(function (x) { return x.id === ui.editId; });
      o.id = ui.editId; o.added = state.items[idx].added; state.items[idx] = L.normalizeItem(o, ui.editId);
      toast(t('toastSaved'), function () { restore(snap); });
    } else {
      o.added = today(); var n = L.normalizeItem(o, uid()); state.items.push(n);
      toast(t('toastAdded', { n: n.name }), function () { restore(snap); });
    }
    save(); $('#itemDlg').close(); render();
  }

  function act(id, a) {
    var idx = state.items.findIndex(function (x) { return x.id === id; }); if (idx < 0) return;
    var it = state.items[idx], snap = snapshot();
    if (a === 'edit') return openDlg(id);
    if (a === 'use') {
      if (L.daysLeft(it, today()) !== null && L.daysLeft(it, today()) >= 0) state.used++; else state.tossed++;
      if (it.qty > 1) it.qty--; else state.items.splice(idx, 1);
      save(); render(); toast(t('toastUsed'), function () { restore(snap); });
    } else if (a === 'del') {
      state.tossed++; state.items.splice(idx, 1); save(); render(); toast(t('toastDel', { n: it.name }), function () { restore(snap); });
    } else if (a === 'open') {
      it.openedOn = today(); save(); openDlg(id); $('#openBox').open = true; $('#fUseWithin').focus();
    }
  }

  function download(name, text, type) {
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: type })); a.download = name;
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function maybeNotify() {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    var td = today(); if (state.lastNotify === td) return;
    var st = L.stats(state.items, td, state.soon); if (!st.expired && !st.soon) return;
    state.lastNotify = td; save();
    try { new Notification(t('notifTitle'), { body: t('notifBody', { e: num(st.expired), s: num(st.soon) }) }); } catch (e) {}
  }
  function notifHint() {
    var h = $('#notifHint');
    if (!('Notification' in window)) h.textContent = t('notifNo');
    else if (Notification.permission === 'granted') h.textContent = t('notifOn');
    else if (Notification.permission === 'denied') h.textContent = t('notifDenied');
    else h.textContent = t('notifOff');
  }

  /* events */
  $('#addBtn').addEventListener('click', function () { openDlg(); });
  $('#itemForm').addEventListener('submit', submitForm);
  $('#cancelBtn').addEventListener('click', function () { $('#itemDlg').close(); });
  $('#fCat').addEventListener('click', function (e) { if (e.target.dataset.v) setCat(e.target.dataset.v); });
  $('#langBtn').addEventListener('click', function () { state.lang = state.lang === 'ar' ? 'en' : 'ar'; save(); applyLang(); render(); });
  $('#menuBtn').addEventListener('click', function () { notifHint(); $('#menuDlg').showModal(); });
  $('#closeMenu').addEventListener('click', function () { $('#menuDlg').close(); });
  $('#soonSel').addEventListener('change', function (e) { state.soon = +e.target.value; save(); applyLang(); render(); });
  $('#q').addEventListener('input', function (e) { ui.q = e.target.value; render(); });
  $('#placeSel').addEventListener('change', function (e) { ui.place = e.target.value; render(); });
  $('#sortSel').addEventListener('change', function (e) { ui.sort = e.target.value; render(); });
  $('#catChips').addEventListener('click', function (e) { if (e.target.dataset.cat) { ui.cat = e.target.dataset.cat; render(); } });
  $$('.tile').forEach(function (b) { b.addEventListener('click', function () { ui.status = ui.status === b.dataset.status ? 'all' : b.dataset.status; render(); }); });
  $('#clearFilter').addEventListener('click', function () { ui.cat = 'all'; ui.status = 'all'; ui.place = 'all'; ui.q = ''; $('#q').value = ''; render(); });
  $('#list').addEventListener('click', function (e) { var b = e.target.closest('button[data-act]'); if (b) act(b.closest('.card').dataset.id, b.dataset.act); });
  $('#hero').addEventListener('click', function (e) { var b = e.target.closest('[data-edit]'); if (b) openDlg(b.dataset.edit); });
  $('#expJson').addEventListener('click', function () { download('salahiya-' + today() + '.json', JSON.stringify({ app: 'salahiya', version: 1, exported: today(), items: state.items }, null, 2), 'application/json'); });
  $('#expCsv').addEventListener('click', function () { download('salahiya-' + today() + '.csv', L.toCSV(state.items, today()), 'text/csv;charset=utf-8'); });
  $('#impBtn').addEventListener('click', function () { $('#impFile').click(); });
  $('#impFile').addEventListener('change', function (e) {
    var f = e.target.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      var res = L.parseImport(String(r.result), state.items.map(function (i) { return i.id; }));
      if (res.error) { toast(t('impBad')); return; }
      var snap = snapshot(); state.items = state.items.concat(res.items); save(); render();
      toast(t('impOk', { n: num(res.items.length) }) + (res.skipped ? t('impSkip', { s: num(res.skipped) }) : ''), function () { restore(snap); });
      $('#menuDlg').close();
    };
    r.readAsText(f); e.target.value = '';
  });
  $('#demoBtn').addEventListener('click', function () {
    var snap = snapshot(), td = today();
    t('demoItems').forEach(function (d) { state.items.push(L.normalizeItem({ name: d[0], cat: d[1], place: d[2], expiry: L.addDays(td, d[3]), added: td }, uid())); });
    save(); render(); $('#menuDlg').close(); toast(t('demoAdded'), function () { restore(snap); });
  });
  $('#wipeBtn').addEventListener('click', function () {
    if (!confirm(t('confirmWipe'))) return;
    state.items = []; state.used = 0; state.tossed = 0; save(); render(); $('#menuDlg').close();
  });
  $('#notifBtn').addEventListener('click', function () {
    if (!('Notification' in window)) return notifHint();
    Notification.requestPermission().then(function () { notifHint(); maybeNotify(); });
  });
  $$('dialog').forEach(function (d) { d.addEventListener('click', function (e) { if (e.target === d) d.close(); }); });

  applyLang(); render(); maybeNotify();
  if ('serviceWorker' in navigator && /^https?:/.test(location.protocol) && !/[?&]today=/.test(location.search)) navigator.serviceWorker.register('sw.js').catch(function () {});
  window.__salahiya = { state: function () { return state; } };
})();
