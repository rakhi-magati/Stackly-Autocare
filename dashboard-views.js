(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var toast = function (m) { window.acToast ? acToast(m) : alert(m); };

  setTimeout(function () { document.body.classList.remove('booting'); }, 3500);

  /* ---------- tab router: sidebar + in-page links use #hash ---------- */
  var views = $$('.view'), links = $$('.side-nav a');
  function show(name) {
    if (!$('#view-' + name)) name = 'dashboard';
    views.forEach(function (v) { v.classList.toggle('active', v.id === 'view-' + name); });
    links.forEach(function (a) { a.classList.toggle('selected', a.getAttribute('href') === '#' + name); });
    window.scrollTo(0, 0);
  }
  function route() { show((location.hash || '#dashboard').slice(1)); }
  addEventListener('hashchange', route); route();

  /* ---------- chip filters (parts, orders, history) + header search ---------- */
  function applyFilter(scope) {
    var on = $('.chips[data-filter] .chip.on', scope), f = on ? on.dataset.f : 'all', q = scope.dataset.q || '';
    var shown = 0;
    $$('[data-cat]', scope).forEach(function (it) {
      var ok = (f === 'all' || it.dataset.cat === f) && (!q || it.textContent.toLowerCase().indexOf(q) > -1);
      it.hidden = !ok; if (ok) shown++;
    });
    var empty = $('.empty', scope); if (empty) empty.hidden = shown > 0;
  }
  $$('.chips[data-filter]').forEach(function (g) {
    g.addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return;
      $$('.chip', g).forEach(function (c) { c.classList.toggle('on', c === b); });
      applyFilter(g.closest('.view'));
    });
  });
  var search = $('.dash-search input'), parts = $('#view-parts');
  search && search.addEventListener('input', function () {
    parts.dataset.q = search.value.trim().toLowerCase();
    if (parts.dataset.q && location.hash !== '#parts') location.hash = '#parts';
    applyFilter(parts);
  });

  /* ---------- cart counter ---------- */
  var cart = 0, cnt = $('#cart-count'), pill = $('.cart-pill');
  $$('.add').forEach(function (b) {
    b.addEventListener('click', function () {
      cnt.textContent = ++cart; pill.classList.remove('pop'); void pill.offsetWidth; pill.classList.add('pop');
      toast(b.dataset.name + ' added to cart');
      b.classList.add('added'); b.textContent = 'Added \u2713';
      setTimeout(function () { b.classList.remove('added'); b.textContent = 'Add to cart'; }, 1300);
    });
  });

  /* ---------- order tracking + history details ---------- */
  var stages = ['Ordered', 'Packed', 'Shipped', 'Out for delivery', 'Delivered'];
  $$('.track-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var row = b.closest('.o-row'), t = $('.track', row);
      if (!t.innerHTML) {
        var n = +row.dataset.step;
        t.innerHTML = '<ol class="stepper">' + stages.map(function (s, i) { return '<li class="' + (i < n ? 'done' : i === n ? 'active' : '') + '">' + s + '</li>'; }).join('') + '</ol>';
      }
      t.hidden = !t.hidden; b.textContent = t.hidden ? 'Track' : 'Hide';
    });
  });
  $$('.more').forEach(function (b) {
    b.addEventListener('click', function () {
      var d = $('.h-detail', b.closest('.h-item')); d.hidden = !d.hidden; b.textContent = d.hidden ? 'Details' : 'Hide';
    });
  });
  var items = $$('.h-item'), sum = 0;
  items.forEach(function (i) { sum += +i.dataset.cost; });
  $('#h-count').textContent = items.length; $('#h-total').textContent = '\u20B9' + sum.toLocaleString('en-IN');

  /* ---------- booking form with live summary ---------- */
  var bf = $('.book-form'), slot = '';
  var inr = function (n) { return '\u20B9' + (+n).toLocaleString('en-IN'); };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var d0 = new Date(); bf.elements.date.min = d0.getFullYear() + '-' + pad(d0.getMonth() + 1) + '-' + pad(d0.getDate());
  function refresh() {
    var r = bf.querySelector('[name=service]:checked'), dv = bf.elements.date.value;
    $('#sum-service').textContent = r.value;
    var price = $('#sum-price'), nv = inr(r.dataset.price);
    if (price.textContent !== nv) { price.textContent = nv; price.classList.add('bump'); setTimeout(function () { price.classList.remove('bump'); }, 250); }
    $('#sum-date').textContent = dv ? new Date(dv + 'T00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '\u2014';
    $('#sum-time').textContent = slot || '\u2014';
    $('#sum-pick').textContent = bf.elements.pickup.checked ? 'Free' : 'Self drop-off';
  }
  bf.addEventListener('change', refresh);
  $('.slots', bf).addEventListener('click', function (e) {
    var c = e.target.closest('.chip'); if (!c) return;
    slot = c.dataset.slot; $$('.chip', bf).forEach(function (x) { x.classList.toggle('on', x === c); }); refresh();
  });
  bf.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = $('.form-msg', bf);
    if (!bf.elements.date.value || !slot) { msg.textContent = 'Please choose a date and a time slot.'; return; }
    msg.textContent = '';
    toast(bf.querySelector('[name=service]:checked').value + ' booked for ' + $('#sum-date').textContent + ', ' + slot);
    bf.reset(); slot = ''; $$('.chip', bf).forEach(function (x) { x.classList.remove('on'); }); refresh();
  });
  refresh();

  /* ---------- profile ---------- */
  var pf = $('.prof-form');
  pf.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = $('.form-msg', pf);
    if (!pf.checkValidity()) { msg.className = 'form-msg'; msg.textContent = 'Please enter a valid name, phone and email.'; return; }
    var name = pf.elements.name.value.trim(), ini = name.split(/\s+/).slice(0, 2).map(function (w) { return w[0].toUpperCase(); }).join('');
    $$('.avatar').forEach(function (a) { a.textContent = ini; });
    $('.user-area strong').textContent = name; $('#prof-name').textContent = name;
    var h = $('.welcome-row h1'), hr = new Date().getHours();
    if (h) h.firstChild.textContent = (hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening') + ', ' + name + ' ';
    msg.textContent = ''; toast('Profile updated');
  });

  /* ---------- settings ---------- */
  var pw = $('.pw-form');
  pw.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = $('.form-msg', pw);
    if (!pw.checkValidity()) { msg.textContent = 'New password must be at least 6 characters.'; return; }
    if (pw.elements['new'].value !== pw.elements.conf.value) { msg.textContent = 'New passwords do not match.'; return; }
    msg.textContent = ''; pw.reset(); toast('Password updated');
  });
  $$('.switch input').forEach(function (i) { i.addEventListener('change', function () { toast('Preference saved'); }); });
  var rm = $('#reduce-motion');
  try { if (localStorage.getItem('ac-reduce') === '1') { rm.checked = true; document.body.classList.add('reduce-motion'); } } catch (x) {}
  rm.addEventListener('change', function () {
    document.body.classList.toggle('reduce-motion', rm.checked);
    try { localStorage.setItem('ac-reduce', rm.checked ? '1' : '0'); } catch (x) {}
  });
})();
