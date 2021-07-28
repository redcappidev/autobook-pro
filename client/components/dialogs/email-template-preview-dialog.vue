<template>
  <q-dialog :value="open" @hide="closeDialog">
    <q-card style="min-width: 600px;">
      <q-card-section class="text-h6">
        Preview
      </q-card-section>
      <q-card-section>
        <div v-html="data ? data.htmlBody : ''"></div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'EmailTemplatePreviewDialog',
  props: ['open', 'data', 'closeDialog']
};
</script>
<style lang="scss"></style>
