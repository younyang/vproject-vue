<template>
  <div class="page-sub-title">
    <h2 v-if="title !== ''"><i></i> {{ title }} <small v-if="small !== ''">{{ small }}</small></h2>
    <h2 v-if="apiName !== ''">
      <i></i> {{ apiService }} &gt;
      <span>{{ apiName }}</span>
      <b-badge
        pill
        :variant="apiStatusVariant">
        {{ apiStatus }}
      </b-badge>
    </h2>

    <b-nav pills v-if="navList.isNav" class="sub-navs">
      <b-nav-item v-for="nav in navList.list" :key="nav.path" :to="nav.path">
          {{ nav.title }}
      </b-nav-item>
    </b-nav>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    apiService: {
      type: String,
      default: ''
    },
    apiName: {
      type: String,
      default: ''
    },
    apiStatus: {
      type: String,
      default: ''
    },

    name: {
      type: String
    },
    small: {
      type: String,
      default: ''
    }
  },

  computed: {
    navList () {
      const routes = this.getRoutes || {};
      return {
        isNav: routes.children !== undefined,
        list: routes.children
      }
    },

    apiStatusVariant (){
      return this.apiStatus.toLowerCase();
    },

    getRoutes () {
      const routes = [];
      const count = (arr) => {
        for (let i in arr) {
          if (!arr.hasOwnProperty(i)){
            continue
          }
          if (arr[i].name === this.name) {
            routes.push(arr[i]);
          } else if (arr[i].hasOwnProperty('children')){
            count(arr[i].children);
          }
        }
      };
      count(this.$router.options.routes);
      return routes[0];
    }
  }
}
</script>
