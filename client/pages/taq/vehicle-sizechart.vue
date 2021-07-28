<template>
  <div class="q-pa-md">
    <div v-if="error">An error occured</div>
    <div v-else>
      <q-table
        flat
        bordered
        title="Vehicle Sizechart"
        :data="vehicleSizeCharts ? vehicleSizeCharts.data : []"
        :columns="columns"
        :pagination.sync="pagination"
        :loading="loading"
        @request="onRequest"
        row-key="id"
        :rows-per-page-options="[25, 50]"
        style="min-width: 750px;"
      >
        <template v-slot:top-right>
          <div>
            <div class="row q-gutter-sm">
              <q-input v-model="filter._make" label="Make" dense />
              <q-input v-model="filter._model" label="Model" dense />
              <q-btn
                color="primary"
                icon="search"
                dense
                style="top: 5px;"
                flat
                @click="handleSearch"
              />
              <q-btn
                icon="clear"
                dense
                flat
                style="top: 5px;"
                @click="handleClearSearch"
              />
            </div>
            <!-- <div class="row justify-end q-mt-md">
              <q-btn color="primary" icon="add" dense @click="handleAdd" />
            </div> -->
          </div>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="make" :props="props">
              {{ props.row.make }}
            </q-td>
            <q-td key="model" :props="props">
              {{ props.row.model }}
            </q-td>
            <q-td key="size" :props="props">
              <q-select
                :value="props.row.size.id"
                :readonly="!canUpdateSizechart"
                @input="handleChangeVehicleSize(props.row.id, $event)"
                label="Vehicle Size"
                :options="vehicleSizes"
                option-value="id"
                option-label="name"
                dense
                emit-value
                map-options
              />
            </q-td>
            <q-td key="action" :props="props">
              <a
                class="text-primary"
                :href="props.row.search"
                v-if="canUpdateSizechart"
              >
                <q-icon name="launch" />
              </a>
              <q-btn
                v-if="canUpdateSizechart"
                dense
                outline
                color="negative"
                size="sm"
                icon="delete"
                class="ml-md"
                @click="handleDelete(props.row.id)"
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
import { assessPermission } from '@server/lib/permission-helpers';

export default {
  name: 'VehicleSize',
  metaInfo: {
    title: 'AutoBook Pro - Vehicle Sizechart'
  },
  apollo: {
    currentUser: {
      query: graphql.queries.currentUser
    },
    vehicleSizes: {
      query: graphql.queries.getVehicleSizes
    },
    vehicleSizeCharts: {
      query: graphql.queries.getVehicleSizechart,
      variables() {
        return {
          filter: {
            make: this.filter.make,
            model: this.filter.model
          },
          cursor: {
            page: this.pagination.page,
            size: this.pagination.rowsPerPage
          }
        };
      },
      watchLoading(isLoading) {
        this.loading = isLoading;
      },
      error(error) {
        this.error = error;
      },
      result(result) {
        if (result.loading) return;
        const { vehicleSizeCharts } = result.data;
        this.pagination = {
          page: vehicleSizeCharts.pageInfo.page,
          rowsPerPage: vehicleSizeCharts.pageInfo.size,
          rowsNumber: vehicleSizeCharts.pageInfo.total
        };
      }
    }
  },
  data() {
    return {
      loading: false,
      error: null,
      filter: {
        make: '',
        model: '',
        _make: '',
        _model: ''
      },
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 0,
        rowsPerPage: 50,
        rowsNumber: 0
      },
      columns: [
        {
          name: 'make',
          label: 'Make',
          align: 'left',
          sortable: false
        },
        {
          name: 'model',
          label: 'Model',
          align: 'left',
          sortable: false
        },
        {
          name: 'size',
          label: 'Size',
          align: 'left',
          sortable: false
        },
        {
          name: 'action',
          label: '',
          align: 'left',
          sortable: false
        }
      ],
      selectedVehicleSize: {},
      sizeUpdating: false
    };
  },
  computed: {
    canUpdateSizechart() {
      return assessPermission.taq.canUpdate(this.currentUser);
    }
  },
  methods: {
    onRequest(props) {
      this.pagination = {
        ...this.pagination,
        page: props.pagination.page,
        rowsPerPage: props.pagination.rowsPerPage
      };
    },
    handleSearch() {
      // eslint-disable-next-line no-underscore-dangle
      const make = this.filter._make;
      // eslint-disable-next-line no-underscore-dangle
      const model = this.filter._model;

      this.pagination.page = 0;
      this.filter = {
        ...this.filter,
        make,
        model
      };
    },
    handleClearSearch() {
      this.pagination.page = 0;
      this.filter = {
        make: '',
        model: '',
        _make: '',
        _model: ''
      };
    },
    async handleDelete(sizechartId) {
      const filter = {
        make: this.filter.make,
        model: this.filter.model
      };
      const cursor = {
        page: this.pagination.page,
        size: this.pagination.rowsPerPage
      };

      try {
        await this.$apollo.mutate({
          mutation: graphql.mutations.deleteVehicleSizechart,
          variables: {
            sizeChartID: sizechartId
          },
          update(store) {
            const data = store.readQuery({
              query: graphql.queries.getVehicleSizechart,
              variables: { filter, cursor }
            });

            data.vehicleSizeCharts.data = data.vehicleSizeCharts.data.filter(
              (vs) => vs.id !== sizechartId
            );

            store.writeQuery({
              query: graphql.queries.getVehicleSizechart,
              variables: { filter, cursor },
              data
            });
          }
        });
      } catch (error) {
        this.notifyNegative(error.message);
      }
    },
    async handleChangeVehicleSize(sizechartId, sizeId) {
      const filter = {
        make: this.filter.make,
        model: this.filter.model
      };
      const cursor = {
        page: this.pagination.page,
        size: this.pagination.rowsPerPage
      };

      try {
        await this.$apollo.mutate({
          mutation: graphql.mutations.updateVehicleSizechart,
          variables: {
            sizeChartID: sizechartId,
            sizeID: Number(sizeId)
          },
          update(store, { data: { updateVehicleSizeChartSize: theUpdated } }) {
            const data = store.readQuery({
              query: graphql.queries.getVehicleSizechart,
              variables: { filter, cursor }
            });

            data.vehicleSizeCharts.data = data.vehicleSizeCharts.data.map(
              (vs) => {
                if (vs.id !== theUpdated.id) return vs;
                return theUpdated;
              }
            );

            store.writeQuery({
              query: graphql.queries.getVehicleSizechart,
              variables: { filter, cursor },
              data
            });
          }
        });
      } catch (error) {
        this.notifyNegative(error.message);
      }
    }
  }
};
</script>

<style></style>
