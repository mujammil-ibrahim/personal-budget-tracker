/* ==========================================================================
   MODULE 6: FINANCIAL GOALS
   ========================================================================== */

import { dbStore } from '../store.js';

export function renderGoals() {
  const goals = dbStore.getTable('Goals');
  const metrics = dbStore.getDashboardMetrics();

  return `
    <div class="page-view animate-fade-in">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h2 style="font-size: 22px; font-weight: 800;">Financial Goals</h2>
          <p style="font-size: 13px; color: var(--text-secondary);">Set short & long-term targets to stay motivated</p>
        </div>
        <button onclick="window.openAddGoalModal()" class="btn-primary">+ Add New Goal</button>
      </div>

      <div class="card-grid card-grid-2">
        ${goals.length === 0 ? `
          <div class="empty-state" style="grid-column: 1 / -1;">No financial goals created yet. Set a target like "Emergency Fund" or "Vacation"!</div>
        ` : goals.map(goal => {
          const current = parseFloat(goal.current_amount || 0);
          const target = parseFloat(goal.target_amount || 1);
          const pct = Math.min(100, Math.round((current / target) * 100));
          const remaining = Math.max(0, target - current);

          let priorityBadge = '<span class="badge badge-emerald">Low Priority</span>';
          if (goal.priority === 'High') priorityBadge = '<span class="badge badge-rose">High Priority</span>';
          else if (goal.priority === 'Medium') priorityBadge = '<span class="badge badge-amber">Medium Priority</span>';

          return `
            <div class="stat-card">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <div>
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                    <h3 style="font-size: 17px; font-weight: 700;">${goal.title}</h3>
                    ${priorityBadge}
                  </div>
                  <p style="font-size: 12px; color: var(--text-muted);">Target Date: ${goal.target_date || 'No Date'}</p>
                </div>
                <div style="text-align: right;">
                  <span style="font-size: 22px; font-weight: 800; color: var(--accent-emerald);">${pct}%</span>
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; margin-bottom: 8px;">
                <span>Saved: ${metrics.currency}${current.toLocaleString()}</span>
                <span style="color: var(--text-secondary);">Target: ${metrics.currency}${target.toLocaleString()}</span>
              </div>

              <div class="progress-track" style="height: 10px; margin-bottom: 14px;">
                <div class="progress-fill green" style="width: ${pct}%;"></div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 12px; color: var(--text-muted);">${remaining > 0 ? `${metrics.currency}${remaining.toLocaleString()} remaining` : 'Goal Completed! 🎉'}</span>
                <button onclick="window.openDepositSavingsModal('${goal.id}')" class="btn-primary btn-emerald" style="padding: 6px 12px; font-size: 12px;">+ Add Funds</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}
