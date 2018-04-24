<template>
  <header class="app-header navbar">
    <b-link class="navbar-brand" to="/"><span class="sr-only">SK V Project</span></b-link>
    <button class="navbar-toggler sidebar-toggler" type="button" @click="sidebarMinimize">&#9776;</button>

    <b-nav class="ml-auto">
      <b-nav-item-dropdown right no-caret class="d-md-down-none notice-list">
        <template slot="button-content">
          <i class="icon-bell"></i>
          <span
            v-if="notices.length"
            class="badge badge-pill badge-danger"
          >{{ notices.length }}</span>
        </template>
        <div v-if="notices.length">
          <b-dropdown-item
            v-for="({ notifyMsg }, index) in notices"
            :key="index"
          >{{ notifyMsg }}</b-dropdown-item>
        </div>
        <div v-else>
          <b-dropdown-item>알림이 없습니다.</b-dropdown-item>
        </div>
      </b-nav-item-dropdown>


      <b-nav-item-dropdown right>
        <template slot="button-content">
          <span class="d-md-down-none">{{ userName }}</span>
        </template>
        <b-dropdown-item :to="{ name: '회원 정보 수정'}"><i class="fa fa-user"></i> 회원정보 수정</b-dropdown-item>
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
      userName: null,
      userId: null,
      notices: []
    }
  },

  mounted () {
    this.userName = auth.getUserInfo('operatorName');
    this.userId = auth.getUserInfo('operatorId')

    // 알림
    this.$https.get('/notices/main')
      .then((res) => {
        this.notices = res.data.items;
      })
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
