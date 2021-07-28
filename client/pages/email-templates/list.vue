<template>
  <div class="autobookpro-page-content">
    <div v-if="error">An error occured</div>
    <div style="max-width: 600px;" class="q-mx-auto q-mt-md" v-else>
      <div class="text-right q-mb-sm">
        <q-btn
          v-if="canCreateEmailTemplate"
          color="primary"
          label="Create"
          outline
          :to="{ name: 'create-email-template' }"
        />
      </div>
      <q-table
        flat
        bordered
        :data="emailTemplates"
        :columns="columns"
        :loading="loading"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">
              {{ props.row.name }}
            </q-td>
            <q-td key="options" :props="props">
              <q-btn
                dense
                outline
                color="primary"
                size="sm"
                icon="remove_red_eye"
                @click="handlePreview(props.row)"
              />
              <q-btn
                v-if="canUpdateEmailTemplate"
                dense
                outline
                color="secondary"
                size="sm"
                icon="edit"
                :to="{
                  name: 'email-template-detail',
                  params: { id: props.row.id }
                }"
              />
              <q-btn
                v-if="canUpdateEmailTemplate"
                dense
                outline
                color="red"
                size="sm"
                icon="delete"
                @click="handleDelete(props.row.id)"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <app-email-template-preview-dialog
      :open="openPreview"
      :data="previewData"
      :closeDialog="(e) => (openPreview = false)"
    />
  </div>
</template>
<script>
import AppEmailTemplatePreviewDialog from '@client/components/dialogs/email-template-preview-dialog';
import graphql from '@client/graphql';
import { assessPermission } from '@server/lib/permission-helpers';

export default {
  name: 'AppEmailTemplates',
  metaInfo: {
    title: 'AutoBook Pro - Email Templates'
  },
  components: {
    AppEmailTemplatePreviewDialog
  },
  apollo: {
    currentUser: {
      query: graphql.queries.currentUser
    },
    emailTemplates: {
      query: graphql.queries.getEmailTemplates,
      watchLoading(isLoading) {
        this.loading = isLoading;
      },
      error(error) {
        this.error = error;
      }
    }
  },
  data() {
    return {
      loading: false,
      error: null,

      openPreview: false,
      previewData: null,
      columns: [
        {
          name: 'name',
          label: 'Name',
          align: 'left'
        },
        {
          name: 'options',
          label: ''
        }
      ]
    };
  },
  computed: {
    canCreateEmailTemplate() {
      return assessPermission.emailTemplate.canCreate(this.currentUser);
    },
    canUpdateEmailTemplate() {
      return assessPermission.emailTemplate.canUpdate(this.currentUser);
    }
  },
  methods: {
    handlePreview(row) {
      this.openPreview = true;
      this.previewData = row;
    },
    handleEdit(id) {
      this.$router.push({ name: 'email-template-detail', params: { id } });
    },
    async handleDelete(id) {
      try {
        await this.$apollo.mutate({
          mutation: graphql.mutations.deleteEmailTemplate,
          variables: { id },
          update: (store) => {
            const data = store.readQuery({
              query: graphql.queries.getEmailTemplates
            });

            data.emailTemplates = data.emailTemplates.filter(
              (e) => e.id !== id
            );

            store.writeQuery({
              query: graphql.queries.getEmailTemplates,
              data
            });
            this.notifyPositive(
              'Successfully the email template has been removed!'
            );
          }
        });
      } catch (error) {
        this.notifyNegative(error.message);
      }
    }
  }
};
</script>
<style lang="scss"></style>
