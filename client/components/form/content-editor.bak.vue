<template>
  <q-editor
    v-model="editor"
    ref="editor"
    :dense="$q.screen.lt.md"
    :fonts="fonts"
    :toolbar="toolbar"
    @input="handleEditorChange"
  >
    <template v-slot:selectors>
      <div ref="selectors" class="row inline">
        <q-select
          dense
          use-input
          hide-selected
          fill-input
          v-model="placeholderModel"
          :options="placeholderOptions"
          :option-label="(item) => item.label"
          :option-value="(item) => item.value"
          @input="(e) => handleSelectChange(e)"
          input-debounce="0"
          class="editor-select text-bold"
          behavior="menu"
          placeholder="Quote Fields"
        />
      </div>
    </template>
  </q-editor>
</template>
<script>
import { stringToHTML } from '@client/utils/data-format';
import { data as placeholderData } from '@server/constants/placeholders';

export default {
  name: 'AppContentEditor',
  props: ['data'],
  data() {
    return {
      editor: '',
      placeholderModel: {},
      placeholderOptions: placeholderData,
      idxPlaceholder: 0,
      placeholders: [],
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
  watch: {
    data: function (newVal) {
      this.editor = newVal;
    }
  },
  methods: {
    handleSelectChange(e) {
      this.idxPlaceholder += 1;
      const tmp = [...this.placeholders];
      tmp.push({
        id: this.idxPlaceholder,
        data: e
      });
      this.placeholders = tmp;
      const edit = this.$refs.editor;
      edit.caret.restore();
      edit.runCmd(
        'insertHTML',
        `<div id="editor_token_${e.id}_${this.idxPlaceholder}" class="editor_token row inline items-center" contenteditable="false">&nbsp;<span>${e.value}</span>&nbsp;</div>`
      );
      edit.focus();
      this.placeholderModel = {};
      this.priceAdjustmentModel = {};
    },
    handleEditorChange(value) {
      const dom = stringToHTML(value);
      const tmp = [];
      this.placeholders.forEach((el) => {
        const elDom = dom.getElementById(`editor_token_${el.data.id}_${el.id}`);
        if (elDom) {
          tmp.push(el);
        }
      });
      this.placeholders = tmp;
      this.$emit('onChange', {
        placeholders: this.placeholders,
        editorData: value
      });
      const edit = this.$refs.editor;
      edit.focus();
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
