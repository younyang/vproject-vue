<template>
  <ol class="breadcrumb" v-if="$route.name !== 'Dashboard'">
    <li class="breadcrumb-item" v-for="(item, index) in list"><span class="active" v-if="isLast(index)">{{ showName(item) }}</span>
      <router-link :to="getPath(item.path)" v-else>{{ showName(item) }}</router-link>
    </li>
  </ol>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      required: true,
      default: () => []
    }
  },

  methods: {
    isLast (index) {
      return index === this.list.length - 1
    },
    getPath (path) {
      return path === '' ? '/' : path
    },
    showName (item) {
      if (item.meta && item.meta.label) {
        item = item.meta && item.meta.label
      }
      if (item.name) {
        item = item.name
      }
      return item
    }
  }
}
</script>
