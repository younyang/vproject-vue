import Vue from 'vue'
import Router from 'vue-router'
import lazyLoading from './lazyLoading'


// Containers
import Full from '@/containers/Full'
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
          component: lazyLoading('Dashboard')
        },
        {
          path: 'service',
          redirect: '/service/service',
          name: 'Service',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            { path: 'service',
              name: 'Service 관리',
              component: lazyLoading('services/service', true)
            },
            {
              path: 'service/create',
              name: 'Service 등록',
              component: lazyLoading('services/service/ServiceCreate')
            },
            {
              path: 'service/:id',
              name: 'Service 상세',
              redirect: '/service/service/:id/default',
              //component: lazyLoading('services/service/ServiceDetail'),
              component: {
                render (c) { return c('router-view') }
              },
              children: [
                { path: 'default',
                  title: '기본정보',
                  props: true,
                  component: lazyLoading('services/service/ServiceDefault')
                },
                { path: 'origin',
                  title: 'Origin',
                  props: true,
                  component: lazyLoading('services/service/ServiceOrigin')
                },
                { path: 'pop',
                  title: 'PoP',
                  props: true,
                  component: lazyLoading('services/service/ServicePop')
                },
                { path: 'ip',
                  title: 'IP Restriction',
                  props: true,
                  component: lazyLoading('services/service/ServiceIp')
                }
              ]
            },
            {
              path: 'bucket',
              name: 'Bucket 관리',
              component: lazyLoading('services/Bucket')
            },
            {
              path: 'account',
              name: 'Account 관리',
              component: lazyLoading('services/Account')
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
              component: lazyLoading('configuration/Edge')
            },
            {
              path: 'referrer',
              name: 'Referrer 관리',
              component: lazyLoading('configuration/referrer', true)
            },
            {
              path: 'referrer/create',
              name: 'Referrer 등록',
              component: lazyLoading('configuration/referrer/Create')
            },
            {
              path: 'referrer/:id',
              name: 'Referrer 상세',
              props: true,
              component: lazyLoading('configuration/referrer/Detail')
            },
            { path: 'pop',
              name: 'Pop 관리',
              component: lazyLoading('configuration/pop', true)
            },
            {
              path: 'pop/create',
              name: 'Pop 등록',
              component: lazyLoading('configuration/pop/PopCreate')
            },
            {
              path: 'pop/:id',
              redirect: '/configuration/pop/:id/default',
              name: 'Pop 상세',
              component: {
                render (c) { return c('router-view') }
              },
              children: [
                { path: 'default',
                  title: '기본정보',
                  props: true,
                  component: lazyLoading('configuration/pop/PopDetail')
                },
                { path: 'edge',
                  title: 'L/R, Edge',
                  props: true,
                  component: lazyLoading('configuration/pop/PopEdge')
                }
              ]
            }
          ]
        },
        {
          path: 'policy',
          redirect: '/policy/onetime',
          name: 'Policy',
          component: {
            render (c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'onetime',
              name: 'One-Time URL',
              component: lazyLoading('policy/Onetime')
            },
            {
              path: 'popPreference',
              name: 'PoP Preference',
              component: lazyLoading('policy/PopPreference')
            },
            {
              path: 'gtmConfig',
              name: 'GTM Config',
              component: lazyLoading('policy/GTMconfig')
            },
            {
              path: 'geoIp',
              name: 'GEO IP',
              component: lazyLoading('policy/GEOip')
            },
            {
              path: 'ipRestriction',
              name: 'IP Restriction',
              component: lazyLoading('policy/IPRestriction')
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
