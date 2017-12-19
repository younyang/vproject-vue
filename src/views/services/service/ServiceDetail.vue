<template>
  <div class="animated fadeIn">
    <content-header
      title="bbb"
      :name="name">
    </content-header>
    <router-view class="child"></router-view>
  </div>
</template>

<script>
  import ContentHeader from '@/components/ContentHeader'

  export default {
    name: 'service',
    props: ['id'],
    components: {
      ContentHeader
    },

    data (){
      return {
        name: 'Service 상세',
      }
    },
    created (){
      console.log(this.id)
    }
  }
</script>
