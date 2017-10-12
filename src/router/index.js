import Vue from 'vue'
import Router from 'vue-router'

// Containers
import Full from '@/containers/Full'

// Views
import Dashboard from '@/views/Dashboard'
import Workflow from '@/views/Workflow'
import Process from '@/views/Process'
import Map from '@/views/Map'
import Routepath from '@/views/Routepath'

Vue.use(Router)

export default new Router({
  mode: 'history', // Demo is living in GitHub.io, so required!
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
          path: 'workflow',
          name: 'Workflow',
          component: Workflow
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
          path: 'routepath',
          name: 'Route path',
          component: Routepath
        }
      ]
    }
  ]
})
