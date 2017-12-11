// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import axios from 'axios'
import router from './router'
import Multiselect from 'vue-multiselect'

Vue.component('multiselect', Multiselect);
Vue.use(BootstrapVue);
Vue.prototype.$https = axios;

// baseURL settings
Vue.prototype.$https.defaults.baseURL = '/api';


Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
});

Vue.filter('lowercase', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.toLowerCase()
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
})
