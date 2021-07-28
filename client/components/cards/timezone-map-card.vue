<template>
  <div>
    <img
      class="q-mt-sm"
      :src="`${assetDomain}united-states-time-zone-map.jpg`"
    />
    <div class="row justify-around">
      <span>{{ pstTime }}</span>
      <span>{{ mstTime }}</span>
      <span>{{ cstTime }}</span>
      <span>{{ estTime }}</span>
    </div>
  </div>
</template>

<script>
import {
  formatEST,
  formatCST,
  formatMST,
  formatPST
} from '@server/lib/date-format';

export default {
  data() {
    return {
      assetDomain: window.ASSET_DOMAIN,
      estTime: '',
      cstTime: '',
      mstTime: '',
      pstTime: ''
    };
  },
  created() {
    this.estTime = formatEST(new Date(), 'HH:mm a');
    this.cstTime = formatCST(new Date(), 'HH:mm a');
    this.mstTime = formatMST(new Date(), 'HH:mm a');
    this.pstTime = formatPST(new Date(), 'HH:mm a');
  }
};
</script>

<style></style>
