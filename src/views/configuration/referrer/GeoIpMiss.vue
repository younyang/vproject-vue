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
          label="PoP"
          :horizontal="true">
          <multiselect
            v-model="popType"
            :showLabels="false"
            :searchable="false"
            :options="code.popType"
            label="codeName"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>
      </div>
      <div class="search-btn">
        <b-button type="reset" variant="outline-secondary" v-b-tooltip.hover title="초기화"><i class="icon-reload"></i></b-button>
        <b-button type="button" variant="primary" @click="onSearch" v-b-tooltip.hover title="검색"><i class="icon-magnifier"></i></b-button>
      </div>
    </b-form>

    <b-form class="searchBox deploy" inline>
      <label>배포상태</label>
      <input
        type="text"
        readonly="readonly"
        class="form-control-plaintext"
        style="width:50px"
        :value="processStateCodeName"
      >
      <a :href="`#/workflow/service/${ processId }`" class="btn btn-in-table" target="_blank">{{ processId }}</a>

      <div class="search-btn">
        <b-button type="button" variant="outline-secondary">배포 이력</b-button>
        <b-button type="button" variant="primary">배포</b-button>
      </div>
    </b-form>

    <section class="board">
      <b-table
        show-empty
        :items="items"
        :fields="fields"
      >
        <template slot="pop" slot-scope="row">
          <span v-if="row.item.isEdit">
            <multiselect
              multiple
              :showLabels="false"
              :searchable="false"
              :options="['목동','의정부','수원','안양']"
              placeholder="전체"
            ></multiselect>
          </span>
          <span v-else><i class="text-danger">미등록</i></span>
        </template>

        <template slot="action" slot-scope="row">
          <span v-if="row.item.isEdit">
            <b-button type="button" variant="in-table" @click="onView(row)">취소</b-button>
            <b-button type="button" variant="in-table" @click="onSubmit(row)">저장</b-button>
          </span>
          <span v-else>
            <b-button type="button" variant="in-table" @click="onEdit(row)">수정</b-button>
          </span>
        </template>
      </b-table>
    </section>

    <section class="board-article d-flex justify-content-between">
      <b-form inline>
        <multiselect
          :value="pageInfo.size"
          :allowEmpty="false"
          :showLabels="false"
          :searchable="false"
          :options="pageOptions"
          @input="onRowSelect"
          class="inline sm"
        ></multiselect>
        <label class="ml-sm-2">Row Per Page</label>
      </b-form>

      <b-pagination
        :value="pageInfo.page"
        :total-rows="pageInfo.totalCount"
        :per-page="pageInfo.size"
        @input="onPagination"
        class="mt-2"
      ></b-pagination>
    </section>

  </div>
</template>

<script>
  export default {
    name: 'geoIpMiss',
    data (){
      return {
        fields: {
          index: {label: '번호'},
          ip: {label: 'IP주소', 'class': 'text-left'},
          pop: {label: 'PoP'},
          action: { label: '관리'}
        },
        items: [{
          index: 10,
          ip: '255.255.255.0',
          pop: '',
          isEdit: false
        }],
        originItems: [],
        pageInfo: {
          page: 1,
          size: 10,
          resultCount: 1,
          totalCount: 1
        },
        pageOptions: [10, 20, 50, 100],

        queryParams: {},

        searchItem: {
          searchType: 'ip',
          searchKeyword: null,
          popId: null
        },
        code: {
          searchType: [{
            code: 'ip',
            codeName: 'IP주소'
          }],
          popType: [{
            code: '01',
            codeName: '미등록'
          },{
            code: '02',
            codeName: 'PoP 목록'
          }]
        },

        // 배포상태
        processId: 10234,
        processStateCodeName: '실패'

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
      popType: {
        get () {
          return this.code.popType.find(obj => obj.code === this.searchItem.popType) || null;
        },
        set (newValue) {
          this.searchItem.popType = newValue !== null ? newValue.code : null;
        }
      }
    },

    created (){
    },

    methods: {
      fetchList (params = {}){
      },

      onEdit (row) {
        row.item.isEdit = true
      },

      onView (row) {
        row.item.isEdit = false;
      },

      onSubmit (row) {
      },

      onSearch (){
      },

      onRowSelect (size){
      },

      onReset (){
      },

      onPagination (page){
      }
    }
  }
</script>
