<template>
  <q-table flat :data="statuses" :columns="columns" hide-pagination>
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="name" :props="props">
          {{ props.row.name }}
        </q-td>
        <q-td key="sendEmail" :props="props">
          <div v-if="props.row.emailTemplate" class="text-bold text-secondary">
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
              query: { category }
            }"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
export default {
  name: 'AppChildrenStatuses',
  props: ['statuses', 'category', 'canUpdateStatus'],
  data() {
    return {
      columns: [
        {
          name: 'name',
          label: 'Child Name',
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
          name: 'options',
          label: 'Options',
          align: 'center'
        }
      ]
    };
  }
};
</script>
<style lang="scss"></style>
