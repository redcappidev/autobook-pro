<template>
  <div style="max-width: 600px;" class="q-mx-auto q-mt-md">
    <div class="text-right q-mb-sm">
      <q-btn label="Save" color="primary" outline @click="handleSave" />
    </div>
    <q-card flat bordered>
      <q-card-section>
        <app-editable-input
          class="q-pb-sm"
          :data="name"
          name="name"
          text="Name *"
          @input="
            name = $event.model;
            delayTouch($v.name, $options.touchMap);
          "
          :error="$v.name.$error"
        />
        <q-field :error="$v.script.$error" :hide-bottom-space="true">
          <template #control>
            <q-editor
              flat
              class="script-editor full-width"
              style="background-color: transparent;"
              v-model="script"
              :toolbar="[['placeholders']]"
              placeholder="Script"
              ref="editor"
            >
              <template v-slot:placeholders>
                <q-select
                  dense
                  use-input
                  label="Short Codes"
                  :options="placeholders"
                  option-label="label"
                  option-value="value"
                  v-model="placeholder"
                  @input="handleSelectChange"
                />
              </template>
            </q-editor>
          </template>
        </q-field>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
import { required } from 'vuelidate/lib/validators';
import { extractKeysIntoObject } from '@client/utils/object-helpers';
import { data as placeholders } from '@server/constants/placeholders';
import graphql from '@client/graphql';
import AppEditableInput from '@client/components/form/editable-input';

export default {
  name: 'AppSMSTemplateDetail',
  metaInfo: {
    title: 'AutoBook Pro - SMS Templates'
  },
  components: {
    AppEditableInput
  },
  validations: {
    name: { required },
    script: { required }
  },
  apollo: {
    smsTemplate: {
      query: graphql.queries.getSMSTemplate,
      variables() {
        return {
          id: this.$route.params.id
        };
      },
      skip() {
        const { name } = this.$router.history.current;
        return name !== 'sms-templates-detail';
      },
      watchLoading(isLoading) {
        this.loading = isLoading;
      },
      error(error) {
        this.error = error;
      },
      result(result) {
        if (result.loading) return;
        Object.assign(this, result.data.smsTemplate);
      }
    }
  },
  data() {
    return {
      loading: false,
      error: null,
      saving: false,

      name: null,
      script: '',

      placeholder: null,
      placeholders
    };
  },
  methods: {
    async handleSave() {
      this.validate(['name', 'script']);

      const { name } = this.$router.history.current;
      const isEditing = name === 'sms-templates-detail';

      this.saving = true;

      const inputData = extractKeysIntoObject(this, ['name', 'script']);

      if (isEditing) {
        await this.$apollo.mutate({
          mutation: graphql.mutations.updateSMSTemplate,
          variables: {
            id: this.$route.params.id,
            input: inputData
          }
        });
      } else {
        await this.$apollo.mutate({
          mutation: graphql.mutations.createSMSTemplate,
          variables: {
            input: inputData
          },
          update(store, { data: { createSMSTemplate: newTemplate } }) {
            const data = store.readQuery({
              query: graphql.queries.getSMSTemplates
            });

            data.smsTemplates = data.smsTemplates.concat(newTemplate);

            store.writeQuery({
              query: graphql.queries.getSMSTemplates,
              data
            });
          }
        });
      }

      this.$router.push({ name: 'sms-templates' });
    },
    handleSelectChange(e) {
      this.$refs.editor.caret.restore();
      this.script = `${this.script} ${e.value}`;
      this.$refs.editor.focus();
      this.placeholder = null;
    }
  }
};
</script>
<style lang="scss">
.script-editor {
  .q-editor__content {
    cursor: text;
  }
}
</style>
