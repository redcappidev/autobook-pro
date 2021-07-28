<template>
  <div class="autobookpro-page-content">
    <div style="max-width: 600px;" class="q-mt-md q-mx-auto">
      <q-toggle
        :value="darkMode"
        @input="handleChangeDarkMode"
        label="Dark Mode"
      />
      <div
        class="row items-center"
        v-for="(color, index) in theme"
        v-bind:key="index"
      >
        <q-input
          class="col-grow"
          v-model="color.model"
          :label="color.label"
          dense
        >
          <template v-slot:append>
            <q-icon name="colorize" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-color
                  :value="color.model"
                  @input="handleChangeColor(color.type, $event)"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <div
          :style="`width: 20px; height: 20px; background-color: ${color.model}`"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { colors } from 'quasar';

export default {
  metaInfo: {
    title: 'AutoBook Pro - General Settings'
  },
  data() {
    return {
      darkMode: localStorage.getItem('dark-mode') === 'true',
      theme: [
        {
          label: 'Primary Color',
          model: colors.getBrand('primary'),
          type: 'primary'
        },
        {
          label: 'Secondary Color',
          model: colors.getBrand('secondary'),
          type: 'secondary'
        },
        {
          label: 'Accent Color',
          model: colors.getBrand('accent'),
          type: 'accent'
        },
        {
          label: 'Dark Color',
          model: colors.getBrand('dark'),
          type: 'dark'
        },
        {
          label: 'Positive Color',
          model: colors.getBrand('positive'),
          type: 'positive'
        },
        {
          label: 'Negative Color',
          model: colors.getBrand('negative'),
          type: 'negative'
        },
        {
          label: 'Info Color',
          model: colors.getBrand('info'),
          type: 'info'
        },
        {
          label: 'Warning Color',
          model: colors.getBrand('warning'),
          type: 'warning'
        }
      ]
    };
  },
  methods: {
    handleChangeDarkMode(value) {
      this.darkMode = value;

      if (this.darkMode) {
        localStorage.setItem('dark-mode', 'true');
        this.$q.dark.set(true);
      } else {
        localStorage.setItem('dark-mode', 'false');
        this.$q.dark.set(false);
      }
    },
    handleChangeColor(type, value) {
      const types = [
        'primary',
        'secondary',
        'accent',
        'dark',
        'positive',
        'negative',
        'info',
        'warning'
      ];
      const index = types.indexOf(type);
      this.theme = this.theme.map((color, colorIndex) => {
        if (colorIndex !== index) return color;
        return {
          ...color,
          model: value
        };
      });
      colors.setBrand(type, value);
      localStorage.setItem(`${type}-color`, value);
    }
  }
};
</script>

<style></style>
