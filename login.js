const loginForm = document.querySelector('.login-form');
const $ = (s) => loginForm.querySelector(s);
let signup = false;

const pw = $('#password'), pwBtn = $('.pw-toggle');
pwBtn.addEventListener('click', () => {
  const show = pw.type === 'password';
  pw.type = show ? 'text' : 'password';
  pwBtn.textContent = show ? 'Hide' : 'Show';
  pwBtn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
});

$('.mode-toggle').addEventListener('click', (e) => {
  e.preventDefault();
  signup = !signup;
  const name = $('#fullname');
  $('.signup-only').hidden = !signup;
  name.required = signup;
  $('#login-title').textContent = signup ? 'Create account' : 'Welcome back';
  $('.login-subtitle').textContent = signup ? 'Join StacklyCare to book services and shop genuine parts.' : 'Sign in to your StacklyCare account.';
  $('.login-submit').textContent = signup ? 'Sign up' : 'Sign in';
  $('.prompt-text').textContent = signup ? 'Already have an account?' : 'New to StacklyCare?';
  e.target.textContent = signup ? 'Sign in' : 'Create an account';
  pw.autocomplete = signup ? 'new-password' : 'current-password';
  $('.form-error').textContent = '';
  (signup ? name : $('#email')).focus();
});

function nameFromEmail(email) {
  return email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()).trim() || 'Customer';
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const err = $('.form-error');
  err.textContent = '';
  if (!loginForm.checkValidity()) {
    err.textContent = pw.validity.tooShort ? 'Password must be at least 6 characters.' : 'Please fill in all required fields correctly.';
    return loginForm.reportValidity();
  }

  const email = $('#email').value.trim().toLowerCase();
  const user = { email, name: nameFromEmail(email) };
  try { localStorage.setItem('stacklycare-user', JSON.stringify(user)); } catch (error) {}

  const btn = $('.login-submit');
  btn.classList.add('loading');
  btn.textContent = signup ? 'Creating account' : 'Signing in';
  setTimeout(() => {
    document.body.classList.add('leaving');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 260);
  }, 900);
});