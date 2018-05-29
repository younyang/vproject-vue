<template>
  <ag-grid-vue
    class="ag-theme-balham"
    :gridReady="onReady"
    :enableColResize="enableColResize"
    :enableSorting="enableSorting"
    :rowSelection="rowSelection"
    :selectionChanged="rowSelected"
    :pagination="pagination"
    :paginationAutoPageSize="autoPageSize"
    :paginationSetPageSize="pageSize"
    :columnDefs="fields"
    :rowData="items">
  </ag-grid-vue>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue';
import { PropertyKeys } from 'ag-grid/dist/lib/propertyKeys';
import { ColDefUtil } from 'ag-grid/dist/lib/components/colDefUtil';
// fix wrong property warning
PropertyKeys.ALL_PROPERTIES.push("__ob__");
ColDefUtil.ALL_PROPERTIES.push("__ob__");

export default {
  props: {
    enableColResize: {
      type: Boolean,
      default: true
    },
    enableSorting: {
      type: Boolean,
      default: true
    },
    rowSelection: {
      type: String,
      default: 'single'
    },
    onRowSelected: {
      type: Function,
      default: () => {}
    },
    pagination: {
      type: Boolean,
      default: true
    },
    autoPageSize: {
      type: Boolean,
      default: true
    },
    pageSize: {
      type: Number,
      default: 10
    },
    fields: {
      type: Array,
      require: true,
      default: []
    },
    items: {
      type: Array,
      require: true,
      default: []
    }
  },

  components: {
    AgGridVue
  },

  created (){
    this.gridApi = null;
  },

  methods: {
    onReady (params){
      this.gridApi = params.api;
      this.gridApi.sizeColumnsToFit();
    },

    rowSelected (){
      const selectedRow = this.gridApi.getSelectedRows()[0];
      if (selectedRow){
        this.onRowSelected(selectedRow)
      }
    }
  }
}
</script>
