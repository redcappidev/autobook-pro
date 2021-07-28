<template>
  <div class="column items-center">
    <q-badge
      v-if="data.vehicles.length > 1"
      :label="data.vehicles.length"
      color="orange"
      floating
      transparent
      class="text-bold"
      style="top: 5px; right: 5px;"
      text-color="white"
    />
    <p class="q-ma-none">
      {{ data.vehicles[0].year }}
    </p>
    <p class="q-ma-none">{{ data.vehicles[0].make }}</p>
    <p class="q-ma-none">{{ data.vehicles[0].model }}</p>
    <p v-if="!data.vehicles[0].operable" class="text-red text-bold q-ma-none">
      Inop
    </p>
  </div>
</template>

<script>
export default {
  name: 'AppQuoteVehicle',
  props: ['data']
};
</script>
