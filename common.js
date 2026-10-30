(function () {
  // toast helper used by every page
  window.acToast = function (msg) {
    var t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add('out'); setTimeout(function () { t.remove(); }, 320); }, 2500);
  };

  // placeholder links (privacy, terms, social, forgot password) get a message instead of jumping to the top
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href="#"]');
    if (!a || e.defaultPrevented) return;
    e.preventDefault(); acToast('This page is coming soon.');
  });

  // smooth fade-out when moving to another page
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target) return;
    var h = a.getAttribute('href');
    if (!h || h.charAt(0) === '#' || /^(mailto:|tel:|https?:)/.test(h)) return;
    e.preventDefault(); document.body.classList.add('leaving');
    setTimeout(function () { location.href = h; }, 260);
  });
  addEventListener('pageshow', function (e) { if (e.persisted) document.body.classList.remove('leaving'); });

  // footer reveal on scroll
  var f = document.querySelector('.site-footer');
  if (f && 'IntersectionObserver' in window) {
    f.querySelectorAll('.fa').forEach(function (el, i) { el.style.setProperty('--i', i); });
    f.classList.add('f-pre');
    new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { f.classList.add('in'); o.disconnect(); } }, { threshold: 0.1 }).observe(f);
  }

  // home page: header icons + contact form
  document.querySelectorAll('.actions button').forEach(function (b) {
    b.addEventListener('click', function () { acToast('Please sign in to use ' + b.getAttribute('aria-label').toLowerCase()); });
  });
  var cf = document.querySelector('.contact-form');
  cf && cf.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!cf.checkValidity()) return cf.reportValidity();
    acToast('Thanks! We will call you back within 30 minutes.'); cf.reset();
  });
})();
