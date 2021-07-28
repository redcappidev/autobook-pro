<template>
  <q-select
    v-if="!loadingData"
    dense
    v-bind="$attrs"
    v-on="$listeners"
    :hide-bottom-space="true"
  >
    <template v-slot:prepend>
      <span v-if="text" class="text-subtitle2" style="min-width: 5rem;">
        {{ text }}
      </span>
    </template>
    <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </q-select>
  <div class="q-py-xs" v-else>
    <q-skeleton type="rect" height="32px" animation="fade" />
  </div>
</template>

<script>
export default {
  name: 'AppSelectInput',
  props: {
    loadingData: {
      type: Boolean,
      default: false
    },
    text: String
  }
};
</script>

<style></style>
