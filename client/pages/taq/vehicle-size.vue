<template>
  <div class="q-pa-md">
    <div v-if="error">An error occured</div>
    <div v-else>
      <q-table
        flat
        bordered
        title="Vehicle Size"
        :data="sizes"
        :columns="columns"
        :loading="loading"
        :rows-per-page-options="[25, 50]"
        :pagination.sync="pagination"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">{{ props.row.name }}</q-td>
            <q-td key="rateBump" :props="props">
              <q-input
                :readonly="!canUpdate"
                v-model.number="props.row.rateBump"
                dense
                label="Percent bump"
                :loading="saving[`${props.row.id}-rateBump`]"
                @blur="handleBumpBlur(props.row.id, 'rateBump')"
              />
            </q-td>
            <q-td key="flatBump" :props="props">
              <q-input
                :readonly="!canUpdate"
                v-model.number="props.row.flatBump"
                dense
                label="Flat bump"
                :loading="saving[`${props.row.id}-flatBump`]"
                @blur="handleBumpBlur(props.row.id, 'flatBump')"
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
  metaInfo: {
    title: 'AutoBook Pro - Vehicle Size'
  },
  apollo: {
    currentUser: {
      query: graphql.queries.currentUser
    },
    vehicleSizes: {
      query: graphql.queries.getVehicleSizes,
      watchLoading(isLoading) {
        this.loading = isLoading;
      },
      error(error) {
        this.error = error;
      },
      result(result) {
        if (result.loading) return;

        this.sizes = result.data.vehicleSizes.map((vs) => ({
          id: vs.id,
          name: vs.name,
          rateBump: vs.rateBump,
          flatBump: vs.flatBump
        }));
      }
    }
  },
  data() {
    return {
      loading: false,
      error: null,

      saving: {},

      sizes: [],

      columns: [
        {
          name: 'name',
          label: 'Name',
          align: 'left',
          sortable: false
        },
        {
          name: 'rateBump',
          label: 'Percent Bump',
          align: 'left',
          sortable: false
        },
        {
          name: 'flatBump',
          label: 'Flat Bump',
          align: 'left',
          sortable: false
        }
      ],
      pagination: {
        rowsPerPage: 50
      }
    };
  },
  computed: {
    canUpdate() {
      return assessPermission.taq.canUpdate(this.currentUser);
    }
  },
  methods: {
    async handleBumpBlur(id, prop) {
      const vs1 = this.vehicleSizes.find((vs) => vs.id === id);
      const vs2 = this.sizes.find((vs) => vs.id === id);

      if (vs1.rateBump !== vs2.rateBump || vs1.flatBump !== vs2.flatBump) {
        this.$set(this.saving, `${id}-${prop}`, true);
        try {
          await this.$apollo.mutate({
            mutation: graphql.mutations.updateVehicleSize,
            variables: {
              vehicleSizeID: id,
              rateBump: vs2.rateBump,
              flatBump: vs2.flatBump
            }
          });
        } catch (error) {
          this.notifyNegative(error.message);
        }

        this.$set(this.saving, `${id}-${prop}`, false);
      }
    }
  }
};
</script>

<style></style>
