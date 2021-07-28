import { QuoteTransition, User, Transaction } from '@server/models';
import { getDateRange } from '@server/lib/date-format';
import { DATE_RANGE, QUOTE_TRANSITIONS } from '@server/constants';
import * as followupService from './followup-service';
import * as quoteService from './quote-service';

export const getQuotesMonthlyTotals = async (user) => {
  const range = getDateRange(DATE_RANGE.month);
  const transitions = await QuoteTransition.query()
    .where('createdAt', '>=', range.startDate)
    .where('createdAt', '<=', range.endDate);

  const assignedQuotes = await User.relatedQuery('assignedQuotes').for(user.id);
  const assignedQuoteIds = assignedQuotes.map((q) => q.id);

  const result = {
    byMe: {
      newQuotes: 0,
      newFollowups: 0,
      newOrders: 0,
      dispatches: 0
    },
    byCompany: {
      newQuotes: 0,
      newFollowups: 0,
      newOrders: 0,
      dispatches: 0
    },
    byUsers: []
  };

  transitions.forEach((t) => {
    if (t.to === QUOTE_TRANSITIONS.NEW_QUOTE) {
      result.byCompany.newQuotes += 1;
    } else if (t.to === QUOTE_TRANSITIONS.NEW_ORDER) {
      result.byCompany.newOrders += 1;
    } else if (t.to === QUOTE_TRANSITIONS.DISPATCH) {
      result.byCompany.dispatches += 1;
    }

    if (assignedQuoteIds.includes(t.quoteId)) {
      if (t.to === QUOTE_TRANSITIONS.NEW_QUOTE) {
        result.byMe.newQuotes += 1;
      } else if (t.to === QUOTE_TRANSITIONS.NEW_ORDER) {
        result.byMe.newOrders += 1;
      } else if (t.to === QUOTE_TRANSITIONS.DISPATCH) {
        result.byMe.dispatches += 1;
      }
    }
  });

  const companyNewFollowupsCount = await followupService.getFollowupsCountByGroup({
    filterBy: {
      group: DATE_RANGE.month
    }
  });

  const userNewFollowupsCount = await followupService.getFollowupsCountByGroup({
    filterBy: {
      group: DATE_RANGE.month,
      assigneeId: user.id
    }
  });

  result.byMe.newFollowups = userNewFollowupsCount;
  result.byCompany.newFollowups = companyNewFollowupsCount;

  const subresult = {};
  const users = await User.query().withGraphFetched('assignedQuotes');

  transitions.forEach((t) => {
    const theUser = users.find((u) => u.assignedQuotes.find((aq) => aq.id === t.quoteId));
    if (theUser) {
      subresult[theUser.id] = subresult[theUser.id] || {
        userId: theUser.id,
        name: `${theUser.firstName} ${theUser.lastName}`,
        newOrders: 0,
        newDispatches: 0
      };

      if (t.to === QUOTE_TRANSITIONS.NEW_ORDER) {
        subresult[theUser.id].newOrders += 1;
      } else if (t.to === QUOTE_TRANSITIONS.DISPATCH) {
        subresult[theUser.id].newDispatches += 1;
      }
    }
  });

  result.byUsers = Object.keys(subresult).map((uid) => subresult[uid]);

  return result;
};

export const getUserQuotesDailyTotals = async (user, startDate, endDate) => {
  const quotes = await quoteService.buildFilterQuotesQuery({
    filterBy: {
      assigneeId: user.id,
      dateRangeStart: startDate,
      dateRangeEnd: endDate
    },
    isOrder: false
  });

  const orders = await quoteService.buildFilterQuotesQuery({
    filterBy: {
      assigneeId: user.id,
      dateRangeStart: startDate,
      dateRangeEnd: endDate
    },
    isOrder: true
  });

  const followups = await followupService.buildFilterFollowupsQuery({
    filterBy: {
      assigneeId: user.id,
      dateRangeStart: startDate,
      dateRangeEnd: endDate
    }
  });

  const result = {};

  quotes.forEach((q) => {
    const date = new Date(q.transport.availableDate).toISOString().split('T')[0];
    if (result[date] && result[date].quotes) {
      result[date].quotes.push(q);
    } else {
      result[date] = {
        quotes: [q]
      };
    }
  });

  followups.forEach((f) => {
    const date = new Date(f.followupOn).toISOString().split('T')[0];
    if (result[date] && result[date].followups) {
      result[date].followups.push(f);
    } else {
      result[date] = {
        ...(result[date] || {}),
        followups: [f]
      };
    }
  });

  orders.forEach((o) => {
    const date = new Date(o.transport.availableDate).toISOString().split('T')[0];
    if (result[date] && result[date].orders) {
      result[date].orders.push(o);
    } else {
      result[date] = {
        ...(result[date] || {}),
        orders: [o]
      };
    }
  });

  return Object.keys(result)
    .sort((a, b) => (a > b ? 1 : -1))
    .map((date) => ({
      date,
      ...result[date]
    }));
};

export const getTodayTransactions = () => {
  const range = getDateRange(DATE_RANGE.today);

  return Transaction.query()
    .where('createdAt', '>=', range.startDate)
    .where('createdAt', '<=', range.endDate)
    .orderBy('createdAt', 'DESC');
};
