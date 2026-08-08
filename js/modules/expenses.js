/* ==========================================================================
   MODULE 3: EXPENSES TRACKER (< 10-Second Quick Entry Focus)
   ========================================================================== */

import { dbStore } from '../store.js';

export function renderExpenses() {
  const expenses = dbStore.getTable('Expenses').slice().reverse();
  const metrics = dbStore.getDashboardMetrics();

  return `
    <div class="page-view animate-fade-in">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h2 style="font-size: 22px; font-weight: 800;">Expense History</h2>
          <p style="font-size: 13px; color: var(--text-secondary);">Track daily spending and transaction details</p>
        </div>
        <button onclick="window.openQuickAddModal()" class="btn-primary">+ Add Expense (< 10s)</button>
      </div>

      <!-- Expense Summary Row -->
      <div class="card-grid card-grid-3" style="margin-bottom: 24px;">
        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Total Expenses</span>
            <div class="stat-icon rose">💸</div>
          </div>
          <div class="stat-value" style="color: var(--accent-rose);">${metrics.currency}${metrics.monthExpenses.toLocaleString()}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Transactions Logged</span>
            <div class="stat-icon indigo">🧾</div>
          </div>
          <div class="stat-value">${expenses.length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Avg. Expense / Day</span>
            <div class="stat-icon amber">📉</div>
          </div>
          <div class="stat-value">${metrics.currency}${(metrics.monthExpenses / 30).toFixed(2)}</div>
        </div>
      </div>

      <!-- Filter Controls & Data Table -->
      <div class="card-table-wrapper">
        <div style="padding: 16px 20px; border-bottom: 1px solid var(--border-color); display: flex; gap: 12px; flex-wrap: wrap; justify-content: space-between; align-items: center;">
          <div style="display: flex; gap: 12px; flex-wrap: wrap; flex: 1;">
            <input type="text" id="expense-search" placeholder="Search merchant..." class="form-input" style="max-width: 220px; height: 38px; font-size: 13px;" onkeyup="window.filterExpenses()">
            <select id="expense-cat-filter" class="form-select" style="max-width: 180px; height: 38px; font-size: 13px;" onchange="window.filterExpenses()">
              <option value="">All Categories</option>
              <option value="Dining">Dining & Food</option>
              <option value="Rent">Rent & Housing</option>
              <option value="Utilities">Utilities & Bills</option>
              <option value="Shopping">Shopping & Clothes</option>
              <option value="Transport">Transport & Fuel</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Health">Health & Fitness</option>
            </select>
          </div>
          <span style="font-size: 11px; color: var(--accent-indigo); font-weight: 600;">(↔ Swipe table)</span>
        </div>

        <div class="table-scroll-wrapper">
          <table class="data-table" id="expenses-table">
            <thead>
              <tr>
                <th style="width: 36px; text-align: center;"><input type="checkbox" onchange="window.toggleSelectAllRows('Expenses', this)" class="master-select-checkbox" title="Select All"></th>
                <th>Date</th>
                <th>Merchant / Item</th>
                <th>Category</th>
                <th>Payment Method</th>
                <th>Notes</th>
                <th style="text-align: right;">Amount</th>
                <th style="text-align: center;">Action</th>
              </tr>
            </thead>
            <tbody id="expenses-tbody">
              ${expenses.length === 0 ? `
                <tr><td colspan="8" class="empty-state">No expense records found.</td></tr>
              ` : expenses.map(exp => `
                <tr>
                  <td style="text-align: center;"><input type="checkbox" value="${exp.id}" onchange="window.onRowSelectChange('Expenses', this)" class="row-select-checkbox"></td>
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
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
