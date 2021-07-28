<template>
  <div style="width: 90%;" class="q-mx-auto q-mt-md">
    <div class="text-right q-mb-sm">
      <q-btn
        :loading="saving"
        label="Save"
        outline
        color="primary"
        @click="handleSave"
      />
    </div>
    <q-card flat bordered>
      <q-card-section>
        <div class="row q-col-gutter-x-sm">
          <div class="col">
            <app-editable-input
              text="Name *"
              :data="name"
              name="name"
              @input="
                name = $event.model;
                delayTouch($v.name, $options.touchMap);
              "
              :error="$v.name.$error"
            />
            <app-select-input
              clearable
              v-model="statusOnOpen"
              :options="statusOptions"
              text="Status on Open"
              option-label="name"
              option-value="id"
            >
              <template #option="scope">
                <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                  <q-item-section avatar v-if="!scope.opt.isChild">
                    <q-badge color="primary" v-if="scope.opt.type === 'QUOTE'">
                      Quote
                    </q-badge>
                    <q-badge color="secondary" v-else>Order</q-badge>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label v-if="!scope.opt.isChild">{{
                      scope.opt.name
                    }}</q-item-label>
                    <q-item-label v-else>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -&nbsp;
                      {{ scope.opt.name }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </app-select-input>
            <app-select-input
              clearable
              v-model="statusOnClick"
              :options="statusOptions"
              text="Status on Click"
              option-label="name"
              option-value="id"
            >
              <template #option="scope">
                <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                  <q-item-section avatar v-if="!scope.opt.isChild">
                    <q-badge color="primary" v-if="scope.opt.type === 'QUOTE'">
                      Quote
                    </q-badge>
                    <q-badge color="secondary" v-else>Order</q-badge>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label v-if="!scope.opt.isChild">{{
                      scope.opt.name
                    }}</q-item-label>
                    <q-item-label v-else>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -&nbsp;
                      {{ scope.opt.name }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </app-select-input>
            <app-select-input
              v-model="referrers"
              :options="referrerOptions"
              option-label="label"
              option-value="value"
              multiple
              clearable
              text="Referrer"
            />
          </div>
          <div class="col">
            <app-editable-input
              text="Email Subject *"
              :data="emailSubject"
              @input="
                emailSubject = $event.model;
                delayTouch($v.emailSubject, $options.touchMap);
              "
              :error="$v.emailSubject.$error"
            />
            <app-editable-input
              text="Email From *"
              :data="emailFrom"
              @input="
                emailFrom = $event.model;
                delayTouch($v.emailFrom, $options.touchMap);
              "
              :error="$v.emailFrom.$error"
            />
            <app-editable-input
              text="Email From Name *"
              :data="emailFromName"
              @input="
                emailFromName = $event.model;
                delayTouch($v.emailFromName, $options.touchMap);
              "
              :error="$v.emailFromName.$error"
            />
            <app-editable-input
              text="Reply To *"
              :data="replyTo"
              @input="
                replyTo = $event.model;
                delayTouch($v.replyTo, $options.touchMap);
              "
              :error="$v.replyTo.$error"
            />
            <app-editable-input
              dense
              :data="emailBcc"
              text="Email Bcc"
              @input="emailBcc = $event.model"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
    <app-content-editor class="q-mt-sm" v-model="htmlBody" />
  </div>
</template>
<script>
import { required } from 'vuelidate/lib/validators';
import { referrers as referrerOptions } from '@server/constants/referrers';
import { extractKeysIntoObject } from '@client/utils/object-helpers';
import graphql from '@client/graphql';
import AppContentEditor from '@client/components/form/content-editor';
import AppEditableInput from '@client/components/form/editable-input';
import AppSelectInput from '@client/components/form/select-input';

export default {
  name: 'AppEmailTemplateDetail',
  metaInfo: {
    title: 'AutoBook Pro - Email Templates'
  },
  validations: {
    name: { required },
    emailSubject: { required },
    emailFrom: { required },
    emailFromName: { required },
    replyTo: { required }
  },
  components: {
    AppContentEditor,
    AppEditableInput,
    AppSelectInput
  },
  apollo: {
    emailTemplate: {
      query: graphql.queries.getEmailTemplate,
      variables() {
        return {
          id: this.$route.params.id
        };
      },
      skip() {
        const { name } = this.$router.history.current;

        return name !== 'email-template-detail';
      },
      watchLoading(isLoading) {
        this.loading = isLoading;
      },
      error(error) {
        this.error = error;
      },
      result(result) {
        if (result.loading) return;
        const { emailTemplate } = result.data;
        Object.assign(this, emailTemplate);
      }
    },
    parentStatuses: {
      query: graphql.queries.getParentStatus,
      variables: {
        type: 'ALL'
      }
    }
  },
  data() {
    return {
      loading: false,
      error: null,

      saving: false,

      name: null,
      emailSubject: 'Auto Shipping Quote #~quote_id~',
      emailFrom: '~my_email~',
      emailFromName: '~email_from_name~',
      replyTo: '~my_email~',
      emailBcc: null,

      statusOnOpen: null,
      statusOnClick: null,

      referrers: null,
      referrerOptions,

      htmlBody: '',
      placeholders: null
    };
  },
  computed: {
    statusOptions() {
      return (this.parentStatuses || [])
        .map((status) => {
          const option = {
            id: status.id,
            type: status.type,
            name: status.name
          };
          if (status.childrenCount === 0) {
            return option;
          }

          return [option].concat(
            status.children.map((child) => ({
              id: child.id,
              type: child.type,
              name: child.name,
              isChild: true
            }))
          );
        })
        .flat();
    }
  },
  methods: {
    async handleSave() {
      this.validate([
        'name',
        'emailSubject',
        'emailFrom',
        'emailFromName',
        'replyTo'
      ]);

      try {
        this.saving = true;
        const sendData = extractKeysIntoObject(this, [
          'name',
          'emailSubject',
          'emailFrom',
          'emailFromName',
          'replyTo',
          'emailBcc',
          'htmlBody',
          'placeholders'
        ]);

        if (this.referrers) {
          sendData.referrers = this.referrers.map((r) => r.value);
        }

        if (this.statusOnOpen) {
          sendData.statusOnOpen = parseInt(this.statusOnOpen.id, 10);
        }

        if (this.statusOnClick) {
          sendData.statusOnClick = parseInt(this.statusOnClick.id, 10);
        }

        const { name } = this.$router.history.current;

        if (name === 'email-template-detail') {
          await this.$apollo.mutate({
            mutation: graphql.mutations.updateEmailTemplate,
            variables: {
              id: this.$route.params.id,
              input: sendData
            },
            update: (store, { data: { updateEmailTemplate } }) => {
              const apolloData = store.readQuery({
                query: graphql.queries.getEmailTemplates
              });
              apolloData.emailTemplates = apolloData.emailTemplates.map(
                (et) => {
                  if (et.id === updateEmailTemplate.id) {
                    return updateEmailTemplate;
                  }
                  return et;
                }
              );
              store.writeQuery({
                query: graphql.queries.getEmailTemplates,
                data: apolloData
              });
            }
          });
        } else if (name === 'create-email-template') {
          await this.$apollo.mutate({
            mutation: graphql.mutations.createEmailTemplate,
            variables: {
              input: sendData
            },
            update: (store, { data: { createEmailTemplate } }) => {
              const apolloData = store.readQuery({
                query: graphql.queries.getEmailTemplates
              });
              apolloData.emailTemplates = [
                ...apolloData.emailTemplates,
                createEmailTemplate
              ];
              store.writeQuery({
                query: graphql.queries.getEmailTemplates,
                data: apolloData
              });
            }
          });
        }

        this.$router.push({ name: 'email-templates' });
      } catch (error) {
        this.notifyNegative(error.message);
      }

      this.saving = false;
    }
  }
};
</script>
