/* ==========================================================================
   MODULE 8: REPORTS & ANALYTICS
   ========================================================================== */

import { dbStore } from '../store.js';

export function renderReports() {
  const metrics = dbStore.getDashboardMetrics();
  const expenses = dbStore.getTable('Expenses');
  const currency = metrics.currency;

  const curMonth = new Date().getMonth() + 1;
  const curYear = new Date().getFullYear();

  // Filter current month expenses
  const currentExpenses = dbStore.getTable('Expenses').filter(e => {
    const d = dbStore.parseLocalDate(e.date);
    return (d.getMonth() + 1) === curMonth && d.getFullYear() === curYear;
  });

  // Calculate current month category totals
  const categoryTotals = {};
  currentExpenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + parseFloat(e.amount || 0);
  });

  const categories = Object.keys(categoryTotals);
  const totalExpense = currentExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0) || 1;

  // Generate SVG Donut Chart slices
  const colors = ['#6366F1', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6', '#06B6D4', '#EC4899'];
  let cumulativeAngle = 0;

  const donutSlices = categories.map((cat, i) => {
    const amt = categoryTotals[cat];
    const percentage = amt / totalExpense;
    const angle = percentage * 360;

    const x1 = 100 + 70 * Math.cos((Math.PI * cumulativeAngle) / 180);
    const y1 = 100 + 70 * Math.sin((Math.PI * cumulativeAngle) / 180);
    
    cumulativeAngle += angle;
    
    const x2 = 100 + 70 * Math.cos((Math.PI * cumulativeAngle) / 180);
    const y2 = 100 + 70 * Math.sin((Math.PI * cumulativeAngle) / 180);

    const largeArcFlag = angle > 180 ? 1 : 0;
    const color = colors[i % colors.length];

    return { cat, amt, percentage, color, path: `M 100 100 L ${x1} ${y1} A 70 70 0 ${largeArcFlag} 1 ${x2} ${y2} Z` };
  });

  return `
    <div class="page-view animate-fade-in">
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 22px; font-weight: 800;">Visual Financial Reports</h2>
        <p style="font-size: 13px; color: var(--text-secondary);">Understand spending patterns and monthly cash flow</p>
      </div>

      <div class="card-grid card-grid-2" style="margin-bottom: 24px;">
        <!-- Category Breakdown SVG Chart -->
        <div class="stat-card">
          <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 16px;">Spending by Category</h3>
          <div style="display: flex; align-items: center; justify-content: space-around; flex-wrap: wrap; gap: 20px;">
            <div style="position: relative; width: 180px; height: 180px;">
              <svg viewBox="0 0 200 200" width="180" height="180">
                ${categories.length === 0 ? `<circle cx="100" cy="100" r="70" fill="var(--bg-surface-elevated)" />` : donutSlices.map(s => `
                  <path d="${s.path}" fill="${s.color}" />
                `).join('')}
                <circle cx="100" cy="100" r="45" fill="var(--bg-surface)" />
              </svg>
              <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <span style="font-size: 11px; color: var(--text-muted); font-weight: 600;">TOTAL</span>
                <span style="font-size: 16px; font-weight: 800;">${currency}${metrics.monthExpenses.toFixed(0)}</span>
              </div>
            </div>

            <!-- Legend -->
            <div style="display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 140px;">
              ${donutSlices.map(s => `
                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 13px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: ${s.color}; inline-block;"></span>
                    <span style="font-weight: 500;">${s.cat}</span>
                  </div>
                  <span style="font-weight: 700;">${(s.percentage * 100).toFixed(0)}%</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Income vs Expense Bar Comparison -->
        <div class="stat-card">
          <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 16px;">Cash Flow Balance</h3>
          <div style="display: flex; flex-direction: column; gap: 20px; padding: 10px 0;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; margin-bottom: 6px;">
                <span style="color: var(--accent-emerald);">Total Income</span>
                <span>${currency}${metrics.monthIncome.toLocaleString()}</span>
              </div>
              <div class="progress-track" style="height: 14px;">
                <div class="progress-fill green" style="width: 100%;"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; margin-bottom: 6px;">
                <span style="color: var(--accent-rose);">Total Expenses</span>
                <span>${currency}${metrics.monthExpenses.toLocaleString()}</span>
              </div>
              <div class="progress-track" style="height: 14px;">
                <div class="progress-fill rose" style="width: ${metrics.monthIncome > 0 ? Math.min(100, (metrics.monthExpenses / metrics.monthIncome) * 100) : 0}%;"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; margin-bottom: 6px;">
                <span style="color: var(--accent-indigo);">Savings & Surplus</span>
                <span>${currency}${Math.max(0, metrics.monthIncome - metrics.monthExpenses).toLocaleString()}</span>
              </div>
              <div class="progress-track" style="height: 14px;">
                <div class="progress-fill indigo" style="width: ${metrics.monthIncome > 0 ? Math.min(100, ((metrics.monthIncome - metrics.monthExpenses) / metrics.monthIncome) * 100) : 0}%;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
