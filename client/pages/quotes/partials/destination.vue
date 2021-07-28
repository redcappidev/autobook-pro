<template>
  <div class="column items-center">
    <p class="q-ma-none">{{ data.destination.city }}</p>
    <p class="q-ma-none">{{ data.destination.state }}</p>
    <p class="q-ma-none">{{ data.destination.zipcode }}</p>
  </div>
</template>

<script>
export default {
  name: 'AppQuoteDestination',
  props: ['data']
};
</script>
