<template>
  <q-card flat bordered>
    <q-card-section class="q-pa-sm row bg-primary justify-between items-center">
      <div class="text-subtitle1 text-bold">
        <q-icon
          name="history_edu"
          style="font-size: 25px; padding-right: 0.1rem;"
        />
        Payment History
      </div>
      <div class="row items-center q-gutter-x-sm">
        <slot name="header"></slot>
        <q-btn
          v-if="billingInfo && terms && terms.accepted && canChargeOrder"
          outline
          label="Charge Order"
          size="sm"
          class="float-right"
          style="top: 3px;"
          :loading="charging"
          @click="handleOpenChargeOrderDialog"
        />
      </div>
    </q-card-section>

    <q-separator />
    <q-card-section v-if="!loadingData && billingInfo">
      <div
        class="row items-center"
        :class="`${transactions.length > 0 ? 'q-mb-md' : ''}`"
      >
        <q-icon name="credit_card" size="sm" />
        <span class="q-ml-sm"
          >Last 4 Digits: {{ billingInfo.creditCard.cardNumber }}</span
        >
      </div>

      <div
        class="full-width"
        v-for="transaction in transactions"
        :key="transaction.id"
      >
        <div class="row">
          <div class="col-8 text-subtitle2">
            Date/Time
          </div>
          <div class="col-4 text-subtitle2">
            Amount
          </div>
          <q-separator />
        </div>
        <div class="row">
          <div class="col-8">
            {{ transaction.createdAt | localTime }}
          </div>
          <div class="col-4">${{ transaction.amount }}</div>
        </div>
        <div class="row q-ml-sm q-mb-sm">
          <div class="col">{{ transaction.note }}</div>
        </div>
      </div>
    </q-card-section>
    <q-card-section v-if="loadingData">
      <q-skeleton type="rect" height="80px" animation="fade" />
    </q-card-section>
    <q-card-actions align="center" v-if="!loadingData && canAddPaymentManually">
      <q-btn
        v-if="billingInfo"
        dense
        flat
        color="primary"
        label="Update Payment Information"
        :loading="saving"
        @click="handleOpenBillingInfoDialog"
      ></q-btn>
      <q-btn
        v-else
        dense
        flat
        color="primary"
        label="Add Payment Information"
        :loading="saving"
        @click="handleOpenBillingInfoDialog"
      ></q-btn>
    </q-card-actions>
    <app-billing-information-dialog
      ref="billingInformationDialogRef"
      @on-save="$emit('on-change-billing-info', $event)"
    />
    <app-charge-order-dialog
      ref="chargeOrderDialogRef"
      @on-charge="$emit('on-charge-order', $event)"
    />
  </q-card>
</template>
<script>
import graphql from '@client/graphql';
import { assessPermission } from '@server/lib/permission-helpers';
import AppBillingInformationDialog from '@client/components/dialogs/billing-information-dialog';
import AppChargeOrderDialog from '@client/components/dialogs/charge-order-dialog';

export default {
  name: 'AppPaymentHistory',
  props: {
    loadingData: {
      type: Boolean,
      default: false
    },
    shipper: Object,
    origin: Object,
    destination: Object,
    terms: {
      type: Object,
      default: function () {
        return { accepted: false };
      }
    },
    transactions: {
      type: Array,
      default: function () {
        return [];
      }
    },
    billingInfo: Object,
    saving: Boolean,
    charging: Boolean
  },
  apollo: {
    currentUser: {
      query: graphql.queries.currentUser
    }
  },
  components: {
    AppBillingInformationDialog,
    AppChargeOrderDialog
  },
  computed: {
    canAddPaymentManually() {
      return assessPermission.payment.canAddManually(this.currentUser);
    },
    canChargeOrder() {
      return assessPermission.payment.canCharge(this.currentUser);
    }
  },
  methods: {
    handleOpenBillingInfoDialog() {
      this.$refs.billingInformationDialogRef.openDialog({
        shipper: this.shipper,
        origin: this.origin,
        destination: this.destination
      });
    },
    handleOpenChargeOrderDialog() {
      this.$refs.chargeOrderDialogRef.openDialog();
    }
  }
};
</script>
