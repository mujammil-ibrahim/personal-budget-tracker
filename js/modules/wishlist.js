/* ==========================================================================
   MODULE 7: SHOPPING LIST, GROCERY PLANNER & WISHLIST
   ========================================================================== */

import { dbStore } from '../store.js';
import { AIEngine } from '../aiEngine.js';

let activeTimingFilter = 'all';

export function renderWishlist() {
  const allWishlist = dbStore.getTable('Wishlist');
  const metrics = dbStore.getDashboardMetrics();
  const settings = dbStore.getTable('Settings')[0] || {};
  const groceryNotes = settings.grocery_notes || 'Milk (2L), Organic Eggs (12pk), Olive Oil, Whole Wheat Bread, Avocados';

  // Filter items by timing
  const items = allWishlist.filter(item => {
    if (activeTimingFilter === 'purchased') return item.status === 'purchased';
    if (item.status === 'purchased') return false; // hide purchased in active planning views
    if (activeTimingFilter === 'all') return true;
    return (item.buy_timing || 'month') === activeTimingFilter;
  });

  const nowCount = allWishlist.filter(w => w.status !== 'purchased' && (w.buy_timing === 'now' || w.buy_timing === 'today')).length;
  const weekCount = allWishlist.filter(w => w.status !== 'purchased' && w.buy_timing === 'week').length;
  const monthCount = allWishlist.filter(w => w.status !== 'purchased' && (w.buy_timing === 'month' || !w.buy_timing)).length;
  const yearCount = allWishlist.filter(w => w.status !== 'purchased' && w.buy_timing === 'year').length;

  return `
    <div class="page-view animate-fade-in">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
        <div>
          <h2 style="font-size: 22px; font-weight: 800;">Shopping List & Purchase Planner</h2>
          <p style="font-size: 13px; color: var(--text-secondary);">Plan purchases (Today, This Week, Month, Year) & auto-add to expenses when bought</p>
        </div>
        <button onclick="window.openAddWishlistModal()" class="btn-primary">+ Add Planned Item</button>
      </div>

      <!-- Quick Summary Stat Cards -->
      <div class="card-grid card-grid-4" style="margin-bottom: 20px;">
        <div class="stat-card" style="padding: 16px;">
          <div style="font-size: 12px; color: var(--text-muted); font-weight: 600;">⚡ BUY TODAY</div>
          <div style="font-size: 24px; font-weight: 800; color: var(--accent-rose);">${nowCount} items</div>
        </div>
        <div class="stat-card" style="padding: 16px;">
          <div style="font-size: 12px; color: var(--text-muted); font-weight: 600;">📅 THIS WEEK</div>
          <div style="font-size: 24px; font-weight: 800; color: var(--accent-amber);">${weekCount} items</div>
        </div>
        <div class="stat-card" style="padding: 16px;">
          <div style="font-size: 12px; color: var(--text-muted); font-weight: 600;">📆 THIS MONTH</div>
          <div style="font-size: 24px; font-weight: 800; color: var(--accent-indigo);">${monthCount} items</div>
        </div>
        <div class="stat-card" style="padding: 16px;">
          <div style="font-size: 12px; color: var(--text-muted); font-weight: 600;">🗓️ THIS YEAR</div>
          <div style="font-size: 24px; font-weight: 800; color: var(--accent-violet);">${yearCount} items</div>
        </div>
      </div>

      <!-- Grocery Notes & Quick Logger Section -->
      <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 20px; margin-bottom: 24px; box-shadow: var(--shadow-sm);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 22px;">🛒</span>
            <div>
              <h3 style="font-size: 16px; font-weight: 700;">Grocery & Household Checklist</h3>
              <p style="font-size: 12px; color: var(--text-muted);">Keep notes for groceries & log to expenses in 1 tap</p>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button onclick="window.saveGroceryNotes()" class="btn-primary btn-emerald" style="padding: 6px 12px; font-size: 12px;">Save Notes</button>
            <button onclick="window.logGroceryAsExpense()" class="btn-primary" style="padding: 6px 12px; font-size: 12px; background: var(--accent-violet);">Log Grocery Expense 💳</button>
          </div>
        </div>
        <textarea id="grocery-notes-input" placeholder="Type your grocery list here (e.g. Milk, Eggs, Bread, Coffee beans, Olive oil)..." class="form-input" style="height: 70px; font-size: 13px; resize: vertical; line-height: 1.5;">${groceryNotes}</textarea>
      </div>

      <!-- Timing Filter Chips -->
      <div style="display: flex; gap: 8px; margin-bottom: 16px; overflow-x: auto; padding-bottom: 4px;">
        <button onclick="window.setShoppingTimingFilter('all')" class="quick-chip ${activeTimingFilter === 'all' ? 'active' : ''}" style="${activeTimingFilter === 'all' ? 'background: var(--accent-indigo); color: #fff;' : ''}">All Planned Items</button>
        <button onclick="window.setShoppingTimingFilter('now')" class="quick-chip ${activeTimingFilter === 'now' ? 'active' : ''}" style="${activeTimingFilter === 'now' ? 'background: var(--accent-indigo); color: #fff;' : ''}">⚡ Buy Today (${nowCount})</button>
        <button onclick="window.setShoppingTimingFilter('week')" class="quick-chip ${activeTimingFilter === 'week' ? 'active' : ''}" style="${activeTimingFilter === 'week' ? 'background: var(--accent-indigo); color: #fff;' : ''}">📅 This Week (${weekCount})</button>
        <button onclick="window.setShoppingTimingFilter('month')" class="quick-chip ${activeTimingFilter === 'month' ? 'active' : ''}" style="${activeTimingFilter === 'month' ? 'background: var(--accent-indigo); color: #fff;' : ''}">📆 This Month (${monthCount})</button>
        <button onclick="window.setShoppingTimingFilter('year')" class="quick-chip ${activeTimingFilter === 'year' ? 'active' : ''}" style="${activeTimingFilter === 'year' ? 'background: var(--accent-indigo); color: #fff;' : ''}">🗓️ This Year (${yearCount})</button>
        <button onclick="window.setShoppingTimingFilter('purchased')" class="quick-chip ${activeTimingFilter === 'purchased' ? 'active' : ''}" style="${activeTimingFilter === 'purchased' ? 'background: var(--accent-emerald); color: #fff;' : ''}">✅ Purchased History</button>
      </div>

      <!-- Planned Items Table -->
      <div class="card-table-wrapper">
        <div class="table-title-bar">
          <h3 style="font-size: 16px; font-weight: 700;">Planned Items List <span style="font-size: 11px; color: var(--accent-indigo); font-weight: 600; margin-left: 4px;">(↔ Swipe)</span></h3>
        </div>
        <div class="table-scroll-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>When to Buy</th>
                <th>Priority</th>
                <th style="text-align: right;">Estimated Price</th>
                <th style="text-align: center;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${items.length === 0 ? `
                <tr><td colspan="6" class="empty-state">No items found for this timing filter. Tap "+ Add Planned Item"!</td></tr>
              ` : items.map(item => {
                let timingBadge = '<span class="badge badge-indigo">📆 This Month</span>';
                if (item.buy_timing === 'now' || item.buy_timing === 'today') timingBadge = '<span class="badge badge-rose">⚡ Today</span>';
                else if (item.buy_timing === 'week') timingBadge = '<span class="badge badge-amber">📅 This Week</span>';
                else if (item.buy_timing === 'year') timingBadge = '<span class="badge badge-emerald">🗓️ This Year</span>';

                let priorityBadge = '<span class="badge badge-indigo">Medium</span>';
                if (item.urgency === 'High' || item.urgency === 'Need') priorityBadge = '<span class="badge badge-rose">High</span>';
                else if (item.urgency === 'Low' || item.urgency === 'Impulse') priorityBadge = '<span class="badge badge-emerald">Low</span>';

                return `
                  <tr>
                    <td style="font-weight: 600;">${item.item_name}</td>
                    <td><span class="badge badge-indigo">${item.category || 'General'}</span></td>
                    <td>${timingBadge}</td>
                    <td>${priorityBadge}</td>
                    <td style="text-align: right; font-weight: 700; font-size: 15px;">${metrics.currency}${parseFloat(item.price).toFixed(2)}</td>
                    <td style="text-align: center;">
                      ${item.status === 'purchased' ? `
                        <span class="badge badge-emerald">Bought ✅</span>
                      ` : `
                        <div style="display: flex; gap: 6px; justify-content: center;">
                          <button onclick="window.markItemAsPurchased('${item.id}', '${item.item_name.replace(/'/g, "\\'")}', ${item.price})" class="btn-primary btn-emerald" style="padding: 4px 10px; font-size: 12px; white-space: nowrap;">Bought ✅</button>
                          <button onclick="window.deleteRecord('Wishlist', '${item.id}')" style="background: none; border: none; color: var(--accent-rose); cursor: pointer; font-size: 14px;">🗑️</button>
                        </div>
                      `}
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

window.setShoppingTimingFilter = function(filter) {
  activeTimingFilter = filter;
  window.switchTab('wishlist');
};
