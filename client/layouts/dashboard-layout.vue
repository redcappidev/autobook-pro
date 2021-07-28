<template>
  <div v-if="loadingUser">Loading...</div>
  <div v-else-if="userError">Loading...</div>
  <q-layout
    v-else-if="currentUser"
    view="lHh Lpr lff"
    container
    class="window-height"
  >
    <q-header bordered height-hint="98">
      <q-toolbar>
        <q-btn dense flat icon="menu" @click="left = !left" />

        <q-toolbar-title class="text-bold">AutoBook Pro</q-toolbar-title>

        <div class="row q-gutter-x-sm items-center">
          <q-btn
            v-if="canCreateQuote"
            color="secondary"
            label="Quick Quote"
            flat
            @click="$refs.quickQuoteDialogRef.openDialog()"
          />

          <q-btn
            v-if="canCreateQuote"
            color="secondary"
            label="Create Quote"
            flat
            @click="$router.push({ name: 'create-quote' })"
          />

          <q-btn
            v-if="canCreateOrder"
            color="secondary"
            label="Create Order"
            flat
            @click="$router.push({ name: 'create-order' })"
          />

          <app-power-search-input v-if="canViewQuoteOrOrder" />

          <q-btn
            dense
            flat
            icon="notification_important"
            :to="{ name: 'notifications' }"
          >
            <q-badge v-if="notificationsCount > 0" color="red" floating>{{
              notificationsCount
            }}</q-badge>
          </q-btn>
          <q-btn-dropdown icon="account_circle" flat dense>
            <div class="row no-wrap q-pa-md">
              <div class="column">
                <div class="text-h6">Settings</div>
                <q-separator />
                <p class="q-my-sm text-uppercase">
                  contexts for setting
                </p>
              </div>

              <q-separator vertical inset class="q-mx-lg" />

              <div class="column items-center">
                <q-avatar size="72px">
                  <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                </q-avatar>

                <div class="text-subtitle1 q-mt-md q-mb-xs">
                  {{ currentUser.firstName }}
                  {{ currentUser.lastName }}
                </div>

                <q-btn
                  color="primary"
                  @click="handleLogout"
                  label="Logout"
                  push
                  size="sm"
                  v-close-popup
                />
              </div>
            </div>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      :width="250"
      :breakpoint="400"
      v-model="left"
      side="left"
      bordered
    >
      <q-scroll-area
        style="
          height: calc(100% - 150px);
          margin-top: 150px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list padding>
          <q-item
            v-for="item in sidebarItems"
            :key="item.id"
            :to="item.path"
            v-ripple
          >
            <q-item-section avatar>
              <q-icon :name="item.icon" />
            </q-item-section>

            <q-item-section>
              {{ item.label }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-img
        class="absolute-top"
        src="https://cdn.quasar.dev/img/material.png"
        style="height: 150px;"
      >
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
          <div class="text-weight-bold">
            {{ currentUser.firstName }} {{ currentUser.lastName }}
          </div>
          <div>Administrator</div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <q-page padding>
        <router-view :key="$route.path" />
      </q-page>
    </q-page-container>

    <app-quick-quote-dialog ref="quickQuoteDialogRef" />
  </q-layout>
</template>
<script>
import { Auth0 } from '@client/third-party';
import graphql from '@client/graphql';
import AppPowerSearchInput from '@client/components/filters/power-search';
import AppQuickQuoteDialog from '@client/components/dialogs/quick-quote-dialog';
import { NOTIFICATION_ACTIONS } from '@server/constants';
import { assessPermission } from '@server/lib/permission-helpers';
import { colors } from 'quasar';
import sidebarItems from './sidebar-items';

export default {
  name: 'DashboardLayout',
  components: {
    AppPowerSearchInput,
    AppQuickQuoteDialog
  },
  apollo: {
    currentUser: {
      query: graphql.queries.currentUser,
      watchLoading(isLoading) {
        this.loadingUser = isLoading;
      },
      error(error) {
        this.userError = error;
      },
      result(result) {
        if (result.loading) return;

        this.resolveSidebarItems();
        this.connectWebsocket();
      }
    },
    notificationsCount: {
      query: graphql.queries.getNotificationsCount
    }
  },
  data() {
    return {
      loadingUser: false,
      userError: null,

      left: false,
      sidebarItems: []
    };
  },
  computed: {
    canViewQuoteOrOrder() {
      return (
        assessPermission.quote.canView(this.currentUser) ||
        assessPermission.order.canView(this.currentUser)
      );
    },
    canCreateQuote() {
      return assessPermission.quote.canCreate(this.currentUser);
    },
    canCreateOrder() {
      return assessPermission.order.canCreate(this.currentUser);
    }
  },
  mounted() {
    const types = [
      'primary',
      'secondary',
      'accent',
      'dark',
      'positive',
      'negative',
      'info',
      'warning'
    ];
    types.forEach((type) => {
      const color = localStorage.getItem(`${type}-color`);
      if (color) {
        colors.setBrand(type, color);
      }
    });

    const darkMode = localStorage.getItem('dark-mode');
    if (darkMode === 'true') {
      this.$q.dark.set(true);
    } else {
      this.$q.dark.set(false);
    }
  },
  methods: {
    resolveSidebarItems() {
      const menuItems = [];

      menuItems.push(sidebarItems.dashboard);

      if (assessPermission.carrier.canView(this.currentUser)) {
        menuItems.push(sidebarItems.carriers);
      }

      if (assessPermission.quote.canView(this.currentUser)) {
        menuItems.push(sidebarItems.quotes);
        menuItems.push(sidebarItems.followups);
      }

      if (assessPermission.order.canView(this.currentUser)) {
        menuItems.push(sidebarItems.orders);
      }

      if (assessPermission.report.canView(this.currentUser)) {
        menuItems.push(sidebarItems.reports);
      }

      if (assessPermission.user.canView(this.currentUser)) {
        menuItems.push(sidebarItems.users);
      }

      if (assessPermission.taq.canView(this.currentUser)) {
        menuItems.push(sidebarItems.taq);
      }

      menuItems.push(sidebarItems.settings);

      this.sidebarItems = menuItems;
    },
    connectWebsocket() {
      if (!window.WEBSOCKET_ENDPOINT) return;

      const ws = new WebSocket(window.WEBSOCKET_ENDPOINT);
      ws.onopen = (event) => {
        console.log('websocket gets opened', event);

        ws.send(
          JSON.stringify({
            action: 'connect-user',
            body: { id: this.currentUser.id }
          })
        );
      };

      ws.onmessage = (event) => {
        console.log('websocket on message', event);

        this.$apollo.queries.notificationsCount.refetch();
        this.handleSocketMessage(event.data);
      };

      ws.onclose = (event) => {
        console.log('websocket gets closed', event);
      };

      window.ws = ws;
    },
    handleSocketMessage(data) {
      try {
        const message = JSON.parse(data);
        if (message.type === 'notification') {
          this.handlePushNotification(message.data);
        }
      } catch (error) {
        console.error(error);
      }
    },
    handlePushNotification(notification) {
      const data = {
        type: notification.type.toLowerCase(),
        message: notification.description,
        position: 'bottom-right',
        multiline: true,
        timeout: 10000
      };

      if (!notification.actions) {
        this.$q.notify(data);
        return;
      }

      data.actions = notification.actions
        .map((action) => {
          const na = NOTIFICATION_ACTIONS.find((d) => d.type === action.type);
          if (!na) return null;

          return {
            label: na.label,
            handler: () => {
              this.$apollo.queries.notificationsCount.refetch();
              na.handler(action);
            }
          };
        })
        .filter((action) => action);

      this.$q.notify(data);
    },
    handleLogout() {
      Auth0.logout();
    }
  }
};
</script>

<style></style>
