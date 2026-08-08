/* ==========================================================================
   MODULE 4: BUDGET PLANNER
   ========================================================================== */

import { dbStore } from '../store.js';

export function renderBudget() {
  const curMonth = new Date().getMonth() + 1;
  const curYear = new Date().getFullYear();
  const budgets = dbStore.getTable('Budgets').filter(b => b.month === curMonth && b.year === curYear);
  const metrics = dbStore.getDashboardMetrics();

  return `
    <div class="page-view animate-fade-in">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
        <div>
          <h2 style="font-size: 22px; font-weight: 800;">Monthly Budgets</h2>
          <p style="font-size: 13px; color: var(--text-secondary);">Set category limits & pick your preferred budgeting rule</p>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button onclick="window.openStrategyModal()" class="btn-primary btn-emerald" style="font-size: 13px;">✨ Auto-Set Strategy</button>
          <button onclick="window.undoResetBudgets()" class="btn-primary" style="background: var(--bg-surface-elevated); color: var(--text-primary); border: 1px solid var(--border-color); font-size: 13px;" title="Reset or Undo Auto Budgets">↺ Reset / Undo</button>
          <button onclick="window.openAddBudgetModal()" class="btn-primary" style="font-size: 13px;">+ New Budget</button>
        </div>
      </div>

      <div class="card-grid card-grid-3" style="margin-bottom: 24px;">
        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Total Allocated</span>
            <div class="stat-icon indigo">🎯</div>
          </div>
          <div class="stat-value">${metrics.currency}${metrics.totalAllocatedBudget.toLocaleString()}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Total Spent So Far</span>
            <div class="stat-icon rose">💸</div>
          </div>
          <div class="stat-value">${metrics.currency}${metrics.monthExpenses.toLocaleString()}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Unallocated Cash</span>
            <div class="stat-icon emerald">💵</div>
          </div>
          <div class="stat-value">${metrics.currency}${Math.max(0, metrics.monthIncome - metrics.totalAllocatedBudget).toLocaleString()}</div>
        </div>
      </div>

      <!-- Category Budget Cards Grid -->
      <div class="card-grid card-grid-2">
        ${budgets.length === 0 ? `
          <div class="empty-state" style="grid-column: 1 / -1;">No category budgets set for this month. Tap "Auto-Set 50/30/20" to get started instantly!</div>
        ` : budgets.map(b => {
          const allocated = parseFloat(b.allocated_amount || 0);
          const spent = parseFloat(b.spent_amount || 0);
          const remaining = allocated - spent;
          const pct = allocated > 0 ? Math.min(100, Math.round((spent / allocated) * 100)) : 0;
          
          let fillClass = 'green';
          let statusBadge = '<span class="badge badge-emerald">On Track</span>';
          if (pct >= 100) {
            fillClass = 'rose';
            statusBadge = '<span class="badge badge-rose">Over Budget!</span>';
          } else if (pct >= 80) {
            fillClass = 'amber';
            statusBadge = '<span class="badge badge-amber">Near Limit</span>';
          }

          return `
            <div class="stat-card">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div style="font-size: 20px;">🏷️</div>
                  <div>
                    <h3 style="font-size: 16px; font-weight: 700;">${b.category}</h3>
                    <p style="font-size: 12px; color: var(--text-muted);">${statusBadge}</p>
                  </div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 16px; font-weight: 800;">${metrics.currency}${spent.toFixed(2)} / ${metrics.currency}${allocated.toFixed(2)}</div>
                  <div style="font-size: 12px; color: ${remaining >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)'}; font-weight: 600;">
                    ${remaining >= 0 ? `${metrics.currency}${remaining.toFixed(2)} left` : `Exceeded by ${metrics.currency}${Math.abs(remaining).toFixed(2)}`}
                  </div>
                </div>
              </div>

              <div class="progress-track" style="height: 10px;">
                <div class="progress-fill ${fillClass}" style="width: ${pct}%;"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}
