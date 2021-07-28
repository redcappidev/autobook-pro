<template>
  <q-card flat bordered>
    <q-card-section class="q-pa-sm row bg-primary justify-between items-center">
      <div class="text-subtitle1 text-bold">
        <q-icon name="place" style="font-size: 25px; padding-right: 0.1rem;" />
        {{ label }}
      </div>
      <div class="row items-center q-gutter-x-sm">
        <q-btn
          v-if="!readonly && action === 'view' && !inBatchUpdating"
          icon="edit"
          color="secondary"
          dense
          flat
          size="sm"
          @click="inBatchUpdating = true"
        />
        <q-btn
          v-if="!readonly && action === 'view' && inBatchUpdating"
          icon="check"
          color="primary"
          dense
          flat
          size="sm"
          @loading="Boolean(saving.batch)"
          @click="handleBatchUpdate"
        />
        <q-btn
          v-if="!readonly && action === 'view' && inBatchUpdating"
          icon="cancel"
          color="red"
          dense
          flat
          size="sm"
          @click="inBatchUpdating = false"
        />
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section :class="sectionClass">
      <div :class="sectionEditablePart">
        <app-editable-input
          v-if="context === 'quote'"
          :loadingData="loadingData"
          :data="value.name"
          :readonly="isReadOnlyField"
          text="Name"
          name="name"
          @input="handleChangeInput"
        />
        <app-editable-input
          v-if="context === 'order' || context === 'book'"
          :loadingData="loadingData"
          :data="value.name"
          :readonly="isReadOnlyField"
          text="Name *"
          name="name"
          @input="handleChangeInput"
          :error="validation.name.$error"
        />
        <app-editable-input
          v-if="context === 'quote'"
          :loadingData="loadingData"
          :data="value.phone"
          :readonly="isReadOnlyField"
          type="tel"
          mask="+1 (###) ### - ####"
          unmasked-value
          text="Phone"
          name="phone"
          @input="handleChangeInput"
        >
          <template #append>
            <span class="text-subtitle2">
              {{ getTimezoneFromPhoneNumber(value.phone) }}
            </span>
          </template>
        </app-editable-input>
        <app-editable-input
          v-if="context === 'order' || context === 'book'"
          :loadingData="loadingData"
          :data="value.phone"
          :readonly="isReadOnlyField"
          type="tel"
          :disablePhoneCall="context === 'book'"
          mask="+1 (###) ### - ####"
          unmasked-value
          text="Phone *"
          name="phone"
          @input="handleChangeInput"
          :error="validation.phone.$error"
        />
        <app-editable-input
          v-if="context !== 'quick-quote'"
          :loadingData="loadingData"
          :data="value.phone2"
          :readonly="isReadOnlyField"
          type="tel"
          :disablePhoneCall="context === 'book'"
          mask="+1 (###) ### - ####"
          unmasked-value
          :text="`Phone 2${context === 'book' ? ' (Optional)' : ''}`"
          name="phone2"
          @input="handleChangeInput"
        >
          <template #append>
            <span class="text-subtitle2" v-if="context !== 'book'">{{
              getTimezoneFromPhoneNumber(value.phone2)
            }}</span>
          </template>
        </app-editable-input>
        <app-editable-input
          v-if="context === 'quote'"
          :loadingData="loadingData"
          :data="value.address"
          :readonly="isReadOnlyField"
          text="Address"
          name="address"
          @input="handleChangeInput"
        />
        <app-editable-input
          v-if="context === 'order' || context === 'book'"
          :loadingData="loadingData"
          :data="value.address"
          :readonly="isReadOnlyField"
          text="Address *"
          name="address"
          @input="handleChangeInput"
          :error="validation.address.$error"
        />
        <app-editable-input
          v-if="context === 'order' || context === 'book'"
          :loadingData="loadingData"
          :data="value.address2"
          :readonly="isReadOnlyField"
          :text="`Address 2${context === 'book' ? ' (Optional)' : ''}`"
          name="address2"
          @input="handleChangeInput"
        />
        <app-select-input
          v-if="context !== 'book'"
          :loadingData="loadingData"
          :readonly="readonly"
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
          v-if="context !== 'book'"
          :loadingData="loadingData"
          :data="value.state"
          :readonly="isReadOnlyField"
          text="State *"
          name="state"
          @input="handleChangeInput"
          :error="validation.state.$error"
        />
        <app-select-input
          v-if="context !== 'book'"
          :loadingData="loadingData"
          :readonly="readonly"
          text="Zipcode *"
          hide-dropdown-icon
          :value="value.zipcode"
          use-input
          @input="
            handleSelectChange($event);
            delayTouch(validation.zipcode, $options.touchMap);
          "
          :options="filterOptions"
          option-label="label"
          option-value="value"
          @filter="filterZipcodeFn"
          :loading="searchingZipcode"
          :error="validation.zipcode.$error"
        />
      </div>
      <div :class="sectionStaticPart" v-if="context === 'book'">
        <div>City: {{ value.city }}</div>
        <div>State: {{ value.state }}</div>
        <div>Zipcode: {{ value.zipcode }}</div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script>
