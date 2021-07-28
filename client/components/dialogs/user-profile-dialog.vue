<template>
  <q-dialog :value="open" @hide="closeDialog">
    <q-card style="min-width: 300px;" v-if="open">
      <q-card-section class="text-center">
        <div class="text-h6 text-weight-medium">
          User Profile
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section v-if="user">
        <app-editable-input
          :data="user.firstName"
          text="First Name *"
          name="firstName"
          @input="handleChangeInput"
          :error="$v.user.firstName.$error"
        />
        <app-editable-input
          :data="user.lastName"
          text="Last Name"
          name="lastName"
          @input="handleChangeInput"
        />
        <app-editable-input
          :data="user.phoneNumber"
          type="tel"
          text="Phone Number"
          name="phoneNumber"
          mask="+1 (###) ### - ####"
          unmasked-value
          @input="handleChangeInput"
        />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right" v-if="canUpdateUser">
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
import AppEditableInput from '@client/components/form/editable-input';
import { assessPermission } from '@server/lib/permission-helpers';
import { userValidator } from '@client/validators';
import { extractKeysIntoObject } from '@client/utils/object-helpers';

export default {
  components: {
    AppEditableInput
  },
  apollo: {
    currentUser: {
      query: graphql.queries.currentUser
    }
  },
  validations: {
    user: userValidator
  },
  data() {
    return {
      open: false,
      user: null,
      saving: false
    };
  },
  computed: {
    canUpdateUser() {
      return assessPermission.user.canUpdate(this.currentUser);
    }
  },
  methods: {
    openDialog(user) {
      this.user = { ...user };
      this.open = true;
    },
    closeDialog() {
      this.open = false;
    },
    handleChangeInput(value) {
      const { name, model } = value;
      this.user[name] = model;

      if (this.$v[name]) {
        this.delayTouch(this.$v[name], this.$options.touchMap);
      }
    },
    async handleSave() {
      this.validate(['user']);

      const payload = extractKeysIntoObject(this.user, [
        'firstName',
        'lastName',
        'phoneNumber'
      ]);
      payload.phoneNumber = `+1${payload.phoneNumber}`;
      this.saving = true;

      await this.$apollo.mutate({
        mutation: graphql.mutations.updateUserProfile,
        variables: {
          id: this.user.id,
          input: payload
        }
      });

      this.saving = false;
      this.closeDialog();
    }
  }
};
</script>

<style></style>
