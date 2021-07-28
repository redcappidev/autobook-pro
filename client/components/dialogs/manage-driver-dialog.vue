<template>
  <q-dialog
    v-model="open"
    persistent
    transition-show="fade"
    transition-hide="fade"
    position="top"
  >
    <q-card style="width: 500px;">
      <q-toolbar>
        <q-toolbar-title class="text-h6">
          Driver
        </q-toolbar-title>
        <q-btn flat round dense icon="close" @click="open = false" />
      </q-toolbar>

      <q-card-section class="q-py-none">
        <form class="row q-col-gutter-sm">
          <app-editable-input
            class="col-12"
            :data="driver.firstName"
            :readonly="false"
            type="text"
            text="First Name"
            name="firstName"
            @input="
              handleChangeInput($event);
              delayTouch($v.driver.firstName, $options.touchMap);
            "
            :error="$v.driver.firstName.$error"
          />
          <app-editable-input
            class="col-12"
            :data="driver.lastName"
            :readonly="false"
            type="text"
            text="Last Name"
            name="lastName"
            @input="handleChangeInput"
          />
          <app-editable-input
            class="col-12"
            :data="driver.email"
            :readonly="false"
            type="email"
            text="Email"
            name="email"
            @input="handleChangeInput"
          />
          <app-editable-input
            class="col-12"
            :data="driver.phoneNumber"
            :readonly="false"
            type="tel"
            text="Phone"
            name="phoneNumber"
            mask="+1 (###) ### - ####"
            unmasked-value
            @input="
              handleChangeInput($event);
              delayTouch($v.driver.phoneNumber, $options.touchMap);
            "
            :error="$v.driver.phoneNumber.$error"
          />
        </form>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          :label="mode === 'create' ? 'Add' : 'Update'"
          color="primary"
          :loading="saving"
          @click="handleSave"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import AppEditableInput from '@client/components/form/editable-input';
import { required } from 'vuelidate/lib/validators';
import graphql from '@client/graphql';
import { extractKeysIntoObject } from '@client/utils/object-helpers';

export default {
  name: 'ManageDriverDialog',
  components: {
    AppEditableInput
  },
  validations: {
    driver: {
      firstName: { required },
      phoneNumber: { required }
    }
  },
  data() {
    return {
      open: false,
      mode: null,
      saving: false,
      carrierId: null,
      driver: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
      }
    };
  },
  methods: {
    openDialog(carrierId, driver = {}) {
      this.mode = driver.id ? 'edit' : 'create';
      this.carrierId = carrierId;
      this.driver = {
        ...driver,
        firstName: driver.firstName || '',
        lastName: driver.lastName || '',
        email: driver.email || '',
        phoneNumber: driver.phoneNumber || ''
      };

      this.open = true;
      this.reset(['driver.firstName', 'driver.phoneNumber']);
    },
    handleChangeInput(value) {
      const { name, model } = value;
      this.driver[name] = model;
      if (name === 'phoneNumber') {
        this.driver[name] = `+1${model}`;
      }
    },
    async handleSave() {
      this.validate(['driver.firstName', 'driver.phoneNumber']);

      const { carrierId } = this;
      this.saving = true;
      const driverData = extractKeysIntoObject(this.driver, [
        'firstName',
        'lastName',
        'email',
        'phoneNumber'
      ]);
      try {
        if (this.mode === 'create') {
          await this.$apollo.mutate({
            mutation: graphql.mutations.addDriver,
            variables: {
              carrierId: carrierId,
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
        } else {
          await this.$apollo.mutate({
            mutation: graphql.mutations.updateDriver,
            variables: {
              id: this.driver.id,
              input: driverData
            },
            update(store, { data: { updateDriver: updatedDriver } }) {
              const data = store.readQuery({
                query: graphql.queries.getCarrier,
                variables: {
                  id: carrierId
                }
              });
              data.carrier.drivers = data.carrier.drivers.map((d) => {
                if (d.id !== updatedDriver.id) return d;
                return updatedDriver;
              });

              store.writeQuery({
                query: graphql.queries.getCarrier,
                variables: {
                  id: carrierId
                },
                data
              });
            }
          });
        }
        this.open = false;
      } catch (error) {
        this.notifyNegative(error.message);
      }
      this.saving = false;
    }
  }
};
</script>

<style></style>
