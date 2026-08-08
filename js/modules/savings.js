/* ==========================================================================
   MODULE 5: SAVINGS TRACKER
   ========================================================================== */

import { dbStore } from '../store.js';

export function renderSavings() {
  const savings = dbStore.getTable('Savings').slice().reverse();
  const goals = dbStore.getTable('Goals');
  const metrics = dbStore.getDashboardMetrics();

  const savingsRate = metrics.monthIncome > 0 
    ? ((metrics.totalSavings / metrics.monthIncome) * 100).toFixed(1)
    : 0;

  return `
    <div class="page-view animate-fade-in">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h2 style="font-size: 22px; font-weight: 800;">Savings Fund</h2>
          <p style="font-size: 13px; color: var(--text-secondary);">Build wealth and fund your future milestones</p>
        </div>
        <button onclick="window.openDepositSavingsModal()" class="btn-primary btn-emerald">+ Quick Savings Deposit</button>
      </div>

      <div class="card-grid card-grid-3" style="margin-bottom: 24px;">
        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Total Funds Saved</span>
            <div class="stat-icon emerald">🏦</div>
          </div>
          <div class="stat-value" style="color: var(--accent-emerald);">${metrics.currency}${metrics.totalSavings.toLocaleString()}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Savings Rate</span>
            <div class="stat-icon violet">📈</div>
          </div>
          <div class="stat-value">${savingsRate}%</div>
          <div class="stat-subtext">of total monthly income</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Active Goals Funded</span>
            <div class="stat-icon indigo">🎯</div>
          </div>
          <div class="stat-value">${goals.length}</div>
        </div>
      </div>

      <div class="card-table-wrapper">
        <div style="padding: 16px 20px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
          <h3 style="font-size: 16px; font-weight: 700;">Savings Deposit History</h3>
          <span style="font-size: 11px; color: var(--accent-indigo); font-weight: 600;">(↔ Swipe table)</span>
        </div>
        <div class="table-scroll-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Goal Allocated</th>
                <th>Notes</th>
                <th style="text-align: right;">Deposit Amount</th>
                <th style="text-align: center;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${savings.length === 0 ? `
                <tr><td colspan="5" class="empty-state">No deposits logged yet. Tap + Quick Savings Deposit!</td></tr>
              ` : savings.map(sav => {
                const matchedGoal = goals.find(g => g.id === sav.goal_id);
                return `
                  <tr>
                    <td>${sav.deposit_date}</td>
                    <td style="font-weight: 600;">${matchedGoal ? matchedGoal.title : 'General Savings'}</td>
                    <td style="color: var(--text-secondary); font-size: 13px;">${sav.notes || '-'}</td>
                    <td style="text-align: right; font-weight: 700; color: var(--accent-emerald);">+ ${metrics.currency}${parseFloat(sav.amount).toFixed(2)}</td>
                    <td style="text-align: center;">
                      <button onclick="window.deleteRecord('Savings', '${sav.id}')" style="background: none; border: none; color: var(--accent-rose); cursor: pointer; font-size: 14px;">🗑️</button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
