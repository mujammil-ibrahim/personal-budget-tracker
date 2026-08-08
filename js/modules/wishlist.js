/* ==========================================================================
   MODULE 7: WISHLIST & "CAN I BUY THIS?" DECISION EVALUATOR
   ========================================================================== */

import { dbStore } from '../store.js';
import { AIEngine } from '../aiEngine.js';

export function renderWishlist() {
  const wishlist = dbStore.getTable('Wishlist');
  const metrics = dbStore.getDashboardMetrics();

  return `
    <div class="page-view animate-fade-in">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h2 style="font-size: 22px; font-weight: 800;">Wishlist & Purchase Planner</h2>
          <p style="font-size: 13px; color: var(--text-secondary);">Evaluate purchase feasibility before spending</p>
        </div>
        <button onclick="window.openAddWishlistModal()" class="btn-primary">+ Add Wishlist Item</button>
      </div>

      <!-- "Can I Buy This?" Interactive Evaluator Card -->
      <div style="background: var(--bg-surface); border: 2px solid var(--accent-violet); border-radius: var(--radius-lg); padding: 24px; margin-bottom: 24px; box-shadow: var(--shadow-glow);">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
          <div style="width: 36px; height: 36px; border-radius: var(--radius-md); background: var(--accent-violet-light); color: var(--accent-violet); display: flex; align-items: center; justify-content: center; font-size: 18px;">💡</div>
          <div>
            <h3 style="font-size: 17px; font-weight: 700;">"Can I Buy This?" Instant Evaluator</h3>
            <p style="font-size: 13px; color: var(--text-secondary);">Test any purchase against your current budget & daily safe allowance</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 12px; margin-bottom: 16px;">
          <input type="text" id="eval-item-name" placeholder="Item Name (e.g. Mechanical Keyboard)" class="form-input">
          <input type="number" id="eval-item-price" placeholder="Price (${metrics.currency})" class="form-input">
          <button onclick="window.evaluatePurchase()" class="btn-primary" style="background: linear-gradient(135deg, var(--accent-violet), var(--accent-indigo)); height: 48px; white-space: nowrap;">Evaluate Now ✨</button>
        </div>

        <!-- Result Box -->
        <div id="eval-result-box" style="display: none; padding: 16px; border-radius: var(--radius-md); font-size: 14px; line-height: 1.5;"></div>
      </div>

      <!-- Saved Wishlist Items Table -->
      <div class="card-table-wrapper">
        <div style="padding: 16px 20px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
          <h3 style="font-size: 16px; font-weight: 700;">Saved Wishlist Items</h3>
          <span style="font-size: 11px; color: var(--accent-indigo); font-weight: 600;">(↔ Swipe table)</span>
        </div>
        <div class="table-scroll-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Decision Notes</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: center;">Evaluate / Action</th>
              </tr>
            </thead>
            <tbody>
              ${wishlist.length === 0 ? `
                <tr><td colspan="6" class="empty-state">No wishlist items added yet. Save something you're eyeing!</td></tr>
              ` : wishlist.map(item => {
                const result = AIEngine.processQuery('can i buy this', { type: 'can_i_buy', price: item.price, itemName: item.item_name });
                
                let urgencyBadge = '<span class="badge badge-indigo">Medium</span>';
                if (item.urgency === 'High' || item.urgency === 'Need') urgencyBadge = '<span class="badge badge-rose">High</span>';
                else if (item.urgency === 'Low' || item.urgency === 'Impulse') urgencyBadge = '<span class="badge badge-emerald">Low</span>';

                let statusBadge = '<span class="badge badge-emerald">Safe to Buy</span>';
                if (result.status === 'amber') statusBadge = '<span class="badge badge-amber">Borderline</span>';
                else if (result.status === 'rose') statusBadge = '<span class="badge badge-rose">Over Budget</span>';

                return `
                  <tr>
                    <td style="font-weight: 600;">${item.item_name}</td>
                    <td><span class="badge badge-indigo">${item.category}</span></td>
                    <td>${urgencyBadge}</td>
                    <td style="color: var(--text-secondary); font-size: 13px;">${item.decision_notes || '-'}</td>
                    <td style="text-align: right; font-weight: 700;">${metrics.currency}${parseFloat(item.price).toFixed(2)}</td>
                    <td style="text-align: center; display: flex; gap: 8px; justify-content: center;">
                      ${statusBadge}
                      <button onclick="window.deleteRecord('Wishlist', '${item.id}')" style="background: none; border: none; color: var(--accent-rose); cursor: pointer; font-size: 14px;">🗑️</button>
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
