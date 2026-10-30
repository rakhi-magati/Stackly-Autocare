(function () {
  // stagger card entrance
  var cards = document.querySelectorAll('.welcome-row,.stat-card,.vehicle-card,.upcoming-card,.offer-card,.orders-card,.quick-card,.health-card,.spend-card,.timeline-card,.remind-card,.activity-card');
  cards.forEach(function (c, i) { c.style.setProperty('--i', i); });

  // count-up numbers
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var end = +el.dataset.count, t0 = performance.now() + 1700, d = 1500;
    (function step(t) {
      if (t < t0) return requestAnimationFrame(step);
      var p = Math.min((t - t0) / d, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * e).toLocaleString('en-IN');
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  });

  // ring value from data-value
  var ring = document.querySelector('.ring');
  if (ring) ring.querySelector('.ring-fg').style.setProperty('--p', (+ring.dataset.value) / 100);

  // greeting by time of day
  var h1 = document.querySelector('.welcome-row h1');
  if (h1) {
    var hr = new Date().getHours(), g = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
    h1.firstChild.textContent = g + ', ' + ((window.stacklycareUser && window.stacklycareUser.name) || 'Customer') + ' ';
  }

  // bell click -> toast
  var bell = document.querySelector('.bell');
  bell && bell.addEventListener('click', function () {
    var t = document.createElement('div'); t.className = 'toast'; t.textContent = 'You have 3 new notifications';
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2600);
  });
})();
