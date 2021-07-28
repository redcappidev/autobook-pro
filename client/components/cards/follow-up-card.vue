<template>
  <q-card flat bordered>
    <q-card-section class="q-pa-sm bg-primary">
      <div class="text-subtitle1 text-bold">
        <q-icon
          name="schedule"
          style="font-size: 25px; padding-right: 0.1rem;"
        />
        Follow Up
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section class="q-pa-none row justify-center">
      <q-date
        class="full-width"
        :value="value.map((e) => e.followupOn)"
        multiple
        minimal
        flat
        :options="optionsFn"
        mask="YYYY-MM-DD"
        :disabled="saving || loadingData || readonly"
        @input="handleChange"
      />
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'AppFollowUpCard',
  props: {
    loadingData: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: function () {
        return [];
      }
    },
    context: String,
    readonly: Boolean,
    action: String,
    saving: Boolean
  },
  methods: {
    optionsFn(date) {
      const today = new Date();
      return new Date(date).getTime() > today.getTime();
    },
    handleChange(value) {
      this.$emit(
        'input',
        (value || []).map((e) => ({ followupOn: e }))
      );

      if (this.action === 'view') {
        this.$emit('update');
      }
    }
  }
};
</script>
<style lang="scss"></style>
