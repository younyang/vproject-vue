import Vue from 'vue'
import Router from 'vue-router'

// Containers
import Full from '@/containers/Full'

// Views
import Dashboard from '@/views/Dashboard'
import { Services, ServicesDetail, Bucket, Account } from '@/views/services/'
import { Edge, Referrer, Pop } from '@/views/configuration/'
import Process from '@/views/Process'
import Map from '@/views/Map'
import GridUI from '@/views/GridUI'

Vue.use(Router)

export default new Router({
  mode: 'hash', // Demo is living in GitHub.io, so required!
  linkActiveClass: 'open active',
  scrollBehavior: function(){
    return { y: 0 }
  },
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: Full,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'service',
          redirect: '/service/service',
          name: 'Service',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'service',
              name: 'Service 관리',
              component: Services
            },
            {
              path: 'service/:id',
              name: 'Service 관리',
              component: ServicesDetail
            },
            {
              path: 'bucket',
              name: 'Bucket 관리',
              component: Bucket
            },
            {
              path: 'account',
              name: 'Account 관리',
              component: Account
            }
          ]
        },
        {
          path: 'configuration',
          redirect: '/configuration/edge',
          name: 'Configuration',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'edge',
              name: 'Edge 관리',
              component: Edge
            },
            {
              path: 'referrer',
              name: 'Referrer 관리',
              component: Referrer
            },
            {
              path: 'pop',
              name: 'Pop 관리',
              component: Pop
            }
          ]
        },
        {
          path: 'process',
          name: 'Process',
          component: Process
        },
        {
          path: 'map',
          name: 'Map',
          component: Map
        },
        {
          path: 'gridUI',
          name: 'Grid UI',
          component: GridUI
        }
      ]
    }
  ]
})
