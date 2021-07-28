import { User, Notification } from '@server/models';
import { getDateRange } from '@server/lib/date-format';
import { DATE_RANGE } from '@server/constants';

export default {
  Query: {
    todayNotifications: (parent, args, { user }) => {
      const range = getDateRange(DATE_RANGE.today);

      return User.relatedQuery('notifications')
        .for(user.id)
        .where('viewed', false)
        .where('createdAt', '>=', range.startDate)
        .where('createdAt', '<=', range.endDate)
        .orderBy('createdAt', 'DESC');
    },
    earlierNotifications: (parent, args, { user }) => {
      const range = getDateRange(DATE_RANGE.today);

      return User.relatedQuery('notifications')
        .for(user.id)
        .where('viewed', false)
        .where('createdAt', '<', range.startDate)
        .orderBy('createdAt', 'DESC');
    },
    notificationsCount: async (parent, args, { user }) => {
      const data = await User.relatedQuery('notifications')
        .for(user.id)
        .where('viewed', false)
        .count();
      return data[0].count;
    }
  },
  Mutation: {
    markNotificationAsRead: async (_, { id }, { user }) => {
      const notification = await Notification.query().findById(id);

      if (!notification || notification.userId !== user.id) return;
      await notification.$query().patch({ viewed: true });
    },
    markTodayNotificationsAsRead: async (_, __, { user }) => {
      const range = getDateRange(DATE_RANGE.today);

      await User.relatedQuery('notifications')
        .for(user.id)
        .where('viewed', false)
        .where('createdAt', '>=', range.startDate)
        .where('createdAt', '<=', range.endDate)
        .patch({ viewed: true });
    },
    markEarlierNotificationsAsRead: async (_, __, { user }) => {
      const range = getDateRange(DATE_RANGE.today);

      await User.relatedQuery('notifications')
        .for(user.id)
        .where('viewed', false)
        .where('createdAt', '<', range.startDate)
        .patch({ viewed: true });
    }
  }
};
