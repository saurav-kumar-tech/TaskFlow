/* ============================================================
   TaskFlow Frontend
   ============================================================ */

const API = '/api';

// ---------- State ----------
let token = localStorage.getItem('tf_token');
let currentUser = JSON.parse(localStorage.getItem('tf_user') || 'null');
let tasks = [];
let ws = null;
let editingId = null;
let currentView = 'dashboard';
// ---------- Analytics ----------
let analyticsPeriod = 'week';

// ---------- DOM ----------
const authScreen   = document.getElementById('authScreen');
const appScreen    = document.getElementById('appScreen');
const loginForm    = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const authError    = document.getElementById('authError');
const welcomeUser  = document.getElementById('welcomeUser');
const taskList     = document.getElementById('taskList');
const emptyState   = document.getElementById('emptyState');
const taskModal    = document.getElementById('taskModal');
const taskForm     = document.getElementById('taskForm');
const modalTitle   = document.getElementById('modalTitle');
const toast        = document.getElementById('toast');

const statsSection   = document.getElementById('statsSection');
const toolbarSection = document.getElementById('toolbarSection');
const viewAnalytics  = document.getElementById('viewAnalytics');
const viewSettings   = document.getElementById('viewSettings');

const pageTitle = document.getElementById('pageTitle');
const pageSub   = document.getElementById('pageSub');

// ---------- Utils ----------
function show(el) { el && el.classList.remove('hidden'); }
function hide(el) { el && el.classList.add('hidden'); }

let toastTimer = null;
function showToast(msg) {
  toast.textContent = msg;
  show(toast);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => hide(toast), 2500);
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  };
}

/**
 * Universal API helper.
 * `isAuthCall = true` → don't auto-logout on 401, just throw error
 * `isAuthCall = false` (default) → on 401, logout and redirect
 */
async function api(path, opts = {}, isAuthCall = false) {
  const res = await fetch(API + path, opts);

  if (!res.ok) {
    let msg = 'Request failed';
    try {
      const data = await res.json();
      msg = data.error || data.message || msg;
    } catch {}

    if ((res.status === 401 || res.status === 403) && !isAuthCall) {
      logout();
      throw new Error('Session expired. Please login again.');
    }
    throw new Error(msg);
  }

  if (res.status === 204) return null;
  return res.json();
}

// ---------- Theme ----------
function applyTheme(theme) {
  document.documentElement.classList.add('theme-switching');
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('tf_theme', theme);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.remove('theme-switching');
    });
  });

  const icon = theme === 'dark' ? '☀️' : '🌙';
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = icon;
}

function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme');
  applyTheme(cur === 'dark' ? 'light' : 'dark');
}

document.getElementById('themeToggle').addEventListener('click', toggleTheme);
document.getElementById('themeToggleSettings').addEventListener('click', toggleTheme);

// ---------- Auth Tabs ----------
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const tabs = document.querySelector('.tabs');
    tabs.dataset.active = tab.dataset.tab;

    if (tab.dataset.tab === 'login') {
      show(loginForm); hide(registerForm);
    } else {
      hide(loginForm); show(registerForm);
    }
    hide(authError);
  });
});

// ---------- Login ----------
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hide(authError);
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!username || !password) {
    authError.textContent = 'Please enter username/email and password';
    show(authError);
    return;
  }

  try {
    const data = await api('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    }, true);  // ← TRUE means: don't auto-logout on failure
    onAuthSuccess(data);
  } catch (err) {
    authError.textContent = err.message || 'Login failed';
    show(authError);
  }
});

// ---------- Register ----------
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hide(authError);
  const username = document.getElementById('registerUsername').value.trim();
  const email    = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;

  try {
    const data = await api('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    }, true);
    onAuthSuccess(data);
  } catch (err) {
    authError.textContent = err.message || 'Registration failed';
    show(authError);
  }
});

function onAuthSuccess(data) {
  token = data.token;
  currentUser = { username: data.username, email: data.email, userId: data.userId };
  localStorage.setItem('tf_token', token);
  localStorage.setItem('tf_user', JSON.stringify(currentUser));

  // Clear login form
  loginForm.reset();
  registerForm.reset();
  hide(authError);

  enterApp();
}

// ---------- Logout ----------
document.getElementById('logoutBtn').addEventListener('click', logout);
document.getElementById('logoutSettings').addEventListener('click', logout);

