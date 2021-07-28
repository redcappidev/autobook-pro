<template>
  <q-card flat bordered>
    <q-card-section class="q-pa-sm">
      <div class="text-subtitle1 text-bold">
        <q-icon name="paid" style="font-size: 25px; padding-right: 0.1rem;" />
        Charged Today
      </div>
    </q-card-section>

    <q-separator />
    <q-card-section>
      <q-scroll-area style="height: 180px;">
        <q-markup-table separator="vertical" flat dense>
          <thead>
            <tr class="text-center">
              <th class="text-left">Order</th>
              <th>Amount</th>
              <th class="text-right">Note</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in todayTransactions" v-bind:key="index">
              <td class="text-left">#{{ item.order.id }}</td>
              <td>{{ item.amount }}</td>
              <td class="text-right">{{ item.note }}</td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-scroll-area>
    </q-card-section>
  </q-card>
</template>

<script>
import graphql from '@client/graphql';

export default {
  apollo: {
    todayTransactions: {
      query: graphql.queries.getTodayTransactions
    }
  }
};
</script>

<style></style>
