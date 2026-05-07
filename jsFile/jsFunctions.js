/* =========================================================
   FitPro — jsFunctions.js
   Global JS: navbar toggle, dropdown, dark/light theme
========================================================= */

/* ---- Theme ---- */
function initTheme() {
  const saved = localStorage.getItem('fitpro-theme') || 'dark';
  document.body.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const current = document.body.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', next);
  localStorage.setItem('fitpro-theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

/* ---- Hamburger Menu ---- */
function toggleMenu() {
  const ul = document.querySelector('nav ul');
  if (ul) ul.classList.toggle('open');
}

/* ---- Mobile Dropdown ---- */
function toggleDropdown(el) {
  const menu = el.nextElementSibling;
  if (menu) menu.classList.toggle('open');
}

/* ---- Close menu on outside click ---- */
document.addEventListener('click', function (e) {
  const nav = document.querySelector('nav');
  if (nav && !nav.contains(e.target)) {
    const ul = document.querySelector('nav ul');
    if (ul) ul.classList.remove('open');
  }
});

/* ---- Init on DOM ready ---- */
document.addEventListener('DOMContentLoaded', initTheme);
