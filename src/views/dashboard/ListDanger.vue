<template>
  <b-table
    striped
    show-empty
    :fields="fields"
    :items="items"
  >
    <template slot="status" scope="data">
      <span class="badge badge-secondary">{{ data.value }}</span>
    </template>
  </b-table>
</template>


<script>
export default {
  name: 'ListDanger',
  mounted (){
    this.items = this.items.map((obj) => {
        return obj.status === '대기' ? Object.assign({}, obj, {
          _rowVariant: 'text-danger'
        }) : obj
    })
  },

  data (){
    return {
      fields: {
        time: {label: '발생시간'},
        type: {label: '구분', 'class': 'text-center'},
        server: {label: '서버 명', 'class': 'text-center'},
        status: {label: '상태', 'class': 'text-center'}
      },
      items: [
        {time: "10:20:23", type: "L/R", server: "OR2212", status: "대기"},
        {time: "2017-05-12", type: "Edge", server: "OR2212", status: "완료"},
        {time: "2017-05-12", type: "Edge", server: "OR2212", status: "완료"},
        {time: "2017-05-12", type: "Edge", server: "OR2212", status: "완료"},
        {time: "2017-05-12", type: "Edge", server: "OR2212", status: "완료"}
      ]
    }
  },

  methods: {
    statusStyle(value, key, row) {
      return `<span class="text-danger">${value} ${key} ${row}</span>`
    }
  }
}
</script>
