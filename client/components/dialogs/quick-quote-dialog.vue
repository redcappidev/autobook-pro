<template>
  <q-dialog
    :value="open"
    position="right"
    transition-show="slide-left"
    transition-hide="slide-right"
    class="absolute"
    @hide="closeDialog"
  >
    <q-card v-if="open" class="quick-quote-container">
      <q-card-section class="text-center">
        <div class="text-h6 text-weight-medium">
          Quick Calculator
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="row q-col-gutter-sm">
        <div class="col-8 q-gutter-y-sm">
          <div class="row q-gutter-x-sm">
            <div class="col">
              <app-location-filterable-card
                context="quick-quote"
                label="Origin"
                v-model="origin"
                :validation="$v.origin"
              />
            </div>
            <div class="col">
              <app-location-filterable-card
                context="quick-quote"
                label="Destination"
                v-model="destination"
                :validation="$v.destination"
              />
            </div>
          </div>
          <div class="q-py-md row justify-between">
            <q-btn
              outline
              color="orange"
              label="Find Similar Loads on Central Dispatch"
              type="a"
              :href="`https://www.centraldispatch.com/protected/listing-search/result?pickupCitySearch=1&pickupRadius=50&pickupCity=${origin.city}&pickupState=${origin.state}&pickupZip=${origin.zipcode}&origination_valid=1&deliveryCitySearch=1&deliveryRadius=50&deliveryCity=${destination.city}&deliveryState=${destination.state}&deliveryZip=${destination.zipcode}&destination_valid=1&trailerType=&vehiclesRun=&minVehicles=1&maxVehicles=&shipWithin=60&paymentType=&minPayPrice=&minPayPerMile=&highlightPeriod=0&listingsPerPage=100&postedBy=&primarySort=1&secondarySort=4`"
              target="__blank"
              :disabled="
                !origin.city ||
                !origin.state ||
                !origin.zipcode ||
                !destination.city ||
                !destination.state ||
                !destination.zipcode
              "
            />
            <div>
              <q-btn
                outline
                color="secondary"
                label="View Origin"
                type="a"
                href="#"
                @click.prevent="handleClickViewLocation(origin.zipcode)"
                :disabled="!origin.zipcode"
              />
              <q-btn
                outline
                color="secondary"
                label="View Destination"
                type="a"
                @click.prevent="handleClickViewLocation(destination.zipcode)"
                :disabled="!destination.zipcode"
              />
              <q-btn
                outline
                color="secondary"
                label="View Route"
                type="a"
                @click.prevent="
                  handleClickViewRoute(origin.zipcode, destination.zipcode)
                "
                :href="`javascript:NewWindow=window.open('http://maps.google.com/maps?q=from+${origin.zipcode}+to+${destination.zipcode}','GoogleImg','width=800,height=600,left=0,top=0, toolbar=No,location=No,scrollbars=Yes,status=No,resizable=Yes,fullscreen=No,directories=No,menubar=No,copyhistory=No'); NewWindow.focus(); void(0);`"
                :disabled="!origin.zipcode || !destination.zipcode"
              />
            </div>
          </div>
          <app-vehicle-details-card
            context="quick-quote"
            v-model="vehicles"
            :validation="$v.vehicles"
          />
        </div>
        <div class="col-4">
          <app-transport-pricing-card
            context="quick-quote"
            v-model="transport"
            @run-taq="handleRunTAQ"
            :running-taq="runningTAQ"
            :validation="$v.transport"
          />
          <app-transport-info-card
            context="quick-quote"
            v-model="transport"
            :validation="$v.transport"
          />
          <div class="text-right q-mt-sm">
            <q-btn
              outline
              color="primary"
              label="Create Quote"
              @click="handleCreateQuote"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { formatISO } from 'date-fns';
