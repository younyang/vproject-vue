export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-grid'
    },
    {
      name: 'Service',
      url: '/service',
      icon: 'icon-support',
      children: [
        {
          name: 'Service 관리',
          url: '/service/service'
        }/*,
        {
          name: 'Bucket 관리',
          url: '/service/bucket'
        }*/
      ]
    },
    {
      name: 'Configuration',
      url: '/configuration',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Edge',
          url: '/configuration/edges',
          children: [
            {
              name: 'Edge 관리',
              url: '/configuration/edges/edge'
            },
            {
              name: 'Edge Monitoring',
              url: '/configuration/edges/edgeMonitoring'
            },
            {
              name: 'Cache Throttling 관리',
              url: '/configuration/edges/cache'
            }/*,
            {
              name: 'Cache Deletions',
              url: '/configuration/edges/cacheDeletions'
            }*/
          ]
        },
        {
          name: 'Referrer',
          url: '/configuration/referrers',
          children: [
            {
              name: 'Referrer 관리',
              url: '/configuration/referrers/referrer'
            }/*,
            {
              name: 'PoP Preference',
              url: '/configuration/referrers/popPreference'
            }*/,
            {
              name: 'IP Restriction',
              url: '/configuration/referrers/ipRestriction'
            },
            {
              name: 'GeoIP Miss',
              url: '/configuration/referrers/geoIpMiss'
            },
            {
              name: 'GeoIP Hit',
              url: '/configuration/referrers/geoIpHit'
            },
            {
              name: 'One-Time URL',
              url: '/configuration/referrers/onetime'
            }
          ]
        },
        {
          name: 'Pop 관리',
          url: '/configuration/pop'
        },
        {
          name: 'Server 관리',
          url: '/configuration/server'
        },
        {
          name: 'DNS',
          url: '/configuration/dns',
          children: [
            {
              name: 'GTM 관리',
              url: '/configuration/dns/gtm'
            },
            {
              name: 'GTM IP Config',
              url: '/configuration/dns/gtmIp'
            }
          ]
        }
      ]
    },
    {
      name: 'Workflow',
      url: '/workflow',
      icon: 'icon-organization',
      children: [
        {
          name: 'Service Processing 관리',
          url: '/workflow/service'
        },
        {
          name: 'Domain Processing 관리',
          url: '/workflow/domain'
        },
        {
          name: 'Content Processing 관리',
          url: '/workflow/content',
          children: [
            {
              name: 'Preload',
              url: '/workflow/content/preload'
            },
            {
              name: 'Purge',
              url: '/workflow/content/Purge'
            }
          ]
        }
      ]
    },
    {
      name: 'Settings',
      url: '/settings',
      icon: 'icon-share',
      children: [
        {
          name: 'Operators',
          url: '/settings/operators',
          children: [
            {
              name: 'Operator 관리',
              url: '/settings/operators/operator'
            },
            {
              name: 'Approval 관리',
              url: '/settings/operators/approval'
            }
          ]
        },
        {
          name: 'Notifications',
          url: '/settings/notifications',
          children: [
            {
              name: 'Notification 관리',
              url: '/settings/notifications/notification'
            },
            {
              name: '전송 내역 관리',
              url: '/settings/notifications/send'
            }
          ]
        }
      ]
    },
    {
      name: 'APIs',
      url: '/apis',
      icon: 'icon-share',
      children: [
        {
          name: 'API 관리',
          url: '/apis/api'
        },
        {
          name: 'Application 관리',
          url: '/apis/application'
        }/*,
        {
          name: 'Adaptor 관리',
          url: '/apis/adaptor'
        }*/,
      ]
    }
    ,
    {
      name: 'System',
      url: '/system',
      icon: 'icon-share',
      children: [
        /*{
          name: 'CommonCode',
          url: '/system/commonCode'
        },*/
        {
          name: 'Scheduler',
          url: '/system/scheduler'
        },
        {
          name: 'Scheduler-Result',
          url: '/system/schedulerResult'
        }
      ]
    }
  ]
}
