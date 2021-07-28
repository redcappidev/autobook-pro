<template>
  <q-item :class="`bg-${color}`">
    <q-item-section avatar>
      <q-icon class="text-white" color="primary" :name="icon" />
    </q-item-section>
    <q-item-section>
      <q-item-label class="text-white text-right">{{ value }}</q-item-label>
      <q-item-label caption class="text-white text-right">
        {{ label }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  props: {
    icon: String,
    color: String,
    label: String,
    value: Number
  }
};
</script>

<style></style>
