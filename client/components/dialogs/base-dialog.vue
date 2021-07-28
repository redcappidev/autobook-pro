<template>
  <q-dialog :value="value" v-bind="$attrs">
    <q-card v-if="value" class="dialog-lg-sized">
      <q-card-section class="text-center">
        <div class="text-h6 text-weight-medium">
          <slot name="header" />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <slot />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <slot name="actions" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'BaseDialog',
  props: ['value']
};
</script>

<style></style>
