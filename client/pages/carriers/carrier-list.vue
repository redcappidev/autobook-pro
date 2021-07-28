<template>
  <div class="q-pa-md">
    <div v-if="error">An error occured</div>
    <div v-else>
      <q-table
        flat
        bordered
        title="Carriers"
        :data="carriers ? carriers.data : []"
        :columns="columns"
        :loading="loading"
        :pagination.sync="pagination"
        @request="(props) => handleChangePagination(props.pagination)"
        :rows-per-page-options="[25, 50]"
      >
        <template v-slot:top-right>
          <q-input
            style="min-width: 300px;"
            color="primary"
            :value="searchText"
            debounce="500"
            label="Search"
            dense
            @input="handleChangeFilters">
            <template v-slot:prepend>
                <q-icon name="search" />
            </template>
          </q-input>
          <q-btn
            v-if="canAddCarrier"
            class="q-ml-md"
            color="primary"
            icon="add"
            dense
            to="/carriers/new"
          />
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">
              {{ props.row.companyName }}
            </q-td>
            <q-td key="mcNumber" :props="props">
              {{ props.row.mcNumber }}
            </q-td>
            <q-td key="location" :props="props">
              {{ props.row.address }} {{ props.row.city }},
              {{ props.row.state }} {{ props.row.zipcode }}
            </q-td>
            <q-td key="actions" :props="props">
              <q-btn
                v-if="canUpdateCarrier"
                round
                dense
                color="primary"
                size="sm"
                icon="create"
                :to="`/carriers/${props.row.id}`"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script>
import graphql from '@client/graphql';
import { sanitizeObject } from '@client/utils/object-helpers';
import { assessPermission } from '@server/lib/permission-helpers';

export default {
  name: 'CarrierList',
  apollo: {
    currentUser: {
      query: graphql.queries.currentUser
    },
    carriers() {
      const gql = graphql.queries.getCarriers;
      return {
        query: gql,
        variables() {
          return {
            search: this.searchText,
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
        result(result) {
          if (result.loading) return;
          const theCarriers = result;
          this.pagination = {
            ...this.pagination,
            page: theCarriers.data.carriers.pageInfo.page + 1,
            rowsPerPage: theCarriers.data.carriers.pageInfo.size,
            rowsNumber: theCarriers.data.carriers.pageInfo.total
          };
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
          page: 1,
          size: 50,
          sortBy: 'name',
          descending: false
        }
      });
    } else {
      this.applyFiltersFromRoute(this.$route);
    }
  },
  data() {
    return {
      searchText: '',
      queryReady: false,
      loading: false,
      error: null,
      columns: [
        {
          name: 'name',
          label: 'Carrier',
          align: 'left',
          sortable: true
        },
        {
          name: 'mcNumber',
          label: 'MC #',
          align: 'left',
          sortable: true
        },
        {
          name: 'location',
          label: 'Location',
          align: 'left',
          sortable: true
        },
        {
          name: 'actions',
          label: '',
          align: 'left'
        }
      ],
      pagination: {
        rowsPerPage: 50,
        descending: false
      }
    };
  },
  computed: {
    canAddCarrier() {
      return assessPermission.carrier.canCreate(this.currentUser);
    },
    canUpdateCarrier() {
      if (assessPermission.carrier.canUpdate(this.currentUser)) {
        return true;
      }
      return false;
    },
    sortByFilter() {
      const { sortBy, descending } = this.pagination || {};

      if (sortBy === 'name') {
        return descending ? 'NAME_DESC' : 'NAME_ASC';
      }
      if (sortBy === 'mcNumber') {
        return descending ? 'MC_NUMBER_DESC' : 'MC_NUMBER_ASC';
      }
      if (sortBy === 'location') {
        return descending ? 'LOCATION_DESC' : 'LOCATION_ASC';
      }
      return 'NAME_ASC';
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
      let searchText = '';
      if ('searchText' in query) searchText = query.searchText;

      const pagination = {
        page: 1,
        rowsPerPage: 50,
        sortBy: 'name',
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
      this.searchText = searchText;
      if ('page' in query) pagination.page = parseInt(query.page, 10);
      if ('size' in query) pagination.rowsPerPage = parseInt(query.size, 10);
      Object.assign(this, { searchText, pagination, queryReady: true });
    },

    changeRoute() {
      const query = {
        searchText: this.searchText,
        page: this.pagination.page,
        size: this.pagination.rowsPerPage,
        sortBy: this.pagination.sortBy,
        descending: this.pagination.descending
      };

      this.$router.push({
        name: this.$route.name,
        query: sanitizeObject(query)
      });
    },
    handleChangeFilters(searchText) {
      this.searchText = searchText;
      this.changeRoute();
    },
    handleChangePagination(pagination) {
      this.pagination = pagination;
      this.changeRoute();
    }
  }
};
</script>
<style></style>
