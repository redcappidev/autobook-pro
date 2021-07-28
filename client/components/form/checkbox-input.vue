<template>
  <q-checkbox v-if="!loadingData" dense v-bind="$attrs" v-on="$listeners" />
  <div class="q-py-xs" v-else>
    <q-skeleton type="QCheckbox" height="32px" animation="fade" />
  </div>
</template>

<script>
export default {
  name: 'AppCheckboxInput',
  props: {
    loadingData: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style></style>
