<template>
  <q-card style="min-width: 560px;">
    <q-card-section class="text-center">
      <div class="text-h6 text-weight-medium">
        Add Driver
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <app-editable-input
        :data="firstName"
        type="text"
        text="First Name *"
        name="firstName"
        @input="handleChangeInput"
        :error="$v.firstName.$error"
      />
      <app-editable-input
        :data="lastName"
        type="text"
        text="Last Name"
        name="lastName"
        @input="handleChangeInput"
      />
      <app-editable-input
        :data="email"
        type="email"
        text="Email"
        name="email"
        @input="handleChangeInput"
      />
      <app-editable-input
        :data="phoneNumber"
        type="tel"
        text="Phone Number *"
        name="phoneNumber"
        mask="+1 (###) ### - ####"
        unmasked-value
        @input="handleChangeInput"
        :error="$v.phoneNumber.$error"
      />
    </q-card-section>
    <q-separator />
    <q-card-actions align="right">
      <q-btn flat label="Back" color="primary" @click="$emit('back')" />
      <q-btn outline label="Save" color="primary" @click="handleSubmit" />
    </q-card-actions>
  </q-card>
</template>

<script>
import AppEditableInput from '@client/components/form/editable-input';
import { driverValidator } from '@client/validators';
import { extractKeysIntoObject } from '@client/utils/object-helpers';
import graphql from '@client/graphql';

export default {
  name: 'AppDispatchToCarrierDialogAddDriver',
  props: ['carrierId'],
  components: {
    AppEditableInput
  },
  validations: driverValidator,
  data() {
    return {
      saving: false,

      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: ''
    };
  },
  methods: {
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
      this.validate(['firstName', 'phoneNumber']);

      this.saving = true;

      const driverData = extractKeysIntoObject(this, [
        'firstName',
        'lastName',
        'email',
        'phoneNumber'
      ]);

      const { carrierId } = this;

      await this.$apollo.mutate({
        mutation: graphql.mutations.addDriver,
        variables: {
          carrierId,
          input: driverData
        },
        update(store, { data: { addDriver: newDriver } }) {
          const data = store.readQuery({
            query: graphql.queries.getCarrier,
            variables: {
              id: carrierId
            }
          });
          data.carrier.drivers = [...data.carrier.drivers, newDriver];

          store.writeQuery({
            query: graphql.queries.getCarrier,
            variables: {
              id: carrierId
            },
            data
          });
        }
      });

      this.$nextTick(() => {
        this.$emit('back');
      });

      this.saving = false;
    }
  }
};
</script>
