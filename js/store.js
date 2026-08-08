/* ==========================================================================
   PERSONAL BUDGET TRACKER - DATABASE STORE (8 TABLES)
   Local Storage Persistent Engine with Seed Data
   ========================================================================== */

const STORAGE_KEY = 'money_companion_db_v1';

const defaultSeedData = {
  Users: [
    {
      id: 'u_1',
      name: 'Alex Rivera',
      email: 'alex@example.com',
      currency: '$',
      monthly_salary: 4200.0,
      created_at: new Date().toISOString()
    }
  ],
  Income: [
    {
      id: 'inc_1',
      user_id: 'u_1',
      amount: 4200.0,
      source_name: 'Tech Corp Salary',
      category: 'Primary',
      date: '2026-08-01',
      recurrence: 'monthly',
      notes: 'Monthly regular paycheck'
    },
    {
      id: 'inc_2',
      user_id: 'u_1',
      amount: 350.0,
      source_name: 'Freelance Design',
      category: 'Bonus',
      date: '2026-08-05',
      recurrence: 'one_time',
      notes: 'Logo design project'
    }
  ],
  Expenses: [
    {
      id: 'exp_1',
      user_id: 'u_1',
      amount: 1200.0,
      category: 'Rent',
      merchant: 'Apex Apartments',
      date: '2026-08-01',
      payment_method: 'Bank Transfer',
      notes: 'Monthly studio rent'
    },
    {
      id: 'exp_2',
      user_id: 'u_1',
      amount: 145.0,
      category: 'Utilities',
      merchant: 'City Energy & Fiber',
      date: '2026-08-03',
      payment_method: 'Card',
      notes: 'Electricity and high-speed wifi'
    },
    {
      id: 'exp_3',
      user_id: 'u_1',
      amount: 68.5,
      category: 'Dining',
      merchant: 'Ramen Izakaya',
      date: '2026-08-04',
      payment_method: 'Card',
      notes: 'Dinner with college friends'
    },
    {
      id: 'exp_4',
      user_id: 'u_1',
      amount: 112.0,
      category: 'Shopping',
      merchant: 'Uniqlo',
      date: '2026-08-06',
      payment_method: 'Card',
      notes: 'Work wear updates'
    },
    {
      id: 'exp_5',
      user_id: 'u_1',
      amount: 15.5,
      category: 'Dining',
      merchant: 'Blue Bottle Coffee',
      date: '2026-08-08',
      payment_method: 'UPI',
      notes: 'Morning matcha latte & pastry'
    }
  ],
  Budgets: [
    { id: 'b_1', user_id: 'u_1', month: 8, year: 2026, category: 'Rent', allocated_amount: 1200.0, spent_amount: 1200.0 },
    { id: 'b_2', user_id: 'u_1', month: 8, year: 2026, category: 'Utilities', allocated_amount: 200.0, spent_amount: 145.0 },
    { id: 'b_3', user_id: 'u_1', month: 8, year: 2026, category: 'Dining', allocated_amount: 400.0, spent_amount: 84.0 },
    { id: 'b_4', user_id: 'u_1', month: 8, year: 2026, category: 'Shopping', allocated_amount: 300.0, spent_amount: 112.0 },
    { id: 'b_5', user_id: 'u_1', month: 8, year: 2026, category: 'Transport', allocated_amount: 150.0, spent_amount: 0.0 },
    { id: 'b_6', user_id: 'u_1', month: 8, year: 2026, category: 'Entertainment', allocated_amount: 200.0, spent_amount: 0.0 }
  ],
  Savings: [
    { id: 'sav_1', user_id: 'u_1', goal_id: 'g_1', amount: 500.0, deposit_date: '2026-08-01', notes: 'Monthly direct savings deposit' },
    { id: 'sav_2', user_id: 'u_1', goal_id: 'g_2', amount: 200.0, deposit_date: '2026-08-05', notes: 'Allocated from freelance bonus' }
  ],
  Goals: [
    {
      id: 'g_1',
      user_id: 'u_1',
      title: 'Emergency Fund',
      target_amount: 5000.0,
      current_amount: 2800.0,
      target_date: '2026-12-31',
      category: 'Safety Net',
      priority: 'High',
      status: 'active'
    },
    {
      id: 'g_2',
      user_id: 'u_1',
      title: 'MacBook Pro M3',
      target_amount: 2200.0,
      current_amount: 1400.0,
      target_date: '2026-10-15',
      category: 'Tech & Work',
      priority: 'Medium',
      status: 'active'
    },
    {
      id: 'g_3',
      user_id: 'u_1',
      title: 'Japan Autumn Trip',
      target_amount: 3000.0,
      current_amount: 900.0,
      target_date: '2027-04-01',
      category: 'Travel',
      priority: 'Low',
      status: 'active'
    }
  ],
  Wishlist: [
    {
      id: 'w_1',
      user_id: 'u_1',
      item_name: 'Noise Cancelling Headphones',
      price: 299.0,
      category: 'Electronics',
      urgency: 'Want',
      status: 'wishing',
      decision_notes: 'Great for focused coding sessions'
    },
    {
      id: 'w_2',
      user_id: 'u_1',
      item_name: 'Ergonomic Desk Chair',
      price: 450.0,
      category: 'Furniture',
      urgency: 'Need',
      status: 'wishing',
      decision_notes: 'Back support for long remote work hours'
    }
  ],
  Settings: [
    {
      id: 's_1',
      user_id: 'u_1',
      theme: 'dark',
      currency_symbol: '$',
      daily_spending_limit: 45.0,
      ai_persona_tone: 'encouraging',
      notification_preferences: { email_alerts: true, daily_reminder: true }
    }
  ]
};

