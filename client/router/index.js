import Vue from 'vue';
import Router from 'vue-router';
import makeRoutes from './routes';

Vue.use(Router);

export default (apolloProvider) => new Router({
  mode: 'history',
  scrollBehavior: () => ({
    x: 0,
    y: 0
  }),
  routes: makeRoutes(apolloProvider)
});
