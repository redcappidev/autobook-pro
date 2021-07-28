<template>
  <q-card flat bordered>
    <q-card-section class="q-gutter-y-sm">
      <div class="row justify-end q-mt-none">
        <q-input
          style="min-width: 300px;"
          color="primary"
          :value="value.search"
          debounce="500"
          label="Search"
          dense
          @input="$emit('input', { ...value, search: $event })"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="row q-gutter-x-sm">
        <q-select
          dense
          label="Timezones"
          clearable
          :value="value.timezone"
          :options="timezoneOptions"
          style="min-width: 150px;"
          @input="$emit('input', { ...value, timezone: $event })"
        />
        <q-select
          style="min-width: 150px;"
          dense
          clearable
          label="Engagements"
          multiple
          emit-value
          map-options
          :value="value.engagements"
          :options="QUOTE_ENGAGEMENTS"
          option-value="value"
          @input="$emit('input', { ...value, engagements: $event })"
        >
          <template #selected-item="scope">
            <q-icon
              :name="scope.opt.icon"
              color="negative"
              size="sm"
              class="q-pa-xs"
            />
          </template>
          <template #option="scope">
            <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
              <q-item-section avatar>
                <q-icon :name="scope.opt.icon" size="md" />
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-select
          dense
          use-input
          clearable
          label="Status"
          emit-value
          map-options
          :value="value.parentStatusId"
          :options="parentStatusOptions"
          :loading="loadingParentStatus"
          option-label="name"
          option-value="id"
          @filter="filterParentStatusFn"
          @input="$emit('input', { ...value, parentStatusId: $event })"
        />
        <q-select
          dense
          use-input
          clearable
          label="Child Status"
          emit-value
          map-options
          :value="value.childStatusId"
          :options="childStatusOptions"
          option-label="name"
          option-value="id"
          @filter="filterChildStatusFn"
          @input="$emit('input', { ...value, childStatusId: $event })"
        />
        <q-select
          dense
          style="min-width: 150px;"
          emit-value
          map-options
          :value="value.assigneeId"
          label="Assignee"
          :options="
            [{ id: null, firstName: 'All', lastName: '' }].concat(users)
          "
          option-value="id"
          :option-label="(item) => `${item.firstName} ${item.lastName}`"
          @input="
            $emit('input', {
              ...value,
              assigneeId: $event
            })
          "
        />
        <q-select
          v-if="selectedQuotes.length > 0"
          dense
          style="min-width: 150px;"
          emit-value
          map-options
          v-model="selectedAssignee"
          label="Re-assign"
          :options="users"
          option-value="id"
          :option-label="(item) => `${item.firstName} ${item.lastName}`"
          :loading="reassigning"
          @input="$emit('reassign', $event)"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import graphql from '@client/graphql';
import { QUOTE_ENGAGEMENTS } from '@server/constants';

export default {
  name: 'AppQuotesFilter',
  props: {
    value: Object,
    context: String,
    selectedQuotes: Array,
    reassigning: Boolean
  },
  apollo: {
    users: {
      query: graphql.queries.loadUsers
    },
    parentStatuses: {
      query: graphql.queries.getParentStatus,
      variables() {
        return { type: this.context === 'quote' ? 'QUOTE' : 'ORDER' };
      },
      watchLoading(isLoading) {
        this.loadingParentStatus = isLoading;
      },
      result(result) {
        if (result.loading) return;

        this.parentStatusOptions = result.data.parentStatuses;
        const parentStatus = this.parentStatusOptions.find(
          (s) => s.id === this.value.parentStatusId
        );
        this.childStatusOptions = parentStatus ? parentStatus.children : [];
      }
    }
  },
  data() {
    return {
      selectedAssignee: null,
      loadingParentStatus: false,
      parentStatusOptions: [],
      childStatusOptions: [],
      timezoneOptions: ['EST', 'CST', 'MT', 'PST'],
      QUOTE_ENGAGEMENTS
    };
  },
  watch: {
    selectedQuotes: function (newVal) {
      if (newVal.length === 0) {
        this.selectedAssignee = null;
      }
    }
  },
  methods: {
    filterParentStatusFn(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.parentStatusOptions = this.parentStatuses.filter(
          (v) => v.name.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    filterChildStatusFn(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        const parentStatus = this.parentStatuses.find(
          (s) => s.id === this.value.parentStatusId
        );
        this.childStatusOptions = parentStatus
          ? parentStatus.children.filter(
              (v) => v.name.toLowerCase().indexOf(needle) > -1
            )
          : [];
      });
    }
  }
};
</script>

<style></style>
