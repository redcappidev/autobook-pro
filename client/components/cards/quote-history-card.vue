<template>
  <q-card>
    <q-card-section class="q-pa-sm bg-primary">
      <div class="text-subtitle1 text-bold q-px-sm">
        <q-icon
          name="history"
          style="font-size: 25px; padding-right: 0.1rem;"
        ></q-icon>
        {{ title }}
      </div>
    </q-card-section>

    <q-separator />
    <q-card-section>
      <q-scroll-area style="height: 100px;"> </q-scroll-area>
    </q-card-section>
  </q-card>
</template>
<script>
export default {
  name: 'AppQuoteHistoryCard',
  props: ['title']
};
</script>
