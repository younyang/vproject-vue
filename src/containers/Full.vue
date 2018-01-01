<template>
  <div class="app">
    <AppHeader/>
    <div class="app-body">
      <Sidebar :navItems="nav"/>
      <main class="main">
        <div class="page-title">
          <h1>{{ name }}</h1>
          <breadcrumb :list="list"/>
        </div>
        <div class="container-fluid">
          <router-view></router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import nav from '../_nav'
import { Header as AppHeader, Sidebar, Footer as AppFooter, Breadcrumb } from '@/components/'

export default {
  name: 'full',
  components: {
    AppHeader,
    Sidebar,
    Breadcrumb
  },
  data () {
    return {
      nav: nav.items
    }
  },

  computed: {
    name () {
      return this.$route.name || this.$route.matched[2].name
    },
    list () {
      return this.$route.matched.slice(0,3)
    }
  }
}
</script>
