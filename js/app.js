/* ==========================================================================
   MONEY COMPANION - MAIN APPLICATION CONTROLLER
   ========================================================================== */

import { dbStore } from './store.js';
import { AIEngine } from './aiEngine.js';

import { renderDashboard } from './modules/dashboard.js';
import { renderIncome } from './modules/income.js';
import { renderExpenses } from './modules/expenses.js';
import { renderBudget } from './modules/budget.js';
import { renderSavings } from './modules/savings.js';
import { renderGoals } from './modules/goals.js';
import { renderWishlist } from './modules/wishlist.js';
import { renderReports } from './modules/reports.js';
import { renderSettings } from './modules/settings.js';
import { renderLandingPage } from './modules/landing.js';

// State
let currentTab = 'landing';

// --- Tab Switcher & Navigation ---
window.switchTab = function(tabName) {
  const isLoggedIn = dbStore.isLoggedIn();

  // If not logged in, enforce landing auth page
  if (!isLoggedIn && tabName !== 'landing') {
    tabName = 'landing';
  }

  currentTab = tabName;

  if (!isLoggedIn) {
    document.body.classList.add('auth-mode');
  } else {
    document.body.classList.remove('auth-mode');
  }

  // Sync Currency Dropdown
  const settings = dbStore.getTable('Settings')[0];
  const topCurrencySelect = document.getElementById('top-currency-select');
  if (topCurrencySelect && settings) {
    topCurrencySelect.value = settings.currency_symbol || '$';
  }

  // Update Nav Active State
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.tab === tabName);
  });

  // Render View Content
  const container = document.getElementById('page-content');
  switch(tabName) {
    case 'landing': container.innerHTML = renderLandingPage(); break;
    case 'dashboard': container.innerHTML = renderDashboard(); break;
    case 'income': container.innerHTML = renderIncome(); break;
    case 'expenses': container.innerHTML = renderExpenses(); break;
    case 'budget': container.innerHTML = renderBudget(); break;
    case 'savings': container.innerHTML = renderSavings(); break;
    case 'goals': container.innerHTML = renderGoals(); break;
    case 'wishlist': container.innerHTML = renderWishlist(); break;
    case 'reports': container.innerHTML = renderReports(); break;
    case 'settings': container.innerHTML = renderSettings(); break;
    default: container.innerHTML = renderDashboard();
  }

  if (isLoggedIn) updateUserHeader();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.handleLogout = function() {
  dbStore.logout();
  alert('🚪 Logged out successfully!');
  window.switchTab('landing');
};

// --- Instant Currency Changer ---
window.changeCurrency = function(newSymbol) {
  const settings = dbStore.getTable('Settings')[0];
  if (settings) {
    dbStore.updateItem('Settings', settings.id, { currency_symbol: newSymbol });
  }
  const users = dbStore.getTable('Users')[0];
  if (users) {
    dbStore.updateItem('Users', users.id, { currency: newSymbol });
  }

  // Sync Settings tab select if visible
  const settingSelect = document.getElementById('setting-currency');
  if (settingSelect) settingSelect.value = newSymbol;

  // Instant re-render
  window.switchTab(currentTab);
};

// --- Theme Manager ---
window.toggleTheme = function() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  window.setThemeFromSettings(newTheme);
};

window.setThemeFromSettings = function(themeName) {
  document.documentElement.setAttribute('data-theme', themeName);
  
  const iconBtn = document.getElementById('theme-toggle-btn');
  if (iconBtn) iconBtn.textContent = themeName === 'dark' ? '🌙' : '☀️';

  const settings = dbStore.getTable('Settings')[0];
  if (settings) dbStore.updateItem('Settings', settings.id, { theme: themeName });

  if (currentTab === 'settings') window.switchTab('settings');
};

// --- Quick Add Modal (< 10-Second Entry System) ---
window.openQuickAddModal = function() {
  const metrics = dbStore.getDashboardMetrics();
  const symbolEl = document.getElementById('qa-amount-currency');
  if (symbolEl) symbolEl.textContent = metrics.currency;
  document.getElementById('quick-add-modal').classList.add('active');
  document.getElementById('qa-amount').focus();
};

window.closeQuickAddModal = function() {
  document.getElementById('quick-add-modal').classList.remove('active');
};

