<template>
  <q-card flat bordered>
    <q-card-section class="q-pa-sm">
      <div class="text-subtitle1 text-bold">
        <q-icon name="notes" style="font-size: 25px; padding-right: 0.1rem;" />
        {{ title }}
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <q-input
        v-model="note"
        rows="5"
        ref="noteEditor"
        :label="editorTitle"
        type="textarea"
        @keyup="keyUp"
        @keydown="keyDown"
        :disable="readonly || loadingData"
        hint="Enter to save note, CTRL & Enter to move to the next line"
      >
        <template #loading>
          <q-spinner-gears />
        </template>
      </q-input>

      <div v-if="!loadingData">
        <div
          class="q-mt-sm row q-col-gutter-x-sm"
          v-for="(internalNote, index) in value"
          :key="index"
        >
          <div class="text-subtitle2 col-10" style="overflow-wrap: break-word;">
            {{ internalNote.note }}
          </div>
          <div class="col-2 row justify-end">
            <q-btn
              v-if="!readonly && action !== 'create'"
              flat
              dense
              size="xs"
              icon="edit"
              @click="handleEditClick(internalNote)"
            />
            <q-btn
              v-if="!readonly"
              flat
              dense
              size="xs"
              icon="delete"
              @click="handleDeleteClick(index)"
            />
          </div>
        </div>
      </div>
      <div v-else>
        <div class="q-py-xs">
          <q-skeleton type="rect" animation="fade" />
        </div>
        <div class="q-py-xs">
          <q-skeleton type="rect" animation="fade" />
        </div>
        <div class="q-py-xs">
          <q-skeleton type="rect" animation="fade" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script>
export default {
  name: 'AppInternalNotesCard',
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
    title: String,
    context: String,
    readonly: Boolean,
    action: String,
    saving: Boolean
  },
  data() {
    return {
      note: null,
      editorTitle: 'New internal note',

      noteIdInEditing: null,

      position: 0,
      ctlLeftPressed: false
    };
  },
  methods: {
    keyDown(event) {
      if (event.keyCode === 17) {
        this.ctlLeftPressed = true;
      }
    },
    keyUp(event) {
      if (event.keyCode === 17) {
        this.ctlLeftPressed = false;
      }
      if (!this.ctlLeftPressed && event.keyCode === 13) {
        if (this.noteIdInEditing) {
          this.$emit(
            'input',
            this.value.map((note) => {
              if (note.id !== this.noteIdInEditing) return note;
              return { ...note, note: this.note };
            })
          );

          if (this.action === 'view') {
            this.$emit('update', this.noteIdInEditing, event.target.value);
          }
          this.noteIdInEditing = null;
        } else {
          this.$emit(
            'input',
            this.value.concat({
              note: event.target.value
            })
          );

          if (this.action === 'view') {
            this.$emit('add', event.target.value);
          }
        }
        this.note = null;
      }
      if (this.ctlLeftPressed && event.keyCode === 13) {
        this.note = `${this.note}\n`;
      }
    },
    async handleDeleteClick(id) {
      this.$emit(
        'input',
        this.value.filter((_, index) => index !== id)
      );

      if (this.action === 'view') {
        this.$emit('delete', this.value[id].id);
      }
    },
    handleEditClick(value) {
      const { id, note } = value;
      this.editorTitle = 'Edit internal note';
      this.note = note;
      this.noteIdInEditing = id;
    },
    scrollTop() {
      this.$refs.scrollArea.setScrollPosition(this.position, 0);
      this.position = 0;
    }
  }
};
</script>
<style lang="scss"></style>
