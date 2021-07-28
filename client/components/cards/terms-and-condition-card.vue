<template>
  <q-card flat bordered>
    <q-card-section class="q-pa-sm bg-primary" v-if="context !== 'book'">
      <div class="text-subtitle1 text-bold">
        <q-icon
          name="thumb_up_alt"
          style="font-size: 25px; padding-right: 0.1rem;"
        />
        Terms and Conditions
      </div>
    </q-card-section>
    <q-separator v-if="context !== 'book'" />

    <q-card-section v-if="context === 'book'">
      <div v-html="tosContent"></div>
    </q-card-section>

    <q-card-section v-if="context === 'book'">
      <div class="q-gutter-y-sm">
        <q-field dense :error="validation.accepted.$error" hide-bottom-space>
          <template #prepend>
            <span class="text-subtitle2"
              >Do you agree the terms and conditions? *</span
            >
          </template>
          <template #control>
            <q-checkbox
              dense
              :toggle-indeterminate="false"
              :value="value.accepted || false"
              @input="
                $emit('input', { ...value, accepted: $event });
                delayTouch(validation.accepted, $options.touchMap);
              "
            />
          </template>
        </q-field>
        <app-editable-input
          :data="value.eName"
          text="Type Your Name *"
          name="eName"
          @input="
            $emit('input', { ...value, eName: $event.model });
            delayTouch(validation.eName, $options.touchMap);
          "
          :error="validation.eName.$error"
        />
        <q-field dense bottom-slots :error="validation.eSign.$error">
          <template #prepend>
            <span class="text-subtitle2">Signature *</span>
          </template>
          <template #control>
            <div style="width: 100%; height: 200px;">
              <app-drawable-area
                :value="value.eSign"
                @input="$emit('input', { ...value, eSign: $event })"
              />
            </div>
          </template>
          <template #hint>
            By signing you are agreeing with the terms of this transport.
          </template>
          <template #append>
            <q-btn
              flat
              icon="cancel"
              @click="$emit('input', { ...value, eSign: null })"
            />
          </template>
        </q-field>
      </div>
    </q-card-section>
    <q-card-section v-if="context === 'order' && !loadingData && value">
      <div class="row q-py-sm">
        <div class="col-4 text-grey-8 text-subtitle2">Signed By</div>
        <div class="col-8 q-pl-sm">{{ value.eName }}</div>
      </div>
      <q-separator />
      <div class="row q-py-sm">
        <div class="col-4 text-grey-8 text-subtitle2">Signed Date/Time</div>
        <div class="col-8 q-pl-sm">{{ value.signedAt | localTime }}</div>
      </div>
      <q-separator />
      <div class="row q-py-sm">
        <div class="col-4 text-grey-8 text-subtitle2">Signed at IP Address</div>
        <div class="col-8 q-pl-sm">{{ value.clientIp }}</div>
      </div>
      <q-separator />
      <!-- <div class="row q-py-sm">
        <div class="col-2">Terms & Conditions Agreed To</div>
        <div class="col-10 q-pl-sm">
          <div v-html="tosContent"></div>
        </div>
      </div>
      <q-separator /> -->
      <div class="row q-py-sm">
        <div class="col-12 text-grey-8 text-subtitle2">Signature</div>
        <div class="col-12" style="height: 200px;">
          <app-drawable-area :value="value.eSign" :disable="true" />
        </div>
      </div>
    </q-card-section>
    <q-card-section v-if="loadingData">
      <q-skeleton type="rect" height="80px" animation="fade" />
    </q-card-section>
  </q-card>
</template>

<script>
import AppDrawableArea from '@client/components/form/drawable-area';
import AppEditableInput from '@client/components/form/editable-input';
import tosContent from '@client/constants/tos';

export default {
  name: 'AppTermsAndConditionCard',
  props: {
    loadingData: {
      type: Boolean,
      default: false
    },
    context: String,
    value: {
      type: Object,
      default: function () {
        return {};
      }
    },
    validation: Object
  },
  components: {
    AppEditableInput,
    AppDrawableArea
  },
  data() {
    return {
      tosContent
    };
  },
  methods: {
    handleChangeInput(value) {
      const { name, model } = value;
      this.$set(this.saving, name, true);
      this[name] = model;
      this.$set(this.saving, name, false);
    }
  }
};
</script>
<style lang="scss"></style>
