<template>
  <b-table
    striped
    show-empty
    :fields="fields"
    :items="items"
  >
  </b-table>
</template>


<script>
export default {
  name: 'ListContent',
  data (){
    return {
      fields: {
        content: {label: 'Content'},
        traffic: {label: 'Traffic', 'class': 'text-right'}
      },
      items: [
        {content: "Contents Name11", traffic: 11},
        {content: "Contents Name22", traffic: 222},
        {content: "Contents Name33", traffic: 123},
        {content: "Contents Name44", traffic: 1234},
        {content: "Contents Name55", traffic: 12345}
      ]
    }
  }
}
</script>
