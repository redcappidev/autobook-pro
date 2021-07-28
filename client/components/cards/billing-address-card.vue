<template>
  <q-card flat bordered>
    <q-card-section class="q-pa-sm">
      <div class="text-subtitle1 text-bold q-px-sm">
        <q-icon
          name="request_quote"
          style="font-size: 25px; padding-right: 0.1rem;"
        />
        Billing Address
      </div>
    </q-card-section>

    <q-separator />
    <q-card-section>
      <div class="row justify-center" v-if="!disableUseInfo">
        <q-btn
          flat
          color="primary"
          label="Same as shipper"
          @click="$emit('use-info', 'shipper')"
        />
        <q-btn
          flat
          color="primary"
          label="Same as pickup"
          @click="$emit('use-info', 'origin')"
        />
        <q-btn
          flat
          color="primary"
          label="Same as delivery"
          @click="$emit('use-info', 'destination')"
        />
      </div>
      <app-editable-input
        :data="value.companyName"
        :text="`Company${context === 'book' ? ' (Optional)' : ''}`"
        name="companyName"
        @input="handleChangeInput($event)"
      />
      <app-editable-input
        :data="value.firstName"
        text="First Name *"
        name="firstName"
        @input="
          handleChangeInput($event);
          delayTouch(validation.firstName, $options.touchMap);
        "
        :error="validation.firstName.$error"
      />
      <app-editable-input
        :data="value.lastName"
        text="Last Name *"
        name="lastName"
        @input="
          handleChangeInput($event);
          delayTouch(validation.lastName, $options.touchMap);
        "
        :error="validation.lastName.$error"
      />
      <app-editable-input
        :data="value.email"
        text="Email *"
        name="email"
        @input="
          handleChangeInput($event);
          delayTouch(validation.email, $options.touchMap);
        "
        :error="validation.email.$error"
      />
      <app-editable-input
        :data="value.address"
        text="Address *"
        name="address"
        @input="
          handleChangeInput($event);
          delayTouch(validation.address, $options.touchMap);
        "
        :error="validation.address.$error"
      />
      <app-select-input
        :readonly="false"
        :action="false"
        text="City *"
        hide-dropdown-icon
        use-input
        :options="filterOptions"
        option-label="label"
        option-value="value"
        :value="value.city"
        @input="
          handleSelectChange($event);
          delayTouch(validation.city, $options.touchMap);
        "
        @filter="filterCityFn"
        :loading="searchingCity"
        :error="validation.city.$error"
      />

      <app-editable-input
        :data="value.state"
        text="State *"
        name="state"
        @input="
          handleChangeInput($event);
          delayTouch(validation.state, $options.touchMap);
        "
        :error="validation.state.$error"
      />
      <app-select-input
        :readonly="false"
        :action="false"
        text="Zipcode *"
        hide-dropdown-icon
        use-input
        :options="filterOptions"
        option-label="label"
        option-value="value"
        :value="value.zipcode"
        @input="
          handleSelectChange($event);
          delayTouch(validation.zipcode, $options.touchMap);
        "
        @filter="filterZipcodeFn"
        :loading="searchingZipcode"
        :error="validation.zipcode.$error"
      />
    </q-card-section>
  </q-card>
</template>
<script>
import AppEditableInput from '@client/components/form/editable-input';
import { RouteRunner } from '@client/third-party';
import AppSelectInput from '@client/components/form/select-input';

export default {
  name: 'AppBillingAddressCard',
  props: {
    context: String,
    disableUseInfo: Boolean,
    value: Object,
    validation: Object
  },
  components: {
    AppEditableInput,
    AppSelectInput
  },
  data() {
    return {
      searchingCity: false,
      searchingZipcode: false,
      filterOptions: []
    };
  },
  methods: {
    handleChangeInput(value) {
      const { name, model } = value;
      this.$emit('input', {
        ...this.value,
        [name]: model
      });
    },
    async filterFn(val) {
      if (!val) return [];

      const response = await RouteRunner.getLocations(val);
      if (response) {
        return JSON.parse(response).map((el) => ({
          label: `${el.city}, ${el.id} ${el.zip}`,
          value: el
        }));
      }

      return [];
    },
    async filterCityFn(val, update) {
      this.searchingCity = true;
      const options = await this.filterFn(val);
      update(() => {
        this.filterOptions = options;
      });
      this.searchingCity = false;
    },
    async filterZipcodeFn(val, update) {
      this.searchingZipcode = true;
      const options = await this.filterFn(val);
      update(() => {
        this.filterOptions = options;
      });
      this.searchingZipcode = false;
    },
    handleSelectChange(props) {
      const { value } = props;
      this.state = value.id;
      this.zipcode = value.zip;
      this.city = value.city;

      this.$emit('input', {
        ...this.value,
        state: value.id.trim(),
        zipcode: value.zip.trim(),
        city: value.city.trim()
      });
    }
  }
};
</script>
<style lang="scss"></style>