function logout() {
  token = null;
  currentUser = null;
  localStorage.removeItem('tf_token');
  localStorage.removeItem('tf_user');
  if (ws) { try { ws.close(); } catch {} ws = null; }
  hide(appScreen);
  show(authScreen);
  tasks = [];
  renderTasks();

  // Clear any leftover state
  loginForm.reset();
  registerForm.reset();
  hide(authError);
}

// ---------- Enter App ----------
function enterApp() {
  hide(authScreen);
  show(appScreen);
  setUserInfo();
  switchView('dashboard');
  requestNotificationPermission();
  connectWebSocket();
  loadTasks();
}

function setUserInfo() {
  const name = (currentUser && currentUser.username) || 'User';
  const initial = name.charAt(0).toUpperCase();

  welcomeUser.textContent = '👋 ' + name;
  document.getElementById('sideName').textContent = name;
  document.getElementById('sideAvatar').textContent = initial;
  document.getElementById('settingsUsername').textContent = name;
  document.getElementById('settingsEmail').textContent =
      (currentUser && currentUser.email) || '—';
}

// ---------- View Switching ----------
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => switchView(item.dataset.view));
});

function switchView(view) {
  currentView = view;

  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.view === view);
  });

  if (view === 'dashboard') {
    show(statsSection); show(toolbarSection); show(taskList);
    hide(viewAnalytics); hide(viewSettings);
    pageTitle.textContent = 'Dashboard';
    pageSub.textContent = "Here's what's on your plate today";
    renderTasks();
  }
  else if (view === 'tasks') {
    hide(statsSection); show(toolbarSection); show(taskList);
    hide(viewAnalytics); hide(viewSettings);
    pageTitle.textContent = 'My Tasks';
    pageSub.textContent = 'All your tasks in one place';
    renderTasks();
  }
  else if (view === 'analytics') {
  hide(statsSection);
  hide(toolbarSection);
  hide(taskList);
  hide(emptyState);

  show(viewAnalytics);
  hide(viewSettings);

  pageTitle.textContent = 'Analytics';
  pageSub.textContent = 'Insights about your productivity';

  updateAnalytics();
  updateAnalyticsChart();
}
  else if (view === 'settings') {
    hide(statsSection); hide(toolbarSection); hide(taskList); hide(emptyState);
    hide(viewAnalytics); show(viewSettings);
    pageTitle.textContent = 'Settings';
    pageSub.textContent = 'Manage your account and preferences';
  }
}

// ---------- Load Tasks ----------
async function loadTasks() {
  try {
    tasks = await api('/tasks', { headers: authHeaders() });
    renderTasks();
    updateAnalytics();
  } catch (err) {
    showToast(err.message);
  }
}

// ---------- Render ----------
function renderTasks() {
  if (currentView !== 'dashboard' && currentView !== 'tasks') return;

  const search = document.getElementById('searchInput').value.trim().toLowerCase();
  const fStatus = document.getElementById('filterStatus').value;
  const fPrio   = document.getElementById('filterPriority').value;

  const filtered = tasks.filter(t => {
    if (fStatus && t.status !== fStatus) return false;
    if (fPrio && t.priority !== fPrio) return false;
    if (search) {
      const blob = [t.title, t.description, t.category, t.tags]
        .filter(Boolean).join(' ').toLowerCase();
      if (!blob.includes(search)) return false;
    }
    return true;
  });

  document.getElementById('statTotal').textContent = tasks.length;
  document.getElementById('statPending').textContent =
      tasks.filter(t => t.status === 'PENDING').length;
  document.getElementById('statProgress').textContent =
      tasks.filter(t => t.status === 'IN_PROGRESS').length;
  document.getElementById('statCompleted').textContent =
      tasks.filter(t => t.status === 'COMPLETED').length;

  taskList.innerHTML = '';
  if (filtered.length === 0) { show(emptyState); return; }
  hide(emptyState);

  filtered.forEach(task => {
    const card = document.createElement('div');
    card.className = 'task-card';

    const statusLabel = {
      PENDING: 'Pending', IN_PROGRESS: 'In Progress', COMPLETED: 'Completed'
    }[task.status] || task.status;

    const priorityLabel = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' }[task.priority] || task.priority;

    const due = task.dueDate ? `<span>📅 ${task.dueDate}</span>` : '';
    const cat = task.category ? `<span>🏷️ ${escapeHtml(task.category)}</span>` : '';
    const tags = task.tags ? `<span>#️⃣ ${escapeHtml(task.tags)}</span>` : '';

    card.innerHTML = `
      <div class="task-header">
        <div class="task-title ${task.status === 'COMPLETED' ? 'done' : ''}">
          ${escapeHtml(task.title)}
        </div>
        <div class="badges">
          <span class="badge prio-${task.priority}">${priorityLabel}</span>
        </div>
      </div>
      ${task.description ? `<div class="task-desc">${escapeHtml(task.description)}</div>` : ''}
      <div class="badges">
        <span class="badge status-${task.status}">${statusLabel}</span>
      </div>
      <div class="task-meta">${due}${cat}${tags}</div>
      <div class="task-actions">
        <button data-action="toggle" data-id="${task.id}">
          ${task.status === 'COMPLETED' ? '↺ Reopen' : '✓ Complete'}
        </button>
        <button data-action="edit" data-id="${task.id}">✎ Edit</button>
        <button data-action="delete" data-id="${task.id}">🗑 Delete</button>
      </div>
    `;
    taskList.appendChild(card);
  });

  taskList.querySelectorAll('button[data-action]').forEach(btn => {
    btn.addEventListener('click', () => handleTaskAction(btn.dataset.action, Number(btn.dataset.id)));
  });
}

