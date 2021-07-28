<template>
  <div class="q-pa-md">
    <div class="row justify-between">
      <div class="q-px-md text-h5">
        <q-icon name="commute" />
        Carrier
      </div>
    </div>

    <q-separator class="q-my-sm" />

    <div v-if="error">An error occured</div>
    <div v-else-if="loading">Loading...</div>
    <div v-else>
      <q-card>
        <q-btn
          outline
          label="Save"
          color="primary"
          @click="handleSaveCarrier"
        />
        <q-card-section>
          <form class="row q-col-gutter-sm items-center">
            <app-editable-input
              class="col-6"
              :data="carrier.mcNumber"
              type="text"
              text="MC Number"
              name="mcNumber"
              @input="handleChangeInput"
            />
            <app-editable-input
              class="col-6"
              :data="carrier.dotNumber"
              type="text"
              text="Dot Number"
              name="dotNumber"
              @input="handleChangeInput"
            />
            <app-editable-input
              class="col-12"
              :data="carrier.companyName"
              type="text"
              text="Company Name"
              name="companyName"
              @input="
                handleChangeInput($event);
                delayTouch($v.carrierData.companyName, $options.touchMap);
              "
              :error="$v.carrierData.companyName.$error"
            />
            <app-editable-input
              class="col-6"
              :data="carrier.address"
              type="text"
              text="Address"
              name="address"
              @input="
                handleChangeInput($event);
                delayTouch($v.carrierData.address, $options.touchMap);
              "
              :error="$v.carrierData.address.$error"
            />
            <app-editable-input
              class="col-6"
              :data="carrier.city"
              type="text"
              text="City"
              name="city"
              @input="
                handleChangeInput($event);
                delayTouch($v.carrierData.city, $options.touchMap);
              "
              :error="$v.carrierData.city.$error"
            />
            <app-editable-input
              class="col-6"
              :data="carrier.state"
              type="text"
              text="State"
              name="state"
              @input="
                handleChangeInput($event);
                delayTouch($v.carrierData.state, $options.touchMap);
              "
              :error="$v.carrierData.state.$error"
            />
            <app-editable-input
              class="col-6"
              :data="carrier.zipcode"
              type="text"
              text="Zip Code"
              name="zipcode"
              @input="
                handleChangeInput($event);
                delayTouch($v.carrierData.zipcode, $options.touchMap);
              "
              :error="$v.carrierData.zipcode.$error"
            />
            <app-editable-input
              class="col-6"
              :data="carrier.phoneNumber"
              type="tel"
              text="Phone Number"
              name="phoneNumber"
              mask="+1 (###) ### - ####"
              unmasked-value
              @input="
                handleChangeInput($event);
                delayTouch($v.carrierData.phoneNumber, $options.touchMap);
              "
              :error="$v.carrierData.phoneNumber.$error"
            />
            <app-editable-input
              class="col-6"
              :data="carrier.fax"
              type="tel"
              text="Fax"
              name="fax"
              @input="handleChangeInput"
            />
            <app-editable-input
              class="col-6"
              :data="carrier.firstContact"
              type="text"
              text="First Contact"
              name="firstContact"
              @input="
                handleChangeInput($event);
                delayTouch($v.carrierData.firstContact, $options.touchMap);
              "
              :error="$v.carrierData.firstContact.$error"
            />
            <app-editable-input
              class="col-6"
              :data="carrier.secondContact"
              type="text"
              text="Second Contact"
              name="secondContact"
              @input="handleChangeInput"
            />
            <app-editable-input
              class="col-6"
              :data="carrier.insuranceExpires"
              type="date"
              text="Insurance Expires"
              name="insuranceExpires"
              @input="handleChangeInput"
            />
            <app-editable-input
              class="col-6"
              :data="carrier.email"
              type="email"
              text="Email"
              name="email"
              @input="handleChangeInput"
            />
            <q-field
              class="col-12"
              label="Contact Option"
              stack-label
              borderless
            >
              <template #control>
                <div class="column">
                  <q-radio
                    left-label
                    v-model="carrier.contactOption"
                    val="PHONE_ONLY"
                    label="Phone Only"
                  />
                  <q-radio
                    left-label
                    v-model="carrier.contactOption"
                    val="FAX_ONLY"
                    label="Fax Only"
                  />
                  <q-radio
                    left-label
                    v-model="carrier.contactOption"
                    val="EMAIL_ONLY"
                    label="Email Only"
                  />
                  <q-radio
                    left-label
                    v-model="carrier.contactOption"
                    val="USE_ALL"
                    label="Use All"
                  />
                </div>
              </template>
            </q-field>
            <q-checkbox
              left-label
              label="Needs 1099"
              v-model="carrier.needs1099"
              dense
            />
            <div class="col-12" />
            <app-editable-input
              class="col-6"
              :data="carrier.ein"
              type="text"
              text="EIN"
              name="ein"
              @input="handleChangeInput"
            />
            <app-editable-input
              class="col-6"
              :data="carrier.ssn"
              type="text"
              text="SSN"
              name="ssn"
              @input="handleChangeInput"
            />
            <app-editable-input
              class="col-6"
              :data="carrier.customField1"
              type="text"
              text="Custom Field 1"
              name="customField1"
              @input="handleChangeInput"
            />
            <app-editable-input
              class="col-6"
              :data="carrier.customField2"
              type="text"
              text="Custom Field 2"
              name="customField2"
              @input="handleChangeInput"
            />
            <app-editable-input
              class="col-6"
              :data="carrier.customField3"
              type="text"
              text="Custom Field 3"
              name="customField3"
              @input="handleChangeInput"
            />
            <app-editable-input
              class="col-6"
              :data="carrier.customField4"
              type="text"
              text="Custom Field 4"
              name="customField4"
              @input="handleChangeInput"
            />
          </form>
        </q-card-section>
      </q-card>
      <q-card class="q-mt-md">
        <q-card-section class="q-pa-sm">
          <div class="text-subtitle1 text-bold q-px-sm">
            <q-icon
              name="contacts"
              style="font-size: 25px; padding-right: 0.1rem;"
            />
            Saved Drivers
            <q-btn
              dense
              outline
              icon="add"
              label="Add"
              size="sm"
              class="float-right q-px-sm"
              style="top: 3px;"
              @click="handleAddDriver"
            />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-table
            flat
            :data="carrier ? carrier.drivers : []"
            :columns="columns"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="name" :props="props">
                  {{ props.row.firstName }} {{ props.row.lastName }}
                </q-td>
                <q-td key="email" :props="props">
                  {{ props.row.email }}
                </q-td>
                <q-td key="phoneNumber" :props="props">
                  {{ props.row.phoneNumber }}
                </q-td>
                <q-td key="actions" :props="props">
                  <q-btn
                    round
                    dense
                    color="secondary"
                    size="sm"
                    icon="edit"
                    @click="handleEditDriver(props.row.id)"
                  />
                  <q-btn
                    round
                    dense
                    color="red"
                    size="sm"
                    icon="delete"
                    @click="handleDeleteDriver(props.row.id)"
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
    <manage-driver-dialog ref="manageDriverDialog" />
  </div>
