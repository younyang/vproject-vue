<template>
  <div class="page-title">
    <h2>{{ title }}</h2>

    <b-nav pills v-if="navList.isNav">
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
      type: String
    },
    name: {
      type: String
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