function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ---------- Task actions ----------
async function handleTaskAction(action, id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  if (action === 'edit') { openTaskModal(task); return; }

  if (action === 'delete') {
    if (!confirm('Delete this task?')) return;
    try {
      await api('/tasks/' + id, { method: 'DELETE', headers: authHeaders() });
      tasks = tasks.filter(t => t.id !== id);
      renderTasks();
      showToast('Task deleted');
    } catch (err) { showToast(err.message); }
    return;
  }

  if (action === 'toggle') {
    const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      const updated = await api(`/tasks/${id}/status?value=${newStatus}`, {
        method: 'PATCH', headers: authHeaders()
      });
      tasks = tasks.map(t => t.id === id ? updated : t);
      renderTasks();
      showToast('Status updated');
    } catch (err) { showToast(err.message); }
  }
}

// ---------- Modal ----------
const addTaskBtn  = document.getElementById('addTaskBtn');
const cancelTask  = document.getElementById('cancelTask');
const cancelTaskX = document.getElementById('cancelTaskX');

addTaskBtn.addEventListener('click', () => openTaskModal(null));
cancelTask.addEventListener('click', closeTaskModal);
cancelTaskX.addEventListener('click', closeTaskModal);
taskModal.addEventListener('click', (e) => {
  if (e.target === taskModal) closeTaskModal();
});

function openTaskModal(task) {
  editingId = task ? task.id : null;
  modalTitle.textContent = task ? 'Edit Task' : 'New Task';
  document.getElementById('taskId').value = task ? task.id : '';
  document.getElementById('taskTitle').value = task ? task.title : '';
  document.getElementById('taskDescription').value = task ? (task.description || '') : '';
  document.getElementById('taskStatus').value = task ? task.status : 'PENDING';
  document.getElementById('taskPriority').value = task ? task.priority : 'MEDIUM';
  document.getElementById('taskDueDate').value = task && task.dueDate ? task.dueDate : '';
  document.getElementById('taskCategory').value = task ? (task.category || '') : '';
  document.getElementById('taskTags').value = task ? (task.tags || '') : '';
  show(taskModal);
}

function closeTaskModal() {
  hide(taskModal);
  editingId = null;
  taskForm.reset();
}

taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    title: document.getElementById('taskTitle').value.trim(),
    description: document.getElementById('taskDescription').value.trim() || null,
    status: document.getElementById('taskStatus').value,
    priority: document.getElementById('taskPriority').value,
    dueDate: document.getElementById('taskDueDate').value || null,
    category: document.getElementById('taskCategory').value.trim() || null,
    tags: document.getElementById('taskTags').value.trim() || null
  };

  try {
    if (editingId) {
      const updated = await api('/tasks/' + editingId, {
        method: 'PUT', headers: authHeaders(), body: JSON.stringify(payload)
      });
      tasks = tasks.map(t => t.id === editingId ? updated : t);
      showToast('Task updated');
    } else {
      const created = await api('/tasks', {
        method: 'POST', headers: authHeaders(), body: JSON.stringify(payload)
      });
      tasks.unshift(created);
      showToast('Task created');
    }
    closeTaskModal();
    renderTasks();
  } catch (err) {
    showToast(err.message);
  }
});

// ---------- Filters ----------
['searchInput', 'filterStatus', 'filterPriority'].forEach(id => {
  document.getElementById(id).addEventListener('input', renderTasks);
});

