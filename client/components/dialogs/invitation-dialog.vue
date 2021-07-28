<template>
  <q-dialog :value="open" @hide="closeDialog">
    <q-card style="min-width: 800px;" v-if="open">
      <q-card-section class="text-center">
        <div class="text-h6 text-weight-medium">
          Invite User
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <app-editable-input
          style="max-width: 300px;"
          :data="email"
          type="email"
          text="Invitee Email *"
          name="email"
          @input="
            email = $event.model;
            delayTouch($v.email, $options.touchMap);
          "
          :error="$v.email.$error"
        />
        <user-access-input
          class="q-mt-sm"
          v-model="permissions"
          :role="role"
          @on-role-change="handleRoleChange"
          :error="$v.role.$error"
        />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right" v-if="canCreateUser">
        <q-btn
          outline
          label="Invite"
          color="primary"
          :loading="saving"
          @click="handleInvite"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators';
import { assessPermission } from '@server/lib/permission-helpers';
import { INVITATION_RESPONSE } from '@server/constants';
import graphql from '@client/graphql';
import UserAccessInput from '@client/components/form/user-access-input';
import AppEditableInput from '@client/components/form/editable-input';

export default {
  components: {
    AppEditableInput,
    UserAccessInput
  },
  apollo: {
    currentUser: {
      query: graphql.queries.currentUser
    }
  },
  validations: {
    email: { required, email },
    role: {
      id: { required }
    }
  },
  data() {
    return {
      open: false,
      email: '',
      role: null,
      permissions: '',
      saving: false
    };
  },
  computed: {
    canUpdatePermissions() {
      return assessPermission.permission.canUpdate(this.currentUser);
    },
    canCreateUser() {
      return assessPermission.user.canCreate(this.currentUser);
    }
  },
  methods: {
    openDialog() {
      this.email = '';
      this.role = null;
      this.permissions = '';
      this.open = true;
    },
    closeDialog() {
      this.open = false;
    },
    handleRoleChange(role) {
      this.role = role;
    },
    async handleInvite() {
      this.validate(['email', 'role']);
      this.saving = true;

      const response = await this.$apollo.mutate({
        mutation: graphql.mutations.inviteUser,
        variables: {
          email: this.email,
          roleId: this.role.id,
          permissions: this.permissions
        }
      });

      this.saving = false;

      const result = response.data.inviteUser;

      if (result === INVITATION_RESPONSE.userAlreadyExists) {
        this.notifyPositive('The user already exists.');
      } else if (result === INVITATION_RESPONSE.invitationSent) {
        this.notifyPositive('An invitation email is sent.');
        this.closeDialog();
      } else {
        this.notifyNegative('Something went wrong. Please try again later');
      }
    }
  }
};
</script>

<style></style>
