document.querySelectorAll('.categories button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('.categories .active')?.classList.remove('active');
    button.classList.add('active');
  });
});