// ---------- WebSocket ----------
function connectWebSocket() {
  if (!token) return;
  const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
  const url = `${proto}//${location.host}/ws/tasks?token=${encodeURIComponent(token)}`;
  try {
    ws = new WebSocket(url);
    ws.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        const verb = {
          CREATED: 'created', UPDATED: 'updated',
          STATUS_CHANGED: 'status changed', DELETED: 'deleted'
        }[msg.event] || msg.event;
        notifyBrowser('TaskFlow', `A task was ${verb} elsewhere.`);
        loadTasks();
      } catch {}
    };
    ws.onclose = () => { if (token) setTimeout(connectWebSocket, 3000); };
    ws.onerror = () => {};
  } catch (e) { console.error('WS error', e); }
}

// ---------- Browser Notifications ----------
function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().catch(() => {});
  }
}
function notifyBrowser(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    try { new Notification(title, { body }); } catch {}
  }
}

// ---------- Boot ----------
(function init() {
  applyTheme(localStorage.getItem('tf_theme') || 'light');
  if (token && currentUser) {
    enterApp();
  } else {
    show(authScreen);
  }
})();

(function init() {
  applyTheme(localStorage.getItem('tf_theme') || 'light');
  if (token && currentUser) {
    enterApp();
  } else {
    show(authScreen);
  }
})();

// ============================================================
// ANALYTICS
// ============================================================

function updateAnalytics() {

  const total = tasks.length;

  const completed = tasks.filter(
    t => t.status === 'COMPLETED'
  ).length;

  const pending = tasks.filter(
    t => t.status === 'PENDING'
  ).length;

  const inProgress = tasks.filter(
    t => t.status === 'IN_PROGRESS'
  ).length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdue = tasks.filter(t => {

    if (!t.dueDate || t.status === 'COMPLETED') {
      return false;
    }

    const due = new Date(t.dueDate);
    due.setHours(0, 0, 0, 0);

    return due < today;
  }).length;


  const completionRate = total > 0
    ? Math.round((completed / total) * 100)
    : 0;


  // Summary cards
  const totalEl = document.getElementById('analyticsTotal');
  const completedEl = document.getElementById('analyticsCompleted');
  const pendingEl = document.getElementById('analyticsPending');
  const overdueEl = document.getElementById('analyticsOverdue');

  if (totalEl) totalEl.textContent = total;
  if (completedEl) completedEl.textContent = completed;
  if (pendingEl) pendingEl.textContent = pending;
  if (overdueEl) overdueEl.textContent = overdue;


  // Completion rate
  const rateEl = document.getElementById('completionRate');

  if (rateEl) {
    rateEl.textContent = completionRate + '%';
  }


  // Circle
  const circle = document.getElementById('completionCircle');

  if (circle) {
    circle.style.background =
      `conic-gradient(
        #6366f1 ${completionRate}%,
        rgba(148,163,184,0.16) ${completionRate}% 100%
      )`;
  }


  // Performance
  const performanceCompleted =
    document.getElementById('performanceCompleted');

  const performanceProgress =
    document.getElementById('performanceProgress');

  const performancePending =
    document.getElementById('performancePending');


  if (performanceCompleted) {
    performanceCompleted.textContent = completed;
  }

  if (performanceProgress) {
    performanceProgress.textContent = inProgress;
  }

  if (performancePending) {
    performancePending.textContent = pending;
  }


  // Performance bars
  const completedBar =
    document.getElementById('performanceCompletedBar');

  const progressBar =
    document.getElementById('performanceProgressBar');

  const pendingBar =
    document.getElementById('performancePendingBar');


  if (total > 0) {

    if (completedBar) {
      completedBar.style.width =
        `${(completed / total) * 100}%`;
    }

    if (progressBar) {
      progressBar.style.width =
        `${(inProgress / total) * 100}%`;
    }

    if (pendingBar) {
      pendingBar.style.width =
        `${(pending / total) * 100}%`;
    }

  } else {

    if (completedBar) completedBar.style.width = '0%';
    if (progressBar) progressBar.style.width = '0%';
    if (pendingBar) pendingBar.style.width = '0%';

  }
}


// ---------- Analytics Period ----------

