<template>
  <div class="text-center">
    <p class="q-ma-none text-bold">${{ data.transport.totalPrice }}</p>
    <p
      class="q-ma-none text-red text-bold text-uppercase"
      v-if="data.transport.fullPay"
    >
      Full pay
    </p>
  </div>
</template>
<script>
export default {
  name: 'AppQuotePrice',
  props: ['data']
};
</script>
