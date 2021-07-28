<template>
  <form class="row q-col-gutter-sm items-center q-pa-sm">
    <q-input
      class="col-6"
      label="Email"
      outlined
      dense
      v-model="email"
      type="email"
      @input="delayTouch($v.email, $options.touchMap)"
      :error="$v.email.$error"
    />
    <q-input
      class="col-6"
      label="Supervisor Email"
      outlined
      dense
      v-model="supervisorEmail"
      type="email"
      @input="delayTouch($v.supervisorEmail, $options.touchMap)"
      :error="$v.supervisorEmail.$error"
    />
    <q-input
      class="col-6"
      label="Title"
      outlined
      dense
      v-model="title"
      @input="delayTouch($v.title, $options.touchMap)"
      :error="$v.title.$error"
    />
    <q-select
      class="col-6"
      outlined
      label="Department"
      dense
      v-model="departmentId"
      @input="delayTouch($v.departmentId, $options.touchMap)"
      :options="departments"
      option-label="name"
      option-value="id"
      map-options
      emit-value
      :error="$v.departmentId.$error"
    />
    <q-checkbox
      class="col-6"
      v-model="safetySensitive"
      label="Safety Sensitive (CFR 121, 135, 145 Only)"
      dense
    />
    <q-checkbox class="col-6" v-model="admin" label="Administrator" dense />
    <div class="row">
      <q-btn
        outline
        color="primary"
        label="Submit"
        :loading="loading"
        @click="handleSubmit"
      >
        <template #loading>
          <q-spinner-gears />
        </template>
      </q-btn>
    </div>
  </form>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators';
import { extractKeysIntoObject } from '@client/utils/object-helpers';

export default {
  name: 'FormExercise',
  validations: {
    email: { required, email },
    supervisorEmail: { required, email },
    title: { required },
    departmentId: { required }
  },
  data() {
    return {
      loading: false,
      email: '',
      supervisorEmail: '',
      title: '',
      departmentId: null,
      safetySensitive: false,
      admin: false,
      departments: [
        {
          id: 'dep1',
          name: 'Test 1'
        },
        {
          id: 'dep2',
          name: 'Test 2'
        },
        {
          id: 'dep3',
          name: 'Test 3'
        },
        {
          id: 'dep4',
          name: 'Test 4'
        },
        {
          id: 'dep5',
          name: 'Test 5'
        },
        {
          id: 'dep6',
          name: 'Test 6'
        }
      ]
    };
  },
  methods: {
    handleSubmit() {
      this.loading = true;
      this.validate(['email', 'supervisorEmail', 'title', 'departmentId']);
      const data = extractKeysIntoObject(this, [
        'email',
        'supervisorEmail',
        'title',
        'departmentId',
        'safetySensitive',
        'admin',
        'selectedCourses'
      ]);

      console.log('form data', data);
      setTimeout(() => {
        this.loading = false;
      }, 1500);
    }
  }
};
</script>

<style></style>
