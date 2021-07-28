<template>
  <div class="autobookpro-page-content">
    <div class="q-mb-lg">
      <span class="text-h5" v-if="isQuoteContext">Quotes</span>
      <span class="text-h5" v-if="isOrderContext">Orders</span>
      <span class="text-h5" v-if="isFollowupContext">Followups</span>
    </div>
    <div v-if="error">An error occured</div>
    <div v-else>
      <app-quotes-filter
        class="q-mb-sm"
        :context="`${isOrderContext ? 'order' : 'quote'}`"
        :value="filters"
        @input="handleChangeFilters"
        :selectedQuotes="selectedQuotes"
        @reassign="handleReassign"
        :reassigning="reassigning"
      />
      <q-table
        flat
        bordered
        :data="quotes ? quotes.data : []"
        :columns="columns"
        :loading="loading"
        :pagination.sync="pagination"
        @request="(props) => handleChangePagination(props.pagination)"
        :rows-per-page-options="[25, 50]"
      >
        <template v-slot:top-left>
          <q-tabs
            v-model="selectedGroup"
            active-color="primary"
            indicator-color="primary"
            dense
            class="text-grey"
            align="left"
          >
            <q-tab
              :name="DATE_RANGE.today"
              @click="handleChangeGroup(DATE_RANGE.today)"
              :label="`Today (${quotesCount ? quotesCount.today : 0})`"
            />
            <q-tab
              :name="DATE_RANGE.week"
              @click="handleChangeGroup(DATE_RANGE.week)"
              :label="`This Week (${quotesCount ? quotesCount.week : 0})`"
            />
            <q-tab
              :name="DATE_RANGE.month"
              @click="handleChangeGroup(DATE_RANGE.month)"
              :label="`This Month(${quotesCount ? quotesCount.month : 0})`"
            />
            <q-tab
              :name="DATE_RANGE.pastDue"
              @click="handleChangeGroup(DATE_RANGE.pastDue)"
              :label="`Past Due(${quotesCount ? quotesCount.pastDue : 0})`"
            />
            <q-tab
              :name="DATE_RANGE.all"
              @click="handleChangeGroup(DATE_RANGE.all)"
              :label="`All(${quotesCount ? quotesCount.all : 0})`"
            />
            <q-tab
              v-if="isOrderContext"
              :name="DISPATCHED_STATUS"
              @click="handleChangeGroup(DISPATCHED_STATUS)"
              :label="`Dispatched(${quotesCount ? quotesCount.dispatched : 0})`"
            />
            <q-tab
              v-if="isOrderContext"
              :name="CANCELED_STATUS"
              @click="handleChangeGroup(CANCELED_STATUS)"
              :label="`Canceled(${quotesCount ? quotesCount.canceled : 0})`"
            />
          </q-tabs>
          <q-separator />
        </template>
        <template #header="props">
          <q-tr :props="props">
            <q-th
              v-for="(col, index) in props.cols"
              :key="col.name"
              :props="props"
            >
              <app-checkbox-input
                v-if="canUpdateQuote && index === 0"
                class="q-mr-sm"
                :value="
                  quotes &&
                  quotes.data &&
                  quotes.data.length > 0 &&
                  quotes.data.length === selectedQuotes.length
                "
                @input="handleChangeSelectAllQuotes"
              ></app-checkbox-input>
              <span>{{ col.label }}</span>
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="id" :props="props">
              <app-checkbox-input
                v-if="canUpdateQuote"
                class="q-mr-sm"
                :value="selectedQuotes.includes(props.row.id)"
                @input="handleChangeSelectQuote(props.row.id, $event)"
              ></app-checkbox-input>
              <a
                class="text-bold text-primary q-ma-none cursor-pointer"
                :href="`/${isOrderContext ? 'orders' : 'quotes'}/${
                  props.row.id
                }?edit=true`"
                @click="handleIDClick($event, props.row.id)"
              >
                {{ props.row.id }}
              </a>
            </q-td>
            <q-td key="engagements" :props="props">
              <span
                v-for="(engagement, index) in QUOTE_ENGAGEMENTS"
                :key="index"
              >
                <q-icon
                  :name="engagement.icon"
                  color="negative"
                  size="sm"
                  v-if="
                    props.row.engagements &&
                    props.row.engagements.includes(engagement.value)
                  "
                />
              </span>
            </q-td>
            <q-td key="followupOn" :props="props" v-if="isFollowupContext">
              <p class="text-bold q-ma-none">
                {{ props.row.followupOn | usDateFormat }}
              </p>
            </q-td>
            <q-td key="date" :props="props">
              <p class="text-bold q-ma-none">
                {{ props.row.transport.availableDate | usDateFormat }}
              </p>
            </q-td>
            <q-td key="shipper" :props="props">
              <app-quote-shipper :data="props.row" />
            </q-td>
            <q-td key="vehicle" :props="props">
              <app-quote-vehicle :data="props.row" />
            </q-td>
            <q-td key="origin" :props="props">
              <app-quote-origin :data="props.row" />
            </q-td>
            <q-td key="destination" :props="props">
              <app-quote-destination :data="props.row" />
            </q-td>
            <q-td key="price" :props="props">
              <app-quote-price :data="props.row" />
            </q-td>
            <q-td key="options" :props="props">
              <div class="row q-gutter-x-sm">
                <q-btn
                  v-if="canUpdateQuote"
                  dense
                  size="sm"
                  outline
                  color="secondary"
                  icon="edit"
                  :to="{
                    name: isOrderContext ? 'order-detail' : 'quote-detail',
                    params: { id: props.row.id },
                    query: { edit: 'true' }
                  }"
                />
                <q-btn
                  v-else
                  dense
                  size="sm"
                  outline
                  color="secondary"
                  icon="visibility"
                  :to="{
                    name: isOrderContext ? 'order-detail' : 'quote-detail',
                    params: { id: props.row.id }
                  }"
                />
                <q-btn
                  v-if="!isOrderContext && canBookOrder"
                  dense
                  size="sm"
                  outline
                  color="primary"
                  icon="shopping_cart"
                  @click="() => handleBookOrder(props.row.id)"
                />
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <app-preview-dialog
      :type="`${isOrderContext ? 'order' : 'quote'}`"
      :open="openPreviewDialog"
      :data="previewQuoteId"
      :hasPreviousQuote="hasPreviousQuote"
      :hasNextQuote="hasNextQuote"
      @goPrevious="handlePreviewPreviousQuote"
      @goNext="handlePreviewNextQuote"
      @hide="openPreviewDialog = false"
    />
  </div>
</template>
<script>
import {
  DATE_RANGE,
  QUOTE_ENGAGEMENTS,
  DISPATCHED_STATUS,
  CANCELED_STATUS
} from '@server/constants';
import { assessPermission } from '@server/lib/permission-helpers';
import graphql from '@client/graphql';
import { sanitizeObject } from '@client/utils/object-helpers';
import AppCheckboxInput from '@client/components/form/checkbox-input';
import AppQuotesFilter from '@client/components/filters/quotes-filter';
import AppPreviewDialog from '@client/components/dialogs/preview-quote-dialog';
import AppQuoteShipper from './partials/shipper';
import AppQuoteVehicle from './partials/vehicle';
import AppQuoteOrigin from './partials/origin';
import AppQuoteDestination from './partials/destination';
import AppQuotePrice from './partials/price';

export default {
  name: 'AppQuoteList',
  metaInfo() {
    let title = 'Quote List';
    if (this.isOrderContext) title = 'Order List';
    if (this.isFollowupContext) title = 'Followup List';

    return {
      title
    };
  },
  components: {
    AppCheckboxInput,
    AppQuotesFilter,
    AppQuoteShipper,
    AppQuoteVehicle,
    AppQuoteOrigin,
    AppQuoteDestination,
    AppQuotePrice,
    AppPreviewDialog
  },
  apollo: {
    currentUser: {
      query: graphql.queries.currentUser
    },
    quotes() {
      let gql = graphql.queries.loadQuotes;
      if (this.isFollowupContext) gql = graphql.queries.getFollowups;
      if (this.isOrderContext) gql = graphql.queries.loadOrders;

      return {
        query: gql,
        variables() {
          return {
            filterBy: this.filters,
            sortBy: this.sortByFilter,
            cursor: this.paginationFilter
          };
        },
        skip() {
          return !this.queryReady;
        },
        watchLoading(isLoading) {
          this.loading = isLoading;
        },
        error(error) {
          this.error = error;
        },
        update(data) {
          if (this.isQuoteContext) return data.quotes;
          if (this.isOrderContext) return data.orders;

          return {
            pageInfo: data.followups.pageInfo,
            data: data.followups.data.map(({ quote, ...followup }) => ({
              ...followup,
              ...quote
            }))
          };
        },
        result(result) {
          if (result.loading) return;

          let theQuotes = result.data.quotes;
          if (this.isFollowupContext) theQuotes = result.data.followups;
          if (this.isOrderContext) theQuotes = result.data.orders;

          this.pagination = {
            ...this.pagination,
            page: theQuotes.pageInfo.page + 1,
            rowsPerPage: theQuotes.pageInfo.size,
            rowsNumber: theQuotes.pageInfo.total
          };
        },
        fetchPolicy: 'cache-and-network'
      };
    },
    quotesCount() {
      let gql = graphql.queries.getQuotesCount;
      if (this.isFollowupContext) gql = graphql.queries.getFollowupsCount;
      if (this.isOrderContext) gql = graphql.queries.getOrdersCount;

      return {
        query: gql,
        variables() {
          return {
            filterBy: this.filters
          };
        },
        update(data) {
          if (this.isOrderContext) return data.ordersCount;
          if (this.isFollowupContext) return data.followupsCount;
          return data.quotesCount;
        },
        fetchPolicy: 'cache-and-network'
      };
    }
  },
  watch: {
    $route(to) {
      this.applyFiltersFromRoute(to);
    }
  },
  created() {
    const { query } = this.$route;
    if (Object.keys(query).length === 0) {
      this.$router.push({
        name: this.$route.name,
        query: {
          group: DATE_RANGE.today,
          assigneeId: this.currentUser.id,
          page: 1,
          size: 50,
          sortBy: 'id',
          descending: false
        }
      });
    } else {
      this.applyFiltersFromRoute(this.$route);
    }
  },
  data() {
    const isQuoteContext = this.$route.name === 'quotes';
    const isFollowupContext = this.$route.name === 'followups';

    let columns = [
      {
        name: 'id',
        label: isQuoteContext || isFollowupContext ? 'Quote ID' : 'Order ID',
        align: 'left',
        sortable: true
      },
      {
        name: 'engagements',
        label: 'Engagements',
        align: 'left'
      }
    ];

    if (isFollowupContext) {
      columns.push(
        {
          name: 'followupOn',
          label: 'Followup Date',
          align: 'left',
          sortable: true
        },
        {
          name: 'date',
          label: 'Ship Date',
          align: 'left'
        }
      );
    } else {
      columns.push({
        name: 'date',
        label: 'Ship Date',
        align: 'left',
        sortable: true
      });
    }

    columns = columns.concat([
      {
        name: 'shipper',
        label: 'Shipper',
        align: 'center'
      },
      {
        name: 'vehicle',
        label: 'Vehicle',
        align: 'center'
      },
      {
        name: 'origin',
        label: 'Origin',
        align: 'center'
      },
      {
        name: 'destination',
        label: 'Destination',
        align: 'center'
      },
      {
        name: 'price',
        label: 'Price',
        align: 'center'
      },
      {
        name: 'options',
        label: '',
        align: 'center'
      }
    ]);

    return {
      queryReady: false,

      loading: false,
      error: null,

      reassigning: false,
      selectedQuotes: [],

      selectedGroup: null,

      DATE_RANGE,
      QUOTE_ENGAGEMENTS,

      DISPATCHED_STATUS,
      CANCELED_STATUS,

      filters: {
        parentStatusId: null,
        childStatusId: null,
        search: null,
        timezone: null,
        group: DATE_RANGE.today,
        dateRangeStart: null,
        dateRangeEnd: null,
        assigneeId: null,
        engagements: null
      },

      pagination: null,

      openPreviewDialog: false,
      hasPreviousQuote: false,
      hasNextQuote: false,
      previewQuoteId: null,

      columns
    };
  },
  computed: {
    isQuoteContext() {
      return this.$route.name === 'quotes';
    },
    isOrderContext() {
      return this.$route.name === 'orders';
    },
    isFollowupContext() {
      return this.$route.name === 'followups';
    },
    canUpdateQuote() {
      if (
        (this.isQuoteContext || this.isFollowupContext) &&
        assessPermission.quote.canUpdate(this.currentUser)
      ) {
        return true;
      }
      if (
        this.isOrderContext &&
        assessPermission.order.canUpdate(this.currentUser)
      ) {
        return true;
      }
      return false;
    },
    canBookOrder() {
      return (
        !this.isOrderContext &&
        assessPermission.order.canCreate(this.currentUser)
      );
    },
    sortByFilter() {
      const { sortBy, descending } = this.pagination || {};

      if (!this.isFollowupContext) {
        if (sortBy === 'date') {
          return descending ? 'AVAILABLE_DATE_DESC' : 'AVAILABLE_DATE_ASC';
        }

        if (sortBy === 'id') {
          return descending ? 'ID_DESC' : 'ID_ASC';
        }

        return 'ID_ASC';
      }

      if (sortBy === 'followupOn') {
        return descending ? 'FOLLOWUP_DATE_DESC' : 'FOLLOWUP_DATE_ASC';
      }

      if (sortBy === 'id') {
        return descending ? 'ID_DESC' : 'ID_ASC';
      }

      return 'FOLLOWUP_DATE_ASC';
    },
    paginationFilter() {
      return {
        page: this.pagination ? this.pagination.page - 1 : 0,
        size: this.pagination ? this.pagination.rowsPerPage : 50
      };
    }
  },
  methods: {
    applyFiltersFromRoute(route) {
      const { query } = route;

      const filters = {};
      if ('parentStatusId' in query) {
        filters.parentStatusId = query.parentStatusId;
      }
      if ('childStatusId' in query) filters.childStatusId = query.childStatusId;
      if ('search' in query) filters.search = query.search;
      if ('timezone' in query) filters.timezone = query.timezone;
      if ('group' in query) {
        this.selectedGroup = query.group;
        filters.group = query.group;
      } else if ('dateRangeStart' in query || 'dateRangeEnd' in query) {
        filters.dateRangeStart = query.dateRangeStart;
        filters.dateRangeEnd = query.dateRangeEnd;
      } else {
        filters.group = DATE_RANGE.today;
        this.selectedGroup = DATE_RANGE.today;
      }
      if ('assigneeId' in query) {
        filters.assigneeId = query.assigneeId;
      }
      if ('engagements' in query) filters.engagements = query.engagements;

      const pagination = {
        page: 1,
        rowsPerPage: 50,
        sortBy: 'id',
        descending: false,
        ...(this.pagination || {})
      };

      if ('sortBy' in query) pagination.sortBy = query.sortBy;
      if ('descending' in query) {
        if (typeof query.descending === 'boolean') {
          pagination.descending = query.descending;
        } else {
          pagination.descending = query.descending === 'true';
        }
      }
      if ('page' in query) pagination.page = parseInt(query.page, 10);
      if ('size' in query) pagination.rowsPerPage = parseInt(query.size, 10);

      Object.assign(this, { filters, pagination, queryReady: true });
    },
    changeRoute(change) {
      this.selectedQuotes = [];

      const query = {
        ...this.filters,
        page: this.pagination.page,
        size: this.pagination.rowsPerPage,
        sortBy: this.pagination.sortBy,
        descending: this.pagination.descending,
        ...change
      };

      this.$router.push({
        name: this.$route.name,
        query: sanitizeObject(query)
      });
    },
    handleChangeSelectAllQuotes(selected) {
      if (selected) {
        this.selectedQuotes = this.quotes.data.map((d) => d.id);
      } else {
        this.selectedQuotes = [];
      }
    },
    handleChangeSelectQuote(id, selected) {
      if (selected) {
        this.selectedQuotes = this.selectedQuotes.concat(id);
      } else {
        this.selectedQuotes = this.selectedQuotes.filter((q) => q !== id);
      }
    },
    handleChangeFilters(filters) {
      this.changeRoute(filters);
    },
    handleChangeGroup(group) {
      this.changeRoute({ group });
    },
    handleChangePagination(pagination) {
      this.pagination = pagination;
      this.changeRoute({
        page: pagination.page,
        size: pagination.rowsPerPage,
        sortBy: pagination.sortBy,
        descending: pagination.descending
      });
    },
    async handleReassign(userId) {
      let gql = graphql.mutations.reassignQuotes;
      if (this.isOrderContext) {
        gql = graphql.mutations.reassignOrders;
      }

      this.reassigning = true;

      try {
        await this.$apollo.mutate({
          mutation: gql,
          variables: {
            ids: this.selectedQuotes,
            userId
          }
        });

        this.selectedQuotes = [];
        this.$apollo.queries.quotes.refetch();
      } catch (error) {
        this.notifyNegative(error.message);
      }

      this.reassigning = false;
    },
    handleBookOrder(id) {
      this.$q
        .dialog({
          title: 'Confirm',
          message: 'Are you sure you want to convert to an order?',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.$router.push({
            name: 'convert-to-order',
            params: { id }
          });
        });
    },
    handleIDClick(event, id) {
      event.preventDefault();
      const index = this.quotes.data.findIndex((q) => q.id === id);
      this.hasPreviousQuote = index > 0;
      this.hasNextQuote = index < this.quotes.data.length - 1;
      this.previewQuoteId = id;
      this.openPreviewDialog = true;
    },
    handlePreviewPreviousQuote() {
      const index = this.quotes.data.findIndex(
        (q) => q.id === this.previewQuoteId
      );
      if (index > 0) {
        this.previewQuoteId = this.quotes.data[index - 1].id;
      }
      this.hasPreviousQuote = index - 1 > 0;
      this.hasNextQuote = index - 1 < this.quotes.data.length - 1;
    },
    handlePreviewNextQuote() {
      const index = this.quotes.data.findIndex(
        (q) => q.id === this.previewQuoteId
      );
      if (index < this.quotes.data.length - 1) {
        this.previewQuoteId = this.quotes.data[index + 1].id;
      }
      this.hasPreviousQuote = index + 1 > 0;
      this.hasNextQuote = index + 1 < this.quotes.data.length - 1;
    }
  }
};
</script>
<style lang="scss"></style>
