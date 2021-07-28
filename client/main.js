import Vue from 'vue';
import Vuelidate from 'vuelidate';
import VueMeta from 'vue-meta';
import CalendarPlugin from '@quasar/quasar-ui-qcalendar';
import App from './App';
import store from './store';
import makeRouter from './router';
import boot from './boot';
import apolloProvider from './apollo-provider';
import globalMixin from './mixins/global';
import '@quasar/quasar-ui-qcalendar/dist/index.css';

import './scss/index.scss';

window.Vue = Vue;

/* eslint-disable-next-line */
require('./assets/quasar.umd.min.js');

Vue.use(CalendarPlugin);
Vue.config.productionTip = false;
Vue.mixin(globalMixin);

Vue.use(Vuelidate);

Vue.use(VueMeta, {
  refreshOnceOnNavigation: true
});

const router = makeRouter(apolloProvider);

const app = new Vue({
  el: '#q-app',
  store,
  router,
  apolloProvider,
  components: { App },
  template: '<App/>'
});

boot([], {
  Vue,
  app,
  router,
  store
});
