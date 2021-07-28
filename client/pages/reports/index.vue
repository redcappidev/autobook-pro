<template>
  <div class="autobookpro-page-content">
    <q-input filled v-model="date" mask="date" :rules="['date']">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy
            ref="qDateProxy"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date v-model="date" range>
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>
<script>
export default {
  name: 'Reports',
  metaInfo: {
    title: 'AutoBook Pro - Report'
  },
  data() {
    return {
      date: '2019/02/01'
    };
  }
};
</script>
<style lang="scss"></style>
