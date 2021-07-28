<template>
  <div>
    <q-select
      style="min-width: 300px;"
      use-input
      input-debounce="500"
      v-model="search"
      :options="options"
      :option-label="(item) => ''"
      option-value="id"
      color="secondary"
      dense
      hide-dropdown-icon
      borderless
      label="Search"
      @filter="filterFn"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template #option="scope">
        <q-item
          v-bind="scope.itemProps"
          v-on="scope.itemEvents"
          @click="handleClickItem(scope.opt)"
          :to="`${scope.opt.isOrder ? '/orders/' : '/quotes/'}${
            scope.opt.id
          }?edit=true`"
        >
          <q-item-section>
            <q-item-label>
              <div>
                {{
                  `${scope.opt.isOrder ? 'Order' : 'Quote'} #${scope.opt.id} `
                }}
              </div>
              <div>
                {{
                  `${scope.opt.shipper.firstName} ${
                    scope.opt.shipper.lastName || ''
                  } `
                }}
              </div>
              <div>
                {{ `${scope.opt.origin.city}, ${scope.opt.origin.state} to ` }}
                {{
                  `${scope.opt.destination.city}, ${scope.opt.destination.state}`
                }}
              </div>
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script>
import graphql from '@client/graphql';

export default {
  name: 'AppPowerSearchInput',
  data() {
    return {
      search: null,
      options: []
    };
  },
  methods: {
    handleClickItem() {
      this.$nextTick(() => {
        this.search = null;
      });
    },
    async filterFn(val, update) {
      if (!val) {
        update(() => {
          this.options = [];
        });
      } else {
        const res = await this.$apollo.query({
          query: graphql.queries.powerSearch,
          variables: { search: val }
        });

        update(() => {
          this.options = res.data.powerSearch;
        });
      }
    }
  }
};
</script>

<style></style>
