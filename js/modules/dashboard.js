/* ==========================================================================
   MODULE 1: DASHBOARD
   ========================================================================== */

import { dbStore } from '../store.js';
import { AIEngine } from '../aiEngine.js';

export function renderDashboard() {
  const metrics = dbStore.getDashboardMetrics();
  const expenses = dbStore.getTable('Expenses').slice(-5).reverse();
  const aiTip = AIEngine.processQuery('default tip');

  const budgetPct = metrics.totalAllocatedBudget > 0 
    ? Math.min(100, Math.round((metrics.monthExpenses / metrics.totalAllocatedBudget) * 100))
    : 0;

  let progressColorClass = 'green';
  if (budgetPct >= 90) progressColorClass = 'rose';
  else if (budgetPct >= 70) progressColorClass = 'amber';

  const currentUser = dbStore.getCurrentUser();
  const userName = currentUser ? currentUser.name : 'Financial Explorer';

  const isINR = metrics.currency === '₹';
  const coffeeAmt = isINR ? 50 : 4.50;
  const lunchAmt = isINR ? 150 : 12.00;
  const groceryAmt = isINR ? 500 : 45.00;
  const uberAmt = isINR ? 200 : 15.00;

  return `
    <div class="page-view animate-fade-in">
      <!-- PERSONALIZED DASHBOARD GREETING -->
      <div style="margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 16px;">
        <h1 style="font-size: 24px; font-weight: 800; color: var(--text-primary); margin-bottom: 4px;">Welcome back, ${userName} 👋</h1>
        <p style="font-size: 13px; color: var(--text-secondary);">Here is your live daily financial status for ${metrics.currentMonthName} ${metrics.currentYear}</p>
      </div>

      <!-- AI Insight Banner with Inline Chat Bar -->
      <div style="background: var(--accent-indigo-light); border: 1px solid var(--accent-indigo); border-radius: var(--radius-lg); padding: 18px 20px; margin-bottom: 24px;">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-indigo), var(--accent-violet)); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; flex-shrink: 0;">✨</div>
            <div>
              <div style="font-size: 14px; font-weight: 700; color: var(--accent-indigo); margin-bottom: 2px;">${aiTip.title}</div>
              <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.4;">${aiTip.text.replace(/\*\*/g, '')}</div>
            </div>
          </div>
          <button onclick="window.openAIDrawer()" class="btn-primary" style="padding: 8px 14px; font-size: 12px; flex-shrink: 0;">Open Drawer</button>
        </div>

        <!-- Inline AI Question Bar -->
        <form onsubmit="window.handleInlineAISubmit(event)" style="display: flex; gap: 8px;">
          <input type="text" id="dashboard-ai-input" placeholder="Ask AI anything (e.g. Can I buy a watch for $150?)" class="form-input" style="flex: 1; height: 40px; font-size: 13px; background: var(--bg-surface);">
          <button type="submit" class="btn-primary" style="height: 40px; font-size: 13px; padding: 0 16px; white-space: nowrap;">Ask AI ✨</button>
        </form>
      </div>

      <!-- Stat Cards Grid -->
      <div class="card-grid card-grid-4" style="margin-bottom: 24px;">
        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Monthly Income</span>
            <div class="stat-icon emerald">💵</div>
          </div>
          <div class="stat-value">${metrics.currency}${metrics.monthIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          <div class="stat-subtext"><span class="trend-up">↑ Total paycheck & extra</span></div>
        </div>

        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Monthly Expenses</span>
            <div class="stat-icon rose">💸</div>
          </div>
          <div class="stat-value">${metrics.currency}${metrics.monthExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          <div class="stat-subtext">Total tracked spending</div>
        </div>

        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Savings & Goal Fund</span>
            <div class="stat-icon violet">🏦</div>
          </div>
          <div class="stat-value" style="color: var(--accent-violet);">${metrics.currency}${metrics.monthSavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          <div class="stat-subtext">Deducted into savings</div>
        </div>

        <div class="stat-card" style="border: 2px solid var(--accent-emerald);">
          <div class="stat-card-header">
            <span class="stat-card-title" style="color: var(--accent-emerald);">Net Available Cash</span>
            <div class="stat-icon emerald">🎯</div>
          </div>
          <div class="stat-value" style="color: var(--accent-emerald);">${metrics.currency}${metrics.netAvailableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          <div class="stat-subtext">Income - Expenses - Savings</div>
        </div>
      </div>

      <!-- Budget Progress Meter -->
      <div class="budget-meter-card">
        <div class="meter-header">
          <div>
            <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 4px;">Overall Budget & Cash Health</h3>
            <p style="font-size: 13px; color: var(--text-secondary);">
              Spent ${metrics.currency}${metrics.monthExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })} of ${metrics.totalAllocatedBudget > 0 ? `${metrics.currency}${metrics.totalAllocatedBudget.toLocaleString()} allocated budget` : `${metrics.currency}${metrics.monthIncome.toLocaleString()} income`}. 
              <strong style="color: var(--accent-emerald);">Net Cash Left: ${metrics.currency}${metrics.netAvailableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
            </p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 18px; font-weight: 800; color: var(--text-primary);">${metrics.currency}${metrics.monthExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })} / ${metrics.currency}${(metrics.totalAllocatedBudget > 0 ? metrics.totalAllocatedBudget : metrics.monthIncome).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <div style="font-size: 12px; color: var(--accent-emerald); font-weight: 700;">${metrics.currency}${metrics.netAvailableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} Available</div>
          </div>
        </div>
        <div class="progress-track">
          <div class="progress-fill ${progressColorClass}" style="width: ${budgetPct}%;"></div>
        </div>
      </div>

      <!-- 1-Tap Quick Action Hub -->
      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 14px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">⚡ 1-Tap Quick Log (< 10s)</h3>
        <div class="quick-action-hub">
          <div class="quick-chip" onclick="window.quickLogExpense('Dining', ${coffeeAmt}, 'Coffee')">☕ Coffee ${metrics.currency}${coffeeAmt}</div>
          <div class="quick-chip" onclick="window.quickLogExpense('Dining', ${lunchAmt}, 'Lunch')">🥗 Lunch ${metrics.currency}${lunchAmt}</div>
          <div class="quick-chip" onclick="window.quickLogExpense('Shopping', ${groceryAmt}, 'Grocery Run')">🛒 Grocery ${metrics.currency}${groceryAmt}</div>
          <div class="quick-chip" onclick="window.quickLogExpense('Transport', ${uberAmt}, 'Uber Ride')">🚗 Uber ${metrics.currency}${uberAmt}</div>
          <div class="quick-chip" onclick="window.openQuickAddModal()" style="border-style: dashed; color: var(--accent-indigo); border-color: var(--accent-indigo);">+ Custom Entry</div>
        </div>
      </div>

      <!-- Recent Activity Table -->
      <div class="card-table-wrapper">
        <div class="table-title-bar">
          <h3 style="font-size: 16px; font-weight: 700;">Recent Transactions <span style="font-size: 11px; color: var(--accent-indigo); font-weight: 600; margin-left: 4px;">(↔ Swipe)</span></h3>
          <button onclick="window.switchTab('expenses')" style="background: none; border: none; color: var(--accent-indigo); font-weight: 600; font-size: 13px; cursor: pointer;">View All →</button>
        </div>
        <div class="table-scroll-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Merchant / Source</th>
                <th>Category</th>
                <th>Method</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${expenses.length === 0 ? `
                <tr><td colspan="5" class="empty-state">No expenses recorded yet. Tap + to add one!</td></tr>
              ` : expenses.map(item => `
                <tr>
                  <td>${item.date}</td>
                  <td style="font-weight: 600;">${item.merchant || 'Expense'}</td>
                  <td><span class="badge badge-indigo">${item.category}</span></td>
                  <td style="color: var(--text-muted);">${item.payment_method || 'Card'}</td>
                  <td style="text-align: right; font-weight: 700; color: var(--accent-rose);">- ${metrics.currency}${parseFloat(item.amount).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
