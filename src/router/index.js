import Vue from 'vue'
import Router from 'vue-router'
import auth from '../auth'
import lazyLoading from './lazyLoading'

// Containers
import Full from '@/containers/Full'
Vue.use(Router)

const requireAuth = (to, from, next) => {
  if (!auth.loggedIn()) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

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
      beforeEnter: requireAuth,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: lazyLoading('dashboard/Dashboard')
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
              component: lazyLoading('services/service/Service')
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
              component: {
                render (c) { return c('router-view') }
              },
              children: [
                { path: 'default',
                  title: '기본정보',
                  props: true,
                  component: lazyLoading('services/service/ServiceDetailBase')
                },
                { path: 'origin',
                  title: 'Origin',
                  props: true,
                  component: lazyLoading('services/service/ServiceDetailOrigin')
                },
                { path: 'pop',
                  title: 'PoP',
                  props: true,
                  component: lazyLoading('services/service/ServiceDetailPop')
                },
                { path: 'ip',
                  title: 'IP Restriction',
                  props: true,
                  component: lazyLoading('services/service/ServiceDetailIpRestriction')
                }
              ]
            },
            {
              path: 'bucket',
              name: 'Bucket 관리',
              component: lazyLoading('services/bucket/Bucket')
            },
            {
              path: 'bucket/create',
              name: 'Bucket 등록',
              component: lazyLoading('services/bucket/BucketCreate')
            },
            {
              path: 'bucket/:id',
              name: 'Bucket 상세',
              props: true,
              component: lazyLoading('services/bucket/BucketDetail')
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
              component: lazyLoading('configuration/edge/Edge')
            },
            {
              path: 'edge/create',
              name: 'Edge 등록',
              component: lazyLoading('configuration/edge/EdgeCreate')
            },
            {
              path: 'edge/:id',
              redirect: '/configuration/edge/:id/default',
              name: 'Edge 상세',
              component: {
                render (c) { return c('router-view') }
              },
              children: [
                { path: 'default',
                  title: '기본정보',
                  props: true,
                  component: lazyLoading('configuration/edge/EdgeDetailBase')
                },
                { path: 'core',
                  title: 'Core Config',
                  props: true,
                  component: lazyLoading('configuration/edge/EdgeDetailCoreConfig')
                },
                { path: 'service',
                  title: 'Service',
                  props: true,
                  component: lazyLoading('configuration/edge/EdgeDetailService')
                }
              ]
            },
            {
              path: 'cache',
              name: 'Cache Throttling 관리',
              component: lazyLoading('configuration/edge/CacheThrottling')
            },
            {
              path: 'cache/create',
              name: 'Cache Throttling 등록',
              component: lazyLoading('configuration/edge/CacheThrottlingCreate')
            },
            {
              path: 'cache/:id',
              name: 'Cache Throttling 상세',
              props: true,
              component: lazyLoading('configuration/edge/CacheThrottlingDetail')
            },
            {
              path: 'referrer',
              name: 'Referrer 관리',
              component: lazyLoading('configuration/referrer/Referrer')
            },
            {
              path: 'referrer/create',
              name: 'Referrer 등록',
              component: lazyLoading('configuration/referrer/ReferrerCreate')
            },
            {
              path: 'referrer/:id',
              name: 'Referrer 상세',
              props: true,
              component: lazyLoading('configuration/referrer/ReferrerDetail')
            },
            {
              path: 'popPreference',
              name: 'PoP Preference',
              component: lazyLoading('configuration/referrer/PopPreference')
            },
            {
              path: 'ipRestriction',
              name: 'IP Restriction',
              component: lazyLoading('configuration/referrer/IpRestriction')
            },
            {
              path: 'geoIp',
              name: 'GEO IP',
              component: lazyLoading('configuration/referrer/GEOip')
            },
            {
              path: 'onetime',
              name: 'One-Time URL',
              component: lazyLoading('configuration/referrer/OnetimeUrl')
            },

            { path: 'pop',
              name: 'Pop 관리',
              component: lazyLoading('configuration/pop/Pop')
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
                  component: lazyLoading('configuration/pop/PopDetailBase')
                },
                { path: 'edge',
                  title: 'L/R, Edge',
                  props: true,
                  component: lazyLoading('configuration/pop/PopDetailEdge')
                }
              ]
            },
            {
              path: 'gtm',
              name: 'GTM 관리',
              component: lazyLoading('configuration/dns/GTM')
            }
          ]
        },
        {
          path: 'workflow',
          redirect: '/workflow/service',
          name: 'Workflow',
          component: {
            render (c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'service',
              name: 'Service Processing 관리',
              component: lazyLoading('workflow/service/ServiceProcess')
            },
            {
              path: 'service/:id',
              name: 'Service Processing 상세',
              props: true,
              component: lazyLoading('workflow/service/ServiceProcessDetail')
            },
            {
              path: 'domain',
              name: 'Domain Processing 관리',
              component: lazyLoading('workflow/domain/DomainProcess')
            },
            {
              path: 'contPreload',
              name: 'Preload',
              component: lazyLoading('workflow/content/Preload')
            },
            {
              path: 'contPreload/:id',
              name: 'Preload 상세',
              props: true,
              component: lazyLoading('workflow/content/PreloadDetail')
            },
            {
              path: 'contPurge',
              name: 'Purge',
              component: lazyLoading('workflow/content/Purge')
            },
            {
              path: 'contPurge/:id',
              name: 'Purge 상세',
              props: true,
              component: lazyLoading('workflow/content/PurgeDetail')
            }
          ]
        }
      ]
    },

    {
      path: '/login',
      name: 'Login',
      component: lazyLoading('Login')
    },
    {
      path: '/register',
      name: 'Register',
      component: lazyLoading('Register')
    },
    {
      path: '/404',
      name: 'Page404',
      component: lazyLoading('Page404')
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
