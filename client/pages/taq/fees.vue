<template>
  <div class="q-pa-md q-gutter-y-sm q-mx-auto" style="max-width: 600px;">
    <q-card flat bordered>
      <q-card-section class="q-pa-sm row justify-between items-center">
        <div class="text-subtitle1 text-bold">
          <q-icon
            name="person"
            style="font-size: 25px; padding-right: 0.1rem;"
          />
          General
        </div>
        <q-btn
          v-if="canUpdateFees"
          outline
          label="Save"
          size="sm"
          :loading="savingFees"
          @click="handleSaveFee"
        />
      </q-card-section>

      <q-separator />
      <q-card-section class="row q-col-gutter-sm">
        <app-editable-input
          class="col-6"
          v-for="(feeItem, index) in depositFeeItems"
          :key="index"
          :loadingData="loadingFees"
          :readonly="!canUpdateFees"
          :data="feeItem.fee"
          type="number"
          min="0"
          :text="`${feeItem.label} Deposit *`"
          :name="feeItem.slug"
          prefix="$"
          @input="handleFeeChange"
        />
        <app-editable-input
          class="col-6"
          :loadingData="loadingFees"
          :readonly="!canUpdateFees"
          :data="inopFeeItem.fee"
          type="number"
          min="0"
          text="Inop Fee *"
          name="inop"
          prefix="$"
          @input="handleFeeChange"
        />
      </q-card-section>
    </q-card>
    <q-card flat bordered>
      <q-card-section class="q-pa-sm row justify-between items-center">
        <div class="text-subtitle1 text-bold">
          <q-icon
            name="person"
            style="font-size: 25px; padding-right: 0.1rem;"
          />
          Enclosed Fees
        </div>
        <q-btn
          v-if="canUpdateFees"
          outline
          label="Save"
          size="sm"
          :loading="savingEnclosedFees"
          @click="handleSaveEnclosedFee"
        />
      </q-card-section>

      <q-separator />
      <q-card-section v-if="!loadingEnclosedFees">
        <div
          class="row items-center q-col-gutter-x-sm"
          v-for="(rule, index) in enclosedFeeItems"
          :key="index"
        >
          <app-editable-input
            class="col"
            :readonly="!canUpdateFees"
            :data="rule.minMileage"
            type="number"
            min="0"
            text="Min Miles *"
            name="minMileage"
            @input="handleEnclosedFeeChange(index, $event)"
          />
          <app-editable-input
            class="col"
            :readonly="!canUpdateFees"
            :data="rule.maxMileage"
            type="number"
            min="0"
            text="Max Miles *"
            name="maxMileage"
            @input="handleEnclosedFeeChange(index, $event)"
          />
          <app-editable-input
            class="col"
            :readonly="!canUpdateFees"
            :data="rule.fee"
            type="number"
            min="0"
            text="Fee *"
            name="fee"
            prefix="$"
            @input="handleEnclosedFeeChange(index, $event)"
          />
          <div v-if="canUpdateFees">
            <q-btn
              dense
              size="sm"
              outline
              color="primary"
              icon="add"
              @click="handleAddEnclosedFee(index)"
            />
          </div>
          <div
            v-if="canUpdateFees"
            :class="`${
              index !== 0 || (enclosedFees && enclosedFees.length > 0)
                ? 'visible'
                : 'invisible'
            }`"
          >
            <q-btn
              dense
              size="sm"
              outline
              color="negative"
              icon="delete"
              @click="handleDeleteEnclosedFee(index)"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-section v-else>
        <div class="q-py-xs">
          <q-skeleton type="rect" height="32px" animation="fade" />
        </div>
        <div class="q-py-xs">
          <q-skeleton type="rect" height="32px" animation="fade" />
        </div>
        <div class="q-py-xs">
          <q-skeleton type="rect" height="32px" animation="fade" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import graphql from '@client/graphql';
import { assessPermission } from '@server/lib/permission-helpers';
import { referrers } from '@server/constants/referrers';
import { sanitizeObject } from '@client/utils/object-helpers';
import AppEditableInput from '@client/components/form/editable-input';

export default {
  name: 'Fees',
  metaInfo: {
    title: 'AutoBook Pro - Fees'
  },
  components: {
    AppEditableInput
  },
  apollo: {
    currentUser: {
      query: graphql.queries.currentUser
    },
    fees: {
      query: graphql.queries.getFees,
      watchLoading(isLoading) {
        this.loadingFees = isLoading;
      },
      error(error) {
        this.error = error;
      },
      result(result) {
        if (result.loading) return;

        this.setFees(result.data.fees);
      }
    },
    enclosedFees: {
      query: graphql.queries.getEnclosedFees,
      watchLoading(isLoading) {
        this.loadingEnclosedFees = isLoading;
      },
      error(error) {
        this.error = error;
      },
      result(result) {
        if (result.loading) return;
        if (result.data.enclosedFees.length === 0) {
          this.enclosedFeeItems = [
            {
              minMileage: 0,
              maxMileage: 0,
              fee: 0,
              order: 0
            }
          ];
        } else {
          this.enclosedFeeItems = result.data.enclosedFees.sort(
            (a, b) => a.order - b.order
          );
        }
      }
    }
  },
  data() {
    return {
      error: null,
      loadingFees: false,
      savingFees: false,

      loadingEnclosedFees: false,
      savingEnclosedFees: false,

      depositFeeItems: [],
      inopFeeItem: {},

      enclosedFeeItems: [],
      deleted: [],

      referrers
    };
  },
  computed: {
    canUpdateFees() {
      return assessPermission.taq.canUpdate(this.currentUser);
    }
  },
  mounted() {
    this.depositFeeItems = this.referrers.map((referrer) => {
      const slug = `${referrer.value}-deposit`;
      return { slug, label: referrer.label, fee: 0 };
    });
  },
  methods: {
    setFees(fees) {
      const data = fees.reduce((m, fee) => ({ ...m, [fee.slug]: fee }), {});

      this.depositFeeItems = this.referrers.map((referrer) => {
        const slug = `${referrer.value}-deposit`;
        const item = data[slug] || {};
        return {
          ...item,
          slug,
          label: referrer.label,
          fee: item.fee || 0
        };
      });

      const inopItem = data.inop || {};
      this.inopFeeItem = {
        ...inopItem,
        slug: 'inop',
        fee: inopItem.fee || 0
      };
    },
    handleFeeChange(event) {
      if (event.name !== 'inop') {
        this.depositFeeItems = this.depositFeeItems.map((d) => {
          if (d.slug === event.name) {
            return {
              ...d,
              fee: parseInt(event.model, 10)
            };
          }
          return d;
        });
      } else {
        this.inopFeeItem.fee = parseInt(event.model, 10);
      }
    },
    handleEnclosedFeeChange(index, event) {
      this.enclosedFeeItems = this.enclosedFeeItems.map((d, i) => {
        if (index === i) {
          return {
            ...d,
            [event.name]: parseInt(event.model, 10)
          };
        }
        return d;
      });
    },
    handleAddEnclosedFee(index) {
      const data = [...this.enclosedFeeItems];
      data.splice(index + 1, 0, {
        minMileage: 0,
        maxMileage: 0,
        fee: 0
      });
      this.enclosedFeeItems = data.map((d, i) => ({ ...d, order: i }));
    },
    handleDeleteEnclosedFee(index) {
      if (this.enclosedFeeItems[index].id) {
        this.deleted.push(this.enclosedFeeItems[index].id);
      }

      const data = [...this.enclosedFeeItems];
      data.splice(index, 1);
      this.enclosedFeeItems = data.map((d, i) => ({ ...d, order: i }));
    },
    async handleSaveFee() {
      this.savingFees = true;

      try {
        const response = await this.$apollo.mutate({
          mutation: graphql.mutations.updateFees,
          variables: {
            feeData: this.depositFeeItems
              .map((depositFeeItem) =>
                sanitizeObject({
                  id: depositFeeItem.id,
                  slug: depositFeeItem.slug,
                  fee: depositFeeItem.fee
                })
              )
              .concat(sanitizeObject(this.inopFeeItem))
          }
        });
        this.setFees(response.data.updateFees);
        this.notifyPositive('Fees have been saved successfully!');
      } catch (error) {
        this.notifyNegative(error.message);
      }

      this.savingFees = false;
    },
    async handleSaveEnclosedFee() {
      this.savingEnclosedFees = true;

      try {
        if (this.deleted.length > 0) {
          await this.$apollo.mutate({
            mutation: graphql.mutations.deleteEnclosedFees,
            variables: {
              ids: this.deleted
            }
          });
        }

        const response = await this.$apollo.mutate({
          mutation: graphql.mutations.updateEnclosedFees,
          variables: {
            feeData: this.enclosedFeeItems.map((d) => sanitizeObject(d))
          }
        });

        this.enclosedFeeItems = response.data.updateEnclosedFees;
        this.deleted = [];
        this.notifyPositive('Enclosed Fees have been saved successfully!');
      } catch (error) {
        this.notifyNegative(error.message);
      }

      this.savingEnclosedFees = false;
    }
  }
};
</script>

<style></style>
