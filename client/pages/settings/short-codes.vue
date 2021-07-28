<template>
  <div class="autobookpro-page-content">
    <div style="max-width: 600px;" class="q-mt-md q-mx-auto">
      <q-card flat bordered>
        <q-card-section class="q-pa-sm row justify-between items-center">
          <div class="text-subtitle1 text-bold">
            <q-icon
              name="person"
              style="font-size: 25px; padding-right: 0.1rem;"
            />
            Short Codes
          </div>
          <q-btn
            outline
            label="Save"
            size="sm"
            :loading="savingShortCodes"
            @click="handleSaveShortCodes"
          />
        </q-card-section>

        <q-separator />
        <q-card-section v-if="!loadingShortCodes">
          <div
            class="row items-center q-col-gutter-x-sm"
            v-for="(shorCode, index) in shortCodeItems"
            :key="index"
          >
            <app-editable-input
              class="col"
              :data="shorCode.alias"
              type="text"
              text="Short Code *"
              name="alias"
              @input="handleShortCodeChange(index, $event)"
            />
            <app-select-input
              class="col"
              text="Quote Fields *"
              :value="shorCode.shortCode"
              :options="SHORTCODES"
              option-label="label"
              option-value="value"
              map-options
              emit-value
              @input="handleShortCodeChange(index, { name: 'shortCode', model: $event })"
            />
            <div>
              <q-btn
                dense
                size="sm"
                outline
                color="primary"
                icon="add"
                @click="handleAddShortCode(index)"
              />
            </div>
            <div
              :class="`${
                index !== 0 || (shortCodes && shortCodes.length > 0)
                  ? 'visible'
                  : 'invisible'
              }`"
            >
              <q-btn
                dense
                size="sm"
                outline
                color="negative"
                icon="delete"
                @click="handleDeleteShortCode(index)"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-section v-else>
          <div class="q-py-xs">
            <q-skeleton type="rect" height="32px" animation="fade" />
          </div>
          <div class="q-py-xs">
            <q-skeleton type="rect" height="32px" animation="fade" />
          </div>
          <div class="q-py-xs">
            <q-skeleton type="rect" height="32px" animation="fade" />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { data as SHORTCODES } from '@server/constants/placeholders';
import graphql from '@client/graphql';
import { sanitizeObject } from '@client/utils/object-helpers';
import AppEditableInput from '@client/components/form/editable-input';
import AppSelectInput from '@client/components/form/select-input';

export default {
  metaInfo: {
    title: 'AutoBook Pro - Short Codes'
  },
  components: {
    AppEditableInput,
    AppSelectInput
  },
  apollo: {
    currentUser: {
      query: graphql.queries.currentUser
    },
    shortCodes: {
      query: graphql.queries.getShortCodes,
      watchLoading(isLoading) {
        this.loadingShortCodes = isLoading;
      },
      error(error) {
        this.error = error;
      },
      result(result) {
        if (result.loading) return;

        if (result.data.shortCodes.length === 0) {
          this.shortCodeItems = [
            {
              alias: '',
              shortCode: ''
            }
          ];
        } else {
          this.shortCodeItems = result.data.shortCodes;
        }
      }
    }
  },
  data() {
    return {
      SHORTCODES,

      loadingShortCodes: false,
      error: null,
      savingShortCodes: false,

      deleted: [],
      shortCodeItems: []
    };
  },
  methods: {
    handleShortCodeChange(index, event) {
      this.shortCodeItems = this.shortCodeItems.map((d, i) => {
        if (index === i) {
          return {
            ...d,
            [event.name]: event.model
          };
        }
        return d;
      });
    },
    handleAddShortCode(index) {
      const data = [...this.shortCodeItems];
      data.splice(index + 1, 0, {
        alias: '',
        shortCode: ''
      });
      this.shortCodeItems = data;
    },
    handleDeleteShortCode(index) {
      if (this.shortCodeItems[index].id) {
        this.deleted.push(this.shortCodeItems[index].id);
      }

      const data = [...this.shortCodeItems];
      data.splice(index, 1);
      this.shortCodeItems = data;
    },
    async handleSaveShortCodes() {
      this.saving = true;

      try {
        if (this.deleted.length > 0) {
          await this.$apollo.mutate({
            mutation: graphql.mutations.deleteShortCodes,
            variables: {
              ids: this.deleted
            }
          });
        }

        const response = await this.$apollo.mutate({
          mutation: graphql.mutations.updateShortCodes,
          variables: {
            input: this.shortCodeItems
              .map((shortCodeItem) =>
                sanitizeObject({
                  id: shortCodeItem.id,
                  alias: shortCodeItem.alias,
                  shortCode: shortCodeItem.shortCode
                })
              )
          }
        });

        this.shortCodeItems = response.data.updateShortCodes;
        this.deleted = [];
        this.notifyPositive('Short Codes have been saved successfully!');
      } catch (error) {
        this.notifyNegative(error.message);
      }

      this.saving = false;
    }
  }
};
</script>

<style></style>
