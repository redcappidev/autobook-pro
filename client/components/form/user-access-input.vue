<template>
  <div>
    <app-select-input
      style="max-width: 300px;"
      text="Role *"
      :value="role"
      :options="roles"
      option-label="name"
      option-value="id"
      @input="handleChangeRole"
      :error="error"
    />
    <div class="q-mt-sm row q-col-gutter-sm">
      <div
        class="col-3"
        v-for="(access, indexI) in USER_ACCESSES"
        :key="indexI"
      >
        <q-list class="full-height" bordered>
          <q-item-label header>{{ access.principal }}</q-item-label>
          <q-item
            dense
            tag="label"
            v-for="(permission, indexJ) in access.permissions"
            :key="indexJ"
          >
            <q-item-section>
              <app-checkbox-input
                :disable="!canUpdatePermissions"
                :label="permission.label"
                :value="userPermissions.includes(permission.id)"
                @input="handleTogglePermission(permission.id)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </div>
</template>

<script>
import graphql from '@client/graphql';
import { assessPermission } from '@server/lib/permission-helpers';
import { USER_ACCESSES, DEFAULT_PERMISSIONS_BY_ROLE } from '@server/constants';
import AppCheckboxInput from '@client/components/form/checkbox-input';
import AppSelectInput from '@client/components/form/select-input';

export default {
  props: {
    error: Boolean,
    value: String,
    role: Object
  },
  components: {
    AppSelectInput,
    AppCheckboxInput
  },
  apollo: {
    currentUser: {
      query: graphql.queries.currentUser
    },
    roles: {
      query: graphql.queries.getRoles
    }
  },
  data() {
    return {
      USER_ACCESSES
    };
  },
  computed: {
    canUpdatePermissions() {
      return assessPermission.permission.canUpdate(this.currentUser);
    },
    userPermissions() {
      return this.value.split(',').filter((p) => p);
    }
  },
  methods: {
    handleChangeRole(role) {
      this.$emit('input', DEFAULT_PERMISSIONS_BY_ROLE[role.name].join(','));
      this.$emit('on-role-change', role);
    },
    handleTogglePermission(pid) {
      if (this.userPermissions.includes(pid)) {
        this.$emit(
          'input',
          this.userPermissions.filter((p) => p !== pid).join(',')
        );
      } else {
        this.$emit('input', this.userPermissions.concat(pid).join(','));
      }
    }
  }
};
</script>

<style></style>