class Store {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load from LocalStorage, using defaults', e);
    }
    this.saveData(defaultSeedData);
    return JSON.parse(JSON.stringify(defaultSeedData));
  }

  saveData(data = this.data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving data to LocalStorage', e);
    }
  }

  resetToDefaults() {
    this.data = JSON.parse(JSON.stringify(defaultSeedData));
    this.saveData();
    window.location.reload();
  }

  // --- Generic Table Helper Operations ---
  getTable(tableName) {
    return this.data[tableName] || [];
  }

  addItem(tableName, item) {
    if (!item.id) item.id = tableName.toLowerCase() + '_' + Date.now();
    if (!item.user_id) item.user_id = 'u_1';
    this.data[tableName].push(item);
    this.saveData();
    this.recalculateBudgets();
    return item;
  }

  deleteItem(tableName, id) {
    this.data[tableName] = this.data[tableName].filter(i => i.id !== id);
    this.saveData();
    this.recalculateBudgets();
  }

  updateItem(tableName, id, updates) {
    const idx = this.data[tableName].findIndex(i => i.id === id);
    if (idx !== -1) {
      this.data[tableName][idx] = { ...this.data[tableName][idx], ...updates };
      this.saveData();
      this.recalculateBudgets();
      return this.data[tableName][idx];
    }
    return null;
  }

  // --- Dynamic Business Logic Calculators ---
  recalculateBudgets() {
    const curMonth = new Date().getMonth() + 1;
    const curYear = new Date().getFullYear();

    const currentExpenses = this.data.Expenses.filter(e => {
      const d = new Date(e.date);
      return (d.getMonth() + 1) === curMonth && d.getFullYear() === curYear;
    });

    const categorySums = {};
    currentExpenses.forEach(exp => {
      categorySums[exp.category] = (categorySums[exp.category] || 0) + parseFloat(exp.amount || 0);
    });

    this.data.Budgets.forEach(b => {
      if (b.month === curMonth && b.year === curYear) {
        b.spent_amount = categorySums[b.category] || 0;
      }
    });

    this.saveData();
  }

  updateFixedSalary(amount) {
    const user = this.data.Users[0];
    if (user) {
      user.monthly_salary = parseFloat(amount);
      this.saveData();
    }
  }

  getDashboardMetrics() {
    const curMonth = new Date().getMonth() + 1;
    const curYear = new Date().getFullYear();

    // Auto-credit fixed monthly salary if no income exists yet for current month
    const userProfile = this.data.Users[0] || { monthly_salary: 4200.0 };
    const fixedSalaryAmount = parseFloat(userProfile.monthly_salary || 4200.0);

    const hasMonthIncome = this.data.Income.some(i => {
      const d = new Date(i.date);
      return (d.getMonth() + 1) === curMonth && d.getFullYear() === curYear;
    });

    if (!hasMonthIncome && fixedSalaryAmount > 0) {
      const firstOfMonth = `${curYear}-${String(curMonth).padStart(2, '0')}-01`;
      this.data.Income.push({
        id: 'inc_auto_' + Date.now(),
        user_id: userProfile.id || 'u_1',
        amount: fixedSalaryAmount,
        source_name: 'Fixed Monthly Paycheck',
        category: 'Primary',
        date: firstOfMonth,
        recurrence: 'monthly',
        notes: 'Auto-credited regular salary'
      });
      this.saveData();
    }

    const monthIncome = this.data.Income
      .filter(i => { const d = new Date(i.date); return (d.getMonth() + 1) === curMonth && d.getFullYear() === curYear; })
      .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

    const monthExpenses = this.data.Expenses
      .filter(e => { const d = new Date(e.date); return (d.getMonth() + 1) === curMonth && d.getFullYear() === curYear; })
      .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

    const totalAllocatedBudget = this.data.Budgets
      .filter(b => b.month === curMonth && b.year === curYear)
      .reduce((sum, b) => sum + parseFloat(b.allocated_amount || 0), 0);

    const remainingBudget = Math.max(0, totalAllocatedBudget - monthExpenses);

    // Calculate Safe Daily Spend Allowance
    const today = new Date();
    const totalDaysInMonth = new Date(curYear, curMonth, 0).getDate();
    const remainingDays = Math.max(1, totalDaysInMonth - today.getDate() + 1);
    const safeDailyLimit = Math.max(0, (remainingBudget / remainingDays)).toFixed(2);

    const totalSavings = this.data.Savings.reduce((sum, s) => sum + parseFloat(s.amount || 0), 0);

    const settings = this.data.Settings[0] || { currency_symbol: '$' };

    return {
      monthIncome,
      monthExpenses,
      totalAllocatedBudget,
      remainingBudget,
      safeDailyLimit: parseFloat(safeDailyLimit),
      remainingDays,
      totalSavings,
      currency: settings.currency_symbol,
      fixedSalary: fixedSalaryAmount
    };
  }
}

export const dbStore = new Store();
