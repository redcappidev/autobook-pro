<template>
  <div style="max-width: 600px;" class="q-mx-auto q-mt-md">
    <div class="text-right q-mb-sm">
      <q-btn
        outline
        label="Save"
        color="primary"
        :loading="saving"
        @click="handleSubmit"
      />
    </div>
    <q-card flat bordered>
      <q-card-section>
        <app-editable-input
          :data="name"
          name="name"
          @input="
            name = $event.model;
            delayTouch($v.name, $options.touchMap);
          "
          text="Name *"
          :error="$v.name.$error"
        />
        <app-select-input
          clearable
          use-input
          v-model="parentStatus"
          :options="parentStatusOptions"
          option-label="name"
          option-value="id"
          input-debounce="0"
          @filter="filterParentStatusFn"
          text="Parent"
        />
        <app-select-input
          clearable
          use-input
          v-model="emailTemplate"
          :options="emailTemplateOptions"
          option-label="name"
          option-value="id"
          input-debounce="0"
          @filter="filterEmailFn"
          text="Email Template"
          hint="If you would like to send an email
          when changing to this status, choose email template above."
        />

        <app-select-input
          clearable
          use-input
          v-model="smsTemplate"
          :options="smsTemplateOptions"
          option-label="name"
          option-value="id"
          input-debounce="0"
          @filter="filterSMSFn"
          text="SMS Template"
          hint="If you would like to send an text message when
          changing to this status, choose text messaging template above."
        />
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
import { required } from 'vuelidate/lib/validators';
import graphql from '@client/graphql';
import AppEditableInput from '@client/components/form/editable-input';
import AppSelectInput from '@client/components/form/select-input';

export default {
  name: 'AppCreateStatus',
  metaInfo: {
    title: 'AutoBook Pro - Statuses'
  },
  components: {
    AppEditableInput,
    AppSelectInput
  },
  validations: {
    name: { required }
  },
  apollo: {
    emailTemplates: {
      query: graphql.queries.getEmailTemplates
    },
    smsTemplates: {
      query: graphql.queries.getSMSTemplates
    },
    parentStatuses() {
      return {
        query: graphql.queries.getParentStatus,
        variables: { type: this.category }
      };
    }
  },
  data() {
    return {
      saving: false,

      name: null,
      parentStatus: null,
      emailTemplate: null,
      smsTemplate: null,

      parentStatusOptions: [],
      emailTemplateOptions: [],
      smsTemplateOptions: []
    };
  },
  computed: {
    category() {
      let { category: data } = this.$route.query;
      if (data !== 'QUOTE' && data !== 'ORDER') data = 'QUOTE';
      return data;
    }
  },
  methods: {
    async handleSubmit() {
      this.validate(['name']);

      const payload = {};
      payload.name = this.name;
      payload.type = this.category;
      if (this.parentStatus) {
        payload.parentId = parseInt(this.parentStatus.id, 10);
      }
      if (this.emailTemplate) {
        payload.emailTemplateId = parseInt(this.emailTemplate.id, 10);
      }
      if (this.smsTemplate) {
        payload.smsTemplateId = parseInt(this.smsTemplate.id, 10);
      }

      this.saving = true;
      await this.$apollo.mutate({
        mutation: graphql.mutations.createStatus,
        variables: { input: payload }
      });
      this.saving = false;

      this.$router.push({ name: 'statuses' });
    },
    filterParentStatusFn(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.parentStatusOptions = this.parentStatuses.filter(
          (v) => v.name.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    filterEmailFn(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.emailTemplateOptions = this.emailTemplates.filter(
          (v) => v.name.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    filterSMSFn(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.smsTemplateOptions = this.smsTemplates.filter(
          (v) => v.name.toLowerCase().indexOf(needle) > -1
        );
      });
    }
  }
};
</script>
