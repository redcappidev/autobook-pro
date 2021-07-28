<template>
  <q-card style="min-width: 560px;">
    <q-card-section class="text-center">
      <div class="text-h6 text-weight-medium">
        Add New Carrier
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <q-scroll-area style="height: 77vh;">
        <app-editable-input
          text="MC Number"
          name="mcNumber"
          type="text"
          :data="mcNumber"
          @input="handleChangeInput"
          @blur="handleMcNumberBlur"
        />
        <app-editable-input
          text="DOT Number"
          name="dotNumber"
          type="text"
          :data="dotNumber"
          @input="handleChangeInput"
          @blur="handleDotNumberBlur"
        />
        <app-editable-input
          text="Company Name *"
          name="companyName"
          type="text"
          :data="companyName"
          @input="handleChangeInput"
          :error="$v.companyName.$error"
        />
        <app-editable-input
          text="Address *"
          name="address"
          type="text"
          :data="address"
          @input="handleChangeInput"
          :error="$v.address.$error"
        />
        <app-editable-input
          text="City"
          name="city"
          type="text"
          :data="city"
          @input="handleChangeInput"
        />
        <app-editable-input
          text="State"
          name="state"
          type="text"
          :data="state"
          @input="handleChangeInput"
        />
        <app-editable-input
          text="Zipcode"
          name="zipcode"
          type="text"
          :data="zipcode"
          @input="handleChangeInput"
        />
        <app-editable-input
          text="Phone Number *"
          name="phoneNumber"
          mask="+1 (###) ### - ####"
          unmasked-value
          type="tel"
          :data="phoneNumber"
          @input="handleChangeInput"
          :error="$v.phoneNumber.$error"
        />
        <app-editable-input
          text="Fax"
          name="fax"
          type="tel"
          :data="fax"
          @input="handleChangeInput"
        />
        <app-editable-input
          text="First Contract"
          name="firstContact"
          type="text"
          :data="firstContact"
          @input="handleChangeInput"
        />
        <app-editable-input
          text="Second Contract"
          name="secondContact"
          type="text"
          :data="secondContact"
          @input="handleChangeInput"
        />
        <app-editable-input
          text="Insurance Expires"
          name="insuranceExpires"
          type="date"
          :data="insuranceExpires"
          @input="handleChangeInput"
        />
        <app-editable-input
          text="Email"
          name="email"
          type="email"
          :data="email"
          @input="handleChangeInput"
        />
        <q-field label="Contact Option" stack-label borderless>
          <template #control>
            <div class="column">
              <q-radio
                left-label
                val="PHONE_ONLY"
                label="Phone Only"
                v-model="contactOption"
              />
              <q-radio
                left-label
                val="FAX_ONLY"
                label="Fax Only"
                v-model="contactOption"
              />
              <q-radio
                left-label
                val="EMAIL_ONLY"
                label="Email Only"
                v-model="contactOption"
              />
              <q-radio
                left-label
                val="USE_ALL"
                label="Use All"
                v-model="contactOption"
              />
            </div>
          </template>
        </q-field>
        <q-checkbox left-label label="Needs 1099" v-model="needs1099" dense />
        <app-editable-input
          text="EIN"
          name="ein"
          type="text"
          :data="ein"
          @input="handleChangeInput"
        />
        <app-editable-input
          text="SSN"
          name="ssn"
          type="text"
          :data="ssn"
          @input="handleChangeInput"
        />
        <app-editable-input
          text="Custom Field 1"
          name="customField1"
          type="text"
          :data="customField1"
          @input="handleChangeInput"
        />
        <app-editable-input
          text="Custom Field 2"
          name="customField2"
          type="text"
          :data="customField2"
          @input="handleChangeInput"
        />
        <app-editable-input
          text="Custom Field 3"
          name="customField3"
          type="text"
          :data="customField3"
          @input="handleChangeInput"
        />
        <app-editable-input
          text="Custom Field 4"
          name="customField4"
          type="text"
          :data="customField4"
          @input="handleChangeInput"
        />
      </q-scroll-area>
    </q-card-section>
    <q-separator />
    <q-card-actions align="right">
      <q-btn flat label="Back" color="primary" @click="$emit('back')" />
      <q-btn outline label="Save" color="primary" @click="handleSubmit" />
    </q-card-actions>
  </q-card>
</template>
<script>
import { carrierValidator } from '@client/validators';
import AppEditableInput from '@client/components/form/editable-input';
import { extractKeysIntoObject } from '@client/utils/object-helpers';
import graphql from '@client/graphql';

export default {
  name: 'AppDispatchToCarrierDialogAddCarrier',
  components: {
    AppEditableInput
  },
  validations: carrierValidator,
  data() {
    return {
      loading: false,

      mcNumber: '',
      dotNumber: '',
      companyName: '',
      address: '',
      city: '',
      state: '',
      zipcode: '',
      phoneNumber: '',
      fax: '',
      firstContact: '',
      secondContact: '',
      insuranceExpires: '',
      email: '',
      contactOption: '',
      needs1099: false,
      ein: '',
      ssn: '',
      customField1: '',
      customField2: '',
      customField3: '',
      customField4: ''
    };
  },
  methods: {
    handleMcNumberBlur() {
      setTimeout(async () => {
        if (!this.mcNumber) return;

        const res = await fetch(
          `/rest-api/carrier-data?search_type=MC&search_number=${this.mcNumber}`
        );
        const company = await res.json();
        Object.assign(this, company);
      }, 0);
    },
    handleDotNumberBlur() {
      setTimeout(async () => {
        if (!this.dotNumber) return;

        const res = await fetch(
          `/rest-api/carrier-data?search_type=DOT&search_number=${this.dotNumber}`
        );
        const company = await res.json();
        Object.assign(this, company);
      }, 0);
    },
    handleChangeInput(value) {
      const { name, model } = value;
      if (name === 'phoneNumber') {
        this[name] = `+1${model}`;
      } else {
        this[name] = model;
      }
      if (this.$v[name]) {
        this.delayTouch(this.$v[name], this.$options.touchMap);
      }
    },
    async handleSubmit() {
      this.validate(['companyName', 'address', 'phoneNumber']);

      this.loading = true;
      const data = extractKeysIntoObject(this, [
        'mcNumber',
        'dotNumber',
        'companyName',
        'address',
        'city',
        'state',
        'zipcode',
        'phoneNumber',
        'fax',
        'firstContact',
        'secondContact',
        'insuranceExpires',
        'email',
        'contactOption',
        'needs1099',
        'ein',
        'ssn',
        'customField1',
        'customField2',
        'customField3',
        'customField4'
      ]);

      await this.$apollo.mutate({
        mutation: graphql.mutations.addCarrier,
        variables: {
          input: data
        },
        update(store, { data: { addCarrier: newCarrier } }) {
          const carriersData = store.readQuery({
            query: graphql.queries.getCarriers
          });
          carriersData.carriers.unshift(newCarrier);
          store.writeQuery({
            query: graphql.queries.getCarriers,
            data: carriersData
          });
        }
      });

      this.loading = false;
      this.$nextTick(() => {
        this.$emit('back');
      });
    }
  }
};
</script>
