<template>
  <div class="row q-col-gutter-sm fit over-flow">
    <div class="col-6 column">
      <div class="text-h5">My Monthly Totals</div>
      <div class="row q-gutter-sm" v-if="!loadingMonthlyTotals">
        <app-aggregation-card
          icon="layers"
          color="warning"
          label="New Quotes"
          :value="quotesMonthlyTotals.byMe.newQuotes"
        />
        <app-aggregation-card
          icon="message"
          color="secondary"
          label="New Followups"
          :value="quotesMonthlyTotals.byMe.newFollowups"
        />
        <app-aggregation-card
          icon="shopping_cart"
          color="primary"
          label="New Orders"
          :value="quotesMonthlyTotals.byMe.newOrders"
        />
        <app-aggregation-card
          icon="local_offer"
          color="positive"
          label="Dispatches"
          :value="quotesMonthlyTotals.byMe.newDispatches"
        />
      </div>
      <div class="q-mt-sm" v-if="!loadingMonthlyTotals">
        <span class="text-caption">Closing Rate</span>
        <q-linear-progress
          :value="
            quotesMonthlyTotals.byMe.newDispatches /
            quotesMonthlyTotals.byMe.newQuotes
          "
        />
      </div>
      <div class="text-h5 q-mt-md">Company Monthly Totals</div>
      <div class="row q-gutter-sm" v-if="!loadingMonthlyTotals">
        <app-aggregation-card
          icon="layers"
          color="warning"
          label="New Quotes"
          :value="quotesMonthlyTotals.byCompany.newQuotes"
        />
        <app-aggregation-card
          icon="message"
          color="secondary"
          label="New Followups"
          :value="quotesMonthlyTotals.byCompany.newFollowups"
        />
        <app-aggregation-card
          icon="shopping_cart"
          color="primary"
          label="New Orders"
          :value="quotesMonthlyTotals.byCompany.newOrders"
        />
        <app-aggregation-card
          icon="local_offer"
          color="positive"
          label="Dispatches"
          :value="quotesMonthlyTotals.byCompany.newDispatches"
        />
      </div>
      <div class="q-mt-sm" v-if="!loadingMonthlyTotals">
        <span class="text-caption">Closing Rate</span>
        <q-linear-progress
          :value="
            quotesMonthlyTotals.byCompany.newDispatches /
            quotesMonthlyTotals.byCompany.newQuotes
          "
        />
      </div>
      <div class="q-mt-lg col-grow column">
        <app-dashboard-calendar-card />
      </div>
    </div>
    <div class="col-6 q-gutter-y-sm">
      <div class="row q-gutter-sm">
        <app-sales-tracker-card
          class="col"
          v-if="!loadingMonthlyTotals"
          :data="quotesMonthlyTotals.byUsers"
        />
        <app-team-members-contact-card class="col" />
      </div>
      <div class="row">
        <app-today-charges-card class="col" />
        <app-estimated-transport-times-card class="col" />
      </div>
      <div class="row q-gutter-x-sm">
        <app-state-abbrs-card />
        <app-timezone-map-card />
      </div>
    </div>
  </div>
</template>

<script>
import AppAggregationCard from '@client/components/cards/aggregation-card';
import AppDashboardCalendarCard from '@client/components/cards/dashboard-calendar-card';
import AppSalesTrackerCard from '@client/components/cards/sales-tracker-card';
import AppEstimatedTransportTimesCard from '@client/components/cards/estimated-transport-times-card';
import AppTeamMembersContactCard from '@client/components/cards/team-members-contact-card';
import AppStateAbbrsCard from '@client/components/cards/state-abbrs-card';
import AppTodayChargesCard from '@client/components/cards/today-charges-card';
import AppTimezoneMapCard from '@client/components/cards/timezone-map-card';
import graphql from '@client/graphql';

export default {
  metaInfo: {
    title: 'AutoBook Pro - Dashboard'
  },
  components: {
    AppAggregationCard,
    AppDashboardCalendarCard,
    AppSalesTrackerCard,
    AppEstimatedTransportTimesCard,
    AppTeamMembersContactCard,
    AppStateAbbrsCard,
    AppTodayChargesCard,
    AppTimezoneMapCard
  },
  apollo: {
    quotesMonthlyTotals: {
      query: graphql.queries.getQuotesMonthlyTotals,
      watchLoading(isLoading) {
        this.loadingMonthlyTotals = isLoading;
      }
    }
  },
  data() {
    return {
      loadingMonthlyTotals: false
    };
  }
};
</script>
<style lang="style"></style>
