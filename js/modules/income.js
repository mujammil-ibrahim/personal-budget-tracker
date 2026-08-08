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
        <button onclick="window.openIncomeModal()" class="btn-primary btn-emerald">+ Add Income Stream</button>
      </div>

      <!-- Fixed Monthly Salary Settings Card -->
      <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 18px 20px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; box-shadow: var(--shadow-sm);">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="font-size: 24px;">🔄</div>
          <div>
            <h3 style="font-size: 15px; font-weight: 700;">Fixed Monthly Salary / Paycheck</h3>
            <p style="font-size: 12px; color: var(--text-muted);">Automatically credited at the start of every month</p>
          </div>
        </div>
        <form onsubmit="window.handleSalaryUpdateSubmit(event)" style="display: flex; gap: 8px; align-items: center;">
          <span style="font-size: 16px; font-weight: 700;">${metrics.currency}</span>
          <input type="number" step="0.01" id="fixed-salary-input" value="${metrics.fixedSalary || 4200}" class="form-input" style="width: 140px; height: 38px; font-size: 14px; font-weight: 700;" required>
          <button type="submit" class="btn-primary btn-emerald" style="height: 38px; font-size: 13px; white-space: nowrap;">Save Fixed Salary</button>
        </form>
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
          <table class="data-table" id="income-table">
            <thead>
              <tr>
                <th style="width: 36px; text-align: center;"><input type="checkbox" onchange="window.toggleSelectAllRows('Income', this)" class="master-select-checkbox" title="Select All"></th>
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
                <tr><td colspan="8" class="empty-state">No income records found. Add your salary or bonus!</td></tr>
              ` : incomes.map(inc => `
                <tr>
                  <td style="text-align: center;"><input type="checkbox" value="${inc.id}" onchange="window.onRowSelectChange('Income', this)" class="row-select-checkbox"></td>
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
