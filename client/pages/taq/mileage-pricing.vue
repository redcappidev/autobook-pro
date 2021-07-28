<template>
  <div class="q-pa-md q-mx-auto" style="max-width: 600px;">
    <q-card flat bordered>
      <q-card-section class="q-pa-sm row justify-between items-center">
        <div class="text-subtitle1 text-bold">
          <q-icon
            name="person"
            style="font-size: 25px; padding-right: 0.1rem;"
          />
          Mileage Pricing
        </div>
        <q-btn
          v-if="canUpdateMileagePricing"
          outline
          label="Save"
          size="sm"
          :loading="saving"
          @click="handleSave"
        />
      </q-card-section>
      <q-separator />
      <q-card-section v-if="!loading">
        <div
          class="row items-center q-col-gutter-x-sm"
          v-for="(pricingItem, index) in mileagePricingItems"
          :key="index"
        >
          <app-editable-input
            class="col"
            :readonly="!canUpdateMileagePricing"
            :data="pricingItem.minMileage"
            type="number"
            min="0"
            text="Min Miles *"
            name="minMileage"
            @input="handlePriceChange(index, $event)"
          />
          <app-editable-input
            class="col"
            :readonly="!canUpdateMileagePricing"
            :data="pricingItem.maxMileage"
            type="number"
            min="0"
            text="Max Miles *"
            name="maxMileage"
            @input="handlePriceChange(index, $event)"
          />
          <app-editable-input
            class="col"
            :readonly="!canUpdateMileagePricing"
            :data="pricingItem.price"
            type="number"
            min="0"
            text="Price *"
            name="price"
            prefix="$"
            @input="handlePriceChange(index, $event)"
          />
          <div v-if="canUpdateMileagePricing">
            <q-btn
              dense
              size="sm"
              outline
              color="primary"
              icon="add"
              @click="handleAddPrice(index)"
            />
          </div>
          <div
            v-if="canUpdateMileagePricing"
            :class="`${
              index !== 0 || (mileagePricings && mileagePricings.length > 0)
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
              @click="handleDeletePrice(index)"
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
import AppEditableInput from '@client/components/form/editable-input';
import { sanitizeObject } from '@client/utils/object-helpers';

export default {
  metaInfo: {
    title: 'AutoBook Pro - Mileage Pricing'
  },
  components: {
    AppEditableInput
  },
  apollo: {
    currentUser: {
      query: graphql.queries.currentUser
    },
    mileagePricings: {
      query: graphql.queries.getMileagePricings,
      watchLoading(isLoading) {
        this.loading = isLoading;
      },
      error(error) {
        this.error = error;
      },
      result(result) {
        if (result.loading) return;

        if (result.data.mileagePricings.length === 0) {
          this.mileagePricingItems = [
            {
              minMileage: 0,
              maxMileage: 0,
              price: 0
            }
          ];
        } else {
          this.mileagePricingItems = result.data.mileagePricings;
        }
      }
    }
  },
  data() {
    return {
      saving: false,
      loading: false,
      error: null,

      deleted: [],
      mileagePricingItems: []
    };
  },
  computed: {
    canUpdateMileagePricing() {
      return assessPermission.taq.canUpdate(this.currentUser);
    }
  },
  methods: {
    handlePriceChange(index, event) {
      this.mileagePricingItems = this.mileagePricingItems.map((d, i) => {
        if (index === i) {
          return {
            ...d,
            [event.name]: parseInt(event.model, 10)
          };
        }
        return d;
      });
    },
    handleAddPrice(index) {
      const data = [...this.mileagePricingItems];
      data.splice(index + 1, 0, {
        minMileage: 0,
        maxMileage: 0,
        price: 0
      });
      this.mileagePricingItems = data;
    },
    handleDeletePrice(index) {
      if (this.mileagePricingItems[index].id) {
        this.deleted.push(this.mileagePricingItems[index].id);
      }

      const data = [...this.mileagePricingItems];
      data.splice(index, 1);
      this.mileagePricingItems = data;
    },
    async handleSave() {
      this.saving = true;

      try {
        if (this.deleted.length > 0) {
          await this.$apollo.mutate({
            mutation: graphql.mutations.deleteMileagePricings,
            variables: {
              ids: this.deleted
            }
          });
        }

        const response = await this.$apollo.mutate({
          mutation: graphql.mutations.updateMileagePricings,
          variables: {
            pricingData: this.mileagePricingItems.map((d) => sanitizeObject(d))
          }
        });

        this.mileagePricingItems = response.data.updateMileagePricings;
        this.deleted = [];
        this.notifyPositive('Mileage Pricings have been saved successfully!');
      } catch (error) {
        this.notifyNegative(error.message);
      }

      this.saving = false;
    }
  }
};
</script>

<style></style>
