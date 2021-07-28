<template>
  <div class="autobookpro-page-content">
    <q-tabs
      active-color="primary"
      indicator-color="primary"
      dense
      class="text-grey"
      align="left"
      narrow-indicator
    >
      <q-route-tab
        label="General"
        :to="{ name: 'general' }"
        v-if="tabs.includes('general')"
      />
      <q-route-tab
        label="Email Templates"
        :to="{ name: 'email-templates' }"
        v-if="tabs.includes('email')"
      />
      <q-route-tab
        label="SMS Templates"
        :to="{ name: 'sms-templates' }"
        v-if="tabs.includes('sms')"
      />
      <q-route-tab
        label="Statuses"
        :to="{ name: 'statuses' }"
        v-if="tabs.includes('status')"
      />
      <q-route-tab
        label="Lead Schedule"
        :to="{ name: 'lead-schedule' }"
        v-if="tabs.includes('lead-schedule')"
      />
      <q-route-tab
        label="Short Codes"
        :to="{ name: 'short-codes' }"
        v-if="tabs.includes('short-codes')"
      />
      <q-route-tab label="Integrations" :to="{ name: 'integrations' }" />
    </q-tabs>
    <q-separator />
    <router-view />
  </div>
</template>

<script>
import graphql from '@client/graphql';
import { assessPermission } from '@server/lib/permission-helpers';

export default {
  name: 'Settings',
  apollo: {
    currentUser: {
      query: graphql.queries.currentUser,
      result(result) {
        if (result.loading) return;

        const user = result.data.currentUser;
        const tabs = ['general', 'short-codes'];
        if (assessPermission.emailTemplate.canView(user)) {
          tabs.push('email');
        }
        if (assessPermission.smsTemplate.canView(user)) {
          tabs.push('sms');
        }
        if (assessPermission.status.canView(user)) {
          tabs.push('status');
        }
        if (assessPermission.isSuperAdmin(user)) {
          tabs.push('lead-schedule');
        }

        this.tabs = tabs;
      }
    }
  },
  data() {
    return {
      tabs: []
    };
  }
};
</script>
<style lang="scss"></style>
