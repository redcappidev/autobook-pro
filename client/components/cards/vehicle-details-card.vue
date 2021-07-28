<template>
  <q-card flat bordered>
    <q-card-section class="q-pa-sm row bg-primary justify-between items-center">
      <div class="text-subtitle1 text-bold">
        <q-icon
          name="directions_car"
          style="font-size: 25px; padding-right: 0.1rem;"
        />
        Vehicle Details
      </div>
      <q-btn
        outline
        label="Add Vehicle"
        size="sm"
        @click="handleAdd"
        v-if="!readonly"
      />
    </q-card-section>
    <q-separator />
    <q-card-section>
      <div
        class="q-pa-sm"
        v-for="(vehicle, index) in validation.$each.$iter"
        :key="index"
      >
        <div class="row justify-between q-px-md">
          <div class="text-subtitle1 row items-center q-gutter-x-sm">
            <span>Vehicle # {{ +index + 1 }}</span>
            <a
              v-if="
                value[index].year && value[index].make && value[index].model
              "
              class="text-primary"
              :href="`javascript:NewWindow=window.open('http://images.google.com/images?q=${value[index].year}+${value[index].make}+${value[index].model}','GoogleImg','width=800,height=600,left=0,top=0, toolbar=No,location=No,scrollbars=Yes,status=No,resizable=Yes,fullscreen=No,directories=No,menubar=No,copyhistory=No'); NewWindow.focus(); void(0);`"
            >
              <q-icon name="launch" />
            </a>
          </div>
          <div class="row">
            <div v-if="!readonly && action === 'view' && !readWrite[index]">
              <q-btn
                flat
                size="sm"
                icon="edit"
                color="secondary"
                @click="handleEdit(+index)"
                :disable="saving.index !== -1"
              />
            </div>
            <q-btn
              v-if="action === 'view' && readWrite[index]"
              flat
              round
              size="sm"
              icon="check"
              color="primary"
              @click="handleSave(+index)"
              :loading="saving.index === +index"
              :disable="saving.index !== -1 && saving.index !== +index"
            />
            <q-btn
              v-if="
                action === 'view' && readWrite[index] && index < value.length
              "
              flat
              round
              size="sm"
              icon="close"
              color="red"
              @click="handleCancel(+index)"
              :disable="saving.index !== -1"
            />

            <q-btn
              v-if="index > 0"
              flat
              round
              size="sm"
              icon="delete"
              color="dark"
              @click="handleDelete(+index)"
              :disable="saving.index !== -1"
            />
          </div>
        </div>
        <q-separator></q-separator>
        <div :class="size === 'sm' || 'row'">
          <div class="col">
            <app-select-input
              :loadingData="loadingData"
              class="q-px-sm"
              dense
              label="Year *"
              :value="value[index].year"
              :options="years"
              :loading="
                loadingOptions[index] ? loadingOptions[index].year : false
              "
              :disable="action === 'view' && saving.index !== -1"
              :readonly="readonly || (action === 'view' && !readWrite[index])"
              @input="
                delayTouch(vehicle.year, $options.touchMap);
                handleSelectChange(+index, 'year', $event);
              "
              :error="vehicle.year.$error"
            />
          </div>
          <div class="col">
            <app-select-input
              :loadingData="loadingData"
              class="q-px-sm"
              dense
              use-input
              label="Make *"
              :value="value[index].make"
              :options="filteredMakes[index]"
              :disable="
                !value[index].year || (action === 'view' && saving.index !== -1)
              "
              :readonly="readonly || (action === 'view' && !readWrite[index])"
              :loading="
                loadingOptions[index] ? loadingOptions[index].make : false
              "
              @filter="filterMakeFn(+index, ...arguments)"
              @input="
                delayTouch(vehicle.make, $options.touchMap);
                handleSelectChange(+index, 'make', $event);
              "
              :error="vehicle.make.$error"
            />
          </div>
          <div class="col">
            <app-select-input
              :loadingData="loadingData"
              dense
              use-input
              label="Model *"
              class="q-px-sm"
              :value="value[index].model"
              :options="filteredModels[index]"
              :disable="
                !value[index].year ||
                !value[index].make ||
                (action === 'view' && saving.index !== -1)
              "
              :readonly="readonly || (action === 'view' && !readWrite[index])"
              :loading="
                loadingOptions[index] ? loadingOptions[index].model : false
              "
              @filter="filterModelFn(+index, ...arguments)"
              @input="
                delayTouch(vehicle.model, $options.touchMap);
                handleSelectChange(+index, 'model', $event);
              "
              :error="vehicle.model.$error"
            />
          </div>
          <div class="col" v-if="context === 'order'">
            <app-select-input
              :loadingData="loadingData"
              dense
              label="Size *"
              class="q-px-sm"
              :value="value[index].size"
              :readonly="readonly || (action === 'view' && !readWrite[index])"
              :options="sizeOptions"
              option-label="name"
              option-value="id"
              @filter="filterSizeFn"
              @input="
                delayTouch(vehicle.size, $options.touchMap);
                handleSelectChange(+index, 'size', $event);
              "
              :error="vehicle.size.$error"
            />
          </div>
          <div class="col">
            <app-select-input
              :loadingData="loadingData"
              dense
              label="Operable *"
              class="q-px-sm"
              :value="value[index].operable"
              :options="operableOptions"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              :readonly="readonly || (action === 'view' && !readWrite[index])"
              @input="
                delayTouch(vehicle.operable, $options.touchMap);
                handleSelectChange(+index, 'operable', $event);
              "
              :error="vehicle.operable.$error"
            />
          </div>
        </div>
        <div class="row" v-if="context === 'order'">
          <div class="col">
            <app-editable-input
              :loadingData="loadingData"
              label="Color"
              class="q-px-sm"
              name="color"
              :data="value[index].color"
              :readonly="readonly || (action === 'view' && !readWrite[index])"
              @input="handleSelectChange(+index, $event.name, $event.model)"
            />
          </div>
          <div class="col">
            <app-editable-input
              :loadingData="loadingData"
              label="Plate"
              class="q-px-sm"
              name="plate"
              :data="value[index].plate"
              :readonly="readonly || (action === 'view' && !readWrite[index])"
              @input="handleSelectChange(+index, $event.name, $event.model)"
            />
          </div>
          <div class="col">
            <app-editable-input
              :loadingData="loadingData"
              label="State"
              class="q-px-sm"
              name="state"
              :data="value[index].state"
              :readonly="readonly || (action === 'view' && !readWrite[index])"
              @input="handleSelectChange(+index, $event.name, $event.model)"
            />
          </div>
          <div class="col">
            <app-editable-input
              :loadingData="loadingData"
              label="Vin"
              class="q-px-sm"
              name="vin"
              :data="value[index].vin"
              :readonly="readonly || (action === 'view' && !readWrite[index])"
              @input="handleSelectChange(+index, $event.name, $event.model)"
            />
          </div>
          <div class="col">
            <app-editable-input
              :loadingData="loadingData"
              label="Lot"
              class="q-px-sm"
              name="lot"
              :data="value[index].lot"
              :readonly="readonly || (action === 'view' && !readWrite[index])"
              @input="handleSelectChange(+index, $event.name, $event.model)"
            />
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script>
import { getYear } from 'date-fns';
import { RouteRunner } from '@client/third-party';
import graphql from '@client/graphql';
import AppEditableInput from '@client/components/form/editable-input';
import AppSelectInput from '@client/components/form/select-input';

