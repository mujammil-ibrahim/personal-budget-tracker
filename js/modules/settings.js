/* ==========================================================================
   SETTINGS & PREFERENCES MODULE
   ========================================================================== */

import { dbStore } from '../store.js';

export function renderSettings() {
  const settings = dbStore.getTable('Settings')[0] || { currency_symbol: '$', daily_spending_limit: 45, theme: 'dark', ai_persona_tone: 'encouraging' };

  return `
    <div class="page-view animate-fade-in">
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 22px; font-weight: 800;">Preferences & Settings</h2>
        <p style="font-size: 13px; color: var(--text-secondary);">Customize currency, appearance theme, and companion persona</p>
      </div>

      <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px; max-width: 600px; box-shadow: var(--shadow-sm);">
        <form onsubmit="window.saveUserSettings(event)">
          
          <!-- Appearance & Theme Selector -->
          <div class="form-group">
            <label class="form-label">Appearance Theme</label>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 6px;">
              <button type="button" onclick="window.setThemeFromSettings('dark')" class="btn-primary" style="background: ${settings.theme === 'dark' ? 'linear-gradient(135deg, var(--accent-indigo), var(--accent-violet))' : 'var(--bg-surface-elevated)'}; color: ${settings.theme === 'dark' ? '#fff' : 'var(--text-primary)'}; border: 1px solid var(--border-color); justify-content: center;">
                🌙 Dark Mode ${settings.theme === 'dark' ? '✓' : ''}
              </button>
              <button type="button" onclick="window.setThemeFromSettings('light')" class="btn-primary" style="background: ${settings.theme === 'light' ? 'linear-gradient(135deg, var(--accent-indigo), var(--accent-violet))' : 'var(--bg-surface-elevated)'}; color: ${settings.theme === 'light' ? '#fff' : 'var(--text-primary)'}; border: 1px solid var(--border-color); justify-content: center;">
                ☀️ Light Mode ${settings.theme === 'light' ? '✓' : ''}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Currency Symbol</label>
            <select id="setting-currency" class="form-select">
              <option value="$" ${settings.currency_symbol === '$' ? 'selected' : ''}>$ USD / Global Dollar ($)</option>
              <option value="€" ${settings.currency_symbol === '€' ? 'selected' : ''}>€ Euro (€)</option>
              <option value="£" ${settings.currency_symbol === '£' ? 'selected' : ''}>£ British Pound (£)</option>
              <option value="₹" ${settings.currency_symbol === '₹' ? 'selected' : ''}>₹ Indian Rupee (₹)</option>
              <option value="¥" ${settings.currency_symbol === '¥' ? 'selected' : ''}>¥ Japanese Yen (¥)</option>
              <option value="A$" ${settings.currency_symbol === 'A$' ? 'selected' : ''}>A$ Australian Dollar (A$)</option>
              <option value="C$" ${settings.currency_symbol === 'C$' ? 'selected' : ''}>C$ Canadian Dollar (C$)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Daily Safe Spending Limit Override</label>
            <input type="number" id="setting-daily-limit" value="${settings.daily_spending_limit}" class="form-input">
          </div>

          <div class="form-group">
            <label class="form-label">AI Companion Persona Tone</label>
            <select id="setting-ai-tone" class="form-select">
              <option value="encouraging" ${settings.ai_persona_tone === 'encouraging' ? 'selected' : ''}>Encouraging & Friendly (Default)</option>
              <option value="pragmatic" ${settings.ai_persona_tone === 'pragmatic' ? 'selected' : ''}>Pragmatic & Direct</option>
              <option value="humorous" ${settings.ai_persona_tone === 'humorous' ? 'selected' : ''}>Humorous & Casual</option>
            </select>
          </div>

          <div style="display: flex; gap: 12px; margin-top: 24px;">
            <button type="submit" class="btn-primary">Save Settings</button>
            <button type="button" onclick="dbStore.resetToDefaults()" class="btn-primary" style="background: var(--accent-rose);">Reset All Sample Data</button>
          </div>
        </form>
      </div>
    </div>
  `;
}
