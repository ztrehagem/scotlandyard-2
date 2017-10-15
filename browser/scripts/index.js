import Vue from 'vue';
import VueRouter from 'vue-router';
import { routes } from './modules/routes';

Vue.use(VueRouter);

const app = new Vue({
  el: '#vue-app-root',
  router: new VueRouter({routes}),
  // template: '<app-root></app-root>',
  // components: {
  //   AppRoot,
  // },
});
