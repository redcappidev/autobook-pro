<template>
  <div class="column items-center">
    <p class="q-ma-none">
      {{ data.shipper.firstName }} {{ data.shipper.lastName }}
    </p>
    <p class="q-ma-none">{{ data.shipper.phone | phoneNumber }}</p>
    <p class="q-ma-none">{{ data.shipper.email }}</p>
  </div>
</template>

<script>
export default {
  name: 'AppQuoteShipper',
  props: ['data']
};
</script>