export default {
  name: 'AppVehicleDetailsCard',
  props: {
    loadingData: {
      type: Boolean,
      default: false
    },
    value: Array,
    context: {
      type: String,
      default: 'quote'
    },
    readonly: Boolean,
    action: {
      type: String,
      default: 'create'
    },
    size: {
      type: String,
      default: 'md'
    },
    validation: Object,
    saving: {
      type: Object,
      default: function () {
        return { index: -1 };
      }
    }
  },
  components: {
    AppEditableInput,
    AppSelectInput
  },
  apollo: {
    vehicleSizes: {
      query: graphql.queries.getVehicleSizes,
      skip() {
        return this.context === 'book';
      }
    }
  },
  data() {
    return {
      buffer: [],
      readWrite: {},

      loadingOptions: [],
      makes: {},
      filteredMakes: {},
      models: {},
      filteredModels: {},
      sizeOptions: [],
      operableOptions: [
        {
          value: true,
          label: 'Yes'
        },
        {
          value: false,
          label: 'No'
        }
      ]
    };
  },
  computed: {
    years() {
      const years = [];
      const thisYear = getYear(new Date());
      for (let i = thisYear; i > 1936; i -= 1) {
        years.push(i);
      }
      return years;
    }
  },
  watch: {
    saving: function (newVal, oldVal) {
      if (newVal.index === -1 && oldVal.index !== -1) {
        this.$set(this.readWrite, oldVal.index, false);
      }
    }
  },
  methods: {
    handleAdd() {
      this.$emit(
        'input',
        this.value.concat({
          year: null,
          make: null,
          model: null
        })
      );
      this.$set(this.readWrite, this.value.length, true);
    },
    handleEdit(id) {
      this.buffer[id] = this.value[id];
      this.$set(this.readWrite, id, true);
    },
    handleCancel(id) {
      this.$emit(
        'input',
        this.value.map((v, index) => {
          if (index !== id) return v;
          return this.buffer[index];
        })
      );
      this.$set(this.readWrite, id, false);
    },
    handleDelete(id) {
      this.$emit(
        'input',
        this.value.filter((_, index) => index !== +id)
      );
    },
    handleSave(id) {
      if (this.validation.$each[id].$invalid) {
        this.validation.$each[id].$touch();
        this.notifyNegative('Vehicles has some invalid fields');
      } else if (this.action === 'view') {
        this.$emit('update', id);
      }
    },
    validateResponse(str) {
      const n = str.search('<b>Warning</b>:');
      if (n < 0) return true;
      return false;
    },
    convertHtmlToArray(str) {
      const words = str.split('<option value="').filter((el) => el !== '');
      const tmp = [];
      words.forEach((el) => {
        const elWord = el.split('</option>').filter((e) => e !== '');
        const data = elWord[0].split('">');
        tmp.push(data[0].trim());
      });
      return tmp;
    },
    async filterMakeFn(index, val, update) {
      if (!this.makes[index] || this.makes[index].length === 0) {
        const vehicle = this.value[index];
        const response = await RouteRunner.getMake(vehicle.year);
        if (response && this.validateResponse(response)) {
          this.makes[index] = this.convertHtmlToArray(response);
        } else {
          this.notifyNegative('Server connection error, please try it again');
        }
      }

      update(() => {
        const needle = val.toLowerCase();
        this.$set(
          this.filteredMakes,
          index,
          this.makes[index].filter(
            (make) => make.toLowerCase().indexOf(needle) > -1
          )
        );
      });
    },
    async filterModelFn(index, val, update) {
      if (!this.models[index] || this.models[index].length === 0) {
        const vehicle = this.value[index];
        const response = await RouteRunner.getModel(vehicle.year, vehicle.make);
        if (response && this.validateResponse(response)) {
          this.models[index] = this.convertHtmlToArray(response);
        } else {
          this.notifyNegative('Server connection error, please try it again');
        }
      }

      update(() => {
        const needle = val.toLowerCase();
        this.$set(
          this.filteredModels,
          index,
          this.models[index].filter(
            (model) => model.toLowerCase().indexOf(needle) > -1
          )
        );
      });
    },
    filterSizeFn(val, update) {
      this.loadingtype = false;
      update(() => {
        const needle = val.toLowerCase();
        this.sizeOptions = this.vehicleSizes.filter(
          (v) => v.name.toLowerCase().indexOf(needle) > -1
        );
        this.loadingtype = false;
      });
    },
    async handleSelectChange(id, name, value) {
      const vehicles = this.value;
      try {
        if (name === 'year') {
          const newVehicles = vehicles.map((v, index) => {
            if (index !== id) return v;
            return { ...v, year: value, make: '', model: '' };
          });
          this.$emit('input', newVehicles);
          this.validation.$each.$iter[id].make.$reset();
          this.validation.$each.$iter[id].model.$reset();

          this.$set(this.loadingOptions, id, {
            ...this.loadingOptions[id],
            make: true
          });

          const response = await RouteRunner.getMake(value);
          if (response && this.validateResponse(response)) {
            this.makes[id] = this.convertHtmlToArray(response);
          } else {
            this.notifyNegative('Server connection error, please try it again');
          }

          this.models[id] = [];

          this.$set(this.loadingOptions, id, {
            ...this.loadingOptions[id],
            make: false
          });
        } else if (name === 'make') {
          const newVehicles = vehicles.map((v, index) => {
            if (index !== id) return v;
            return { ...v, make: value, model: '' };
          });
          this.$emit('input', newVehicles);
          this.validation.$each.$iter[id].model.$reset();

          this.$set(this.loadingOptions, id, {
            ...this.loadingOptions[id],
            model: true
          });

          const vehicle = this.value.find((_, index) => index === id);
          const response = await RouteRunner.getModel(vehicle.year, value);
          if (response && this.validateResponse(response)) {
            this.models[id] = this.convertHtmlToArray(response);
          } else {
            this.notifyNegative('Server connection error, please try it again');
          }

          this.$set(this.loadingOptions, id, {
            ...this.loadingOptions[id],
            model: false
          });
        } else if (name === 'model') {
          const newVehicles = vehicles.map((v, index) => {
            if (index !== id) return v;
            return { operable: true, ...v, model: value };
          });
          this.$emit('input', newVehicles);
        } else {
          const newVehicles = vehicles.map((v, index) => {
            if (index !== id) return v;
            return { ...v, [name]: value };
          });
          this.$emit('input', newVehicles);
        }
      } catch (error) {
        this.notifyNegative(error.message);
      }
    }
  }
};
</script>
<style lang="scss" scoped></style>
