<template>
  <div v-if="invalidLink">
    <h3 class="text-negative text-center">Sorry! This request is invalid!</h3>
  </div>
  <div
    class="full-height row justify-center items-center"
    v-else-if="resolvingToken"
  >
    <q-spinner color="primary" size="md" />
  </div>
  <div v-else />
</template>

<script>
import graphql from '@client/graphql';
import { Auth0 } from '@client/third-party';

export default {
  data() {
    return {
      invalidLink: false,
      resolvingToken: false
    };
  },
  async mounted() {
    const { token } = this.$route.params;
    if (!token) {
      this.$router.push({ name: 'home' });
      return;
    }

    this.resolvingToken = true;
    const response = await this.$apollo.mutate({
      mutation: graphql.mutations.resolveInvitationLink,
      variables: { encryption: token }
    });
    this.resolvingToken = false;
    const { resolveInvitationLink: invitation } = response.data;
    if (!invitation) {
      this.invalidLink = true;
    } else {
      Auth0.login('/', {
        allowLogin: false,
        allowSignUp: true,
        prefill: {
          email: invitation.email
        },
        additionalSignUpFields: [
          {
            type: 'hidden',
            name: 'invitation_token',
            value: token
          }
        ]
      });
    }
  }
};
</script>

<style></style>
