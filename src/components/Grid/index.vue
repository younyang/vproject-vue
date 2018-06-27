<template>
  <div>
    <ag-grid-vue
      class="ag-theme-balham"
      :gridReady="onReady"
      :gridOptions="gridOptions"
      :enableColResize="enableColResize"
      :enableSorting="enableSorting"
      :rowSelection="rowSelection"
      :selectionChanged="rowSelected"
      :sortChanged="sortChange"
      :pagination="pagination"
      :paginationAutoPageSize="autoPageSize"
      :paginationSetPageSize="pageSize"
      :columnDefs="fields"
      :rowData="rowData"
    >
    </ag-grid-vue>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue';
import { PropertyKeys } from 'ag-grid/dist/lib/propertyKeys';
import { ColDefUtil } from 'ag-grid/dist/lib/components/colDefUtil';
import cSwitch from '@/components/Switch'

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
    onRowSubmit: {
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
    AgGridVue,

    // UseYn
    'UseYn': {
      components: {
        cSwitch
      },
      template: `
<div>
  <c-switch
    v-if="params.data.isEdit"
    :checked="params.value"
    type="text"
    class="v-switch"
    on="사용"
    off="미사용"
    @change="onChange"
  ></c-switch>
  <span v-else>{{params.value ? '사용' : '미사용' }}</span>
</div>`,
      methods: {
        onChange (value){
          console.log(value)
        }
      }
    },

    // Edit Input
    'EditInput': {
      template: `
  <b-form-input
    type="text"
    :value="params.value"
    :plaintext="!params.data.isEdit"
    @input="onInput"
    required
  ></b-form-input>
      `,
      methods: {
        onInput (v){
          this.params.setValue(v);
        }
      }
    },


    // 수정, 저장, 취소 button
    'EditAction': {
      template: `
<div style="text-align: center">
  <span v-if="params.data.isEdit">
    <b-button type="button" variant="in-table" @click="onView">취소</b-button>
    <b-button type="button" variant="in-table" @click="onSubmit">저장</b-button>
  </span>
  <span v-else>
    <b-button v-if="params.data.isHistory !== undefined" type="button" variant="in-table" @click="onHistory">이력</b-button>
    <b-button type="button" variant="in-table" @click="onEdit">수정</b-button>
  </span>
</div>
      `,

      methods: {
        onEdit() {
          this.params.data.isEdit = true;
        },

        onView (){
          this.params.data.isEdit = false;
        },

        onSubmit (){
          this.params.data.isEdit = false;
          this.params.context.componentParent.onRowSubmit(this.params.data);
        },

        onHistory (){

        }
      }
    },
  },

  computed: {
    rowData (){
      return this.items.map((obj, index) => ({
          index: (this.items.length - index),
          isEdit: false,
          ...obj
        }));
    }
  },

  data (){
    return {
      gridApi: null,
      gridOptions: null
    }
  },

  created (){
    this.gridApi = null;
    this.gridOptions = {
      context: {
        componentParent: this
      }
    }
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
    },

    sortChange (){
/*
 var dataSource = {
 rowCount: null,
 getRows: function(params) {
 console.log("asking for " + params.startRow + " to " + params.endRow);
 setTimeout(function() {
 var rowsThisPage = data.slice(params.startRow, params.endRow);
 var lastRow = -1;
 if (data.length <= params.endRow) {
 lastRow = data.length;
 }
 params.successCallback(rowsThisPage, lastRow);
 }, 500);
 }
 };
 params.api.setDatasource(dataSource);
 */



    }
  }
}
</script>
