/* ==========================================================================
   PERSONAL BUDGET TRACKER - AI RECOMMENDATION ENGINE
   Lightweight, Conversational, Dynamic Financial Companion
   ========================================================================== */

import { dbStore } from './store.js';

export class AIEngine {
  static processQuery(promptText, customParams = {}) {
    const metrics = dbStore.getDashboardMetrics();
    const expenses = dbStore.getTable('Expenses');
    const budgets = dbStore.getTable('Budgets');
    const currency = metrics.currency;
    
    const queryLower = (promptText || '').toLowerCase().trim();

    // Parse numbers from user typed query (e.g. "Can I buy a watch for $150?")
    const extractedNumbers = queryLower.match(/\d+(\.\d+)?/g);
    let extractedPrice = extractedNumbers ? parseFloat(extractedNumbers[0]) : 0;

    // 1. "Can I buy..." / Purchase Feasibility
    if (queryLower.includes('can i buy') || queryLower.includes('should i buy') || queryLower.includes('can i afford') || customParams.type === 'can_i_buy') {
      const price = customParams.price ? parseFloat(customParams.price) : extractedPrice;
      
      // Clean item name from query
      let itemName = customParams.itemName || promptText.replace(/can i buy|should i buy|can i afford|for|\$|₹|€|£|\d+/gi, '').trim();
      if (!itemName) itemName = 'this item';

      if (price <= 0) {
        return {
          title: "Buy Decision Evaluator 🤔",
          text: `Tell me what item you'd like to buy and its price (e.g. *"Can I buy a watch for $150?"* or use the Wishlist evaluator)!`,
          status: 'info'
        };
      }

      if (price <= metrics.safeDailyLimit) {
        return {
          title: "Yes! Safe to Buy 🎉",
          text: `**${itemName}** (${currency}${price}) is comfortably within your daily safe limit of **${currency}${metrics.safeDailyLimit}**. Go for it!`,
          status: 'emerald'
        };
      } else if (price <= metrics.remainingBudget) {
        const remainingAfter = (metrics.remainingBudget - price).toFixed(2);
        return {
          title: "Feasible with Care ⚠️",
          text: `You can afford **${itemName}** (${currency}${price}), but it will reduce your remaining monthly budget to **${currency}${remainingAfter}**. Your remaining daily allowance will adjust to **${currency}${(remainingAfter / metrics.remainingDays).toFixed(2)}/day**.`,
          status: 'amber'
        };
      } else {
        const deficit = (price - metrics.remainingBudget).toFixed(2);
        return {
          title: "Hold Off for Now 🛑",
          text: `**${itemName}** (${currency}${price}) exceeds your remaining budget by **${currency}${deficit}**. Consider saving it in your **Wishlist** or waiting until next month's salary deposit!`,
          status: 'rose'
        };
      }
    }

    // 2. Budget status
    if (queryLower.includes('budget') || queryLower.includes('left') || queryLower.includes('remaining')) {
      const pctLeft = ((metrics.remainingBudget / (metrics.totalAllocatedBudget || 1)) * 100).toFixed(0);
      return {
        title: "Remaining Budget Summary 📊",
        text: `You have **${currency}${metrics.remainingBudget.toLocaleString()}** left in your monthly budget (**${pctLeft}%** remaining).\n\nYour safe daily spending allowance for the remaining **${metrics.remainingDays} days** is **${currency}${metrics.safeDailyLimit}/day**.`,
        status: metrics.remainingBudget > 0 ? 'emerald' : 'rose'
      };
    }

    // 3. Expenses / Spending query
    if (queryLower.includes('spent') || queryLower.includes('expense') || queryLower.includes('cost') || queryLower.includes('paid')) {
      // Check if user named a specific category like dining or rent
      const categories = ['dining', 'rent', 'utilities', 'shopping', 'transport', 'entertainment', 'health', 'bills'];
      const matchedCat = categories.find(c => queryLower.includes(c));

      if (matchedCat) {
        const catExpenses = expenses.filter(e => e.category.toLowerCase().includes(matchedCat));
        const catTotal = catExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
        return {
          title: `${matchedCat.toUpperCase()} Spending 🏷️`,
          text: `You have spent **${currency}${catTotal.toFixed(2)}** on **${matchedCat}** across ${catExpenses.length} transaction(s) this month.`,
          status: 'indigo'
        };
      }

      return {
        title: "Monthly Spending Overview 💸",
        text: `So far this month, you've spent **${currency}${metrics.monthExpenses.toLocaleString()}** across **${expenses.length} transactions** out of your **${currency}${metrics.monthIncome.toLocaleString()}** total income.`,
        status: 'indigo'
      };
    }

    // 4. Category breakdown
    if (queryLower.includes('category') || queryLower.includes('most') || queryLower.includes('highest')) {
      const categoryTotals = {};
      expenses.forEach(e => {
        categoryTotals[e.category] = (categoryTotals[e.category] || 0) + parseFloat(e.amount || 0);
      });

      let topCat = 'None';
      let topAmount = 0;
      Object.entries(categoryTotals).forEach(([cat, amt]) => {
        if (amt > topAmount) {
          topAmount = amt;
          topCat = cat;
        }
      });

      const pctOfTotal = metrics.monthExpenses > 0 ? ((topAmount / metrics.monthExpenses) * 100).toFixed(0) : 0;

      return {
        title: "Top Expense Category 🏷️",
        text: `Your highest spending category this month is **${topCat}** at **${currency}${topAmount.toLocaleString()}** (**${pctOfTotal}%** of total expenses).`,
        status: 'violet'
      };
    }

    // 5. Savings query
    if (queryLower.includes('save') || queryLower.includes('saving') || queryLower.includes('deposit')) {
      const recommendedTarget = (metrics.monthIncome * 0.20).toFixed(0);
      const currentSavedThisMonth = dbStore.getTable('Savings').reduce((s, item) => s + parseFloat(item.amount || 0), 0);
      
      return {
        title: "Savings Recommendation 🎯",
        text: `Aim to save at least **20% of your monthly income** (**${currency}${recommendedTarget}/month**).\n\nYou've saved **${currency}${currentSavedThisMonth}** so far this month! Keep it up!`,
        status: 'emerald'
      };
    }

    // Greetings or general chat fallback
    if (queryLower.includes('hi') || queryLower.includes('hello') || queryLower.includes('hey') || queryLower.includes('who are you')) {
      return {
        title: "Hello! 👋",
        text: `I'm your Personal Money Companion! Ask me anything like *"Can I buy a watch for $50?"*, *"How much budget is left?"*, or *"What category am I spending the most on?"*`,
        status: 'indigo'
      };
    }

    // General fallback insight
    return {
      title: "Money Companion Insight 💡",
      text: `Based on your cash flow: Staying under your safe daily limit of **${currency}${metrics.safeDailyLimit}** will keep you right on track for your monthly savings goal!`,
      status: 'indigo'
    };
  }
}
