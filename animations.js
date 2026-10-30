(function () {
  // scroll progress bar + sticky header + back-to-top
  var bar = document.createElement('div'); bar.className = 'scroll-bar'; document.body.appendChild(bar);
  var top = document.createElement('button'); top.className = 'to-top'; top.setAttribute('aria-label', 'Back to top'); top.innerHTML = '&uarr;';
  top.onclick = function () { window.scrollTo({ top: 0, behavior: 'smooth' }); }; document.body.appendChild(top);
  var header = document.querySelector('.site-header');
  function onScroll() {
    var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? y / h * 100 : 0) + '%';
    header && header.classList.toggle('scrolled', y > 20);
    top.classList.toggle('show', y > 500);
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // stagger children
  document.querySelectorAll('.service-grid,.steps,.shop-grid,.review-grid').forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty('--i', i); });
  });

  // count-up
  function count(el) {
    var end = +el.dataset.count, suf = el.dataset.suffix || '', t0 = performance.now(), d = 1600;
    (function step(t) {
      var p = Math.min((t - t0) / d, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * e).toLocaleString('en-IN') + suf;
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  // reveal on scroll
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      en.target.querySelectorAll('[data-count]').forEach(count);
      io.unobserve(en.target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // active nav link follows scroll
  var links = document.querySelectorAll('.main-nav a');
  var map = {}; links.forEach(function (a) { map[a.getAttribute('href')] = a; });
  var so = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting && map['#' + e.target.id]) {
        document.querySelector('.main-nav .active')?.classList.remove('active');
        map['#' + e.target.id].classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['home', 'services', 'shop', 'about', 'contact'].forEach(function (id) { var s = document.getElementById(id); s && so.observe(s); });
})();
