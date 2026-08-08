/* ==========================================================================
   MODULE 0: INTERACTIVE LANDING PAGE & APP ONBOARDING SHOWCASE
   ========================================================================== */

import { dbStore } from '../store.js';

export function renderLandingPage() {
  const users = dbStore.getAllUsers();
  const activeUser = dbStore.getCurrentUser();

  return `
    <div class="page-view animate-fade-in" style="max-width: 1100px; margin: 0 auto; padding-bottom: 60px;">
      
      <!-- HERO BANNER -->
      <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15)); border: 1px solid var(--accent-indigo); border-radius: var(--radius-xl); padding: 40px 28px; margin-bottom: 40px; text-align: center; position: relative; overflow: hidden; backdrop-filter: blur(12px);">
        <span class="badge badge-indigo" style="font-size: 13px; padding: 6px 16px; margin-bottom: 16px; display: inline-block; font-weight: 700;">
          ✨ Intelligent Simplicity • 100% Offline PWA & Multi-User Support
        </span>
        
        <h1 style="font-size: clamp(28px, 5vw, 44px); font-weight: 900; line-height: 1.2; margin-bottom: 16px; background: linear-gradient(135deg, #FFFFFF, var(--accent-indigo)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          Master Your Daily Money with AI-Powered Financial Clarity
        </h1>

        <p style="font-size: 16px; color: var(--text-secondary); max-width: 680px; margin: 0 auto 28px auto; line-height: 1.6;">
          Log transactions in &lt; 10 seconds, set automated monthly budgets, evaluate purchase decisions with AI, and plan shopping lists effortlessly across multiple accounts.
        </p>

        <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
          <button onclick="window.scrollToAuthSection('login')" class="btn-primary" style="padding: 12px 28px; font-size: 15px; font-weight: 700;">🚀 Sign In to Account</button>
          <button onclick="window.scrollToAuthSection('register')" class="btn-primary btn-emerald" style="padding: 12px 28px; font-size: 15px; font-weight: 700;">✨ Create Free Account</button>
          <button onclick="window.enterDemoMode()" class="btn-primary" style="padding: 12px 24px; font-size: 15px; font-weight: 700; background: var(--bg-surface-elevated); color: var(--text-primary); border: 1px solid var(--border-color);">⚡ Explore Demo Mode</button>
        </div>
      </div>

      <!-- INTERACTIVE CALCULATOR SHOWCASE WIDGET -->
      <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: 28px; margin-bottom: 40px; box-shadow: var(--shadow-md);">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 28px;">📊</span>
          <h2 style="font-size: 22px; font-weight: 800; margin-top: 4px;">Interactive Daily Limit Calculator</h2>
          <p style="font-size: 13px; color: var(--text-secondary);">Test how Money Companion calculates your daily safe spending allowance in real time</p>
        </div>

        <div class="card-grid card-grid-2" style="align-items: center; gap: 24px;">
          <!-- Slider Controls -->
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <label style="font-size: 14px; font-weight: 700;">Monthly Income:</label>
                <span id="calc-income-val" style="font-size: 15px; font-weight: 800; color: var(--accent-emerald);">$4,200</span>
              </div>
              <input type="range" id="calc-income-slider" min="1000" max="15000" step="100" value="4200" oninput="window.updateInteractiveLandingCalc()" style="width: 100%; cursor: pointer;">
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <label style="font-size: 14px; font-weight: 700;">Fixed Monthly Expenses (Rent/Bills):</label>
                <span id="calc-expense-val" style="font-size: 15px; font-weight: 800; color: var(--accent-rose);">$1,500</span>
              </div>
              <input type="range" id="calc-expense-slider" min="300" max="8000" step="50" value="1500" oninput="window.updateInteractiveLandingCalc()" style="width: 100%; cursor: pointer;">
            </div>
          </div>

          <!-- Live Output Card -->
          <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px; text-align: center;">
            <div style="font-size: 12px; color: var(--text-muted); font-weight: 700; text-transform: uppercase; margin-bottom: 6px;">YOUR SAFE DAILY SPEND ALLOWANCE</div>
            <div id="calc-daily-output" style="font-size: 38px; font-weight: 900; color: var(--accent-emerald); margin-bottom: 12px;">$90.00 / day</div>
            
            <div style="display: flex; justify-content: space-between; font-size: 13px; padding-top: 12px; border-top: 1px solid var(--border-color);">
              <span>Discretionary Budget: <strong id="calc-budget-output" style="color: var(--accent-indigo);">$2,700</strong></span>
              <span>50/30/20 Savings Goal: <strong id="calc-savings-output" style="color: var(--accent-violet);">$840/mo</strong></span>
            </div>
          </div>
        </div>
      </div>

      <!-- FEATURES SHOWCASE GRID -->
      <div style="margin-bottom: 40px;">
        <h2 style="font-size: 22px; font-weight: 800; text-align: center; margin-bottom: 24px;">Built for Effortless Financial Control</h2>
        
        <div class="card-grid card-grid-3">
          <div class="stat-card" style="padding: 24px;">
            <div style="font-size: 32px; margin-bottom: 12px;">⚡</div>
            <h3 style="font-size: 17px; font-weight: 700; margin-bottom: 8px;">1-Tap Quick Logging</h3>
            <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5;">Log daily coffee, lunch, groceries, or rides in under 10 seconds. No endless form fields required.</p>
          </div>

          <div class="stat-card" style="padding: 24px;">
            <div style="font-size: 32px; margin-bottom: 12px;">🤖</div>
            <h3 style="font-size: 17px; font-weight: 700; margin-bottom: 8px;">AI Purchase Evaluator</h3>
            <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5;">Ask "Can I buy a watch for $150?" and get instant data-driven advice based on your remaining budget.</p>
          </div>

          <div class="stat-card" style="padding: 24px;">
            <div style="font-size: 32px; margin-bottom: 12px;">🛒</div>
            <h3 style="font-size: 17px; font-weight: 700; margin-bottom: 8px;">Shopping & Grocery Planner</h3>
            <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5;">Plan items to buy (Today, Week, Month, Year). Tap "Bought ✅" to auto-convert them into logged expenses!</p>
          </div>

          <div class="stat-card" style="padding: 24px;">
            <div style="font-size: 32px; margin-bottom: 12px;">⚖️</div>
            <h3 style="font-size: 17px; font-weight: 700; margin-bottom: 8px;">Multi-Strategy Budgeting</h3>
            <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5;">Choose 50/30/20, 70/20/10, 60/30/10, or 80/20 rules with 1 tap. Reset or undo allocations anytime.</p>
          </div>

          <div class="stat-card" style="padding: 24px;">
            <div style="font-size: 32px; margin-bottom: 12px;">🔄</div>
            <h3 style="font-size: 17px; font-weight: 700; margin-bottom: 8px;">Auto Fixed Monthly Income</h3>
            <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5;">Set your monthly salary once. The app automatically credits your paycheck at the start of every month.</p>
          </div>

          <div class="stat-card" style="padding: 24px;">
            <div style="font-size: 32px; margin-bottom: 12px;">🔐</div>
            <h3 style="font-size: 17px; font-weight: 700; margin-bottom: 8px;">Multi-Account Privacy</h3>
            <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5;">Manage personal, business, or family accounts on one device with 100% offline local encryption.</p>
          </div>
        </div>
      </div>

      <!-- EMBEDDED AUTHENTICATION & LOGIN CARD -->
      <div id="landing-auth-section" style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: 32px; max-width: 520px; margin: 0 auto; box-shadow: var(--shadow-lg);">
        <div style="text-align: center; margin-bottom: 20px;">
          <h3 style="font-size: 22px; font-weight: 800;">Get Started Now</h3>
          <p style="font-size: 13px; color: var(--text-secondary);">Sign in to your account or create a new profile in seconds</p>
        </div>

        <div style="display: flex; gap: 8px; margin-bottom: 24px; background: var(--bg-surface-elevated); padding: 4px; border-radius: var(--radius-md);">
          <button onclick="window.switchLandingAuthTab('login')" id="landing-tab-login" class="quick-chip active" style="flex: 1; text-align: center; font-weight: 700; background: var(--accent-indigo); color: #fff;">Sign In</button>
          <button onclick="window.switchLandingAuthTab('register')" id="landing-tab-register" class="quick-chip" style="flex: 1; text-align: center; font-weight: 700;">Create Account</button>
        </div>

        <!-- Sign In Form -->
        <form id="landing-form-login" onsubmit="window.handleLandingLoginSubmit(event)">
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" id="l-login-email" placeholder="e.g. alex@example.com" class="form-input" required>
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" id="l-login-password" placeholder="••••••••" class="form-input" required>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%; height: 46px; font-size: 15px; font-weight: 700; margin-top: 12px;">Sign In to Money Companion 🚀</button>
        </form>

        <!-- Register Form -->
        <form id="landing-form-register" onsubmit="window.handleLandingRegisterSubmit(event)" style="display: none;">
          <div class="form-group">
            <label class="form-label">Account Name (e.g. Alex Personal / Business)</label>
            <input type="text" id="l-reg-name" placeholder="e.g. Alex Johnson" class="form-input" required>
          </div>
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" id="l-reg-email" placeholder="alex@example.com" class="form-input" required>
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" id="l-reg-password" placeholder="Create password" class="form-input" required>
          </div>
          <div class="form-group">
            <label class="form-label">Monthly Salary / Fixed Income</label>
            <input type="number" step="0.01" id="l-reg-salary" placeholder="4200.00" class="form-input" required>
          </div>
          <button type="submit" class="btn-primary btn-emerald" style="width: 100%; height: 46px; font-size: 15px; font-weight: 700; margin-top: 12px;">Create Account & Launch ✨</button>
        </form>

        <div style="text-align: center; margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-color);">
          <span style="font-size: 13px; color: var(--text-muted);">Want to test without registering?</span>
          <button onclick="window.enterDemoMode()" style="background: none; border: none; color: var(--accent-indigo); font-weight: 700; font-size: 13px; cursor: pointer; text-decoration: underline; margin-left: 6px;">Launch Instant Demo ⚡</button>
        </div>
      </div>

    </div>
  `;
}

