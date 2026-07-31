// js/admin.js — Shared JS for all admin pages

const API = 'http://localhost:5000/api';

// ── AUTH HELPERS ──────────────────────────────────────────
function getToken() { return localStorage.getItem('scm_admin_token'); }
function getAdmin() { return JSON.parse(localStorage.getItem('scm_admin_user') || '{}'); }

function requireAdmin() {
  const token = getToken();
  const user = getAdmin();
  if (!token || user.role !== 'admin') {
    window.location.href = 'login.html';
  }
}

function logout() {
  localStorage.removeItem('scm_admin_token');
  localStorage.removeItem('scm_admin_user');
  window.location.href = 'login.html';
}

// ── API HELPER ────────────────────────────────────────────
async function apiCall(endpoint, method = 'GET', body = null) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(API + endpoint, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'API Error');
  return data;
}

// ── SIDEBAR ACTIVE LINK ───────────────────────────────────
function setActiveNav() {
  const page = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });
}

// ── SIDEBAR TOGGLE (mobile) ───────────────────────────────
function toggleSidebar() {
  document.querySelector('.sidebar').classList.toggle('open');
}

// ── MODAL HELPERS ─────────────────────────────────────────
function openModal(id) {
  document.getElementById(id).classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

// Close modal when clicking outside
document.addEventListener('click', e => {
  document.querySelectorAll('.modal-overlay.open').forEach(modal => {
    if (e.target === modal) modal.classList.remove('open');
  });
});

// ── TOAST NOTIFICATION ────────────────────────────────────
function showToast(msg, type = 'success') {
  const existing = document.getElementById('scm-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'scm-toast';
  toast.style.cssText = `
    position:fixed;bottom:28px;right:28px;z-index:9999;
    padding:13px 20px;border-radius:10px;font-size:14px;font-weight:600;
    color:#fff;box-shadow:0 6px 20px rgba(0,0,0,.2);
    animation:slideUp .3s ease;display:flex;align-items:center;gap:10px;
    background:${type === 'success' ? '#2A6B4A' : type === 'error' ? '#B5390A' : '#0E82E8'};
  `;
  toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>${msg}`;
  document.body.appendChild(toast);

  const style = document.createElement('style');
  style.textContent = '@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}';
  document.head.appendChild(style);

  setTimeout(() => toast.remove(), 3500);
}

// ── FORMAT HELPERS ────────────────────────────────────────
function formatPrice(n) { return '₹' + Number(n).toLocaleString('en-IN'); }
function formatDate(d) { return new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }); }
function formatDateTime(d) { return new Date(d).toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }); }

// ── STATUS BADGE ─────────────────────────────────────────
function statusBadge(status) {
  const map = {
    'Processing':        'badge-orange',
    'Confirmed':         'badge-blue',
    'Packed':            'badge-blue',
    'Shipped':           'badge-blue',
    'Out for Delivery':  'badge-blue',
    'Delivered':         'badge-green',
    'Cancelled':         'badge-red',
    'Paid':              'badge-green',
    'Pending':           'badge-orange',
    'Failed':            'badge-red',
    'New':               'badge-orange',
    'Read':              'badge-blue',
    'Replied':           'badge-green',
  };
  return `<span class="badge ${map[status] || 'badge-grey'}">${status}</span>`;
}

// ── SIDEBAR HTML ─────────────────────────────────────────
// Call this in each page's <script> with: renderSidebar('dashboard.html')
function renderSidebar(activePage) {
  const admin = getAdmin();
  const logo = document.getElementById('adminLogo')?.src || '';

  const navItems = [
    { page: 'dashboard.html', icon: 'fa-chart-pie',       label: 'Dashboard',        section: 'MAIN' },
    { page: 'products.html',  icon: 'fa-box-open',        label: 'Products',         section: null },
    { page: 'orders.html',    icon: 'fa-shopping-bag',    label: 'Orders',           badge: null, section: null },
    { page: 'customers.html', icon: 'fa-users',           label: 'Customers',        section: null },
    { page: 'coupons.html',   icon: 'fa-tag',             label: 'Coupons',          section: 'MANAGE' },
    { page: 'banners.html',   icon: 'fa-images',          label: 'Banners',          section: null },
    { page: 'reviews.html',   icon: 'fa-star',            label: 'Reviews',          section: null },
    { page: 'contacts.html',  icon: 'fa-envelope',        label: 'Inquiries',        badge: null, section: null },
    { page: 'settings.html',  icon: 'fa-cog',             label: 'Settings',         section: 'SYSTEM' },
  ];

  let html = `
    <div class="sidebar-logo">
      <img id="sideLogoImg" src="" alt="SCM"/>
      <div class="sidebar-logo-txt">
        <span>Sunil Choudhary Masala</span>
        <span>Admin Panel</span>
      </div>
    </div>
    <div class="sidebar-admin-info">
      <div class="admin-avatar">${(admin.firstName || 'A')[0]}</div>
      <div>
        <div class="admin-name">${admin.firstName || 'Admin'} ${admin.lastName || ''}</div>
        <div class="admin-role">Shopkeeper / Admin</div>
      </div>
    </div>`;

  let lastSection = null;
  navItems.forEach(item => {
    if (item.section && item.section !== lastSection) {
      html += `<div class="nav-section-label">${item.section}</div>`;
      lastSection = item.section;
    }
    const active = activePage === item.page ? 'active' : '';
    html += `<a href="${item.page}" class="nav-item ${active}" data-page="${item.page}">
      <i class="fas ${item.icon}"></i>${item.label}
    </a>`;
  });

  html += `
    <div class="sidebar-footer">
      <a href="../sunil-choudhary-masala/index.html" target="_blank" class="nav-item" style="margin-bottom:8px">
        <i class="fas fa-external-link-alt"></i> View Website
      </a>
      <div class="logout-btn" onclick="logout()">
        <i class="fas fa-sign-out-alt"></i> Logout
      </div>
    </div>`;

  document.querySelector('.sidebar').innerHTML = html;

  // ── Load live badge counts from backend ──
  (async () => {
    try {
      // Pending orders count
      const orders = await apiCall('/orders').catch(() => []);
      const pendingOrders = (Array.isArray(orders) ? orders : [])
        .filter(o => ['Processing','Confirmed','Packed'].includes(o.orderStatus)).length;
      if (pendingOrders > 0) {
        const ordLink = document.querySelector('.sidebar a[data-page="orders.html"]');
        if (ordLink) {
          ordLink.innerHTML += `<span class="badge" style="background:var(--red);color:#fff;margin-left:auto">${pendingOrders}</span>`;
        }
      }

      // New/unread contact inquiries count
      const contacts = await apiCall('/contact').catch(() => []);
      const newContacts = (Array.isArray(contacts) ? contacts : [])
        .filter(c => c.status === 'New').length;
      if (newContacts > 0) {
        const ctLink = document.querySelector('.sidebar a[data-page="contacts.html"]');
        if (ctLink) {
          ctLink.innerHTML += `<span class="badge" style="background:var(--red);color:#fff;margin-left:auto">${newContacts}</span>`;
        }
      }
    } catch(e) {
      // Silently skip badge counts if backend is unreachable
    }
  })();

  // Set logo from stored base64
  const logoB64 = localStorage.getItem('scm_logo');
  if (logoB64) document.getElementById('sideLogoImg').src = logoB64;
}

// Init on every page load
window.addEventListener('DOMContentLoaded', () => {
  // Store logo in localStorage for quick sidebar rendering
  const logoEl = document.getElementById('adminLogo');
  if (logoEl && logoEl.src && !localStorage.getItem('scm_logo')) {
    localStorage.setItem('scm_logo', logoEl.src);
  }
});
