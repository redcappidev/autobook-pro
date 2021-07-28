<template>
  <q-dialog
    :value="open"
    transition-show="fade"
    transition-hide="fade"
    @hide="closeDialog"
  >
    <app-dispatch-to-carrier-dialog-carrier-list
      v-if="currentView === 'list'"
      @add="currentView = 'add'"
      @select="handleSelectCarrier"
    />
    <app-dispatch-to-carrier-dialog-add-carrier
      v-if="currentView === 'add'"
      @back="currentView = 'list'"
    />
    <app-dispatch-to-carrier-dialog-dispatch
      v-if="currentView === 'dispatch'"
      :carrierId="selectedCarrierId"
      :orderId="orderId"
      @back="currentView = 'list'"
      @add-driver="currentView = 'driver'"
      @dispatched="handleDispatched"
    />
    <app-dispatch-to-carrier-dialog-add-driver
      v-if="currentView === 'driver'"
      :carrierId="selectedCarrierId"
      @back="currentView = 'dispatch'"
    />
  </q-dialog>
</template>
<script>
import AppDispatchToCarrierDialogCarrierList from './carrier-list';
import AppDispatchToCarrierDialogAddCarrier from './add-carrier';
import AppDispatchToCarrierDialogDispatch from './dispatch';
import AppDispatchToCarrierDialogAddDriver from './add-driver';

export default {
  name: 'AppDispatchToCarrierDialog',
  props: ['orderId'],
  components: {
    AppDispatchToCarrierDialogCarrierList,
    AppDispatchToCarrierDialogAddCarrier,
    AppDispatchToCarrierDialogDispatch,
    AppDispatchToCarrierDialogAddDriver
  },
  data() {
    return {
      open: false,
      currentView: 'list',
      selectedCarrierId: null
    };
  },
  methods: {
    openDialog() {
      this.currentView = 'list';
      this.selectedCarrierId = null;
      this.open = true;
    },
    closeDialog() {
      this.open = false;
    },
    handleSelectCarrier(carrier) {
      this.selectedCarrierId = carrier.id;
      this.currentView = 'dispatch';
    },
    handleDispatched(centralDispatchInternalId) {
      this.open = false;
      if (centralDispatchInternalId) {
        window.open(
          `https://www.centraldispatch.com/protected/dispatch/broker?do=assign&dsid=${centralDispatchInternalId}`
        );
      }
    }
  }
};
</script>
