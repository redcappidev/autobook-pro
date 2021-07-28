<template>
  <q-card style="min-width: 700px;">
    <q-card-section class="text-center">
      <div class="text-h6 text-weight-medium row">
        <span>Dispatch To&nbsp;</span>
        <span v-if="!loading">{{ carrier.companyName }}</span>
        <q-skeleton
          v-else
          type="rect"
          width="200px"
          height="32px"
          animation="fade"
        />
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <div class="row q-col-gutter-x-sm">
        <div class="col">
          <a
            v-if="!loading"
            href="#"
            @click="handleMoveToCarrierDetail"
            class="text-subtitle1 text-bold text-primary"
          >
            {{ carrier.companyName }}
          </a>
          <div v-else>
            <q-skeleton type="rect" height="18px" animation="fade" />
          </div>

          <div class="text-body2" v-if="!loading">{{ carrier.address }}</div>
          <div class="q-mt-sm" v-else>
            <q-skeleton type="rect" height="18px" animation="fade" />
          </div>

          <div class="text-body2" v-if="!loading">
            {{ carrier.city }} {{ carrier.state }}, {{ carrier.zipcode }}
          </div>
          <div class="q-mt-sm" v-else>
            <q-skeleton type="rect" height="18px" animation="fade" />
          </div>

          <div class="text-body2" v-if="!loading">
            {{ carrier.phoneNumber | phoneNumber }}
          </div>
          <div class="q-mt-sm" v-else>
            <q-skeleton type="rect" height="18px" animation="fade" />
          </div>

          <div class="text-body2 q-mt-sm" v-if="!loading">
            <strong>MC Number:</strong> {{ carrier.mcNumber }}
          </div>
          <div class="q-mt-sm" v-else>
            <q-skeleton type="rect" height="18px" animation="fade" />
          </div>

          <div class="text-body2" v-if="!loading">
            <strong>DOT Number:</strong> {{ carrier.dotNumber }}
          </div>
          <div class="q-mt-sm" v-else>
            <q-skeleton type="rect" height="18px" animation="fade" />
          </div>
        </div>
        <div class="col">
          <div class="row justify-between items-center">
            <strong>Driver:</strong>
            <q-btn
              outline
              color="primary"
              size="sm"
              label="Add driver"
              class="float-right"
              :disabled="loading"
              @click="$emit('add-driver')"
            />
          </div>
          <app-select-input
            :loadingData="loading"
            :value="driver"
            :options="carrier ? carrier.drivers : []"
            :option-label="(opt) => `${opt.firstName} ${opt.lastName}`"
            option-value="id"
            label="Select a driver"
            @input="
              driver = $event;
              delayTouch($v.driver, $options.touchMap);
            "
            :error="$v.driver.$error"
          />

          <div class="q-mt-sm">
            <strong>Dispatch Instructions: </strong>
            <q-input
              v-if="!loading"
              dense
              type="textarea"
              rows="3"
              placeholder="Additional Information for the driver/carrier"
              :value="instructions"
              @input="
                instructions = $event;
                delayTouch($v.instructions, $options.touchMap);
              "
              :error="$v.instructions.$error"
            />
            <div class="q-py-xs" v-else>
              <q-skeleton type="rect" height="64px" animation="fade" />
            </div>
          </div>

          <q-input
            dense
            class="q-mt-sm"
            type="date"
            v-model="pickupDate"
            @input="
              pickupDate = $event;
              delayTouch($v.pickupDate, $options.touchMap);
            "
            :error="$v.pickupDate.$error"
          >
            <template v-slot:prepend>
              <span class="text-subtitle2">Pickup Date &nbsp;</span>
            </template>
          </q-input>

          <q-input
            dense
            class="q-mt-sm"
            type="date"
            v-model="deliveryDate"
            @input="
              deliveryDate = $event;
              delayTouch($v.deliveryDate, $options.touchMap);
            "
            :error="$v.deliveryDate.$error"
          >
            <template v-slot:prepend>
              <span class="text-subtitle2">Delivery Date</span>
            </template>
          </q-input>

          <!-- <div class="q-mt-sm">
            <strong>Dispatch Options:</strong>
            <q-option-group
              v-model="dispatchOption"
              :options="dispatchOptions"
              class="text-body2"
              type="radio"
            />
          </div> -->
        </div>
      </div>
    </q-card-section>
    <q-separator />
    <q-card-actions align="right">
      <q-btn flat label="Back" color="primary" @click="$emit('back')" />
      <q-btn
        outline
        label="Dispatch To Carrier"
        color="primary"
        :loading="dispatching"
        @click="handleDispatch"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import AppSelectInput from '@client/components/form/select-input';
import graphql from '@client/graphql';
import { required } from 'vuelidate/lib/validators';
import { extractKeysIntoObject } from '@client/utils/object-helpers';

export default {
  name: 'AppDispatchToCarrierDialogDispatch',
  props: ['carrierId', 'orderId'],
  components: {
    AppSelectInput
  },
  apollo: {
    carrier: {
      query: graphql.queries.getCarrier,
      variables() {
        return {
          id: this.carrierId
        };
      },
      watchLoading(isLoading) {
        this.loading = isLoading;
      }
    }
  },
  validations: {
    driver: {
      id: { required }
    },
    instructions: { required },
    pickupDate: { required },
    deliveryDate: { required }
  },
  data() {
    return {
      loading: false,

      driver: null,
      instructions: null,
      pickupDate: null,
      deliveryDate: null,

      dispatchOption: 1,
      dispatchOptions: [
        { label: 'Dispatch through ProABD (Remove from Central)', value: 1 },
        { label: ' Dispatch through ProABD (Keep on Central)', value: 2 }
      ],

      dispatching: false
    };
  },
  methods: {
    handleMoveToCarrierDetail() {
      const routeData = this.$router.resolve({
        name: 'carrier-detail',
        params: { id: this.carrier.id }
      });
      window.open(routeData.href, '_blank');
    },
    async handleDispatch() {
      this.validate(['driver', 'instructions', 'pickupDate', 'deliveryDate']);

      this.dispatching = true;

      try {
        const data = extractKeysIntoObject(this, [
          'instructions',
          'pickupDate',
          'deliveryDate'
        ]);
        await this.$apollo.mutate({
          mutation: graphql.mutations.dispatchOrder,
          variables: {
            orderId: this.orderId,
            input: {
              ...data,
              driverId: this.driver.id
            }
          }
        });

        const res = await fetch(
          `/rest-api/central-dispatch-id?order_id=${this.orderId}`
        );
        const result = await res.json();
        this.$emit('dispatched', result.data);
      } catch (error) {
        console.log('dispatch error', error);
      }

      this.dispatching = false;
    }
  }
};
</script>