</template>

<script>
import AppEditableInput from '@client/components/form/editable-input';
import ManageDriverDialog from '@client/components/dialogs/manage-driver-dialog';
import { required } from 'vuelidate/lib/validators';
import graphql from '@client/graphql';

export default {
  name: 'CarrierDetail',
  components: {
    AppEditableInput,
    ManageDriverDialog
  },
  apollo: {
    carrier: {
      query: graphql.queries.getCarrier,
      variables() {
        return {
          id: this.$route.params.id
        };
      },
      watchLoading(isLoading) {
        this.loading = isLoading;
      },
      result(queryResult) {
        this.carrierData = queryResult.data.carrier;
      },
      error(error) {
        this.error = error;
      }
    }
  },
  validations: {
    carrierData: {
      companyName: { required },
      address: { required },
      city: { required },
      state: { required },
      zipcode: { required },
      phoneNumber: { required },
      firstContact: { required }
    }
  },
  mounted() {
    console.log('fff', this.$route);
  },
  data() {
    return {
      loading: false,
      error: null,
      carrierData: null,
      saving: {},
      columns: [
        {
          name: 'name',
          label: 'Name',
          align: 'left'
        },
        {
          name: 'email',
          label: 'Email',
          align: 'left'
        },
        {
          name: 'phoneNumber',
          label: 'Phone Number',
          align: 'left'
        },
        {
          name: 'actions',
          label: ''
        }
      ]
    };
  },
  methods: {
    async handleSaveCarrier() {
      const { id: carrierId } = this.$route.params;
      try {
        await this.$apollo.mutate({
          mutation: graphql.mutations.updateCarrier,
          variables: {
            id: carrierId,
            input: this.carrier
          },
          update(store, { data: { updateCarrier: updatedCarrier } }) {
            const data = store.readQuery({
              query: graphql.queries.getCarrier,
              variables: {
                id: carrierId
              }
            });
            data.carrier = updatedCarrier;

            store.writeQuery({
              query: graphql.queries.getCarrier,
              variables: {
                id: carrierId
              },
              data
            });
          }
        });
      } catch (error) {
        this.notifyNegative(error.message);
      }
    },
    handleChangeInput(value) {
      let { model } = value;
      if (value.name === 'phoneNumber') {
        model = `+1${model}`;
      }
      this.$set(this.carrierData, value.name, model);
    },
    handleAddDriver() {
      const { id: carrierId } = this.$route.params;
      this.$refs.manageDriverDialog.openDialog(carrierId);
    },
    handleEditDriver(driverId) {
      const { id: carrierId } = this.$route.params;
      const driver = this.carrier.drivers.find((d) => d.id === driverId);
      this.$refs.manageDriverDialog.openDialog(carrierId, driver);
    },
    handleDeleteDriver() {}
  }
};
</script>

<style></style>
