<template>
  <q-card style="min-width: 560px;">
    <q-card-section class="text-center">
      <div class="text-h6 text-weight-medium">
        Select a carrier
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <q-input
        class="q-mb-sm"
        dense
        placeholder="Seach"
        v-model.lazy="carrierSearch"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-list>
        <q-item>
          <q-item-section class="text-bold text-center">
            Carrier Name
          </q-item-section>
          <q-item-section class="text-bold text-center">
            MC Number
          </q-item-section>
          <q-item-section class="text-bold text-center">
            Location
          </q-item-section>
          <q-item-section class="text-bold text-center">#</q-item-section>
        </q-item>
      </q-list>
      <q-scroll-area style="height: 68vh;">
        <q-list dense v-for="carrier in filteredCarriers" :key="carrier.id">
          <q-item class="q-py-xs">
            <q-item-section class="text-center">
              {{ carrier.companyName }}
            </q-item-section>
            <q-item-section class="text-center">
              {{ carrier.mcNumber }}
            </q-item-section>
            <q-item-section class="text-center">
              {{ carrier.city }}, {{ carrier.state }},{{ carrier.zipcode }}
            </q-item-section>
            <q-item-section class="text-center">
              <q-btn
                dense
                outline
                label="Select"
                color="primary"
                @click="$emit('select', carrier)"
              ></q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-card-section>
    <q-separator />
    <q-card-actions align="right">
      <q-btn
        outline
        label="Add Carrier"
        color="primary"
        @click="$emit('add')"
      />
    </q-card-actions>
  </q-card>
</template>
<script>
import graphql from '@client/graphql';

export default {
  name: 'AppDispatchToCarrierDialogCarrierList',
  apollo: {
    carriers: {
      query: graphql.queries.getCarriers
    }
  },
  data() {
    return {
      carrierSearch: ''
    };
  },
  computed: {
    filteredCarriers() {
      if (!this.carrierSearch) return this.carriers;

      return this.carriers.filter((carrier) => {
        if (carrier.companyName.indexOf(this.carrierSearch) !== -1) return true;
        if (carrier.mcNumber.indexOf(this.carrierSearch) !== -1) {
          return true;
        }
        return false;
      });
    }
  }
};
</script>
