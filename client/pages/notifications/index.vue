<template>
  <div class="autobookpro-page-content">
    <div class="q-mb-lg">
      <span class="text-h5">Notifications</span>
    </div>

    <app-notification-list
      class="q-mb-md"
      label="Today"
      dateRange="today"
      :notifications="todayNotifications"
      @on-read="handleMarkAsRead('today', $event)"
    />
    <app-notification-list
      label="Earlier"
      dateRange="earlier"
      :notifications="earlierNotifications"
      @on-read="handleMarkAsRead('earlier', $event)"
    />
  </div>
</template>

<script>
import graphql from '@client/graphql';
import AppNotificationList from './list';

export default {
  name: 'AppNotifications',
  components: {
    AppNotificationList
  },
  apollo: {
    todayNotifications: {
      query: graphql.queries.getTodayNotifications,
      fetchPolicy: 'cache-and-network'
    },
    earlierNotifications: {
      query: graphql.queries.getEarlierNotifications,
      fetchPolicy: 'cache-and-network'
    },
    notificationsCount: {
      query: graphql.queries.getNotificationsCount,
      fetchPolicy: 'cache-and-network'
    }
  },
  methods: {
    async handleMarkAsRead(type) {
      if (type === 'today') {
        this.$apollo.queries.todayNotifications.refetch();
      } else {
        this.$apollo.queries.earlierNotifications.refetch();
      }
      this.$apollo.queries.notificationsCount.refetch();
    }
  }
};
</script>

<style></style>
