<template>
  <q-card flat bordered>
    <q-card-section class="q-pa-sm">
      <div class="text-subtitle1 text-bold">
        <q-icon name="person" style="font-size: 25px; padding-right: 0.1rem;" />
        Sales Tracker
      </div>
    </q-card-section>

    <q-separator />
    <q-card-section>
      <q-scroll-area style="height: 180px;">
        <q-markup-table separator="vertical" flat dense>
          <thead>
            <tr class="text-center">
              <th class="text-left">Name</th>
              <th>Book</th>
              <th class="text-right">Dispatch</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in data" v-bind:key="index">
              <td class="text-left">{{ item.name }}</td>
              <td>{{ item.newOrders }}</td>
              <td class="text-right">{{ item.newDispatches }}</td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-scroll-area>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  props: ['data']
};
</script>

<style></style>