window.selectQACategory = function(element, categoryName) {
  document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('selected'));
  element.classList.add('selected');
  document.getElementById('qa-selected-category').value = categoryName;
};

window.quickLogExpense = function(category, amount, merchant = '') {
  dbStore.addItem('Expenses', {
    amount: parseFloat(amount),
    category,
    merchant,
    date: new Date().toISOString().split('T')[0],
    payment_method: 'Card',
    notes: '1-Tap Quick Log'
  });
  window.switchTab(currentTab);
};

window.handleQuickAddSubmit = function(e) {
  e.preventDefault();
  const amount = parseFloat(document.getElementById('qa-amount').value);
  const merchant = document.getElementById('qa-merchant').value.trim() || 'General Expense';
  const category = document.getElementById('qa-selected-category').value || 'Dining';
  const paymentMethod = document.getElementById('qa-payment-method').value;

  if (isNaN(amount) || amount <= 0) return alert('Please enter a valid amount!');

  dbStore.addItem('Expenses', {
    amount,
    merchant,
    category,
    payment_method: paymentMethod,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  window.closeQuickAddModal();
  document.getElementById('qa-amount').value = '';
  document.getElementById('qa-merchant').value = '';
  window.switchTab(currentTab);
};

// --- Income Modal ---
window.openIncomeModal = function() {
  document.getElementById('income-modal').classList.add('active');
};

window.closeIncomeModal = function() {
  document.getElementById('income-modal').classList.remove('active');
};

window.handleSalaryUpdateSubmit = function(e) {
  e.preventDefault();
  const amount = parseFloat(document.getElementById('fixed-salary-input').value);
  if (isNaN(amount) || amount < 0) return alert('Please enter a valid salary amount!');

  dbStore.updateFixedSalary(amount);
  alert('Fixed Monthly Salary updated successfully! It will automatically credit every month.');
  window.switchTab(currentTab);
};

window.handleIncomeSubmit = function(e) {
  e.preventDefault();
  const amount = parseFloat(document.getElementById('inc-amount').value);
  const source_name = document.getElementById('inc-source').value.trim() || 'Salary';
  const category = document.getElementById('inc-category').value;
  const recurrence = document.getElementById('inc-recurrence').value;

  if (isNaN(amount) || amount <= 0) return alert('Please enter a valid income amount!');

  dbStore.addItem('Income', {
    amount,
    source_name,
    category,
    recurrence,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  window.closeIncomeModal();
  window.switchTab(currentTab);
};

// --- Custom Budget Allocation Modal ---
window.openStrategyModal = function() {
  document.getElementById('budget-strategy-modal').classList.add('active');
};

window.closeStrategyModal = function() {
  document.getElementById('budget-strategy-modal').classList.remove('active');
};

window.handleStrategySubmit = function(e) {
  e.preventDefault();
  const strategy = document.getElementById('budget-strategy-select').value;
  dbStore.autoSetBudgetStrategy(strategy);
  window.closeStrategyModal();
  alert('✨ Budget strategy applied successfully based on your monthly income!');
  window.switchTab(currentTab);
};

window.undoResetBudgets = function() {
  if (confirm('Are you sure you want to reset and clear all budget limits for this month? You can auto-set any budget strategy again anytime!')) {
    dbStore.resetCurrentMonthBudgets();
    alert('↺ Monthly budgets reset successfully!');
    window.switchTab(currentTab);
  }
};

window.openAddBudgetModal = function() {
  document.getElementById('add-budget-modal').classList.add('active');
};

window.closeAddBudgetModal = function() {
  document.getElementById('add-budget-modal').classList.remove('active');
};

window.handleBudgetSubmit = function(e) {
  e.preventDefault();
  const category = document.getElementById('b-category').value;
  const allocated_amount = parseFloat(document.getElementById('b-allocated').value);

  if (isNaN(allocated_amount) || allocated_amount <= 0) return alert('Please enter a valid budget amount!');

  const curMonth = new Date().getMonth() + 1;
  const curYear = new Date().getFullYear();

  const existing = dbStore.getTable('Budgets').find(b => b.category === category && b.month === curMonth && b.year === curYear);
  if (existing) {
    dbStore.updateItem('Budgets', existing.id, { allocated_amount });
  } else {
    dbStore.addItem('Budgets', { month: curMonth, year: curYear, category, allocated_amount, spent_amount: 0 });
  }

  window.closeAddBudgetModal();
  window.switchTab(currentTab);
};

// --- Savings Deposit Modal ---
window.openDepositSavingsModal = function(goalId = '') {
  const modal = document.getElementById('savings-modal');
  modal.classList.add('active');
  const goalSelect = document.getElementById('sav-goal-id');
  if (goalId && goalSelect) goalSelect.value = goalId;
};

window.closeSavingsModal = function() {
  document.getElementById('savings-modal').classList.remove('active');
};

window.handleSavingsSubmit = function(e) {
  e.preventDefault();
  const amount = parseFloat(document.getElementById('sav-amount').value);
  const goal_id = document.getElementById('sav-goal-id').value;

  if (isNaN(amount) || amount <= 0) return alert('Please enter a valid deposit amount!');

  dbStore.addItem('Savings', {
    amount,
    goal_id,
    deposit_date: new Date().toISOString().split('T')[0],
    notes: 'Direct deposit'
  });

  // Update target goal current amount
  if (goal_id) {
    const goal = dbStore.getTable('Goals').find(g => g.id === goal_id);
    if (goal) {
      dbStore.updateItem('Goals', goal_id, { current_amount: parseFloat(goal.current_amount || 0) + amount });
    }
  }

  window.closeSavingsModal();
  window.switchTab(currentTab);
};

// --- Add Financial Goal Modal ---
window.openAddGoalModal = function() {
  document.getElementById('goal-modal').classList.add('active');
};

window.closeGoalModal = function() {
  document.getElementById('goal-modal').classList.remove('active');
};

window.handleGoalSubmit = function(e) {
  e.preventDefault();
  const title = document.getElementById('g-title').value.trim();
  const target_amount = parseFloat(document.getElementById('g-target').value);
  const target_date = document.getElementById('g-date').value || '';
  const priority = document.getElementById('g-priority').value;

  if (!title || isNaN(target_amount) || target_amount <= 0) return alert('Please enter valid goal details!');

  dbStore.addItem('Goals', {
    title,
    target_amount,
    current_amount: 0,
    target_date,
    category: 'General',
    priority,
    status: 'active'
  });

  window.closeGoalModal();
  window.switchTab(currentTab);
};

// --- Wishlist Modal & Evaluator ---
window.openAddWishlistModal = function() {
  document.getElementById('wishlist-modal').classList.add('active');
};

window.closeWishlistModal = function() {
  document.getElementById('wishlist-modal').classList.remove('active');
};

window.handleWishlistSubmit = function(e) {
  e.preventDefault();
  const item_name = document.getElementById('wl-item-name').value.trim();
  const price = parseFloat(document.getElementById('wl-item-price').value);
  const buy_timing = document.getElementById('wl-buy-timing') ? document.getElementById('wl-buy-timing').value : 'month';
  const category = document.getElementById('wl-category').value;
  const urgency = document.getElementById('wl-urgency').value;

  if (!item_name || isNaN(price)) return alert('Please enter valid item details!');

  dbStore.addItem('Wishlist', { item_name, price, category, buy_timing, urgency, status: 'wishing' });
  window.closeWishlistModal();
  window.switchTab(currentTab);
};

window.markItemAsPurchased = function(itemId, itemName, defaultPrice) {
  const method = prompt(`Marking "${itemName}" as Purchased!\nSelect Payment Method:\n1 = Card\n2 = UPI\n3 = Cash\n4 = Bank Transfer`, '1');
  if (method === null) return; // User cancelled

  let paymentMethod = 'Card';
  if (method === '2') paymentMethod = 'UPI';
  else if (method === '3') paymentMethod = 'Cash';
  else if (method === '4') paymentMethod = 'Bank Transfer';

  dbStore.markWishlistPurchased(itemId, paymentMethod, defaultPrice);
  alert(`🎉 "${itemName}" marked as Purchased! It has been automatically added to your Expenses table.`);
  window.switchTab(currentTab);
};

window.saveGroceryNotes = function() {
  const text = document.getElementById('grocery-notes-input')?.value || '';
  const settings = dbStore.getTable('Settings')[0];
  if (settings) {
    dbStore.updateItem('Settings', settings.id, { grocery_notes: text });
  }
  alert('Grocery & Household notes saved!');
};

window.logGroceryAsExpense = function() {
  const amountStr = prompt('Enter Total Amount spent on Groceries:', '45.00');
  if (!amountStr) return;
  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) return alert('Invalid amount!');

  dbStore.addItem('Expenses', {
    amount,
    merchant: 'Grocery Store Run',
    category: 'Dining',
    payment_method: 'Card',
    date: new Date().toISOString().split('T')[0],
    notes: document.getElementById('grocery-notes-input')?.value || 'Grocery checklist'
  });

  alert(`🛒 Grocery Expense logged successfully! Added to Expenses.`);
  window.switchTab(currentTab);
};

window.evaluatePurchase = function() {
  const name = document.getElementById('eval-item-name').value.trim() || 'Item';
  const price = parseFloat(document.getElementById('eval-item-price').value);

  const resultBox = document.getElementById('eval-result-box');
  if (isNaN(price) || price <= 0) {
    resultBox.style.display = 'block';
    resultBox.style.background = 'var(--accent-amber-light)';
    resultBox.style.color = 'var(--accent-amber)';
    resultBox.innerHTML = '⚠️ Please enter a valid price to evaluate feasibility.';
    return;
  }

  const evalResult = AIEngine.processQuery('can i buy this', { type: 'can_i_buy', price, itemName: name });
  
  resultBox.style.display = 'block';
  if (evalResult.status === 'emerald') {
    resultBox.style.background = 'var(--accent-emerald-light)';
    resultBox.style.color = 'var(--accent-emerald)';
  } else if (evalResult.status === 'amber') {
    resultBox.style.background = 'var(--accent-amber-light)';
    resultBox.style.color = 'var(--accent-amber)';
  } else {
    resultBox.style.background = 'var(--accent-rose-light)';
    resultBox.style.color = 'var(--accent-rose)';
  }

  resultBox.innerHTML = `<strong>${evalResult.title}</strong><br/>${evalResult.text.replace(/\*\*/g, '')}`;
};

// --- Budget Auto Allocation (50/30/20 Helper) ---
window.autoAllocateBudgets = function() {
  const metrics = dbStore.getDashboardMetrics();
  const monthlySalary = metrics.monthIncome || 4000;
  
  const curMonth = new Date().getMonth() + 1;
  const curYear = new Date().getFullYear();

  const standardAllocations = [
    { category: 'Rent', pct: 0.30 },
    { category: 'Dining', pct: 0.12 },
    { category: 'Utilities', pct: 0.08 },
    { category: 'Shopping', pct: 0.10 },
    { category: 'Transport', pct: 0.08 },
    { category: 'Entertainment', pct: 0.07 }
  ];

  standardAllocations.forEach(alloc => {
    const allocated_amount = Math.round(monthlySalary * alloc.pct);
    const existing = dbStore.getTable('Budgets').find(b => b.category === alloc.category && b.month === curMonth && b.year === curYear);
    if (existing) {
      dbStore.updateItem('Budgets', existing.id, { allocated_amount });
    } else {
      dbStore.addItem('Budgets', { month: curMonth, year: curYear, category: alloc.category, allocated_amount, spent_amount: 0 });
    }
  });

  window.switchTab(currentTab);
};

// --- AI Companion Drawer Engine & Interactive Custom Messaging ---
window.openAIDrawer = function() {
  document.getElementById('ai-drawer').classList.add('open');
  setTimeout(() => {
    const input = document.getElementById('ai-custom-input');
    if (input) input.focus();
  }, 200);
};

window.closeAIDrawer = function() {
  document.getElementById('ai-drawer').classList.remove('open');
};

window.handleInlineAISubmit = function(e) {
  e.preventDefault();
  const inputEl = document.getElementById('dashboard-ai-input');
  const text = inputEl ? inputEl.value.trim() : '';
  if (!text) return;
  
  window.openAIDrawer();
  window.sendAIQuery(text);
  if (inputEl) inputEl.value = '';
};

// --- Multi-User Account Authentication & Account Switcher Engine ---
function updateUserHeader() {
  const user = dbStore.getCurrentUser();
  const greetingEl = document.getElementById('top-user-greeting');
  if (greetingEl && user) {
    greetingEl.innerText = `Welcome back, ${user.name.split(' ')[0]} 👋`;
  }
}

window.openAuthModal = function() {
  document.getElementById('auth-modal').classList.add('active');
  window.switchAuthTab('switch');
  renderAccountList();
};

window.closeAuthModal = function() {
  document.getElementById('auth-modal').classList.remove('active');
};

window.switchAuthTab = function(tab) {
  ['login', 'register', 'switch'].forEach(t => {
    const form = document.getElementById(`auth-form-${t}`);
    const tabBtn = document.getElementById(`auth-tab-${t}`);
    if (form) form.style.display = t === tab ? 'block' : 'none';
    if (tabBtn) {
      if (t === tab) {
        tabBtn.classList.add('active');
        tabBtn.style.background = 'var(--accent-indigo)';
        tabBtn.style.color = '#fff';
      } else {
        tabBtn.classList.remove('active');
        tabBtn.style.background = 'var(--bg-surface-elevated)';
        tabBtn.style.color = 'var(--text-secondary)';
      }
    }
  });

  if (tab === 'switch') renderAccountList();
};

function renderAccountList() {
  const container = document.getElementById('account-switcher-list');
  if (!container) return;
  const users = dbStore.getAllUsers();
  const activeUser = dbStore.getCurrentUser();

  container.innerHTML = users.map(u => {
    const isActive = u.id === activeUser.id;
    return `
      <div onclick="window.switchAccountTo('${u.id}')" style="background: ${isActive ? 'var(--accent-indigo-light)' : 'var(--bg-surface-elevated)'}; border: 1px solid ${isActive ? 'var(--accent-indigo)' : 'var(--border-color)'}; padding: 12px 16px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-indigo), var(--accent-violet)); color: #fff; font-weight: 700; display: flex; align-items: center; justify-content: center; font-size: 14px;">
            ${u.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style="font-size: 14px; font-weight: 700;">${u.name} ${isActive ? '🟢 Active' : ''}</div>
            <div style="font-size: 12px; color: var(--text-muted);">${u.email}</div>
          </div>
        </div>
        <button class="btn-primary" style="font-size: 11px; padding: 4px 10px; background: ${isActive ? 'var(--accent-emerald)' : 'var(--accent-indigo)'};">
          ${isActive ? 'Selected' : 'Switch ➔'}
        </button>
      </div>
    `;
  }).join('');
}

window.switchAccountTo = function(userId) {
  dbStore.setActiveUserId(userId);
  updateUserHeader();
  window.closeAuthModal();
  alert(`✨ Switched to ${dbStore.getCurrentUser().name}'s account!`);
  window.switchTab(currentTab);
};

window.handleLoginSubmit = function(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const pass = document.getElementById('login-password').value;

  const user = dbStore.login(email, pass);
  if (user) {
    updateUserHeader();
    window.closeAuthModal();
    alert(`🎉 Successfully logged in as ${user.name}!`);
    window.switchTab(currentTab);
  } else {
    alert('❌ Invalid Email or Password. Try again or select from Registered Accounts!');
  }
};

window.openLandingPage = function() {
  window.switchTab('landing');
};

window.enterDemoMode = function() {
  dbStore.setActiveUserId('u_1');
  alert('⚡ Welcome to Demo Mode! Logged in as Alex Rivera.');
  window.switchTab('dashboard');
};

window.handleLandingLoginSubmit = function(e) {
  e.preventDefault();
  const email = document.getElementById('l-login-email').value;
  const pass = document.getElementById('l-login-password').value;

  const user = dbStore.login(email, pass);
  if (user) {
    alert(`🎉 Successfully logged in as ${user.name}!`);
    window.switchTab('dashboard');
  } else {
    alert('❌ Invalid Email or Password. Try Demo Mode or Register a new account!');
  }
};

window.handleLandingRegisterSubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('l-reg-name').value.trim();
  const email = document.getElementById('l-reg-email').value.trim();
  const pass = document.getElementById('l-reg-password').value;
  const salary = document.getElementById('l-reg-salary').value;

  const result = dbStore.register(name, email, pass, salary);
  if (result.error) {
    alert(`❌ ${result.error}`);
  } else {
    alert(`🎉 Welcome ${name}! Your new account has been created.`);
    window.switchTab('dashboard');
  }
};

window.handleRegisterSubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass = document.getElementById('reg-password').value;
  const salary = document.getElementById('reg-salary').value;

  const result = dbStore.register(name, email, pass, salary);
  if (result.error) {
    alert(`❌ ${result.error}`);
  } else {
    updateUserHeader();
    window.closeAuthModal();
    alert(`🎉 Welcome ${name}! Your new account has been created and set as active.`);
    window.switchTab(currentTab);
  }
};

window.handleAIChatSubmit = function(e) {
  e.preventDefault();
  const inputEl = document.getElementById('ai-custom-input');
  const text = inputEl ? inputEl.value.trim() : '';
  if (!text) return;
  
  window.sendAIQuery(text);
  if (inputEl) inputEl.value = '';
};

window.sendAIQuery = function(promptText) {
  const chatBody = document.getElementById('ai-chat-body');
  
  // User Bubble
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble user';
  userBubble.textContent = promptText;
  chatBody.appendChild(userBubble);

  // AI Response
  const response = AIEngine.processQuery(promptText);

  setTimeout(() => {
    const aiBubble = document.createElement('div');
    aiBubble.className = 'chat-bubble ai';
    aiBubble.innerHTML = `<strong>${response.title}</strong><br/>${response.text.replace(/\*\*/g, '')}`;
    chatBody.appendChild(aiBubble);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 200);

  chatBody.scrollTop = chatBody.scrollHeight;
};

// --- Generic Table Delete ---
window.deleteRecord = function(tableName, id) {
  if (confirm(`Are you sure you want to delete this ${tableName.toLowerCase()} entry?`)) {
    dbStore.deleteItem(tableName, id);
    window.switchTab(currentTab);
  }
};

// --- Expenses Filter ---
window.filterExpenses = function() {
  const searchVal = (document.getElementById('expense-search')?.value || '').toLowerCase();
  const catVal = document.getElementById('expense-cat-filter')?.value || '';

  const expenses = dbStore.getTable('Expenses').filter(exp => {
    const matchesSearch = (exp.merchant || '').toLowerCase().includes(searchVal) || (exp.notes || '').toLowerCase().includes(searchVal);
    const matchesCat = catVal === '' || exp.category === catVal;
    return matchesSearch && matchesCat;
  }).reverse();

  const tbody = document.getElementById('expenses-tbody');
  const metrics = dbStore.getDashboardMetrics();

  if (!tbody) return;

  if (expenses.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty-state">No matching transactions found.</td></tr>`;
  } else {
    tbody.innerHTML = expenses.map(exp => `
      <tr>
        <td>${exp.date}</td>
        <td style="font-weight: 600;">${exp.merchant || 'Expense'}</td>
        <td><span class="badge badge-indigo">${exp.category}</span></td>
        <td style="color: var(--text-muted);">${exp.payment_method || 'Card'}</td>
        <td style="color: var(--text-secondary); font-size: 13px;">${exp.notes || '-'}</td>
        <td style="text-align: right; font-weight: 700; color: var(--accent-rose);">- ${metrics.currency}${parseFloat(exp.amount).toFixed(2)}</td>
        <td style="text-align: center;">
          <button onclick="window.deleteRecord('Expenses', '${exp.id}')" style="background: none; border: none; color: var(--accent-rose); cursor: pointer; font-size: 14px;">🗑️</button>
        </td>
      </tr>
    `).join('');
  }
};

// --- User Settings Save ---
window.saveUserSettings = function(e) {
  e.preventDefault();
  const currency_symbol = document.getElementById('setting-currency').value;
  const daily_spending_limit = parseFloat(document.getElementById('setting-daily-limit').value);
  const ai_persona_tone = document.getElementById('setting-ai-tone').value;

  const settings = dbStore.getTable('Settings')[0];
  if (settings) {
    dbStore.updateItem('Settings', settings.id, { currency_symbol, daily_spending_limit, ai_persona_tone });
  }

  alert('Settings saved successfully!');
  window.switchTab(currentTab);
};

// Global Hotkeys (Press '+' for Quick Add Modal)
document.addEventListener('keydown', (e) => {
  if (e.key === '+' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
    window.openQuickAddModal();
  }
});

// App Startup
document.addEventListener('DOMContentLoaded', () => {
  const settings = dbStore.getTable('Settings')[0];
  if (settings && settings.theme) {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }
  window.switchTab('landing');
});
