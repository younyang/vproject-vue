<template>
  <div class="animated fadeIn">
    <b-form class="searchBox" @reset="onReset">
      <div class="form-row">
        <b-form-fieldset
          label="검색어"
          class="inline"
          :horizontal="true">
          <multiselect
            v-model="searchType"
            label="codeName"
            class="noEmpty"
            :allowEmpty="false"
            :showLabels="false"
            :searchable="false"
            :options="code.searchType"
          ></multiselect>
          <b-form-input type="text" class="keyword" v-model="searchItem.searchKeyword" placeholder="Enter Search text"></b-form-input>
        </b-form-fieldset>
      </div>

      <div class="form-row">
        <b-form-fieldset
          label="사용여부"
          :horizontal="true">
          <multiselect
            v-model="searchItem.useYn"
            :showLabels="false"
            :searchable="false"
            :options="['사용', '미사용']"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>
      </div>
      <div class="search-btn">
        <b-button type="reset" variant="outline-secondary" v-b-tooltip.hover title="초기화"><i class="icon-reload"></i></b-button>
        <b-button type="button" variant="primary" @click="onSearch" v-b-tooltip.hover title="검색"><i class="icon-magnifier"></i></b-button>
      </div>
    </b-form>


    <div class="cache-content">
      <h3 class="cache-title">
        <i class="fa fa-arrow-right"></i>
        <strong>그룹코드</strong>

        <b-button
          type="button"
          variant="in-table"
          class="float-right"
          @click="onAddGroup"
        >등록</b-button>
      </h3>

      <section class="board">
        <ag-grid
          :fields="fields"
          :items="items"
          :onRowSelected="onRowSelected"
          :onRowSubmit="onRowSubmit"
        ></ag-grid>
      </section>
    </div>
  </div>
</template>

<script>
  import AgGrid from '@/components/Grid';

  export default {
    name: 'services',
    components: {
      AgGrid
    },
    data (){
      return {
        fields: [
          {
            headerName: '번호',
            field: 'index',
            width: 100
          },
          {
            headerName: '그룹코드 명',
            field: 'groupCodeName',
            cellRendererFramework: 'EditInput',
            cellClass: 'text-left'
          },
          {
            headerName: '사용여부',
            field: 'useYn',
            cellRendererFramework: 'UseYn',
            width: 100
          },
          {
            headerName: '설명',
            field: 'groupCodeDesc',
            cellRendererFramework: 'EditInput',
            cellClass: 'text-left'
          },
          { headerName: '등록일', field: 'createDateTime' },
          { headerName: '수정일', field: 'modifyDateTime' },
          {
            headerName: '관리',
            field: 'action',
            cellRendererFramework: 'EditAction'
          }
        ],
        items: [],

        queryParams: {},

        searchItem: {
          searchType: 'groupCode',
          searchKeyword: null,
          useYn: null
        },
        code: {
          searchType: [{
              code: 'groupCode',
              codeName: '그룹코드 명'
            },{
              code: 'commonCode',
              codeName: '공통코드 명'
            }
          ]
        },
        isLoad: {
        }
      }
    },

    computed: {
      searchType: {
        get () {
          return this.code.searchType.find(obj => obj.code === this.searchItem.searchType) || null;
        },
        set (newValue) {
          this.searchItem.searchType = newValue !== null ? newValue.code : null;
        }
      },
      searchDateType: {
        get () {
          return this.code.searchDateType.find(obj => obj.code === this.searchItem.searchDateType) || null;
        },
        set (newValue) {
          this.searchItem.searchDateType = newValue !== null ? newValue.code : null;
        }
      }
    },

    created (){
      this.fetchList();
    },

    methods: {
      fetchList (params = {}){
        this.$https.get('/system/commonGroupCode', {...params})
          .then((res) => {
            this.items = res.data.items;
          });
      },

      onSearch (){
        this.queryParams = {};

        // UseYn data convert
        Object.keys(this.searchItem).forEach(key => {
          if (this.searchItem[key] !== null && this.searchItem[key] !== ''){
            this.queryParams[key] = (key === 'useYn')
              ? (this.searchItem[key] === '사용')
              : this.searchItem[key];
          }
        });

        this.fetchList({ page: 1 });
      },

      onReset (){
        Object.keys(this.searchItem).forEach((key) => {
          if (key === 'searchType'){
            this.searchItem[key] = 'groupCode';
          } else {
            this.searchItem[key] = null;
          }
        });
        this.queryParams = {};
        this.fetchList();
      },

      onAddGroup (){

      },

      onRowSelected (){

      },

      onRowSubmit (data){
        console.log(data);

      }
    }
  }
</script>
