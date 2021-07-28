<template>
  <q-dialog
    v-model="open"
    persistent
    transition-show="fade"
    transition-hide="fade"
    position="top"
  >
    <q-card style="width: 500px; top: 75px;">
      <q-card-section class="text-h6">
        Edit Status
      </q-card-section>
      <q-card-section class="q-py-none q-px-lg">
        <q-select
          dense
          outlined
          use-input
          clearable
          hide-selected
          fill-input
          class="q-pb-md"
          label="Choose Email Template"
          v-model="emailModel"
          :options="emailOptions"
          :option-label="(item) => item.name"
          :option-value="(item) => item.id"
          @filter="filterEmailFn"
          @input="(e) => handleSelectChange('email', e)"
        >
        </q-select>
        <q-select
          dense
          outlined
          use-input
          clearable
          hide-selected
          fill-input
          class="q-pb-md"
          label="Choose SMS Template"
          v-model="smsModel"
          :options="smsOptions"
          :option-label="(item) => item.name"
          :option-value="(item) => item.id"
          @filter="filterSmsFn"
          @input="(e) => handleSelectChange('email', e)"
        >
        </q-select>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" @click="handleClose" />
        <q-btn flat label="Save" color="primary" @click="handleSubmit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import graphql from '@client/graphql';

export default {
  name: 'AppEditParentStatusDialog',
  props: ['open', 'data', 'closeDialog', 'type'],
  watch: {
    data: function (newVal) {
      const { emailTemplate, smsTemplate } = newVal;
      this.emailModel = emailTemplate;
      this.smsModel = smsTemplate;
    }
  },
  data() {
    return {
      emailModel: {},
      smsModel: {},
      emailOptions: [],
      smsOptions: [],
      emailTemplates: [],
      smsTemplates: []
    };
  },
  async mounted() {
    this.emailTemplates = await this.getEmailTemplates();
    this.smsTemplates = await this.getSMSTemplates();
  },
  methods: {
    filterSmsFn(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.smsTemplates = this.smsTemplates.filter(
          (v) => v.name.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    filterEmailFn(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.emailOptions = this.emailTemplates.filter(
          (v) => v.name.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    handleSelectChange(type, value) {
      if (type === 'email') {
        this.emailModel = value;
      }
      if (type === 'sms') {
        this.smsModel = value;
      }
    },
    handleClose() {
      this.emailModel = {};
      this.smsModel = {};
      this.closeDialog();
    },
    async handleSubmit() {
      const sendData = {
        emailTemplateId:
          this.emailModel && Object.keys(this.emailModel).length > 0
            ? parseInt(this.emailModel.id, 10)
            : null,
        smsTemplateId:
          this.smsModel && Object.keys(this.smsModel).length > 0
            ? parseInt(this.smsModel.id, 10)
            : null
      };
      await this.updateStatus(sendData);
      this.emailModel = {};
      this.smsModel = {};
      this.closeDialog();
    },
    async updateStatus(value) {
      try {
        await this.$apollo.mutate({
          mutation: graphql.mutations.updateStatus,
          variables: {
            id: this.data.id,
            input: value
          },
          update: (store, { data: { updateStatus } }) => {
            const apolloData = store.readQuery({
              query: graphql.queries.getParentStatus,
              variables: {
                type: this.type.value
              }
            });
            const { id, emailTemplate, smsTemplate } = updateStatus;
            const idx = apolloData.parentStatuses.findIndex((e) => e.id === id);
            const tmpArr = [...apolloData.parentStatuses];
            tmpArr[idx] = {
              ...tmpArr[idx],
              emailTemplate,
              smsTemplate
            };
            apolloData.parentStatuses = tmpArr;
            store.writeQuery({
              query: graphql.queries.getParentStatus,
              variables: {
                type: this.type.value
              },
              data: apolloData
            });
          }
        });

        this.notifyPositive('Successfully updated the parent status');
      } catch (error) {
        this.notifyNegative(error.message);
      }
    },
    async getEmailTemplates() {
      let tmp = [];
      try {
        const response = await this.$apollo.query({
          query: graphql.queries.getEmailTemplates
        });

        const { emailTemplates } = response.data;
        tmp = emailTemplates;
      } catch (error) {
        this.notifyNegative(error.message);
      }
      return tmp;
    },
    async getSMSTemplates() {
      let tmp = [];
      try {
        const response = await this.$apollo.query({
          query: graphql.queries.getSMSTemplates
        });

        const { smsTemplates } = response.data;
        tmp = smsTemplates;
      } catch (error) {
        this.notifyNegative(error.message);
      }

      return tmp;
    }
  }
};
</script>