window.updateInteractiveLandingCalc = function() {
  const income = parseFloat(document.getElementById('calc-income-slider')?.value || 4200);
  const fixedExpenses = parseFloat(document.getElementById('calc-expense-slider')?.value || 1500);

  document.getElementById('calc-income-val').innerText = `$${income.toLocaleString()}`;
  document.getElementById('calc-expense-val').innerText = `$${fixedExpenses.toLocaleString()}`;

  const discretionary = Math.max(0, income - fixedExpenses);
  const daily = (discretionary / 30).toFixed(2);
  const savings = Math.round(income * 0.20);

  document.getElementById('calc-daily-output').innerText = `$${daily} / day`;
  document.getElementById('calc-budget-output').innerText = `$${discretionary.toLocaleString()}`;
  document.getElementById('calc-savings-output').innerText = `$${savings.toLocaleString()}/mo`;
};

window.scrollToAuthSection = function(tab = 'login') {
  const section = document.getElementById('landing-auth-section');
  if (section) section.scrollIntoView({ behavior: 'smooth' });
  window.switchLandingAuthTab(tab);
};

window.switchLandingAuthTab = function(tab) {
  const loginForm = document.getElementById('landing-form-login');
  const regForm = document.getElementById('landing-form-register');
  const loginBtn = document.getElementById('landing-tab-login');
  const regBtn = document.getElementById('landing-tab-register');

  if (loginForm && regForm) {
    loginForm.style.display = tab === 'login' ? 'block' : 'none';
    regForm.style.display = tab === 'register' ? 'block' : 'none';
  }

  if (loginBtn && regBtn) {
    if (tab === 'login') {
      loginBtn.style.background = 'var(--accent-indigo)';
      loginBtn.style.color = '#fff';
      regBtn.style.background = 'transparent';
      regBtn.style.color = 'var(--text-secondary)';
    } else {
      regBtn.style.background = 'var(--accent-emerald)';
      regBtn.style.color = '#fff';
      loginBtn.style.background = 'transparent';
      loginBtn.style.color = 'var(--text-secondary)';
    }
  }
};
