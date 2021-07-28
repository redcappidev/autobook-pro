<template>
  <div class="q-pa-md">
    <div v-if="error">An error occured</div>
    <div class="row q-gutter-x-md" v-else>
      <q-table
        flat
        bordered
        class="col-grow"
        title="Pricing Exceptions"
        :data="pricingExceptions ? pricingExceptions.data : []"
        :columns="columns"
        :pagination.sync="pagination"
        @request="(props) => (pagination = props.pagination)"
        :loading="loading"
        :rows-per-page-options="[25, 50]"
      >
        <template #header-cell="props">
          <q-th :props="props" v-if="props.col.name !== 'select'">
            {{ props.col.label }}
          </q-th>
          <q-th :props="props" v-else>
            <q-checkbox v-model="selectAll" dense />
          </q-th>
        </template>
        <template v-slot:top-right>
          <div>
            <div class="row q-gutter-md">
              <q-select
                v-model="filter.originState"
                @input="
                  filter.originCities = null;
                  filter.originCity = null;
                  pagination.page = 1;
                "
                :options="filter.allStates"
                option-value="abbr"
                option-label="name"
                label="Pickup State"
                dense
                style="min-width: 130px;"
              />
              <q-select
                v-model="filter.originCity"
                @input="pagination.page = 1"
                :options="filter.originCities || []"
                option-value="id"
                option-label="name"
                label="Pickup City"
                dense
                style="min-width: 130px;"
                @filter="filterOriginCities"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <q-select
                v-model="filter.destState"
                @input="
                  filter.destCities = null;
                  filter.destCity = null;
                  pagination.page = 1;
                "
                :options="filter.allStates"
                option-value="abbr"
                option-label="name"
                label="Delivery State"
                dense
                style="min-width: 130px;"
              />
              <q-select
                v-model="filter.destCity"
                @input="pagination.page = 1"
                :options="filter.destCities || []"
                option-value="id"
                option-label="name"
                label="Delivery City"
                dense
                style="min-width: 130px;"
                @filter="filterDestCities"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <q-btn
                dense
                flat
                icon="clear"
                style="top: 5px;"
                @click="
                  filter.originState = null;
                  filter.destState = null;
                  filter.originCities = null;
                  filter.originCity = null;
                  filter.destCities = null;
                  filter.destCity = null;
                  pagination.page = 1;
                "
              />
            </div>
            <!-- <div class="row justify-end q-mt-md">
              <q-btn
                color="primary"
                icon="add"
                dense
                @click="handleAddException"
              />
            </div> -->
          </div>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="select" :props="props">
              <q-checkbox
                :value="exceptionSelections[props.row.id]"
                @input="$set(exceptionSelections, props.row.id, $event)"
                dense
              />
            </q-td>
            <q-td key="originCityState" :props="props">
              {{ props.row.originCity }}, {{ props.row.originState }}
            </q-td>
            <q-td key="destCityState" :props="props">
              {{ props.row.destCity }}, {{ props.row.destState }}
            </q-td>
            <q-td
              :key="`radius${index + 1}`"
              v-for="(rule, index) in props.row.rules"
              :props="props"
            >
              <a
                href="#"
                @click.prevent
                class="text-primary"
                v-if="canUpdateException"
              >
                <span
                  v-if="
                    !editingRule || editingRule.id !== `${props.row.id}${index}`
                  "
                  class="cursor-pointer"
                  @click="toggleEditRule(props.row, index, rule)"
                >
                  {{ rule.originRadius }}/{{ rule.destRadius }} | ${{
                    rule.price
                  }}
                </span>
              </a>
              <span v-else>
                {{ rule.originRadius }}/{{ rule.destRadius }} | ${{
                  rule.price
                }}
              </span>
              <div
                v-if="
                  editingRule && editingRule.id === `${props.row.id}${index}`
                "
              >
                <q-input
                  type="number"
                  dense
                  label="Origin Radius"
                  v-model.number="editingRule.originRadius"
                ></q-input>
                <q-input
                  type="number"
                  dense
                  label="Destination Radius"
                  v-model.number="editingRule.destRadius"
                ></q-input>
                <q-input
                  type="number"
                  dense
                  label="Price"
                  v-model.number="editingRule.price"
                ></q-input>
                <div class="q-mt-sm text-center">
                  <q-btn
                    round
                    dense
                    color="primary"
                    size="sm"
                    icon="done"
                    :loading="updatingRule"
                    @click="handleUpdateRule"
                  />
                  <q-btn
                    round
                    dense
                    color="dark"
                    size="sm"
                    icon="clear"
                    @click="editingRule.id = null"
                  />
                </div>
              </div>
            </q-td>
            <q-td key="actions" :props="props"> </q-td>
          </q-tr>
        </template>
      </q-table>
      <div class="column" v-if="canUpdateException">
        <q-btn
          class="q-mb-md"
          color="primary"
          label="Add"
          @click="$refs.addPricingExceptionDialogRef.openDialog()"
        />
        <q-btn color="primary" label="Export CSV" type="a" :href="csvPath" />
        <div class="q-mt-md row q-gutter-x-sm">
          <q-select
            label="Origin Radius 1"
            :options="RADIUSES"
            v-model="batchOriginRadius1Input"
            dense
            style="min-width: 150px;"
          />
          <q-select
            label="Destination Radius 1"
            :options="RADIUSES"
            v-model="batchDestRadius1Input"
            dense
            style="min-width: 150px;"
          />
        </div>
        <div class="row q-gutter-x-sm">
          <q-select
            label="Price 1"
            :options="PRICES"
            v-model="batchPrice1BumpInput"
            dense
            style="min-width: 150px;"
          />
          <q-input
            v-model.number="batchPrice1Input"
            label="Custom Price 1"
            dense
          />
        </div>
        <q-btn
          class="q-mt-md"
          outline
          color="primary"
          label="Apply"
          @click="handleBatchUpdate(1)"
        />

        <div class="row q-gutter-x-sm q-mt-md">
          <q-select
            label="Origin Radius 2"
            :options="RADIUSES"
            v-model="batchOriginRadius2Input"
            dense
            style="min-width: 150px;"
          />
          <q-select
            label="Destination Radius 2"
            :options="RADIUSES"
            v-model="batchDestRadius2Input"
            dense
            style="min-width: 150px;"
          />
        </div>
        <div class="row q-gutter-x-sm">
          <q-select
            label="Price 2"
            :options="PRICES"
            v-model="batchPrice2BumpInput"
            dense
            style="min-width: 150px;"
          />
          <q-input
            v-model.number="batchPrice2Input"
            label="Custom Price 2"
            dense
          />
        </div>
        <q-btn
          class="q-mt-md"
          outline
          color="primary"
          label="Apply"
          @click="handleBatchUpdate(2)"
        />

        <div class="row q-gutter-x-sm q-mt-md">
          <q-select
            label="Origin Radius 3"
            :options="RADIUSES"
            v-model="batchOriginRadius3Input"
            dense
            style="min-width: 150px;"
          />
          <q-select
            label="Destination Radius 3"
            :options="RADIUSES"
            v-model="batchDestRadius3Input"
            dense
            style="min-width: 150px;"
          />
        </div>
        <div class="row q-gutter-x-sm">
          <q-select
            label="Price 3"
            :options="PRICES"
            v-model="batchPrice3BumpInput"
            dense
            style="min-width: 150px;"
          />
          <q-input
            v-model.number="batchPrice3Input"
            label="Custom Price 3"
            dense
          />
        </div>
        <q-btn
          class="q-mt-md"
          outline
          color="primary"
          label="Apply"
          @click="handleBatchUpdate(3)"
        />
      </div>
    </div>
    <app-add-pricing-exception-dialog ref="addPricingExceptionDialogRef" />
  </div>
