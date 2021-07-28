<template>
  <div>
    <h1>Welcome to AutoBook Pro</h1>
    <div class="q-pa-md q-gutter-sm">
      <ApolloQuery :query="$options.graphql.queries.currentUser">
        <template #default="{ result: { data: userGraph } }">
          <div v-if="userGraph && userGraph.currentUser">
            <q-btn
              color="primary"
              label="Dashboard"
              @click="$router.push({ path: 'dashboard' })"
            ></q-btn>
          </div>
          <div v-else>
            <q-btn
              color="primary"
              label="Get started"
              @click="handleSignIn"
            ></q-btn>
          </div>
        </template>
      </ApolloQuery>
    </div>
  </div>
</template>

<script>
import { Auth0 } from '@client/third-party';
import graphql from '@client/graphql';

export default {
  name: 'Home',
  graphql,
  methods: {
    handleSignIn() {
      Auth0.login('/', {
        allowLogin: true,
        allowSignUp: false
      });
    }
  }
};
</script>
