<template>
  <q-dialog :value="open" @hide="closeDialog">
    <q-card v-if="open">
      <q-card-section class="text-center">
        <div class="text-h6 text-weight-medium">
          Pricing Exception
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-gutter-y-sm">
        <div class="row q-gutter-x-sm">
          <q-select
            v-model="originState"
            :options="allStates"
            option-value="abbr"
            option-label="name"
            label="Pickup State"
            dense
            style="min-width: 130px;"
            @input="delayTouch($v.originState, $options.touchMap)"
            :error="$v.originState.$error"
          />
          <q-select
            v-model="originCity"
            :options="originCities || []"
            option-value="id"
            option-label="name"
            label="Pickup City"
            dense
            style="min-width: 130px;"
            @filter="filterOriginCities"
            @input="delayTouch($v.originCity, $options.touchMap)"
            :error="$v.originCity.$error"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="row q-gutter-x-sm">
          <q-select
            v-model="destState"
            :options="allStates"
            option-value="abbr"
            option-label="name"
            label="Delivery State"
            dense
            style="min-width: 130px;"
            @input="delayTouch($v.destState, $options.touchMap)"
            :error="$v.destState.$error"
          />
          <q-select
            v-model="destCity"
            :options="destCities || []"
            option-value="id"
            option-label="name"
            label="Delivery City"
            dense
            style="min-width: 130px;"
            @filter="filterDestCities"
            @input="delayTouch($v.destCity, $options.touchMap)"
            :error="$v.destCity.$error"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <q-input
          label="Origin Radius"
          type="number"
          dense
          v-model.number="originRadius"
        />
        <q-input
          label="Destination Radius"
          type="number"
          dense
          v-model.number="destRadius"
        />
        <q-input label="Price" type="number" dense v-model.number="price" />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          outline
          label="Save"
          color="primary"
          :loading="saving"
          @click="handleSave"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import USA_STATES from '@server/constants/usa-states';
import { pricingExceptionValidator } from '@client/validators';
import { extractKeysIntoObject } from '@client/utils/object-helpers';
import graphql from '@client/graphql';

export default {
  validations: pricingExceptionValidator,
  data() {
    return {
      open: false,
      allStates: USA_STATES,
      originCities: null,
      destCities: null,
      originState: null,
      originCity: null,
      destState: null,
      destCity: null,
      originRadius: null,
      destRadius: null,
      price: null,

      saving: false
    };
  },
  methods: {
    async filterCities(state) {
      const res = await fetch(`/rest-api/cities?state=${state}`);
      return res.json();
    },
    async filterOriginCities(val, update, abort) {
      if (this.originCities) {
        update();
      } else if (this.originState) {
        try {
          const cities = await this.filterCities(this.originState.abbr);
          update(() => {
            this.originCities = cities;
          });
        } catch (e) {
          abort();
        }
      } else {
        update();
      }
    },
    async filterDestCities(val, update, abort) {
      if (this.destCities) {
        update();
      } else if (this.destState) {
        try {
          const cities = await this.filterCities(this.destState.abbr);
          update(() => {
            this.destCities = cities;
          });
        } catch (e) {
          abort();
        }
      } else {
        update();
      }
    },
    openDialog() {
      this.$v.$reset();
      this.open = true;
    },
    closeDialog() {
      this.open = false;
    },
    async handleSave() {
      this.validate(['originState', 'originCity', 'destState', 'destCity']);

      const pe = extractKeysIntoObject(this, [
        'originState',
        'originCity',
        'destState',
        'destCity',
        'originRadius',
        'destRadius',
        'price'
      ]);

      this.saving = true;

      try {
        await this.$apollo.mutate({
          mutation: graphql.mutations.createPricingException,
          variables: {
            originState: pe.originState.abbr,
            originCity: pe.originCity.name,
            destState: pe.destState.abbr,
            destCity: pe.destCity.name,
            pricingRules: [
              {
                originRadius: pe.originRadius,
                destRadius: pe.destRadius,
                price: pe.price
              }
            ]
          }
        });

        this.closeDialog();
      } catch (error) {
        this.notifyNegative(error.message);
      }

      this.saving = false;
    }
  }
};
</script>

<style></style>
