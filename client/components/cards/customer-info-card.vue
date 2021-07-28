<template>
  <q-card flat bordered>
    <q-card-section class="q-pa-sm bg-primary row justify-between items-center">
      <div class="text-subtitle1 text-bold">
        <q-icon name="person" style="font-size: 25px; padding-right: 0.1rem;" />
        Customer Information
      </div>
      <div class="row items-center q-gutter-x-sm">
        <slot name="header"></slot>
        <q-btn
          v-if="!readonly && action === 'view' && !inBatchUpdating"
          icon="edit"
          color="secondary"
          dense
          flat
          size="sm"
          @click="handleBatchEditStart"
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
          @click="handleBatchEditCancel"
        />
      </div>
    </q-card-section>

    <q-separator />
    <q-card-section>
      <div
        class="text-negative text-right"
        v-if="
          possibleDuplicates.byEmailPhone.length > 0 ||
          possibleDuplicates.byName.length > 0
        "
      >
        Found duplicates!
      </div>
      <div :class="customerInfoContentClass">
        <div class="col">
          <app-editable-input
            :loadingData="loadingData"
            :data="value.firstName"
            :readonly="isReadOnlyField"
            text="First Name *"
            :textColor="`${
              possibleDuplicates.byName.length > 0 ? 'negative' : ''
            }`"
            name="firstName"
            @input="handleChangeInput"
            :error="validation.firstName.$error"
          >
            <template #append>
              <q-badge
                class="cursor-pointer"
                rounded
                color="danger"
                :label="possibleDuplicates.byName.length"
                v-if="possibleDuplicates.byName.length > 0"
                @click="handleShowDuplicates('byName')"
              />
            </template>
          </app-editable-input>
          <app-editable-input
            :loadingData="loadingData"
            v-if="context === 'quote'"
            :data="value.lastName"
            :readonly="isReadOnlyField"
            text="Last Name"
            :textColor="`${
              possibleDuplicates.byName.length > 0 ? 'negative' : ''
            }`"
            name="lastName"
            @input="handleChangeInput"
          >
            <template #append>
              <q-badge
                class="cursor-pointer"
                rounded
                color="danger"
                :label="possibleDuplicates.byName.length"
                v-if="possibleDuplicates.byName.length > 0"
                @click="handleShowDuplicates('byName')"
              />
            </template>
          </app-editable-input>
          <app-editable-input
            :loadingData="loadingData"
            v-if="context === 'order' || context === 'book'"
            :data="value.lastName"
            :readonly="isReadOnlyField"
            text="Last Name *"
            :textColor="`${
              possibleDuplicates.byName.length > 0 && context === 'order'
                ? 'negative'
                : ''
            }`"
            name="lastName"
            @input="handleChangeInput"
            :error="validation.lastName.$error"
          >
            <template #append>
              <q-badge
                class="cursor-pointer"
                rounded
                color="danger"
                :label="possibleDuplicates.byName.length"
                v-if="possibleDuplicates.byName.length > 0"
                @click="handleShowDuplicates('byName')"
              />
            </template>
          </app-editable-input>
          <app-editable-input
            :loadingData="loadingData"
            v-if="context === 'quote'"
            :data="value.email"
            :readonly="isReadOnlyField"
            type="email"
            text="Email"
            :textColor="`${
              possibleDuplicates.byEmailPhone.length > 0 ? 'negative' : ''
            }`"
            name="email"
            @input="handleChangeInput"
            :error="validation.email.$error"
          >
            <template #append>
              <q-badge
                class="cursor-pointer"
                rounded
                color="danger"
                :label="possibleDuplicates.byEmailPhone.length"
                v-if="possibleDuplicates.byEmailPhone.length > 0"
                @click="handleShowDuplicates('byEmailPhone')"
              />
            </template>
          </app-editable-input>
          <app-editable-input
            :loadingData="loadingData"
            v-if="context === 'order' || context === 'book'"
            :data="value.email"
            :readonly="isReadOnlyField"
            type="email"
            text="Email *"
            :textColor="`${
              possibleDuplicates.byEmailPhone.length > 0 && context === 'order'
                ? 'negative'
                : ''
            }`"
            name="email"
            @input="handleChangeInput"
            :error="validation.email.$error"
          >
            <template #append>
              <q-badge
                class="cursor-pointer"
                rounded
                color="danger"
                :label="possibleDuplicates.byEmailPhone.length"
                v-if="possibleDuplicates.byEmailPhone.length > 0"
                @click="handleShowDuplicates('byEmailPhone')"
              />
            </template>
          </app-editable-input>
          <app-editable-input
            :loadingData="loadingData"
            :data="value.phone"
            :readonly="isReadOnlyField"
            type="tel"
            text="Phone *"
            :textColor="`${
              possibleDuplicates.byEmailPhone.length > 0 ? 'negative' : ''
            }`"
            name="phone"
            :disablePhoneCall="context === 'book'"
            mask="+1 (###) ### - ####"
            unmasked-value
            @input="handleChangeInput"
            :error="validation.phone.$error"
          >
            <template #append>
              <span class="text-subtitle2" v-if="context !== 'book'">
                {{ getTimezoneFromPhoneNumber(value.phone) }}
              </span>
              <q-badge
                class="cursor-pointer"
                rounded
                color="danger"
                :label="possibleDuplicates.byEmailPhone.length"
                v-if="possibleDuplicates.byEmailPhone.length > 0"
                @click="handleShowDuplicates('byEmailPhone')"
              />
            </template>
          </app-editable-input>
          <app-editable-input
            :loadingData="loadingData"
            :data="value.phone2"
            :readonly="isReadOnlyField"
            type="tel"
            :text="`Phone 2${context === 'book' ? ' (Optional)' : ''}`"
            name="phone2"
            :disablePhoneCall="context === 'book'"
            mask="+1 (###) ### - ####"
            unmasked-value
            @input="handleChangeInput"
          >
            <template #append>
              <span class="text-subtitle2" v-if="context !== 'book'">
                {{ getTimezoneFromPhoneNumber(value.phone2) }}
              </span>
            </template>
          </app-editable-input>
          <div class="row inline q-pa-sm" v-if="context !== 'book'">
            <app-checkbox-input
              :loadingData="loadingData"
              :value="value.noText"
              :disable="readonly"
              @input="handleChangeInput({ name: 'noText', model: $event })"
              label="No Text"
              class="q-mr-md"
            />
            <app-checkbox-input
              :loadingData="loadingData"
              :value="value.noEmail"
              :disable="readonly"
              @input="handleChangeInput({ name: 'noEmail', model: $event })"
              label="No Email"
              class="q-mx-md"
            />
          </div>
        </div>
        <div class="col" v-if="context === 'order' || context === 'book'">
          <app-editable-input
            :loadingData="loadingData"
            :data="value.companyName"
            :readonly="isReadOnlyField"
            :text="`Company Name${context === 'book' ? ' (Optional)' : ''}`"
            name="companyName"
            @input="handleChangeInput"
          />
          <app-editable-input
            :loadingData="loadingData"
            :data="value.address"
            :readonly="isReadOnlyField"
            text="Address"
            name="address"
            @input="handleChangeInput"
          />
          <app-editable-input
            :loadingData="loadingData"
            :data="value.address2"
            :readonly="isReadOnlyField"
            :text="`Address 2${context === 'book' ? ' (Optional)' : ''}`"
            name="address2"
            @input="handleChangeInput"
          />
          <app-select-input
            :loadingData="loadingData"
            :readonly="isReadOnlyField"
            text="City"
            hide-dropdown-icon
            use-input
            :options="filterOptions"
            option-label="label"
            option-value="value"
            :value="value.city"
            @input="handleSelectChange"
            @filter="filterCityFn"
            :loading="searchingCity"
          />

          <app-editable-input
            :loadingData="loadingData"
            :data="value.state"
            :readonly="isReadOnlyField"
            text="State"
            name="state"
            @input="handleChangeInput"
          />
          <app-select-input
            :loadingData="loadingData"
            :readonly="isReadOnlyField"
            text="Zipcode"
            hide-dropdown-icon
            use-input
            :options="filterOptions"
            option-label="label"
            option-value="value"
            :value="value.zipcode"
            @input="handleSelectChange"
            @filter="filterZipcodeFn"
            :loading="searchingZipcode"
          />
        </div>
      </div>
      <app-editable-input
        v-if="
          (context === 'order' || context === 'book') && action !== 'create'
        "
        :loadingData="loadingData"
        :data="value.note"
        :readonly="isReadOnlyField"
        type="textarea"
        :text="`Carrier Notes${context === 'book' ? ' (Optional)' : ''}`"
        :placeholder="carrierNotePlaceholder"
        name="note"
        @input="handleChangeInput"
      />
    </q-card-section>
    <q-dialog
      v-model="openDuplicatesDialog"
      transition-show="fade"
      transition-hide="fade"
    >
      <q-card>
        <q-card-section class="text-center">
          <div class="text-h6 text-weight-medium">
            Duplicates
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div v-for="quote in duplicates" v-bind:key="quote.id">
            <a
              class="text-primary"
              :href="`/quotes/${quote.id}?edit=true`"
              target="_blank"
              v-if="!quote.isOrder"
            >
              Quote #{{ quote.id }}
            </a>
            <a
              class="text-primary"
              :href="`/orders/${quote.id}?edit=true`"
              target="_blank"
              v-else
            >
              Order #{{ quote.id }}
            </a>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>
<script>
import { getTimezoneFromPhoneNumber } from '@server/lib/phone-format';
import AppEditableInput from '@client/components/form/editable-input';
import AppCheckboxInput from '@client/components/form/checkbox-input';
import AppSelectInput from '@client/components/form/select-input';
import { RouteRunner } from '@client/third-party';

export default {
  name: 'AppCustomerInfoCard',
  components: {
    AppEditableInput,
    AppCheckboxInput,
    AppSelectInput
  },
  props: {
    possibleDuplicates: {
      type: Object,
      default: function () {
        return {
          byEmailPhone: [],
          byName: []
        };
      }
    },
    loadingData: {
      type: Boolean,
      default: false
    },
    value: Object,
    context: {
      type: String,
      default: 'quote'
    },
    readonly: {
      type: Boolean,
      default: false
    },
    action: {
      type: String,
      default: 'create'
    },
    validation: Object,
    saving: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  data() {
    return {
      valueBackup: null,

      searchingCity: false,
      searchingZipcode: false,
      filterOptions: [],

      openDuplicatesDialog: false,
      duplicates: [],
      inBatchUpdating: false,
      carrierNotePlaceholder:
        'Please alert us to any information that can affect your transport. Flight date, Moving date, Hours of operation, Gatepass info, Passwords, Low clearance, Lift Dually, Height over 7ft, etc'
    };
  },
  computed: {
    customerInfoContentClass() {
      if (this.$q.screen.gt.sm) return 'row q-gutter-x-sm';
      return '';
    },
    isReadOnlyField() {
      if (this.saving.batch) return true;
      if (this.inBatchUpdating) return false;
      return this.readonly || this.action === 'view';
    }
  },
  watch: {
    saving: function (newVal, oldVal) {
      if (oldVal.batch && !newVal.batch) {
        this.inBatchUpdating = false;
      }
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
    handleShowDuplicates(by) {
      this.openDuplicatesDialog = true;
      this.duplicates = this.possibleDuplicates[by];
    },
    handleBatchEditStart() {
      this.valueBackup = this.value;
      this.inBatchUpdating = true;
    },
    handleBatchEditCancel() {
      this.inBatchUpdating = false;
      this.$emit('input', this.valueBackup);
    },
    handleBatchUpdate() {
      if (this.action === 'view') {
        this.$emit('update');
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
    getTimezoneFromPhoneNumber
  }
};
</script>
