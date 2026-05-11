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
  

/* =========================================================
   Dashboard — Stock Chart & CRUD
   (Only runs when #stockChart canvas is present)
========================================================= */

/* ─── Chart Data ─── */
const DASH_LABELS     = ['Weights', 'Cardio', 'Strength', 'Accessories', 'Recovery', 'Nutrition'];
const DASH_STOCK_QTY  = [65, 42, 38, 55, 28, 20];
const DASH_STOCK_VAL  = [12000, 18000, 5500, 3200, 1800, 950];

const DASH_ORANGE  = 'rgba(255,107,53,0.85)';
const DASH_RED     = 'rgba(233,69,96,0.85)';
const DASH_BLUE    = 'rgba(99,179,237,0.85)';
const DASH_GREEN   = 'rgba(104,211,145,0.85)';
const DASH_YELLOW  = 'rgba(246,173,85,0.85)';
const DASH_PURPLE  = 'rgba(159,122,234,0.85)';
const DASH_PALETTE = [DASH_ORANGE, DASH_RED, DASH_BLUE, DASH_GREEN, DASH_YELLOW, DASH_PURPLE];

const dashIsDark    = () => document.body.getAttribute('data-theme') === 'dark';
const dashGridColor = () => dashIsDark() ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
const dashTickColor = () => dashIsDark() ? '#aaa' : '#555';

let dashChart = null;

function buildChartConfig(type) {
  if (type === 'doughnut') {
    return {
      type: 'doughnut',
      data: {
        labels: DASH_LABELS,
        datasets: [{
          data: DASH_STOCK_QTY,
          backgroundColor: DASH_PALETTE,
          borderWidth: 2,
          borderColor: dashIsDark() ? '#1A1A2E' : '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: dashTickColor(), font: { family: 'Barlow', weight: '700', size: 13 }, padding: 16 }
          },
          tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed} units` } }
        }
      }
    };
  }

  return {
    type,
    data: {
      labels: DASH_LABELS,
      datasets: [
        {
          label: 'Qty in Stock',
          data: DASH_STOCK_QTY,
          backgroundColor: type === 'bar' ? DASH_PALETTE : 'rgba(255,107,53,0.15)',
          borderColor: DASH_ORANGE,
          borderWidth: 2,
          tension: 0.4,
          fill: type === 'line',
          pointBackgroundColor: DASH_ORANGE,
          pointRadius: 5
        },
        {
          label: 'Stock Value ($00s)',
          data: DASH_STOCK_VAL.map(v => Math.round(v / 100)),
          backgroundColor: type === 'bar' ? 'rgba(233,69,96,0.6)' : 'rgba(233,69,96,0.1)',
          borderColor: DASH_RED,
          borderWidth: 2,
          tension: 0.4,
          fill: type === 'line',
          pointBackgroundColor: DASH_RED,
          pointRadius: 5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          labels: { color: dashTickColor(), font: { family: 'Barlow', weight: '700' }, padding: 16 }
        },
        tooltip: {
          bodyFont: { family: 'Inter' },
          titleFont: { family: 'Barlow', weight: '700' }
        }
      },
      scales: {
        x: { ticks: { color: dashTickColor(), font: { family: 'Barlow', weight: '600' } }, grid: { color: dashGridColor() } },
        y: { ticks: { color: dashTickColor(), font: { family: 'Inter' } }, grid: { color: dashGridColor() }, beginAtZero: true }
      }
    }
  };
}

function renderChart(type) {
  if (dashChart) dashChart.destroy();
  const canvas = document.getElementById('stockChart');
  if (!canvas) return;
  dashChart = new Chart(canvas.getContext('2d'), buildChartConfig(type));
}

function switchChart(type, btn) {
  document.querySelectorAll('.chart-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderChart(type);
}

/* ─── Row Selection ─── */
let selectedRow = null;

function selectRow(row) {
  if (selectedRow) selectedRow.classList.remove('table-row-selected');
  selectedRow = row;
  row.classList.add('table-row-selected');
}

/* ─── Delete Handler ─── */
function handleDelete() {
  if (!selectedRow) {
    alert('⚠️ Please click a row in the table to select a stock item first.');
    return;
  }
  const name = selectedRow.querySelectorAll('td')[1].textContent;
  if (confirm(`🗑️ Delete "${name}" from stock? This cannot be undone.`)) {
    selectedRow.style.transition = 'opacity 0.4s';
    selectedRow.style.opacity = '0';
    setTimeout(() => { selectedRow.remove(); selectedRow = null; }, 400);
  }
}

/* ─── Init chart on dashboard page ─── */
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('stockChart')) renderChart('bar');
});
