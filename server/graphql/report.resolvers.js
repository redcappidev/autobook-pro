import * as reportService from '@server/services/report-service';

export default {
  Query: {
    quotesMonthlyTotals: (parent, args, { user }) => reportService.getQuotesMonthlyTotals(user),
    userQuotesDailyTotals: (parent, { startDate, endDate }, { user }) =>
      reportService.getUserQuotesDailyTotals(user, startDate, endDate),
    todayTransactions: () => reportService.getTodayTransactions()
  },
  Mutation: {
  }
};
