<template>
  <div class="autobookpro-page-content">
    <div class="row justify-between q-mb-lg">
      <span class="text-h5">Users</span>
      <q-btn
        color="primary"
        label="Invite"
        outline
        v-if="canInviteUser"
        @click="$refs.invitationDialogRef.openDialog()"
      />
    </div>
    <div v-if="error">An error occured</div>
    <div v-else>
      <q-table
        flat
        bordered
        :data="users"
        :columns="columns"
        :loading="loading"
        :rows-per-page-options="[25, 50]"
        :pagination.sync="pagination"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">
              <span>{{ props.row.firstName }} {{ props.row.lastName }}</span>
            </q-td>
            <q-td key="status" :props="props">
              <span v-if="props.row.status === 'ACTIVATED'">Active</span>
              <span
                class="text-negative"
                v-if="props.row.status === 'DEACTIVATED'"
                >Inactive</span
              >
            </q-td>
            <q-td key="email" :props="props">
              <span>{{ props.row.email }}</span>
            </q-td>
            <q-td key="phoneNumber" :props="props">
              <span>{{ props.row.phoneNumber }}</span>
            </q-td>
            <q-td key="role" :props="props" class="text-capitalize">
              <span>{{ getRoleTitle(props.row.role.name) }}</span>
            </q-td>
            <q-td key="createdAt" :props="props">
              <span>{{ props.row.createdAt | localTime }}</span>
            </q-td>
            <q-td key="options" :props="props">
              <div class="row items-center q-gutter-x-sm">
                <q-btn
                  v-if="canUpdateUser"
                  dense
                  size="sm"
                  outline
                  color="primary"
                  icon="edit"
                  @click="$refs.userProfileDialogRef.openDialog(props.row)"
                />
                <q-btn
                  v-if="
                    currentUser.id !== props.row.id &&
                    !isSuperAdmin(props.row) &&
                    canViewPermissions
                  "
                  dense
                  size="sm"
                  outline
                  color="primary"
                  icon="admin_panel_settings"
                  @click="$refs.userAccessDialogRef.openDialog(props.row)"
                />
                <div v-if="!updatingStatus[props.row.id]">
                  <q-toggle
                    v-if="
                      currentUser.id !== props.row.id &&
                      !isSuperAdmin(props.row) &&
                      canUpdateUser
                    "
                    :value="props.row.status === 'ACTIVATED' ? true : false"
                    dense
                    size="sm"
                    color="primary"
                    @input="handleActivateUser(props.row, $event)"
                  />
                </div>
                <q-spinner size="16px" v-else />
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <app-user-access-dialog ref="userAccessDialogRef" />
    <app-user-profile-dialog ref="userProfileDialogRef" />
    <app-invitation-dialog ref="invitationDialogRef" />
  </div>
</template>

<script>
import graphql from '@client/graphql';
import { assessPermission, getRoleTitle } from '@server/lib/permission-helpers';
import AppUserAccessDialog from '@client/components/dialogs/user-access-dialog';
import AppUserProfileDialog from '@client/components/dialogs/user-profile-dialog';
import AppInvitationDialog from '@client/components/dialogs/invitation-dialog';

export default {
  metaInfo: {
    title: 'AutoBook Pro - Users'
  },
  components: {
    AppUserAccessDialog,
    AppUserProfileDialog,
    AppInvitationDialog
  },
  apollo: {
    currentUser: {
      query: graphql.queries.currentUser
    },
    users: {
      query: graphql.queries.loadUsers
    }
  },
  data() {
    return {
      loading: false,
      error: null,
      updatingStatus: {},

      columns: [
        {
          name: 'name',
          label: 'Name',
          align: 'left'
        },
        {
          name: 'status',
          label: 'Status',
          align: 'left'
        },
        {
          name: 'email',
          label: 'Email',
          align: 'left'
        },
        {
          name: 'phoneNumber',
          label: 'Phone',
          align: 'left'
        },
        {
          name: 'role',
          label: 'Role',
          align: 'left'
        },
        {
          name: 'createdAt',
          label: 'Created At',
          align: 'left'
        },
        {
          name: 'options',
          label: '',
          align: 'center'
        }
      ],
      pagination: {
        rowsPerPage: 50
      }
    };
  },
  computed: {
    canViewPermissions() {
      return assessPermission.permission.canView(this.currentUser);
    },
    canUpdateUser() {
      return assessPermission.user.canUpdate(this.currentUser);
    },
    canInviteUser() {
      return assessPermission.user.canCreate(this.currentUser);
    }
  },
  methods: {
    async handleActivateUser(user, status) {
      this.$set(this.updatingStatus, user.id, true);
      if (status) {
        await this.$apollo.mutate({
          mutation: graphql.mutations.activateUser,
          variables: { id: user.id }
        });
      } else {
        await this.$apollo.mutate({
          mutation: graphql.mutations.deactivateUser,
          variables: { id: user.id }
        });
      }
      this.$set(this.updatingStatus, user.id, false);
    },
    isSuperAdmin(user) {
      return assessPermission.isSuperAdmin(user);
    },
    getRoleTitle
  }
};
</script>

<style></style>
