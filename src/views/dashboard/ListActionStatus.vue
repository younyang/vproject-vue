<template>
  <b-table
    striped
    show-empty
    foot-clone
    :fields="fields"
    :items="items"
  >
    <template slot="all" scope="data">
      {{ total.row[data.index] }}
    </template>
    <template slot="FOOT_name" scope="data">
      Total
    </template>
    <template slot="FOOT_success" scope="items">
      {{ total.success }}
    </template>
    <template slot="FOOT_warning" scope="data">
      {{ total.warning }}
    </template>
    <template slot="FOOT_danger" scope="data">
      {{ total.danger }}
    </template>
    <template slot="FOOT_all" scope="data">
      {{ total.all }}
    </template>
  </b-table>
</template>


<script>
export default {
  name: 'ListActionStatus',
  data (){
    return {
      fields: {
        name: {label: '구분'},
        success: {label: '<span class="badge badge-success">정상</span>', 'class': 'text-right text-success'},
        warning: {label: '<span class="badge badge-warning">경고</span>', 'class': 'text-right text-warning'},
        danger: {label: '<span class="badge badge-danger">장애</span>', 'class': 'text-right text-danger'},
        all: {label: '전체', 'class': 'text-right'}
      },
      items: [
        {name: "H/R", success: 40, warning: null, danger: 1},
        {name: "L/R", success: 21, warning: 6, danger: 5},
        {name: "Edge", success: 5000, warning: 22, danger: 2},
        {name: "APIs", success: 6, warning: 12, danger: 9}
      ]
    }
  },

  computed: {
    total (){
      return {
        row: this.items
          .map(({success, warning, danger}) => success + warning + danger)
        ,
        success: this.items
          .map(({success}) => success)
          .reduce((p, n) => p + n)
        ,
        warning: this.items
          .map(({warning}) => warning)
          .reduce((p, n) => p + n)
        ,
        danger: this.items
          .map(({danger}) => danger)
          .reduce((p, n) => p + n)
        ,
        all: this.items
          .map(({success, warning, danger}) => success + warning + danger)
          .reduce((p, n) => p + n)
      };
    }
  }
}
</script>
