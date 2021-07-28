<template>
  <q-dialog :value="open" @hide="closeDialog">
    <q-card style="min-width: 800px;" v-if="open">
      <q-card-section class="text-center">
        <div class="text-h6 text-weight-medium">
          User Access
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <user-access-input
          :role="role"
          v-model="permissions"
          @on-role-change="handleRoleChange"
        />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right" v-if="canUpdatePermissions">
        <q-btn
          outline
          label="Save"
          color="primary"
          :loading="saving"
          @click="handleSave"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import graphql from '@client/graphql';
import { assessPermission } from '@server/lib/permission-helpers';
import UserAccessInput from '@client/components/form/user-access-input';

export default {
  components: {
    UserAccessInput
  },
  apollo: {
    currentUser: {
      query: graphql.queries.currentUser
    }
  },
  data() {
    return {
      open: false,
      userId: null,
      role: null,
      permissions: '',
      saving: false
    };
  },
  computed: {
    canUpdatePermissions() {
      return assessPermission.permission.canUpdate(this.currentUser);
    }
  },
  methods: {
    openDialog(user) {
      this.userId = user.id;
      this.role = user.role;
      this.permissions = user.permissions;
      this.open = true;
    },
    closeDialog() {
      this.open = false;
    },
    handleRoleChange(role) {
      this.role = role;
    },
    async handleSave() {
      this.saving = true;

      await this.$apollo.mutate({
        mutation: graphql.mutations.updateUserAccess,
        variables: {
          id: this.userId,
          roleId: this.role.id,
          permissions: this.permissions
        }
      });

      this.saving = false;
      this.closeDialog();
    }
  }
};
</script>

<style></style>