import { required, minLength, minValue } from 'vuelidate/lib/validators';
import graphql from '@client/graphql';
import { extractKeysIntoObject } from '@client/utils/object-helpers';
import AppLocationFilterableCard from '../cards/location-filterable-card';
import AppVehicleDetailsCard from '../cards/vehicle-details-card';
import AppTransportPricingCard from '../cards/transport-pricing-card';
import AppTransportInfoCard from '../cards/transport-info-card';

const defaultValue = {
  origin: {},
  destination: {},
  vehicles: [
    {
      year: null,
      make: null,
      model: null,
      operable: null
    }
  ],
  transport: {
    carrierType: 'OPEN',
    availableDate: formatISO(new Date(), { representation: 'date' }),
    deposit: 0,
    totalPrice: 0,
    basePrice: 0,
    sizeFee: 0,
    inopFee: 0,
    enclosedFee: 0,
    fullPay: 0
  }
};

export default {
  name: 'AppQuickQuoteDialog',
  components: {
    AppLocationFilterableCard,
    AppVehicleDetailsCard,
    AppTransportPricingCard,
    AppTransportInfoCard
  },
  validations: {
    origin: {
      state: { required },
      city: { required },
      zipcode: { required }
    },
    destination: {
      state: { required },
      city: { required },
      zipcode: { required }
    },
    vehicles: {
      required,
      minLength: minLength(1),
      $each: {
        year: { required },
        make: { required },
        model: { required },
        operable: { required }
      }
    },
    transport: {
      basePrice: {
        required,
        minValue: minValue(1)
      },
      deposit: {
        required,
        minValue: minValue(1)
      }
    }
  },
  data() {
    return {
      open: false,
      runningTAQ: false,

      ...defaultValue
    };
  },
  methods: {
    openDialog() {
      Object.assign(this, defaultValue);
      this.$v.$reset();
      this.open = true;
    },
    closeDialog() {
      this.open = false;
    },
    handleClickViewLocation(zipcode) {
      if (!zipcode) return;
      const NewWindow = window.open(
        `http://maps.google.com/maps?q=${zipcode}`,
        'GoogleImg',
        'width=800,height=600,left=0,top=0,toolbar=No,location=No,scrollbars=Yes,status=No,resizable=Yes,fullscreen=No,directories=No,menubar=No,copyhistory=No'
      );
      NewWindow.focus();
    },
    handleClickViewRoute(originZipcode, destinationZipcode) {
      if (!originZipcode || !destinationZipcode) return;
      const NewWindow = window.open(
        `http://maps.google.com/maps?q=from+${originZipcode}+to+${destinationZipcode}'`,
        'GoogleImg',
        'width=800,height=600,left=0,top=0,toolbar=No,location=No,scrollbars=Yes,status=No,resizable=Yes,fullscreen=No,directories=No,menubar=No,copyhistory=No'
      );
      NewWindow.focus();
    },
    async handleRunTAQ() {
      this.validate(['origin', 'destination', 'vehicles']);

      this.runningTAQ = true;

      try {
        const response = await this.$apollo.mutate({
          mutation: graphql.mutations.calcQuotePrice,
          variables: {
            origin: this.origin,
            destination: this.destination,
            vehicles: this.vehicles,
            carrierType: this.transport.carrierType
          }
        });
        const { calcQuotePrice } = response.data;
        this.transport = { ...this.transport, ...calcQuotePrice };
      } catch (error) {
        this.notifyNegative(error.message);
      }

      this.runningTAQ = false;
    },
    handleCreateQuote() {
      this.validate(['origin', 'destination', 'vehicles', 'transport']);

      const inputData = extractKeysIntoObject(this, [
        'origin',
        'destination',
        'vehicles',
        'transport'
      ]);

      localStorage.setItem('quick-quote', JSON.stringify(inputData));

      this.closeDialog();
      this.$router.push({
        name: 'create-quote',
        query: { referrer: 'quick-quote' }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.quick-quote-container {
  min-width: calc(100vw - 230px);
}
</style>
