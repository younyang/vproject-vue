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


// baseURL settings
axios.defaults.baseURL = '/api';
axios.defaults.transformResponse = [function (data) {
  const origin = JSON.parse(data)
  return {
    result: origin.result,
    items: origin.resultData ? origin.resultData.data : [],
    pageInfo: origin.resultData ? origin.resultData.pageInfo : {},
    error: origin.error
  };
}];

Vue.prototype.$https = {
  get (url = '', params = {}){
    return axios.get(url, {
      params: params
    })
  },
  post (url = '', data = {}){
    return axios.post(url, data)
  },
  put (url = '', data = {}){
    return axios.put(url, data)
  },
  delete (url = ''){
    return axios.delete(url)
  }
};



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
