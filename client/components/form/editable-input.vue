<template>
  <div v-if="!loadingData">
    <q-input
      ref="input"
      class="q-pa-none"
      v-bind="$attrs"
      :value="data"
      dense
      :type="type"
      @input="handleChange"
      @blur="$emit('blur', $event)"
    >
      <template v-slot:prepend>
        <template v-if="icon">
          <a :href="`rcmobile://call?number=${data}`" v-if="type === 'tel'">
            <q-icon :name="icon" color="primary" class="cursor-pointer" />
          </a>
          <q-icon :name="icon" color="inherit" v-else />
        </template>
        <template v-if="text">
          <!-- <a :href="`rcmobile://call?number=${data}`" style="text-decoration: none; min-width: 5rem; padding-bottom: 8px;" v-if="type === 'tel' && !disablePhoneCall"> -->
            <span
              v-if="type === 'tel' && !disablePhoneCall"
              class="cursor-pointer text-subtitle2"
              :class="`${textColor ? `text-${textColor}` : 'text-primary'}`"
              style="min-width: 5rem;"
              @click="handleDialPhone"
            >
              {{ text }}
            </span>
          <!-- </a> -->
          <span
            v-else
            class="text-subtitle2"
            :class="`${textColor ? `text-${textColor}` : ''}`"
            style="min-width: 5rem;"
          >
            {{ text }}
          </span>
        </template>
      </template>
      <template v-slot:append>
        <slot name="append"></slot>
      </template>
    </q-input>
  </div>
  <div class="q-py-xs" v-else>
    <q-skeleton type="rect" height="32px" animation="fade" />
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  props: {
    loadingData: Boolean,
    data: [String, Number],
    name: String,
    icon: String,
    text: String,
    textColor: String,
    type: {
      type: String,
      default: 'text'
    },
    disablePhoneCall: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleChange(value) {
      this.$emit('input', { name: this.name, model: value });
    },
    handleDialPhone() {
      window.open(`rcmobile://call?number=${this.data}`);
    }
  }
};
</script>
