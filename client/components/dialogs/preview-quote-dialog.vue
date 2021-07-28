<template>
  <q-dialog
    :value="open"
    position="right"
    transition-show="slide-left"
    transition-hide="slide-right"
    class="absolute"
    @hide="$emit('hide')"
  >
    <q-card class="preview-card-wrapper">
      <q-linear-progress :value="1" color="primary" />
      <q-card-section class="q-pa-none preview-header">
        <div class="row items-center">
          <q-icon
            v-if="hasPreviousQuote"
            flat
            size="lg"
            color="primary"
            name="navigate_before"
            class="cursor-pointer q-pl-lg"
            @click="$emit('goPrevious')"
          ></q-icon>
          <span class="text-h5 q-px-md">
            {{ type === 'quote' ? 'Quote' : 'Order' }} ID: # {{ data }}
          </span>
          <q-icon
            v-if="hasNextQuote"
            flat
            size="lg"
            color="primary"
            name="navigate_next"
            class="cursor-pointer"
            @click="$emit('goNext')"
          ></q-icon>
        </div>
        <app-power-search-input />
        <span
          class="row items-center text-primary cursor-pointer"
          @click="handleNewWindow"
        >
          <q-icon style="font-size: 1.5rem;" name="open_in_new"></q-icon>
          <strong class="text-h6 q-px-sm">
            Open {{ type === 'quote' ? 'Quote' : 'Order' }} in a new window
          </strong>
        </span>
      </q-card-section>
      <q-card-section :flat="true" class="q-pt-md">
        <app-quote-detail :quoteId="data" :quoteType="type" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
import AppQuoteDetail from '@client/pages/quotes/detail';
import AppPowerSearchInput from '@client/components/filters/power-search';

export default {
  name: 'AppQuotePreviewDialog',
  props: {
    open: {
      type: Boolean,
      default: false
    },
    data: String,
    type: {
      type: String,
      default: 'quote'
    },
    hasNextQuote: Boolean,
    hasPreviousQuote: Boolean
  },
  components: {
    AppQuoteDetail,
    AppPowerSearchInput
  },
  methods: {
    handleNewWindow() {
      const routeData = this.$router.resolve({
        name: this.type === 'quote' ? 'quote-detail' : 'order-detail',
        params: { id: this.data },
        query: { edit: true }
      });
      window.open(routeData.href, '_blank');
    }
  }
};
</script>
<style lang="scss" scoped>
.preview-card-wrapper {
  min-width: calc(100vw - 230px);
  min-height: 100vh;
  top: -25px;

  .preview-header {
    height: 80px;
    width: 100% !important;
    box-shadow: 0px 0px 5px 0px #d6d6d6;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
