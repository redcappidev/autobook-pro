<template>
  <div class="column items-center">
    <p class="q-ma-none">{{ data.origin.city }}</p>
    <p class="q-ma-none">{{ data.origin.state }}</p>
    <p class="q-ma-none">{{ data.origin.zipcode }}</p>
  </div>
</template>

<script>
export default {
  name: 'AppQuoteOrigin',
  props: ['data']
};
</script>
