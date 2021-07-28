<template>
  <div class="autobookpro-page-content">
    <div style="width: 90%;" class="q-mx-auto q-mt-md">
      <div class="row justify-between items-center q-mb-sm">
        <app-select-input
          text="Category"
          v-model="status"
          :options="statusOptions"
          option-label="label"
          option-value="value"
        />
        <div>
          <q-btn
            v-if="canCreateStatus"
            outline
            color="primary"
            label="Create"
            :to="{
              name: 'create-status',
              query: { category: status.value }
            }"
          />
        </div>
      </div>
      <q-table
        class="q-mt-md"
        flat
        bordered
        :loading="loading"
        :data="statuses"
        :columns="columns"
        :rows-per-page-options="[10, 15, 20]"
        binary-state-sort
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">
              {{ props.row.name }}
            </q-td>
            <q-td key="sendEmail" :props="props">
              <div
                v-if="props.row.emailTemplate"
                class="text-bold text-secondary"
              >
                Yes
              </div>
              <div v-else class="text-dark">No</div>
            </q-td>
            <q-td key="emailTemplate" :props="props">
              {{ props.row.emailTemplate ? props.row.emailTemplate.name : '' }}
            </q-td>
            <q-td key="smsTemplate" :props="props">
              {{ props.row.smsTemplate ? props.row.smsTemplate.name : '' }}
            </q-td>
            <q-td key="children" :props="props">
              <div
                v-if="props.row.childrenCount > 0"
                class="text-info text-bold cursor-pointer"
                @click="props.expand = !props.expand"
              >
                {{ props.row.childrenCount }}
              </div>
              <div v-else>0</div>
            </q-td>
            <q-td key="options" :props="props">
              <q-btn
                v-if="canUpdateStatus"
                dense
                outline
                color="primary"
                size="sm"
                icon="edit"
                :to="{
                  name: 'status-detail',
                  params: { id: props.row.id },
                  query: { category: status.value }
                }"
              />
            </q-td>
          </q-tr>
          <q-tr v-if="props.expand" :props="props">
            <q-td colspan="100%">
              <div class="q-mx-auto" style="width: 80%;">
                <app-children-list
                  :statuses="props.row.children"
                  :category="status.value"
                  :canUpdateStatus="canUpdateStatus"
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
import AppSelectInput from '@client/components/form/select-input';
import { assessPermission } from '@server/lib/permission-helpers';
import AppChildrenList from './children-list';

const statusOptions = [
  {
    label: 'Quotes',
    value: 'QUOTE'
  },
  {
    label: 'Orders',
    value: 'ORDER'
  }
];

export default {
  name: 'AppStatuses',
  metaInfo: {
    title: 'AutoBook Pro - Statuses'
  },
  components: {
    AppSelectInput,
    AppChildrenList
  },
  data() {
    return {
      statuses: [],
      status: statusOptions[0],
      loading: false,
      columns: [
        {
          name: 'name',
          label: 'Name',
          align: 'left',
          sortable: true
        },
        {
          name: 'sendEmail',
          label: 'Send Email',
          align: 'left'
        },
        {
          name: 'emailTemplate',
          label: 'Email',
          align: 'left'
        },
        {
          name: 'smsTemplate',
          label: 'SMS',
          align: 'left'
        },
        {
          name: 'children',
          label: 'Children',
          align: 'center'
        },
        {
          name: 'options',
          label: 'Options',
          align: 'center'
        }
      ],
      statusOptions
    };
  },
  apollo: {
    currentUser: {
      query: graphql.queries.currentUser
    },
    statuses: {
      query: graphql.queries.getParentStatus,
      variables() {
        return {
          type: this.status.value
        };
      },
      update: (data) => data.parentStatuses,
      watchLoading(isLoading) {
        this.loading = isLoading;
      },
      fetchPolicy: 'cache-and-network'
    }
  },
  computed: {
    canCreateStatus() {
      return assessPermission.status.canCreate(this.currentUser);
    },
    canUpdateStatus() {
      return assessPermission.status.canUpdate(this.currentUser);
    }
  },
  methods: {
    async deleteStatus(id) {
      try {
        await this.$apollo.mutate({
          mutation: graphql.mutations.deleteStatus,
          variables: { id },
          update: (store, { data: { deleteStatus } }) => {
            const data = store.readQuery({
              query: graphql.queries.getParentStatus,
              variables: {
                type: this.status.value
              }
            });
            data.parentStatuses = data.parentStatuses.filter(
              (e) => e.id !== deleteStatus.id
            );
            store.writeQuery({
              query: graphql.queries.getParentStatus,
              variables: { type: this.status.value },
              data
            });
          }
        });
        this.notifyPositive('Successfully status has been removed!');
      } catch (error) {
        this.notifyNegative(error.message);
      }
    }
  }
};
</script>
<style lang="scss"></style>
