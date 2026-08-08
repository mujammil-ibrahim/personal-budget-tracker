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

  return `
    <div class="page-view animate-fade-in">
      <!-- AI Insight Banner -->
      <div style="background: var(--accent-indigo-light); border: 1px solid var(--accent-indigo); border-radius: var(--radius-lg); padding: 16px 20px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-indigo), var(--accent-violet)); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; flex-shrink: 0;">✨</div>
          <div>
            <div style="font-size: 14px; font-weight: 700; color: var(--accent-indigo); margin-bottom: 2px;">${aiTip.title}</div>
            <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.4;">${aiTip.text.replace(/\*\*/g, '')}</div>
          </div>
        </div>
        <button onclick="window.openAIDrawer()" class="btn-primary" style="padding: 8px 14px; font-size: 12px; flex-shrink: 0;">Ask Companion</button>
      </div>

      <!-- Stat Cards Grid -->
      <div class="card-grid card-grid-4">
        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Monthly Income</span>
            <div class="stat-icon emerald">💵</div>
          </div>
          <div class="stat-value">${metrics.currency}${metrics.monthIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          <div class="stat-subtext"><span class="trend-up">↑ Salary & Extra</span> this month</div>
        </div>

        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Monthly Spent</span>
            <div class="stat-icon rose">💸</div>
          </div>
          <div class="stat-value">${metrics.currency}${metrics.monthExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          <div class="stat-subtext">Total tracked spending</div>
        </div>

        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Budget Remaining</span>
            <div class="stat-icon indigo">⚖️</div>
          </div>
          <div class="stat-value">${metrics.currency}${metrics.remainingBudget.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          <div class="stat-subtext">${100 - budgetPct}% of budget remaining</div>
        </div>

        <div class="stat-card" style="border: 2px solid var(--accent-emerald);">
          <div class="stat-card-header">
            <span class="stat-card-title" style="color: var(--accent-emerald);">Daily Limit</span>
            <div class="stat-icon emerald">🎯</div>
          </div>
          <div class="stat-value" style="color: var(--accent-emerald);">${metrics.currency}${metrics.safeDailyLimit}</div>
          <div class="stat-subtext">Safe allowance for ${metrics.remainingDays} days</div>
        </div>
      </div>

      <!-- Budget Progress Meter -->
      <div class="budget-meter-card">
        <div class="meter-header">
          <div>
            <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 4px;">Overall Budget Health</h3>
            <p style="font-size: 13px; color: var(--text-secondary);">You've used ${budgetPct}% of your allocated monthly budget</p>
          </div>
          <div style="font-size: 18px; font-weight: 800; color: var(--text-primary);">${metrics.currency}${metrics.monthExpenses} / ${metrics.currency}${metrics.totalAllocatedBudget}</div>
        </div>
        <div class="progress-track">
          <div class="progress-fill ${progressColorClass}" style="width: ${budgetPct}%;"></div>
        </div>
      </div>

      <!-- 1-Tap Quick Action Hub -->
      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 14px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">⚡ 1-Tap Quick Log (< 10s)</h3>
        <div class="quick-action-hub">
          <div class="quick-chip" onclick="window.quickLogExpense('Dining', 4.50, 'Coffee')">☕ Coffee ${metrics.currency}4.50</div>
          <div class="quick-chip" onclick="window.quickLogExpense('Dining', 12.00, 'Lunch Deal')">🥗 Lunch ${metrics.currency}12.00</div>
          <div class="quick-chip" onclick="window.quickLogExpense('Shopping', 45.00, 'Grocery Run')">🛒 Grocery ${metrics.currency}45.00</div>
          <div class="quick-chip" onclick="window.quickLogExpense('Transport', 15.00, 'Uber Ride')">🚗 Uber ${metrics.currency}15.00</div>
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
