<template>
  <div class="autobookpro-page-content">
    <q-tabs
      active-color="primary"
      indicator-color="primary"
      dense
      class="text-grey"
      align="left"
      narrow-indicator
    >
      <q-route-tab label="Mileages" :to="{ name: 'mileage-pricing' }" />
      <q-route-tab label="Exceptions" :to="{ name: 'exceptions' }" />
      <q-route-tab label="Vehicle Size" :to="{ name: 'vehicle-size' }" />
      <q-route-tab
        label="Vehicle Sizechart"
        :to="{ name: 'vehicle-sizechart' }"
      />
      <q-route-tab label="Fees" :to="{ name: 'fees' }" />
    </q-tabs>
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'TAQ'
};
</script>
<style lang="scss"></style>
