<template>
  <q-input dense v-bind="$attrs" :value="value" v-if="!loadingData">
    <template v-slot:append>
      <q-icon name="colorize" class="cursor-pointer">
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-color :value="value" @input="$emit('input', $event)" />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
  <div class="q-py-xs" v-else>
    <q-skeleton type="rect" height="32px" animation="fade" />
  </div>
</template>

<script>
export default {
  name: 'AppColorPickerInput',
  props: {
    loadingData: {
      type: Boolean,
      default: false
    },
    value: String
  }
};
</script>

<style></style>
