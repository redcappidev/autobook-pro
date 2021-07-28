<template>
  <q-editor
    ref="editor"
    :dense="$q.screen.lt.md"
    :fonts="fonts"
    :toolbar="toolbar"
    :value="value"
    @input="$emit('input', $event)"
  >
    <template v-slot:selectors>
      <div ref="selectors" class="row inline">
        <q-select
          dense
          use-input
          v-model="placeholder"
          :options="placeholders"
          option-label="label"
          option-value="value"
          @input="handleSelectChange"
          input-debounce="0"
          class="editor-select text-bold"
          placeholder="Quote Fields"
        />
      </div>
    </template>
  </q-editor>
</template>
<script>
import { data as placeholders } from '@server/constants/placeholders';

export default {
  name: 'AppContentEditor',
  props: ['value'],
  data() {
    return {
      placeholder: null,
      placeholders,

      fonts: {
        arial: 'Arial',
        arial_black: 'Arial Black',
        comic_sans: 'Comic Sans MS',
        courier_new: 'Courier New',
        impact: 'Impact',
        lucida_grande: 'Lucida Grande',
        times_new_roman: 'Times New Roman',
        verdana: 'Verdana'
      },

      toolbar: [
        [
          {
            label: this.$q.lang.editor.align,
            icon: this.$q.iconSet.editor.align,
            fixedLabel: true,
            list: 'only-icons',
            options: ['left', 'center', 'right', 'justify']
          },
          {
            label: this.$q.lang.editor.align,
            icon: this.$q.iconSet.editor.align,
            fixedLabel: true,
            options: ['left', 'center', 'right', 'justify']
          },
          {
            label: this.$q.lang.editor.formatting,
            icon: this.$q.iconSet.editor.formatting,
            list: 'no-icons',
            options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']
          },
          {
            label: this.$q.lang.editor.fontSize,
            icon: this.$q.iconSet.editor.fontSize,
            fixedLabel: true,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'size-1',
              'size-2',
              'size-3',
              'size-4',
              'size-5',
              'size-6',
              'size-7'
            ]
          },
          {
            label: this.$q.lang.editor.defaultFont,
            icon: this.$q.iconSet.editor.font,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'default_font',
              'arial',
              'arial_black',
              'comic_sans',
              'courier_new',
              'impact',
              'lucida_grande',
              'times_new_roman',
              'verdana'
            ]
          },
          'removeFormat',
          'bold',
          'italic',
          'strike',
          'underline',
          'subscript',
          'superscript',
          'hr',
          'link',
          'quote',
          'unordered',
          'ordered',
          'outdent',
          'indent',
          'selectors'
        ],
        ['undo', 'redo'],
        ['viewsource', 'fullscreen']
      ]
    };
  },
  methods: {
    handleSelectChange(e) {
      this.$refs.editor.caret.restore();
      this.$emit('input', `${this.value} ${e.value}`);
      this.$refs.editor.focus();
      this.placeholder = null;
    }
  }
};
</script>
<style lang="scss">
.q-editor__toolbar {
  padding: 4px 0px;
  .q-editor__toolbar-group {
    a {
      margin: 2px;
      span {
        font-size: 14px;
      }

      i {
        font-size: 18px;
      }
    }
  }
}
.q-field.editor-select {
  font-size: 13px;
  padding: 4px 8px;
  .q-field__inner {
    .field__control {
      min-height: 30px;
    }
  }
}

.editor_token {
  font-size: 18px;
  font-weight: 400;
}
</style>
