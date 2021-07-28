<template>
  <q-card flat bordered>
    <q-card-section class="q-pa-sm">
      <div class="text-subtitle1 text-bold">
        <q-icon name="person" style="font-size: 25px; padding-right: 0.1rem;" />
        Team Members
      </div>
    </q-card-section>

    <q-separator />
    <q-card-section>
      <q-scroll-area style="height: 180px;">
        <q-markup-table separator="vertical" flat dense v-if="!loading">
          <thead>
            <tr class="text-center">
              <th class="text-left">Name</th>
              <th>EXT</th>
              <th class="text-right">Email</th>
            </tr>
          </thead>
          <tbody v-for="(user, index) in teamMembers" v-bind:key="index">
            <tr>
              <td class="text-left">
                {{ user.firstName }} {{ user.lastName }}
              </td>
              <td>{{ user.ext }}</td>
              <td class="text-right">{{ user.email }}</td>
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
    teamMembers: {
      query: graphql.queries.getTeamMembers,
      watchLoading(isLoading) {
        this.loading = isLoading;
      }
    }
  },
  data() {
    return {
      loading: false
    };
  }
};
</script>

<style></style>
