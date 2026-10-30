document.querySelectorAll('.side-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    document.querySelector('.side-nav .selected')?.classList.remove('selected');
    link.classList.add('selected');
  });
});