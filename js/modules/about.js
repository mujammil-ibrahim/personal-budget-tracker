/* ==========================================================================
   MODULE 9: ABOUT US & APP INFORMATION PAGE
   ========================================================================== */

export function renderAbout() {
  return `
    <div class="page-view animate-fade-in" style="max-width: 900px; margin: 0 auto; padding-bottom: 40px;">
      
      <!-- HEADER BANNER -->
      <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15)); border: 1px solid var(--accent-indigo); border-radius: var(--radius-xl); padding: 32px 24px; margin-bottom: 32px; text-align: center; backdrop-filter: blur(10px);">
        <div style="width: 56px; height: 56px; border-radius: var(--radius-lg); background: linear-gradient(135deg, var(--accent-indigo), var(--accent-violet)); display: flex; align-items: center; justify-content: center; font-size: 28px; color: #fff; margin: 0 auto 16px auto; box-shadow: var(--shadow-glow);">💎</div>
        <h2 style="font-size: 26px; font-weight: 900; margin-bottom: 8px;">Money Companion</h2>
        <p style="font-size: 14px; color: var(--text-secondary); max-width: 580px; margin: 0 auto 16px auto; line-line: 1.5;">
          A lightweight, privacy-first, beginner-friendly personal budget tracker designed for daily financial clarity.
        </p>
        <span class="badge badge-indigo" style="font-size: 12px; font-weight: 700; padding: 4px 14px;">Version 2.4.0 (PWA Standalone)</span>
      </div>

      <!-- METRICS & DEVELOPER DETAILS CARD -->
      <div class="card-grid card-grid-2" style="margin-bottom: 32px;">
        <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px;">
          <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            <span>👨‍💻</span> Developer & Project Info
          </h3>
          <div style="display: flex; flex-direction: column; gap: 12px; font-size: 14px;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
              <span style="color: var(--text-muted);">Creator:</span>
              <strong style="color: var(--text-primary);">Mujammil Ibrahim</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
              <span style="color: var(--text-muted);">GitHub:</span>
              <a href="https://github.com/mujammil-ibrahim" target="_blank" style="color: var(--accent-indigo); text-decoration: none; font-weight: 600;">@mujammil-ibrahim ↗</a>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
              <span style="color: var(--text-muted);">Deployment:</span>
              <span style="color: var(--accent-emerald); font-weight: 600;">Vercel Live Build</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-muted);">Framework:</span>
              <span style="font-weight: 600;">Pure HTML5 / ES6 JS / PWA</span>
            </div>
          </div>
        </div>

        <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px;">
          <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            <span>🛡️</span> Privacy & Security Promise
          </h3>
          <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 12px;">
            Your financial data is <strong>100% private</strong> and stored exclusively in your browser's local encrypted storage. No financial records are ever uploaded to external servers or third parties.
          </p>
          <div style="background: var(--accent-indigo-light); border: 1px solid var(--accent-indigo); padding: 10px 14px; border-radius: var(--radius-md); font-size: 12px; color: var(--accent-indigo); font-weight: 600;">
            🔒 100% Offline Capability with PWA ServiceWorker
          </div>
        </div>
      </div>

      <!-- FAQ ACCORDION SECTION -->
      <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-sm);">
        <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 20px;">Frequently Asked Questions (FAQ)</h3>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div style="border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px; background: var(--bg-surface-elevated);">
            <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 6px; color: var(--accent-indigo);">❓ How does the AI Money Companion work?</h4>
            <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5;">
              The AI Money Companion runs deterministically in your browser using your live monthly income, budget limits, and tracked expenses to give instant advice on purchase feasibility ("Can I buy this?"), safe daily spend allowances, and savings advice.
            </p>
          </div>

          <div style="border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px; background: var(--bg-surface-elevated);">
            <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 6px; color: var(--accent-indigo);">❓ How do I switch currencies?</h4>
            <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5;">
              Use the top-bar currency dropdown at any time to switch between USD ($), EUR (€), GBP (£), INR (₹), JPY (¥), AUD, CAD, PHP, BRL, and more. All values and charts update instantly!
            </p>
          </div>

          <div style="border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px; background: var(--bg-surface-elevated);">
            <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 6px; color: var(--accent-indigo);">❓ How does the Shopping List Auto-Expense feature work?</h4>
            <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5;">
              Add items you plan to buy (Today, Week, Month, Year). When you make the purchase, tap <strong>"Bought ✅"</strong>, select your payment method, and it automatically logs the item into your Expenses table while updating your monthly budget!
            </p>
          </div>
        </div>
      </div>

    </div>
  `;
}
