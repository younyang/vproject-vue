// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import axios from 'axios'
import router from './router'
import Multiselect from 'vue-multiselect'
import VueHighcharts from 'vue-highcharts'


Vue.component('multiselect', Multiselect);
Vue.use(BootstrapVue);
Vue.use(VueHighcharts);

// axios instance
const ax = axios.create({
  baseURL: '/api',
  transformResponse: [function (data) {
    const origin = JSON.parse(data)
    return {
      result: origin.result,
      items: origin.resultData ? origin.resultData.data : [],
      pageInfo: origin.resultData ? origin.resultData.pageInfo : {},
      error: origin.error
    };
  }]
});

// axios chart instance
const axChart = axios.create({
  baseURL: '/api',
  headers: { 'x-vessel-appKey': '0fc75651-8fa5-4d13-a376-69384eacb315'}
});


Vue.prototype.$https = {
  get (url = '', params = {}){
    return ax.get(url, {
      params: params
    })
  },
  post (url = '', data = {}){
    return ax.post(url, data)
  },
  put (url = '', data = {}){
    return ax.put(url, data)
  },
  delete (url = ''){
    return ax.delete(url)
  },

  // Dashboard
  getChart (url = '', params = {}){
    return axChart.get(url, {
      params: params
    })
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
