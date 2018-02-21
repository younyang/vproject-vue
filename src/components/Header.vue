<template>
  <header class="app-header navbar">
    <b-link class="navbar-brand" to="/"><span class="sr-only">SK V Project</span></b-link>
    <button class="navbar-toggler sidebar-toggler" type="button" @click="sidebarMinimize">&#9776;</button>

    <b-nav class="ml-auto">
      <b-nav-item-dropdown right no-caret class="d-md-down-none">
        <template slot="button-content">
          <i class="icon-bell"></i><span class="badge badge-pill badge-danger">3</span>
        </template>
        <b-dropdown-item>알림 메세지 1</b-dropdown-item>
        <b-dropdown-item>알림 메세지 2222</b-dropdown-item>
        <b-dropdown-item>알림 메세지 33</b-dropdown-item>
      </b-nav-item-dropdown>
      <b-nav-item-dropdown right>
        <template slot="button-content">
          <span class="d-md-down-none">{{ userName }}</span>
        </template>
        <b-dropdown-item><i class="fa fa-user"></i> 회원정보 수정</b-dropdown-item>
        <b-dropdown-item @click="logout"><i class="fa fa-lock"></i> Logout</b-dropdown-item>
      </b-nav-item-dropdown>
    </b-nav>
  </header>
</template>
<script>
import auth from '../auth';

export default {
  data (){
    return {
      userName: null
    }
  },

  mounted () {
    this.userName = auth.getUserInfo('operatorName')
  },

  methods: {
    logout () {
      this.$https.put('/logout')
        .then(() => {
            auth.logout(() => {
            this.$router.push({ name: 'Login' });
          })
      });
    },
    sidebarToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-hidden')
    },
    sidebarMinimize (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-minimized')
    },
    mobileSidebarToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-mobile-show')
    }
  }
}
</script>
