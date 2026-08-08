/* ==========================================================================
   MODULE 2: INCOME TRACKER
   ========================================================================== */

import { dbStore } from '../store.js';

export function renderIncome() {
  const incomes = dbStore.getTable('Income');
  const metrics = dbStore.getDashboardMetrics();

  return `
    <div class="page-view animate-fade-in">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h2 style="font-size: 22px; font-weight: 800;">Income Streams</h2>
          <p style="font-size: 13px; color: var(--text-secondary);">Manage salary, side hustles, and additional income</p>
        </div>
        <button onclick="window.openIncomeModal()" class="btn-primary btn-emerald">+ Add Income</button>
      </div>

      <div class="card-grid card-grid-3" style="margin-bottom: 24px;">
        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Total Income (This Month)</span>
            <div class="stat-icon emerald">💰</div>
          </div>
          <div class="stat-value" style="color: var(--accent-emerald);">${metrics.currency}${metrics.monthIncome.toLocaleString()}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Active Income Streams</span>
            <div class="stat-icon indigo">📊</div>
          </div>
          <div class="stat-value">${incomes.length}</div>
        </div>
      </div>

      <div class="card-table-wrapper">
        <div class="table-title-bar">
          <h3 style="font-size: 16px; font-weight: 700;">Income Log <span style="font-size: 11px; color: var(--accent-indigo); font-weight: 600; margin-left: 4px;">(↔ Swipe)</span></h3>
        </div>
        <div class="table-scroll-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Source Name</th>
                <th>Category</th>
                <th>Type</th>
                <th>Notes</th>
                <th style="text-align: right;">Amount</th>
                <th style="text-align: center;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${incomes.length === 0 ? `
                <tr><td colspan="7" class="empty-state">No income records found. Add your salary or bonus!</td></tr>
              ` : incomes.map(inc => `
                <tr>
                  <td>${inc.date}</td>
                  <td style="font-weight: 600;">${inc.source_name}</td>
                  <td><span class="badge badge-emerald">${inc.category}</span></td>
                  <td><span class="badge badge-indigo">${inc.recurrence}</span></td>
                  <td style="color: var(--text-secondary); font-size: 13px;">${inc.notes || '-'}</td>
                  <td style="text-align: right; font-weight: 700; color: var(--accent-emerald);">+ ${metrics.currency}${parseFloat(inc.amount).toFixed(2)}</td>
                  <td style="text-align: center;">
                    <button onclick="window.deleteRecord('Income', '${inc.id}')" style="background: none; border: none; color: var(--accent-rose); cursor: pointer; font-size: 14px;">🗑️</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
