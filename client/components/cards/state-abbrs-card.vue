<template>
  <q-card flat bordered style="width: 240px;">
    <q-card-section class="q-pa-sm">
      <div class="text-subtitle1 text-bold">
        <q-icon name="room" style="font-size: 25px; padding-right: 0.1rem;" />
        State Abbreviations
      </div>
    </q-card-section>

    <q-separator />
    <q-card-section>
      <q-scroll-area style="height: 280px;">
        <q-markup-table separator="vertical" flat dense>
          <tbody>
            <tr v-for="(s, index) in STATES" :key="index">
              <td class="text-left">{{ s.name }}</td>
              <td>{{ s.abbr }}</td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-scroll-area>
    </q-card-section>
  </q-card>
</template>

<script>
import STATES from '@server/constants/usa-states';

export default {
  data() {
    return {
      STATES
    };
  }
};
</script>

<style></style>
