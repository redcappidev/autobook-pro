<template>
  <q-card class="col-grow column" flat bordered>
    <q-card-section class="col-grow column">
      <q-calendar
        class="col-grow column"
        v-if="!loadingCalendarData"
        ref="calendar"
        v-touch-swipe.mouse.left.right="handleSwipe"
        v-model="selectedDate"
        animated
        transition-prev="slide-right"
        transition-next="slide-left"
        view="month"
        :weekdays="weekdays"
        short-month-label
        short-weekday-label
      >
        <template #day="{ timestamp }">
          <router-link
            class="badge-link"
            :to="getLink(timestamp.date, 'quotes')"
          >
            <q-badge
              v-if="getQuotes(timestamp.date).length > 0"
              class="cursor-pointer"
              rounded
              color="warning"
              :label="getQuotes(timestamp.date).length"
            />
          </router-link>
          <router-link
            class="badge-link"
            :to="getLink(timestamp.date, 'followups')"
          >
            <q-badge
              v-if="getFollowups(timestamp.date).length > 0"
              class="cursor-pointer"
              rounded
              color="secondary"
              :label="getFollowups(timestamp.date).length"
            />
          </router-link>
          <router-link
            class="badge-link"
            :to="getLink(timestamp.date, 'orders')"
          >
            <q-badge
              v-if="getOrders(timestamp.date).length > 0"
              class="cursor-pointer"
              rounded
              color="primary"
              :label="getOrders(timestamp.date).length"
            />
          </router-link>
          <router-link
            class="badge-link"
            :to="getLink(timestamp.date, 'dispatches')"
          >
            <q-badge
              v-if="getDispatches(timestamp.date).length > 0"
              class="cursor-pointer"
              rounded
              color="positive"
              :label="getDispatches(timestamp.date).length"
            />
          </router-link>
        </template>
      </q-calendar>
    </q-card-section>
    <q-dialog v-model="displayEvent">
      <q-card v-if="selectedBubble" style="min-width: 500px;">
        <q-card-section class="text-center">
          <div class="text-h6 text-weight-medium text-capitalize">
            {{ selectedBubble.state }}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-gutter-y-sm">
          <q-markup-table flat dense>
            <tbody>
              <tr
                v-for="(item, index) in selectedBubble.items"
                v-bind:key="index"
              >
                <td class="text-left">
                  <a :href="`/${selectedBubble.state}/${item.id}`"
                    >#{{ item.id }}</a
                  >
                </td>
                <td>
                  {{ item.shipper.firstName }} {{ item.shipper.lastName }}
                </td>
                <td>
                  {{ item.origin.city }} {{ item.origin.state }},
                  {{ item.origin.zipcode }}
                </td>
                <td class="text-right">
                  {{ item.destination.city }} {{ item.destination.state }},
                  {{ item.destination.zipcode }}
                </td>
                <td>${{ item.transport.totalPrice }}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import { stopAndPrevent } from 'quasar/src/utils/event';
import graphql from '@client/graphql';
import { DATE_RANGE } from '@server/constants';
import {
  getDateRange,
  getDateStringFromDateObject
} from '@server/lib/date-format';

export default {
  apollo: {
    currentUser: {
      query: graphql.queries.currentUser
    },
    userQuotesDailyTotals: {
      query: graphql.queries.getUserQuotesDailyTotals,
      variables() {
        return {
          startDate: this.dateRangeStart,
          endDate: this.dateRangeEnd
        };
      },
      watchLoading(isLoading) {
        this.loadingCalendarData = isLoading;
      }
    }
  },
  data() {
    return {
      selectedDate: new Date().toISOString().split('T')[0],
      weekdays: [0, 1, 2, 3, 4, 5, 6],
      dragging: false,
      ignoreNextSwipe: false,
      displayEvent: false,
      loadingCalendarData: false,
      selectedBubble: null,
      dateRangeStart: getDateStringFromDateObject(
        getDateRange(DATE_RANGE.month).startDate
      ),
      dateRangeEnd: getDateStringFromDateObject(
        getDateRange(DATE_RANGE.month).endDate
      )
    };
  },
  methods: {
    calendarPrev() {
      this.$refs.calendar.prev();
      setTimeout(() => {
        const { lastStart, lastEnd } = this.$refs.calendar;
        this.dateRangeStart = lastStart;
        this.dateRangeEnd = lastEnd;
      }, 0);
    },
    calendarNext() {
      this.$refs.calendar.next();
      setTimeout(() => {
        const { lastStart, lastEnd } = this.$refs.calendar;
        this.dateRangeStart = lastStart;
        this.dateRangeEnd = lastEnd;
      }, 0);
    },
    handleSwipe({ evt, ...info }) {
      if (this.dragging === false) {
        if (info.duration >= 30 && this.ignoreNextSwipe === false) {
          if (info.direction === 'right') {
            this.calendarPrev();
          } else if (info.direction === 'left') {
            this.calendarNext();
          }
        } else {
          this.ignoreNextSwipe = false;
        }
      }
      stopAndPrevent(evt);
    },
    showDetail(dt, state) {
      const record = this.userQuotesDailyTotals.find((d) => d.date === dt);
      let items = [];
      if (state === 'followups') {
        items = (record.followups || []).map((f) => f.quote);
      } else if (state === 'dispatches') {
        items = record.dispatches || [];
      } else {
        items = record[state] || [];
      }
      this.selectedBubble = {
        date: dt,
        state,
        items
      };
      this.displayEvent = true;
    },
    getLink(dt, state) {
      return `/${state}?dateRangeStart=${dt}&dateRangeEnd=${dt}&assigneeId=${this.currentUser.id}&page=1&size=10&sortBy=id&descending=false`;
    },
    getQuotes(dt) {
      const record = this.userQuotesDailyTotals.find((d) => d.date === dt);
      if (record) return record.quotes || [];
      return [];
    },
    getOrders(dt) {
      const record = this.userQuotesDailyTotals.find((d) => d.date === dt);
      if (record) return record.orders || [];
      return [];
    },
    getFollowups(dt) {
      const record = this.userQuotesDailyTotals.find((d) => d.date === dt);
      if (record) return record.followups || [];
      return [];
    },
    getDispatches(dt) {
      const record = this.userQuotesDailyTotals.find((d) => d.date === dt);
      if (record) return record.dispatches || [];
      return [];
    }
  }
};
</script>

<style lang="scss">
.q-calendar-weekly__head {
  flex: none !important;
}

.q-calendar-weekly__container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  flex: 1 0 auto;
}

.q-calendar-weekly__week--wrapper {
  flex: 1 !important;
}

.badge-link {
  text-decoration: none;
}
</style>