import { getTimezoneFromPhoneNumber } from '@server/lib/phone-format';
import { RouteRunner } from '@client/third-party';
import AppEditableInput from '@client/components/form/editable-input';
import AppSelectInput from '@client/components/form/select-input';

export default {
  name: 'AppLocationFilterableCard',
  props: {
    loadingData: {
      type: Boolean,
      default: false
    },
    value: Object,
    context: {
      type: String,
      default: 'quote'
    },
    readonly: Boolean,
    action: {
      type: String,
      default: 'create'
    },
    label: String,
    saving: {
      type: Object,
      default: function () {
        return {};
      }
    },
    validation: Object
  },
  components: {
    AppEditableInput,
    AppSelectInput
  },
  data() {
    return {
      inBatchUpdating: false,
      searchingCity: false,
      searchingZipcode: false,
      search: null,
      filterOptions: []
    };
  },
  watch: {
    saving: function (newVal, oldVal) {
      if (oldVal.batch && !newVal.batch) {
        this.inBatchUpdating = false;
      }
    }
  },
  computed: {
    sectionClass() {
      if (this.$q.screen.lt.sm) return 'row q-col-gutter-sm';
      if (this.context === 'book') return 'row q-col-gutter-x-sm';
      return 'row q-col-gutter-sm';
    },
    sectionEditablePart() {
      if (this.$q.screen.lt.sm) return 'col-12';
      if (this.context === 'book') return 'col-8';
      return 'col-12';
    },
    sectionStaticPart() {
      if (this.$q.screen.lt.sm) return 'col-12';
      if (this.context === 'book') return 'col-4 q-gutter-y-sm';
      return 'col-12';
    },
    isReadOnlyField() {
      if (this.saving.batch) return true;
      if (this.inBatchUpdating) return false;
      return this.readonly || this.action === 'view';
    }
  },
  methods: {
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
    handleChangeInput(value) {
      const { name, model } = value;
      this[name] = model;

      let tryValidate = false;

      if (name === 'phone' || name === 'phone2') {
        if (model.length > 0 && this.value[name] !== `+1${model}`) {
          this.$emit('input', {
            ...this.value,
            [name]: `+1${model}`
          });
          tryValidate = true;
        }
      } else {
        this.$emit('input', {
          ...this.value,
          [name]: model
        });
        tryValidate = true;
      }

      if (tryValidate && this.validation[name]) {
        this.delayTouch(this.validation[name], this.$options.touchMap);
      }
    },
    handleBatchUpdate() {
      if (this.action === 'view') {
        this.$emit('update', []);
      }
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
      if (this.action === 'view' && !this.inBatchUpdating) {
        this.$emit('update', ['state', 'city', 'zipcode']);
      }
      this.search = null;
    },
    getTimezoneFromPhoneNumber
  }
};
</script>
<style lang="scss"></style>
