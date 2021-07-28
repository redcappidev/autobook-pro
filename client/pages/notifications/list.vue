<template>
  <q-list bordered separator v-if="theNotifications.length > 0">
    <q-item>
      <q-item-section>
        <q-item-label header>{{ label }}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-btn
          outline
          size="sm"
          label="Mark all as read"
          @click="handleMarkAllAsRead"
          :loading="saving.all"
        />
      </q-item-section>
    </q-item>
    <q-slide-item
      @left="markAsRead(notification)"
      v-for="notification in theNotifications"
      :key="notification.id"
    >
      <template v-slot:left>
        <span v-if="!saving[notification.id]">Mark as read</span>
        <q-spinner v-else />
      </template>
      <q-item>
        <q-item-section>
          <q-item-label>{{ notification.description }}</q-item-label>
          <q-item-label caption>{{
            notification.createdAt | localTime
          }}</q-item-label>
        </q-item-section>
        <q-item-section
          side
          v-if="notification.actions && notification.actions.length > 0"
        >
          <q-btn
            outline
            size="sm"
            v-for="(action, index) in notification.actions"
            :key="index"
            :label="action.label"
            @click="action.handler"
          ></q-btn>
        </q-item-section>
      </q-item>
    </q-slide-item>
  </q-list>
  <q-list bordered separator v-else>
    <q-item-label header>{{ label }}</q-item-label>
    <q-item>
      <q-item-section>
        <q-item-label caption>No new notifications</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import graphql from '@client/graphql';
import { NOTIFICATION_ACTIONS } from '@server/constants';

export default {
  name: 'AppNotificationList',
  props: {
    label: String,
    notifications: {
      type: Array,
      default: function () {
        return [];
      }
    },
    dateRange: String
  },
  data() {
    return {
      saving: {}
    };
  },
  computed: {
    theNotifications() {
      return this.notifications.map((notif) => {
        let actions = [];
        if (notif.actions && notif.actions.length > 0) {
          actions = notif.actions.map((action) => {
            const na = NOTIFICATION_ACTIONS.find((d) => d.type === action.type);

            return {
              label: na.label,
              handler: () => na.handler(action)
            };
          });
        }

        return {
          ...notif,
          actions
        };
      });
    }
  },
  methods: {
    async markAsRead(notification) {
      this.$set(this.saving, notification.id, true);
      await this.$apollo.mutate({
        mutation: graphql.mutations.markNotificationAsRead,
        variables: {
          id: notification.id
        }
      });
      this.$set(this.saving, notification.id, false);

      this.$emit('on-read');
    },
    async handleMarkAllAsRead() {
      this.$set(this.saving, 'all', true);
      if (this.dateRange === 'today') {
        await this.$apollo.mutate({
          mutation: graphql.mutations.markTodayNotificationsAsRead
        });
      } else {
        await this.$apollo.mutate({
          mutation: graphql.mutations.markEarlierNotificationsAsRead
        });
      }
      this.$set(this.saving, 'all', false);

      this.$emit('on-read');
    }
  }
};
</script>

<style></style>
