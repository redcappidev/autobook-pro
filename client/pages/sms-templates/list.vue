<template>
  <div class="autobookpro-page-content">
    <div v-if="error">An error occured</div>
    <div style="max-width: 600px;" class="q-mx-auto q-mt-md" v-else>
      <div class="text-right q-mb-sm">
        <q-btn
          v-if="canCreateSMSTemplate"
          color="primary"
          label="Create"
          outline
          :to="{ name: 'create-sms-templates' }"
        />
      </div>
      <q-table
        flat
        bordered
        :data="smsTemplates"
        :columns="columns"
        :loading="loading"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">
              {{ props.row.name }}
            </q-td>
            <q-td key="options" :props="props">
              <div class="row justify-end q-gutter-x-sm">
                <q-btn
                  v-if="canUpdateSMSTemplate"
                  dense
                  size="sm"
                  outline
                  color="primary"
                  icon="edit"
                  :to="{
                    name: 'sms-templates-detail',
                    params: { id: props.row.id }
                  }"
                />
                <q-btn
                  v-if="canUpdateSMSTemplate"
                  dense
                  size="sm"
                  outline
                  color="negative"
                  icon="delete"
                  @click="handleDelete(props.row.id)"
                />
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>
<script>
import graphql from '@client/graphql';
import { assessPermission } from '@server/lib/permission-helpers';

export default {
  name: 'AppSMSTemplates',
  metaInfo: {
    title: 'AutoBook Pro - SMS Templates'
  },
  apollo: {
    currentUser: {
      query: graphql.queries.currentUser
    },
    smsTemplates: {
      query: graphql.queries.getSMSTemplates,
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

      columns: [
        {
          name: 'name',
          label: 'Name',
          align: 'left',
          sortable: true
        },
        {
          name: 'options',
          label: ''
        }
      ]
    };
  },
  computed: {
    canCreateSMSTemplate() {
      return assessPermission.smsTemplate.canCreate(this.currentUser);
    },
    canUpdateSMSTemplate() {
      return assessPermission.smsTemplate.canUpdate(this.currentUser);
    }
  },
  methods: {
    async handleDelete(rowId) {
      await this.$apollo.mutate({
        mutation: graphql.mutations.deleteSMSTemplate,
        variables: {
          id: rowId
        },
        update: (store) => {
          const data = store.readQuery({
            query: graphql.queries.getSMSTemplates
          });

          data.smsTemplates = data.smsTemplates.filter((e) => e.id !== rowId);
          store.writeQuery({
            query: graphql.queries.getSMSTemplates,
            data
          });
        }
      });

      this.notifyPositive('It has been successfully removed');
    }
  }
};
</script>
<style lang="scss"></style>
