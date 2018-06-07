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
          path: 'user',
          name: '회원 정보 수정',
          component: lazyLoading('UserInfo')
        },
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
          redirect: '/configuration/edges/edge',
          name: 'Configuration',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'edges',
              redirect: '/configuration/edges/edge',
              name: 'Edge',
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
                  redirect: '/configuration/edges/edge/:id/default',
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
                  path: 'edgeMonitoring',
                  name: 'Edge Monitoring',
                  component: lazyLoading('configuration/edge/EdgeMonitoring')
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
                  path: 'cacheDeletions',
                  name: 'Cache Deletions',
                  component: lazyLoading('configuration/edge/CacheDeletions')
                }
              ]
            },
            {
              path: 'referrers',
              redirect: '/configuration/referrers/referrer',
              name: 'Referrer',
              component: {
                render (c) { return c('router-view') }
              },
              children: [
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
                }
              ]
            },
            {
              path: 'pop',
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
                  title: 'Edge',
                  props: true,
                  component: lazyLoading('configuration/pop/PopDetailEdge')
                }
              ]
            },
            {
              path: 'server',
              name: 'Server 관리',
              component: lazyLoading('configuration/server/Server')
            },
            {
              path: 'server/create',
              name: 'Server 등록',
              component: lazyLoading('configuration/server/ServerCreate')
            },
            {
              path: 'server/:id',
              name: 'Server 상세',
              props: true,
              component: lazyLoading('configuration/server/ServerDetail')
            },
            {
              path: 'dns',
              redirect: '/configuration/dns/gtm',
              name: 'DNS',
              component: {
                render (c) {
                  return c('router-view')
                }
              },
              children: [
                {
                  path: 'gtm',
                  name: 'GTM 관리',
                  component: lazyLoading('configuration/dns/GTM')
                },
                {
                  path: 'gtmIp',
                  name: 'GTM IP Config',
                  component: lazyLoading('configuration/dns/GTMip')
                }
              ]
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
              path: 'domain/pool/:method',
              name: 'Domain Processing - Pool',
              props: true,
              component: lazyLoading('workflow/domain/DomainProcessPool')
            },
            {
              path: 'domain/:id',
              name: 'Domain Processing 상세',
              props: true,
              component: lazyLoading('workflow/domain/DomainProcessDetail')
            },
            {
              path: 'content',
              redirect: '/workflow/content/preload',
              name: 'Content Processing 관리',
              component: {
                render (c) {
                  return c('router-view')
                }
              },
              children: [
                {
                  path: 'preload',
                  name: 'Preload',
                  component: lazyLoading('workflow/content/Preload')
                },
                {
                  path: 'preload/:id',
                  name: 'Preload 상세',
                  props: true,
                  component: lazyLoading('workflow/content/PreloadDetail')
                },
                {
                  path: 'purge',
                  name: 'Purge',
                  component: lazyLoading('workflow/content/Purge')
                },
                {
                  path: 'purge/:id',
                  name: 'Purge 상세',
                  props: true,
                  component: lazyLoading('workflow/content/PurgeDetail')
                }
              ]
            }
          ]
        },
        {
          path: 'settings',
          redirect: '/setting',
          name: 'Settings',
          component: {
            render (c) { return c('router-view') }
          },
          children:[
            {
              path: 'operators',
              redirect: 'settings/operators',
              name: 'Operators',
              component: {
                render (c) { return c('router-view') }
              },
              children: [
                {
                  path: 'operator',
                  name: 'Operator 관리',
                  component: lazyLoading('settings/operators/Operator')
                },
                {
                  path: 'operator/:id',
                  name: 'Operator 상세',
                  props: true,
                  component: lazyLoading('settings/operators/OperatorDetail')
                },
                {
                  path: 'approval',
                  name: 'Approval 관리',
                  component: lazyLoading('settings/operators/Approval')
                },
                {
                  path: 'approval/:id',
                  name: 'Approval 상세',
                  props: true,
                  component: lazyLoading('settings/operators/ApprovalDetail')
                },
              ]
            },
            {
              path: 'menu',
              name: 'Menu 관리',
              component: lazyLoading('settings/Menu')
            },
            {
              path: 'group',
              name: 'Group 관리',
              component: lazyLoading('settings/Group')
            },
            {
              path: 'menuGroup',
              name: 'Menu-Group 관리',
              component: lazyLoading('settings/MenuGroup')
            },
            {
              path: 'notifications',
              redirect: 'settings/notifications',
              name: 'Notification',
              component: {
                render (c) { return c('router-view') }
              },
              children: [
                {
                  path: 'notification',
                  name: 'Notification 관리',
                  component: lazyLoading('settings/notification/Notification')
                },
                {
                  path: 'notification/:id',
                  name: 'Notification 상세',
                  props: true,
                  component: lazyLoading('settings/notification/NotificationDetail')
                },
                {
                  path: 'send',
                  name: '전송 내역 관리',
                  component: lazyLoading('settings/notification/Send')
                },
                {
                  path: 'send/:id',
                  name: '전송 내역 상세',
                  props: true,
                  component: lazyLoading('settings/notification/SendDetail')
                },
              ]
            }
          ]
        },
        {
          path: 'apis',
          redirect: '/apis/api',
          name: 'APIs',
          component: {
            render (c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'api',
              name: 'API 관리',
              component: lazyLoading('apis/api/API')
            },
            {
              path: 'api/create',
              name: 'API 등록',
              component: lazyLoading('apis/api/APICreate')
            },
            {
              path: 'api/:id',
              name: 'API 상세',
              props: true,
              component: lazyLoading('apis/api/APIDetail')
            },
            {
              path: 'application',
              name: 'Application 관리',
              props: true,
              component: lazyLoading('apis/application/Application')
            },
            {
              path: 'application/create',
              name: 'Application 등록',
              component: lazyLoading('apis/application/ApplicationCreate')
            },
            {
              path: 'application/:id',
              name: 'Application 상세',
              props: true,
              component: lazyLoading('apis/application/ApplicationDetail')
            },
            {
              path: 'adaptor',
              name: 'Adaptor 관리',
              component: lazyLoading('apis/adaptor/Adaptor')
            }
          ]
        },
        {
          path: 'system',
          redirect: '/system/scheduler',
          name: 'System',
          component: {
            render (c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'scheduler',
              name: 'Scheduler 관리',
              component: lazyLoading('system/scheduler/Scheduler')
            },
            {
              path: 'scheduler/create',
              name: 'Scheduler 등록',
              component: lazyLoading('system/scheduler/SchedulerCreate')
            },
            {
              path: 'scheduler/:id',
              name: 'Scheduler 상세',
              props: true,
              component: lazyLoading('system/scheduler/SchedulerDetail')
            },
            {
              path: 'schedulerResult',
              name: 'Scheduler-Result 목록',
              component: lazyLoading('system/schedulerResult/SchedulerResult')
            },
            {
              path: 'schedulerResult/:id',
              name: 'Scheduler-Result 상세',
              props: true,
              component: lazyLoading('system/schedulerResult/SchedulerResultDetail')
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
