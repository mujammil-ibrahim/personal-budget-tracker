/* ==========================================================================
   PERSONAL BUDGET TRACKER - AI RECOMMENDATION ENGINE (v2.0)
   Smart, Conversational, Dynamic Financial Companion with Auto-Action Execution
   ========================================================================== */

import { dbStore } from './store.js';

export class AIEngine {
  static processQuery(promptText, customParams = {}) {
    const metrics = dbStore.getDashboardMetrics();
    const expenses = dbStore.getTable('Expenses');
    const currency = metrics.currency;

    const queryLower = (promptText || '').toLowerCase().trim();

    // Extract numbers (supports ₹500, $50, 500.50, 1500)
    const extractedNumbers = queryLower.match(/\d+(\.\d+)?/g);
    let extractedAmount = extractedNumbers ? parseFloat(extractedNumbers[0]) : 0;

    // =========================================================================
    // ⚡ AI AUTO-ACTION EXECUTION SYSTEM
    // =========================================================================

    // A1. Auto-Log Expense (e.g. "log 50 for coffee", "spent 150 on lunch", "add expense 500 grocery")
    if (queryLower.includes('log expense') || queryLower.startsWith('spent') || queryLower.startsWith('log ') || queryLower.includes('add expense')) {
      if (extractedAmount > 0) {
        // Detect category
        let cat = 'Dining';
        if (queryLower.includes('rent') || queryLower.includes('house')) cat = 'Rent';
        else if (queryLower.includes('bill') || queryLower.includes('electricity') || queryLower.includes('water') || queryLower.includes('utility')) cat = 'Utilities';
        else if (queryLower.includes('groc') || queryLower.includes('supermarket') || queryLower.includes('market')) cat = 'Grocery';
        else if (queryLower.includes('shop') || queryLower.includes('cloth') || queryLower.includes('shoes')) cat = 'Shopping';
        else if (queryLower.includes('uber') || queryLower.includes('cab') || queryLower.includes('bus') || queryLower.includes('fuel') || queryLower.includes('transport')) cat = 'Transport';
        else if (queryLower.includes('movie') || queryLower.includes('fun') || queryLower.includes('game') || queryLower.includes('entertainment')) cat = 'Entertainment';

        // Extract merchant/description
        let merchant = promptText.replace(/log expense|log|spent|add expense|for|on|₹|\$|€|£|\d+(\.\d+)?/gi, '').trim();
        if (!merchant) merchant = cat + ' Item';
        merchant = merchant.charAt(0).toUpperCase() + merchant.slice(1);

        dbStore.addItem('Expenses', {
          amount: extractedAmount,
          category: cat,
          merchant,
          date: new Date().toISOString().split('T')[0],
          payment_method: 'Card',
          notes: 'AI Conversation Quick Log'
        });

        const newMetrics = dbStore.getDashboardMetrics();
        return {
          title: "Expense Logged Automatically! 💳",
          text: `✅ Added **${currency}${extractedAmount.toFixed(2)}** for **${merchant}** under **${cat}**!\n\nYour updated Net Available Cash is **${currency}${newMetrics.netAvailableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}**.`,
          status: 'emerald',
          executedAction: 'expense_logged'
        };
      }
    }

    // A2. Auto-Log Income (e.g. "add income 5000 freelance", "got salary 20000", "log income 1000")
    if (queryLower.includes('add income') || queryLower.includes('log income') || queryLower.includes('got salary') || queryLower.includes('recieved income')) {
      if (extractedAmount > 0) {
        let source_name = promptText.replace(/add income|log income|got salary|recieved income|salary|for|from|₹|\$|€|£|\d+(\.\d+)?/gi, '').trim();
        if (!source_name) source_name = 'Side Income';
        source_name = source_name.charAt(0).toUpperCase() + source_name.slice(1);

        dbStore.addItem('Income', {
          amount: extractedAmount,
          source_name,
          category: 'Bonus',
          date: new Date().toISOString().split('T')[0],
          recurrence: 'one_time',
          notes: 'AI Conversation Quick Income'
        });

        const newMetrics = dbStore.getDashboardMetrics();
        return {
          title: "Income Deposited! 💵",
          text: `🎉 Added **${currency}${extractedAmount.toFixed(2)}** income from **${source_name}**!\n\nYour total monthly income is now **${currency}${newMetrics.monthIncome.toLocaleString()}**, with **${currency}${newMetrics.netAvailableBalance.toLocaleString()}** Net Available Cash.`,
          status: 'emerald',
          executedAction: 'income_logged'
        };
      }
    }

    // A3. Auto-Log Savings Deposit (e.g. "save 1000", "deposit 500 into savings")
    if (queryLower.startsWith('save ') || queryLower.includes('deposit ') || queryLower.includes('add savings')) {
      if (extractedAmount > 0) {
        const goals = dbStore.getTable('Goals');
        const defaultGoal = goals[0] || { id: 'g_1', title: 'General Savings' };

        dbStore.addItem('Savings', {
          amount: extractedAmount,
          goal_id: defaultGoal.id,
          deposit_date: new Date().toISOString().split('T')[0],
          notes: 'AI Quick Savings Deposit'
        });

        const newMetrics = dbStore.getDashboardMetrics();
        return {
          title: "Savings Deposited! 🏦",
          text: `🏦 Deposited **${currency}${extractedAmount.toFixed(2)}** into **${defaultGoal.title}**!\n\nTotal month savings: **${currency}${newMetrics.monthSavings.toLocaleString()}**. Net Cash remaining: **${currency}${newMetrics.netAvailableBalance.toLocaleString()}**.`,
          status: 'emerald',
          executedAction: 'savings_logged'
        };
      }
    }

    // A4. Add to Wishlist / Shopping Planner (e.g. "wishlist airpods 150", "add item watch 200")
    if (queryLower.includes('wishlist') || queryLower.includes('plan to buy') || queryLower.includes('add item')) {
      if (extractedAmount > 0) {
        let itemName = promptText.replace(/wishlist|plan to buy|add item|for|on|₹|\$|€|£|\d+(\.\d+)?/gi, '').trim();
        if (!itemName) itemName = 'Planned Item';
        itemName = itemName.charAt(0).toUpperCase() + itemName.slice(1);

        dbStore.addItem('Wishlist', {
          item_name: itemName,
          price: extractedAmount,
          category: 'Shopping',
          buy_timing: 'month',
          urgency: 'Medium',
          status: 'wishing'
        });

        return {
          title: "Added to Shopping List! 🛒",
          text: `🛒 Added **${itemName}** (${currency}${extractedAmount.toFixed(2)}) to your **Shopping List & Purchase Planner**!`,
          status: 'indigo',
          executedAction: 'wishlist_logged'
        };
      }
    }

    // =========================================================================
    // 🧠 CONVERSATIONAL FINANCIAL QUERY EVALUATIONS
    // =========================================================================

    // 1. "Can I buy..." / Purchase Feasibility
    if (queryLower.includes('can i buy') || queryLower.includes('should i buy') || queryLower.includes('can i afford') || customParams.type === 'can_i_buy') {
      const price = customParams.price ? parseFloat(customParams.price) : extractedAmount;
      let itemName = customParams.itemName || promptText.replace(/can i buy|should i buy|can i afford|for|\$|₹|€|£|\d+(\.\d+)?/gi, '').trim();
      if (!itemName) itemName = 'this item';

      if (price <= 0) {
        return {
          title: "Purchase Evaluator 🤔",
          text: `Tell me what item you'd like to buy and its price (e.g. *"Can I buy a watch for $150?"* or *"Can I buy shoes for ₹2500?"*)!`,
          status: 'info'
        };
      }

      if (price <= metrics.safeDailyLimit) {
        return {
          title: "Yes! Safe to Buy 🎉",
          text: `**${itemName}** (${currency}${price}) is comfortably within your daily safe allowance of **${currency}${metrics.safeDailyLimit}**. Go for it!`,
          status: 'emerald'
        };
      } else if (price <= metrics.netAvailableBalance) {
        const remainingAfter = (metrics.netAvailableBalance - price).toFixed(2);
        return {
          title: "Feasible with Care ⚠️",
          text: `You have enough cash for **${itemName}** (${currency}${price}), but it will reduce your Net Available Cash to **${currency}${remainingAfter}**. Your revised daily allowance will adjust to **${currency}${(remainingAfter / metrics.remainingDays).toFixed(2)}/day**.`,
          status: 'amber'
        };
      } else {
        const deficit = (price - metrics.netAvailableBalance).toFixed(2);
        return {
          title: "Hold Off for Now 🛑",
          text: `**${itemName}** (${currency}${price}) exceeds your Net Available Cash balance by **${currency}${deficit}**. Save it in your **Shopping List** or wait until your next paycheck!`,
          status: 'rose'
        };
      }
    }

    // 2. Net Cash & Balance query
    if (queryLower.includes('net cash') || queryLower.includes('balance') || queryLower.includes('available cash') || queryLower.includes('how much money')) {
      return {
        title: "Net Available Cash Breakdown 💵",
        text: `• **Monthly Income**: ${currency}${metrics.monthIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}\n• **Total Expenses**: ${currency}${metrics.monthExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}\n• **Savings & Goals**: ${currency}${metrics.monthSavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}\n\n👉 **Net Available Cash**: **${currency}${metrics.netAvailableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}**\n👉 **Safe Daily Limit**: **${currency}${metrics.safeDailyLimit}/day** (${metrics.remainingDays} days left).`,
        status: 'emerald'
      };
    }

    // 3. Financial Health Score Audit
    if (queryLower.includes('health') || queryLower.includes('score') || queryLower.includes('audit') || queryLower.includes('status')) {
      const savingsRate = metrics.monthIncome > 0 ? ((metrics.monthSavings / metrics.monthIncome) * 100) : 0;
      const expenseRate = metrics.monthIncome > 0 ? ((metrics.monthExpenses / metrics.monthIncome) * 100) : 0;
      
      let score = 100;
      if (expenseRate > 80) score -= 40;
      else if (expenseRate > 60) score -= 20;
      if (savingsRate < 10) score -= 20;
      else if (savingsRate >= 20) score += 10;
      score = Math.min(100, Math.max(0, score));

      let badge = '🟢 Excellent';
      if (score < 60) badge = '🔴 High Risk';
      else if (score < 80) badge = '🟡 Fair';

      return {
        title: `Financial Health Score: ${score}/100 (${badge}) 📈`,
        text: `• **Savings Rate**: ${savingsRate.toFixed(0)}% (Goal: 20%+)\n• **Expense Ratio**: ${expenseRate.toFixed(0)}% of income\n• **Daily Safe Allowance**: ${currency}${metrics.safeDailyLimit}/day\n\n${score >= 80 ? '🌟 Awesome financial management!' : '💡 Tip: Keep daily spending below your safe limit to build surplus savings.'}`,
        status: score >= 80 ? 'emerald' : (score >= 60 ? 'amber' : 'rose')
      };
    }

    // 4. Budget status
    if (queryLower.includes('budget') || queryLower.includes('left') || queryLower.includes('remaining')) {
      const pctLeft = ((metrics.remainingBudget / (metrics.totalAllocatedBudget || 1)) * 100).toFixed(0);
      return {
        title: "Remaining Budget Summary 📊",
        text: `You have **${currency}${metrics.remainingBudget.toLocaleString()}** left in your category budget limits (**${pctLeft}%** remaining).\n\nYour safe daily spending allowance for the remaining **${metrics.remainingDays} days** is **${currency}${metrics.safeDailyLimit}/day**.`,
        status: metrics.remainingBudget > 0 ? 'emerald' : 'rose'
      };
    }

    // 5. Expenses / Spending query
    if (queryLower.includes('spent') || queryLower.includes('expense') || queryLower.includes('cost') || queryLower.includes('paid')) {
      const categories = ['dining', 'rent', 'utilities', 'shopping', 'transport', 'entertainment', 'health', 'grocery'];
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

    // 6. Savings query
    if (queryLower.includes('save') || queryLower.includes('saving') || queryLower.includes('deposit')) {
      const recommendedTarget = (metrics.monthIncome * 0.20).toFixed(0);
      return {
        title: "Savings Summary & Targets 🎯",
        text: `Aim to save at least **20% of your monthly income** (**${currency}${recommendedTarget}/month**).\n\nYou have deposited **${currency}${metrics.monthSavings.toLocaleString()}** into savings & goals so far this month!`,
        status: 'emerald'
      };
    }

    // 7. Greetings & Friendly Assistant Fallback
    if (queryLower.includes('hi') || queryLower.includes('hello') || queryLower.includes('hey') || queryLower.includes('who are you')) {
      return {
        title: "Hello! 👋 I'm Money Companion AI",
        text: `Ask me questions or type fast commands like:\n• *"Can I buy a jacket for ${currency}100?"*\n• *"Log expense 50 for Coffee"*\n• *"Add income 5000 freelance"*\n• *"What is my health score?"*`,
        status: 'indigo'
      };
    }

    // General fallback insight
    return {
      title: "Money Companion Insight 💡",
      text: `Staying under your safe daily allowance of **${currency}${metrics.safeDailyLimit}/day** will preserve your **${currency}${metrics.netAvailableBalance.toLocaleString()}** Net Available Cash balance!`,
      status: 'indigo'
    };
  }
}