function updateAnalyticsChart() {

  const chartColumns =
    document.querySelectorAll('.chart-column');

  if (!chartColumns.length) return;

  // No tasks = empty chart
  if (!tasks || tasks.length === 0) {

    chartColumns.forEach((column, index) => {

      column.classList.toggle(
        'month-hidden',
        analyticsPeriod === 'month' && index >= 4
      );

      const bar = column.querySelector('.chart-bar');
      const label = column.querySelector('span');

      if (bar) {
        bar.style.height = '0%';
      }

      if (label) {
        if (analyticsPeriod === 'week') {
          label.textContent =
            ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index] || '';
        } else {
          label.textContent =
            ['Week 1', 'Week 2', 'Week 3', 'Week 4'][index] || '';
        }
      }
    });

    return;
  }


  // ==========================================================
  // THIS WEEK
  // ==========================================================

  if (analyticsPeriod === 'week') {

    const today = new Date();

    // Monday = start of current week
    const startOfWeek = new Date(today);
    const day = today.getDay();

    const diff = day === 0 ? -6 : 1 - day;

    startOfWeek.setDate(today.getDate() + diff);
    startOfWeek.setHours(0, 0, 0, 0);


    const weeklyLabels = [
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun'
    ];


    // Count tasks completed on each day
    const completedByDay = [0, 0, 0, 0, 0, 0, 0];

    tasks.forEach(task => {

      if (
        task.status !== 'COMPLETED' ||
        !task.updatedAt
      ) {
        return;
      }

      const completedDate =
        new Date(task.updatedAt);

      if (isNaN(completedDate.getTime())) {
        return;
      }

      completedDate.setHours(0, 0, 0, 0);


      const diffDays =
        Math.floor(
          (completedDate - startOfWeek) /
          (1000 * 60 * 60 * 24)
        );


      if (diffDays >= 0 && diffDays < 7) {
        completedByDay[diffDays]++;
      }

    });


    // Maximum completed tasks on any day
    const maxCompleted =
      Math.max(...completedByDay, 1);


    chartColumns.forEach((column, index) => {

      column.classList.remove('month-hidden');

      const bar =
        column.querySelector('.chart-bar');

      const label =
        column.querySelector('span');


      // Convert actual count to percentage
      const percentage =
        Math.round(
          (completedByDay[index] / maxCompleted) * 100
        );


      if (bar) {
        bar.style.height =
          `${percentage}%`;

        // Keep a tiny visible bar for days with 0 tasks
        if (completedByDay[index] === 0) {
          bar.style.height = '4%';
        }
      }


      if (label) {
        label.textContent =
          weeklyLabels[index] || '';
      }

    });

  }


  // ==========================================================
  // THIS MONTH
  // ==========================================================

  else {

    const monthlyLabels = [
      'Week 1',
      'Week 2',
      'Week 3',
      'Week 4'
    ];

    const completedByWeek =
      [0, 0, 0, 0];


    const today = new Date();

    const currentYear =
      today.getFullYear();

    const currentMonth =
      today.getMonth();


    tasks.forEach(task => {

      if (
        task.status !== 'COMPLETED' ||
        !task.updatedAt
      ) {
        return;
      }


      const completedDate =
        new Date(task.updatedAt);


      if (isNaN(completedDate.getTime())) {
        return;
      }


      if (
        completedDate.getFullYear() !== currentYear ||
        completedDate.getMonth() !== currentMonth
      ) {
        return;
      }


      const date =
        completedDate.getDate();


      let weekIndex;

      if (date <= 7) {
        weekIndex = 0;
      } else if (date <= 14) {
        weekIndex = 1;
      } else if (date <= 21) {
        weekIndex = 2;
      } else {
        weekIndex = 3;
      }


      completedByWeek[weekIndex]++;

    });


    const maxCompleted =
      Math.max(...completedByWeek, 1);


    chartColumns.forEach((column, index) => {

      if (index < 4) {

        column.classList.remove('month-hidden');

        const bar =
          column.querySelector('.chart-bar');

        const label =
          column.querySelector('span');


        const percentage =
          Math.round(
            (completedByWeek[index] / maxCompleted) * 100
          );


        if (bar) {
          bar.style.height =
            completedByWeek[index] === 0
              ? '4%'
              : `${percentage}%`;
        }


        if (label) {
          label.textContent =
            monthlyLabels[index];
        }

      } else {

        column.classList.add('month-hidden');

      }

    });

  }

}


// ---------- Analytics Toggle ----------

const weekBtn =
  document.getElementById('weekBtn');

const monthBtn =
  document.getElementById('monthBtn');


if (weekBtn) {

  weekBtn.addEventListener('click', () => {

    analyticsPeriod = 'week';

    weekBtn.classList.add('active');

    if (monthBtn) {
      monthBtn.classList.remove('active');
    }

    updateAnalyticsChart();

  });

}


if (monthBtn) {

  monthBtn.addEventListener('click', () => {

    analyticsPeriod = 'month';

    monthBtn.classList.add('active');

    if (weekBtn) {
      weekBtn.classList.remove('active');
    }

    updateAnalyticsChart();

  });

}