</template>

<script>
import USA_STATES from '@server/constants/usa-states';
import { assessPermission } from '@server/lib/permission-helpers';
import graphql from '@client/graphql';
import AppAddPricingExceptionDialog from '@client/components/dialogs/add-pricing-exception-dialog';

export default {
  name: 'ExceptionRules',
  metaInfo: {
    title: 'AutoBook Pro - Pricing Exceptions'
  },
  components: {
    AppAddPricingExceptionDialog
  },
  apollo: {
    currentUser: {
      query: graphql.queries.currentUser
    },
    pricingExceptions: {
      query: graphql.queries.getPricingExceptions,
      variables() {
        return {
          filter: this.exceptionsFilter,
          cursor: this.paginationFilter
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

        const { pricingExceptions } = result.data;
        const selections = {};
        pricingExceptions.data.forEach((d) => {
          selections[d.id] = false;
        });
        this.exceptionSelections = selections;
        this.pagination = {
          page: pricingExceptions.pageInfo.page + 1,
          rowsPerPage: pricingExceptions.pageInfo.size,
          rowsNumber: pricingExceptions.pageInfo.total
        };
      }
    }
  },
  data() {
    return {
      loading: false,
      updatingRule: false,
      editingRule: null,
      error: null,
      filter: {
        originState: null,
        originCity: null,
        destState: null,
        destCity: null,
        allStates: [{ name: 'Not set', abbr: '' }].concat(USA_STATES),
        originCities: null,
        destCities: null
      },
      pagination: null,
      exceptionSelections: {},
      temp: '',
      columns: [
        {
          name: 'select',
          align: 'left',
          sortable: false
        },
        {
          name: 'originCityState',
          label: 'Origin City/State',
          align: 'left',
          sortable: false
        },
        {
          name: 'destCityState',
          label: 'Destination City/State',
          align: 'left',
          sortable: false
        },
        {
          name: 'radius1',
          label: 'Radius 1',
          align: 'left',
          sortable: false
        },
        {
          name: 'radius2',
          label: 'Radius 2',
          align: 'left',
          sortable: false
        },
        {
          name: 'radius3',
          label: 'Radius 3',
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

      RADIUSES: [
        'No Change',
        5,
        10,
        15,
        20,
        25,
        30,
        35,
        40,
        45,
        50,
        55,
        60,
        65,
        70,
        75,
        80,
        85,
        90,
        95,
        100
      ],

      PRICES: [
        'No Change',
        300,
        250,
        200,
        175,
        150,
        125,
        100,
        75,
        50,
        25,
        10,
        5,
        0,
        -5,
        -10,
        -25,
        -50,
        -75,
        -100,
        -125,
        -150,
        -175,
        -200,
        -250,
        -300
      ],

      batchOriginRadius1Input: 'No Change',
      batchOriginRadius2Input: 'No Change',
      batchOriginRadius3Input: 'No Change',
      batchDestRadius1Input: 'No Change',
      batchDestRadius2Input: 'No Change',
      batchDestRadius3Input: 'No Change',
      batchPrice1BumpInput: 'No Change',
      batchPrice2BumpInput: 'No Change',
      batchPrice3BumpInput: 'No Change',
      batchPrice1Input: 0,
      batchPrice2Input: 0,
      batchPrice3Input: 0,

      csvPath: `${window.BASE_URL}/rest-api/export-exceptions`
    };
  },
  computed: {
    selectAll: {
      get() {
        if (!this.pricingExceptions) return false;
        return this.pricingExceptions.data.every(
          (d) => this.exceptionSelections[d.id]
        );
      },
      set(newValue) {
        const selections = {};
        this.pricingExceptions.data.forEach((d) => {
          selections[d.id] = newValue;
        });
        this.exceptionSelections = selections;
      }
    },
    canUpdateException() {
      return assessPermission.taq.canUpdate(this.currentUser);
    },
    exceptionsFilter() {
      return {
        originState: this.filter.originState
          ? this.filter.originState.abbr
          : '',
        originCity:
          this.filter.originCity && this.filter.originCity.id !== -1
            ? this.filter.originCity.name
            : '',
        destState: this.filter.destState ? this.filter.destState.abbr : '',
        destCity:
          this.filter.destCity && this.filter.destCity.id !== -1
            ? this.filter.destCity.name
            : ''
      };
    },
    paginationFilter() {
      return {
        page: this.pagination ? this.pagination.page - 1 : 0,
        size: this.pagination ? this.pagination.rowsPerPage : 50
      };
    }
  },
  methods: {
    async handleBatchUpdate(priority) {
      const ids = Object.keys(this.exceptionSelections).filter(
        (id) => this.exceptionSelections[id]
      );
      if (ids.length === 0) return;

      const payload = {};

      if (this[`batchOriginRadius${priority}Input`] !== 'No Change') {
        payload.originRadius = this[`batchOriginRadius${priority}Input`];
      }

      if (this[`batchDestRadius${priority}Input`] !== 'No Change') {
        payload.destRadius = this[`batchDestRadius${priority}Input`];
      }

      if (this[`batchPrice${priority}BumpInput`] !== 'No Change') {
        payload.priceBump = this[`batchPrice${priority}BumpInput`];
      }

      if (this[`batchPrice${priority}Input`] !== 0) {
        payload.price = this[`batchPrice${priority}Input`];
      }

      await this.$apollo.mutate({
        mutation: graphql.mutations.updatePricingExceptions,
        variables: {
          pricingExceptionIDs: ids,
          priority: priority,
          pricingRule: payload
        }
      });
    },
    async filterCities(state) {
      const res = await fetch(`/rest-api/cities?state=${state}`);
      return res.json();
    },
    async filterOriginCities(val, update, abort) {
      if (this.filter.originCities) {
        update();
      } else if (this.filter.originState) {
        try {
          const cities = await this.filterCities(this.filter.originState.abbr);
          update(() => {
            this.filter.originCities = [{ id: -1, name: 'Not set' }].concat(
              cities
            );
          });
        } catch (e) {
          abort();
        }
      } else {
        update();
      }
    },
    async filterDestCities(val, update, abort) {
      if (this.filter.destCities) {
        update();
      } else if (this.filter.destState) {
        try {
          const cities = await this.filterCities(this.filter.destState.abbr);
          update(() => {
            this.filter.destCities = [{ id: -1, name: 'Not set' }].concat(
              cities
            );
          });
        } catch (e) {
          abort();
        }
      } else {
        update();
      }
    },
    // handleAddException() {},
    toggleEditRule(exception, index, rule) {
      this.editingRule = {
        id: `${exception.id}${index}`,
        ...rule
      };
    },
    async handleUpdateRule() {
      const exceptionId = this.editingRule.id.substr(
        0,
        this.editingRule.id.length - 1
      );
      const ruleIndex = Number(
        this.editingRule.id.substr(this.editingRule.id.length - 1)
      );

      try {
        this.updatingRule = true;
        await this.$apollo.mutate({
          mutation: graphql.mutations.updatePricingException,
          variables: {
            pricingExceptionID: exceptionId,
            priority: ruleIndex + 1,
            pricingRule: {
              originRadius: this.editingRule.originRadius,
              destRadius: this.editingRule.destRadius,
              price: this.editingRule.price
            }
          },
          update: (store, { data: { updatePricingRule: theUpdated } }) => {
            const data = store.readQuery({
              query: graphql.queries.getPricingExceptions,
              variables: {
                filter: this.exceptionsFilter,
                cursor: this.getPaginationCursor()
              }
            });

            data.pricingExceptions.data = data.pricingExceptions.data.map(
              (exception) => {
                if (exception.id !== theUpdated.id) return exception;
                return theUpdated;
              }
            );

            store.writeQuery({
              query: graphql.queries.getPricingExceptions,
              variables: {
                filter: this.exceptionsFilter,
                cursor: this.getPaginationCursor()
              },
              data
            });
          }
        });
        this.editingRule.id = null;
      } catch (error) {
        this.notifyNegative(error.message);
      }
      this.updatingRule = false;
    }
  }
};
</script>

<style></style>
