<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section>
        <form class="row q-col-gutter-sm items-center">
          <app-editable-input
            class="col-6"
            :data="mcNumber"
            type="text"
            text="MC Number"
            name="mcNumber"
            @input="handleChangeInput"
          />
          <app-editable-input
            class="col-6"
            :data="dotNumber"
            type="text"
            text="Dot Number"
            name="dotNumber"
            @input="handleChangeInput"
          />
          <app-editable-input
            class="col-12"
            :data="companyName"
            type="text"
            text="Company Name *"
            name="companyName"
            @input="
              handleChangeInput($event);
              delayTouch($v.companyName, $options.touchMap);
            "
            :error="$v.companyName.$error"
          />
          <app-editable-input
            class="col-6"
            :data="address"
            type="text"
            text="Address *"
            name="address"
            @input="
              handleChangeInput($event);
              delayTouch($v.address, $options.touchMap);
            "
            :error="$v.address.$error"
          />
          <app-editable-input
            class="col-6"
            :data="city"
            type="text"
            text="City"
            name="city"
            @input="handleChangeInput"
          />
          <app-editable-input
            class="col-6"
            :data="state"
            type="text"
            text="State"
            name="state"
            @input="handleChangeInput"
          />
          <app-editable-input
            class="col-6"
            :data="zipcode"
            type="text"
            text="Zip Code"
            name="zipcode"
            @input="handleChangeInput"
          />
          <app-editable-input
            class="col-6"
            :data="phoneNumber"
            type="tel"
            text="Phone Number *"
            name="phoneNumber"
            mask="+1 (###) ### - ####"
            unmasked-value
            @input="
              handleChangeInput($event);
              delayTouch($v.phoneNumber, $options.touchMap);
            "
            :error="$v.phoneNumber.$error"
          />
          <app-editable-input
            class="col-6"
            :data="fax"
            type="tel"
            text="Fax"
            name="fax"
            @input="handleChangeInput"
          />
          <app-editable-input
            class="col-6"
            :data="firstContact"
            type="text"
            text="First Contact"
            name="firstContact"
            @input="handleChangeInput"
          />
          <app-editable-input
            class="col-6"
            :data="secondContact"
            type="text"
            text="Second Contact"
            name="secondContact"
            @input="handleChangeInput"
          />
          <app-editable-input
            class="col-6"
            :data="insuranceExpires"
            type="date"
            text="Insurance Expires"
            name="insuranceExpires"
            @input="handleChangeInput"
          />
          <app-editable-input
            class="col-6"
            :data="email"
            type="email"
            text="Email"
            name="email"
            @input="handleChangeInput"
          />
          <q-field class="col-12" label="Contact Option" stack-label borderless>
            <template #control>
              <div class="column">
                <q-radio
                  left-label
                  v-model="contactOption"
                  val="PHONE_ONLY"
                  label="Phone Only"
                />
                <q-radio
                  left-label
                  v-model="contactOption"
                  val="FAX_ONLY"
                  label="Fax Only"
                />
                <q-radio
                  left-label
                  v-model="contactOption"
                  val="EMAIL_ONLY"
                  label="Email Only"
                />
                <q-radio
                  left-label
                  v-model="contactOption"
                  val="USE_ALL"
                  label="Use All"
                />
              </div>
            </template>
          </q-field>
          <q-checkbox left-label label="Needs 1099" v-model="needs1099" dense />
          <div class="col-12" />
          <app-editable-input
            class="col-6"
            :data="ein"
            type="text"
            text="EIN"
            name="ein"
            @input="handleChangeInput"
          />
          <app-editable-input
            class="col-6"
            :data="ssn"
            type="text"
            text="SSN"
            name="ssn"
            @input="handleChangeInput"
          />
          <app-editable-input
            class="col-6"
            :data="customField1"
            type="text"
            text="Custom Field 1"
            name="customField1"
            @input="handleChangeInput"
          />
          <app-editable-input
            class="col-6"
            :data="customField2"
            type="text"
            text="Custom Field 2"
            name="customField2"
            @input="handleChangeInput"
          />
          <app-editable-input
            class="col-6"
            :data="customField3"
            type="text"
            text="Custom Field 3"
            name="customField3"
            @input="handleChangeInput"
          />
          <app-editable-input
            class="col-6"
            :data="customField4"
            type="text"
            text="Custom Field 4"
            name="customField4"
            @input="handleChangeInput"
          />
        </form>
      </q-card-section>
    </q-card>
    <q-btn color="primary q-mt-md" label="Add" @click="handleAdd" />
  </div>
</template>

<script>
import AppEditableInput from '@client/components/form/editable-input';
import { extractKeysIntoObject } from '@client/utils/object-helpers';
import { carrierValidator } from '@client/validators';
import graphql from '@client/graphql';

export default {
  name: 'CreateCarrier',
  components: {
    AppEditableInput
  },
  validations: carrierValidator,
  data() {
    return {
      loading: false,
      mcNumber: null,
      dotNumber: null,
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
    handleChangeInput(value) {
      const { name, model } = value;
      this[name] = model;
    },
    async handleAdd() {
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
      data.phoneNumber = `+1${data.phoneNumber}`;
      await this.$apollo.mutate({
        mutation: graphql.mutations.addCarrier,
        variables: {
          input: data
        }
      });
      this.loading = false;
      this.$router.push({ name: 'carriers' });
    }
  }
};
</script>

<style></style>
