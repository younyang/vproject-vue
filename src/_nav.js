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
        },
        {
          name: 'Bucket 관리',
          url: '/service/bucket'
        }
      ]
    },
    {
      name: 'Configuration',
      url: '/configuration',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Edge',
          url: '/configuration/edge',
          children: [
            {
              name: 'Edge 관리',
              url: '/configuration/edge'
            },
            {
              name: 'Cache Throttling 관리',
              url: '/configuration/cache'
            }
          ]
        },
        {
          name: 'Referrer',
          url: '/configuration/referrer',
          children: [
            {
              name: 'Referrer 관리',
              url: '/configuration/referrer'
            },
            {
              name: 'PoP Preference',
              url: '/configuration/popPreference'
            },
            {
              name: 'IP Restriction',
              url: '/configuration/ipRestriction'
            },
            /*
             {
             name: 'GEO IP',
             url: '/configuration/geoIp'
             },
             */
            {
              name: 'One-Time URL',
              url: '/configuration/onetime'
            }
          ]
        },
        {
          name: 'Pop 관리',
          url: '/configuration/pop'
        },
        {
          name: 'DNS',
 //         url: '/configuration/dns',
          children: [
            {
              name: 'GTM 등록 관리',
              url: '/configuration/gtm'
            }
          ]
        }
      ]
    },
    {
      name: 'Workflow',
      url: '/workflow',
      icon: 'icon-share',
      children: [
        {
          name: 'Service Processing 관리',
          url: '/workflow/service'
        },
        /*
        {
          name: 'Domain Processing 관리',
          url: '/workflow/domain'
        },
        */
        {
          name: 'Content Processing 관리',
          url: '/workflow',
          children: [
            {
              name: 'Preload',
              url: '/workflow/contPreload'
            },
            {
              name: 'Purge',
              url: '/workflow/contPurge'
            }
          ]
        }
      ]
    }
    /*
    {
      title: true,
      name: 'UI Component Sample',
      class: '',
      wrapper: {
        element: '',
        attributes: {}
      }
    },
    {
      name: 'Process(drag&drop)',
      url: '/process',
      icon: 'icon-chart'
    },
    {
      name: 'Map',
      url: '/map',
      icon: 'icon-map'
    },
    {
      name: 'Grid UI',
      url: '/gridUI',
      icon: 'icon-grid'
    }
    */
  ]
}
