const navigation = document.querySelector('.main-nav');
const menuToggle = document.querySelector('.menu-toggle');

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    document.querySelector('.main-nav .active')?.classList.remove('active');
    link.classList.add('active');
    navigation?.classList.remove('is-open');
    menuToggle?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open menu');
  });
});

menuToggle?.addEventListener('click', () => {
  const isOpen = navigation?.classList.toggle('is-open');
  menuToggle.classList.toggle('is-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 800) {
    navigation?.classList.remove('is-open');
    menuToggle?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }
});