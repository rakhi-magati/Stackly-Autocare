(function () {
  function nameFromEmail(email) {
    return email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, function (letter) { return letter.toUpperCase(); }).trim() || 'Customer';
  }
  function initials(name) {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map(function (word) { return word[0].toUpperCase(); }).join('') || 'SC';
  }
  function greeting() {
    var hour = new Date().getHours();
    return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  }
  var user = { name: 'Customer', email: '' };
  try {
    var saved = JSON.parse(localStorage.getItem('stacklycare-user'));
    if (saved && saved.email) user = { email: saved.email, name: nameFromEmail(saved.email) };
  } catch (error) {}
  window.stacklycareUser = user;
  window.stacklycareGreeting = greeting;
  document.addEventListener('DOMContentLoaded', function () {
    var name = user.name, email = user.email, ini = initials(name);
    document.querySelectorAll('.user-area strong, #prof-name, [data-user-name]').forEach(function (node) { node.textContent = name; });
    document.querySelectorAll('.avatar, .shop-avatar').forEach(function (node) { node.textContent = ini; });
    document.querySelectorAll('[data-user-email]').forEach(function (node) { node.textContent = email || 'Customer'; });
    var heading = document.querySelector('.welcome-row h1');
    if (heading) heading.firstChild.textContent = greeting() + ', ' + name + ' ';
    var profileEmail = document.querySelector('.prof-form [name=email]');
    if (profileEmail && email) profileEmail.value = email;
  });
})();