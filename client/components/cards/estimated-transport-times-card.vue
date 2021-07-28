<template>
  <q-card flat bordered>
    <q-card-section class="q-pa-sm">
      <div class="text-subtitle1 text-bold">
        <q-icon name="person" style="font-size: 25px; padding-right: 0.1rem;" />
        Estimated Transport Times
      </div>
    </q-card-section>

    <q-separator />
    <q-card-section>
      <q-scroll-area style="height: 180px;">
        <q-markup-table separator="vertical" flat dense>
          <thead>
            <tr class="text-center">
              <th class="text-left">Mileage</th>
              <th class="text-left">Days</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-left">100 - 600</td>
              <td class="text-left">1 - 2</td>
            </tr>
            <tr>
              <td class="text-left">700 - 1500</td>
              <td class="text-left">2 - 3</td>
            </tr>
            <tr>
              <td class="text-left">1501 - 2000</td>
              <td class="text-left">4 - 6</td>
            </tr>
            <tr>
              <td class="text-left">2001 - 2500</td>
              <td class="text-left">5 - 7</td>
            </tr>
            <tr>
              <td class="text-left">2501 - 3000</td>
              <td class="text-left">6 - 8</td>
            </tr>
            <tr>
              <td class="text-left">3001 - 3500</td>
              <td class="text-left">7 - 10</td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-scroll-area>
    </q-card-section>
  </q-card>
</template>

<script>
export default {};
</script>

<style></style>
