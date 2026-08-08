/* ==========================================================================
   PERSONAL BUDGET TRACKER - AI RECOMMENDATION ENGINE
   Lightweight, Conversational, Bite-Sized Financial Companion
   ========================================================================== */

import { dbStore } from './store.js';

export class AIEngine {
  static processQuery(promptText, customParams = {}) {
    const metrics = dbStore.getDashboardMetrics();
    const expenses = dbStore.getTable('Expenses');
    const budgets = dbStore.getTable('Budgets');
    const currency = metrics.currency;
    
    const queryLower = promptText.toLowerCase().trim();

    // 1. Can I buy this?
    if (queryLower.includes('can i buy') || customParams.type === 'can_i_buy') {
      const price = parseFloat(customParams.price || 0);
      const itemName = customParams.itemName || 'this item';
      
      if (price <= 0) {
        return {
          title: "Buy Decision Evaluator",
          text: `Enter an item name and price to get an instant feasibility assessment!`,
          status: 'info'
        };
      }

      if (price <= metrics.safeDailyLimit) {
        return {
          title: "Yes! Safe to Buy 🎉",
          text: `**${itemName}** (${currency}${price}) is comfortably within your daily safe allowance of **${currency}${metrics.safeDailyLimit}**. Go for it!`,
          status: 'emerald'
        };
      } else if (price <= metrics.remainingBudget) {
        const remainingAfter = (metrics.remainingBudget - price).toFixed(2);
        return {
          title: "Feasible with Care ⚠️",
          text: `You can buy **${itemName}** (${currency}${price}), but it will reduce your remaining monthly budget from **${currency}${metrics.remainingBudget}** down to **${currency}${remainingAfter}**. Your remaining daily allowance will adjust to **${currency}${(remainingAfter / metrics.remainingDays).toFixed(2)}/day**.`,
          status: 'amber'
        };
      } else {
        const deficit = (price - metrics.remainingBudget).toFixed(2);
        return {
          title: "Hold Off for Now 🛑",
          text: `**${itemName}** (${currency}${price}) exceeds your remaining monthly budget by **${currency}${deficit}**. Consider adding it to your **Wishlist** or waiting until next month's salary deposit!`,
          status: 'rose'
        };
      }
    }

    // 2. How much budget is left?
    if (queryLower.includes('budget is left') || queryLower.includes('budget left')) {
      const pctLeft = ((metrics.remainingBudget / (metrics.totalAllocatedBudget || 1)) * 100).toFixed(0);
      return {
        title: "Remaining Budget Summary 📊",
        text: `You have **${currency}${metrics.remainingBudget.toLocaleString()}** left in your allocated monthly budget (**${pctLeft}%** remaining).\n\nYour safe daily spending allowance for the remaining **${metrics.remainingDays} days** is **${currency}${metrics.safeDailyLimit}/day**.`,
        status: metrics.remainingBudget > 0 ? 'emerald' : 'rose'
      };
    }

    // 3. How much have I spent this month?
    if (queryLower.includes('spent this month') || queryLower.includes('total spent')) {
      return {
        title: "Monthly Spending Overview 💸",
        text: `So far this month, you've spent **${currency}${metrics.monthExpenses.toLocaleString()}** across **${expenses.length} transactions** out of your **${currency}${metrics.monthIncome.toLocaleString()}** income.`,
        status: 'indigo'
      };
    }

    // 4. What category am I spending the most on?
    if (queryLower.includes('category am i spending') || queryLower.includes('top category')) {
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
        text: `Your highest spending category this month is **${topCat}** at **${currency}${topAmount.toLocaleString()}** (**${pctOfTotal}%** of all expenses).`,
        status: 'violet'
      };
    }

    // 5. How much should I save this month?
    if (queryLower.includes('should i save') || queryLower.includes('recommended savings')) {
      const recommendedTarget = (metrics.monthIncome * 0.20).toFixed(0); // 20% rule of thumb
      const currentSavedThisMonth = dbStore.getTable('Savings').reduce((s, item) => s + parseFloat(item.amount || 0), 0);
      
      return {
        title: "Savings Goal Recommendation 🎯",
        text: `Based on the 50/30/20 rule, aim to save **20% of your income** (**${currency}${recommendedTarget}/month**).\n\nYou've saved **${currency}${currentSavedThisMonth}** so far this month! Keep up the momentum.`,
        status: 'emerald'
      };
    }

    // Default Friendly Insight
    return {
      title: "Friendly Money Tip 💡",
      text: `Staying under your daily safe limit of **${currency}${metrics.safeDailyLimit}** will leave you with an extra **${currency}${(metrics.safeDailyLimit * 5).toFixed(0)}** by the end of the week!`,
      status: 'indigo'
    };
  }
}
