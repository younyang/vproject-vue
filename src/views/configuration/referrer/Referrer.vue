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

        <b-form-fieldset
          label="구분"
          class="label-lg"
          :horizontal="true">
          <multiselect
            v-model="referrerTypeCode"
            :showLabels="false"
            :searchable="false"
            :options="code.referrerTypeCode"
            :loading="isLoad.referrerTypeCode"
            label="codeName"
            track-by="code"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>
      </div>

      <div class="form-row">
        <b-form-fieldset
          label="PoP"
          :horizontal="true">
          <multiselect
            v-model="popId"
            :showLabels="false"
            :searchable="false"
            :options="code.popId"
            :loading="isLoad.popId"
            label="popName"
            track-by="popId"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>

        <b-form-fieldset
          label="사용여부"
          class="label-lg"
          :horizontal="true">
          <multiselect
            v-model="searchItem.referrerUseYn"
            :showLabels="false"
            :searchable="false"
            :options="['사용', '미사용']"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>
      </div>

      <div class="form-row">
        <b-form-fieldset
          label="기간"
          class="inline date"
          :horizontal="true">
          <multiselect
            v-model="searchDateType"
            label="codeName"
            class="noEmpty"
            :allowEmpty="false"
            :showLabels="false"
            :searchable="false"
            :options="code.searchDateType"
          ></multiselect>

          <b-form-input type="date" class="form-date" v-model="searchItem.searchDateFrom"></b-form-input> ~
          <b-form-input type="date" class="form-date" v-model="searchItem.searchDateTo"></b-form-input>

          <b-button class="btn-day" @click="onCalendar('today')">오늘</b-button>
          <b-button class="btn-day" @click="onCalendar(7, 'days')">7일</b-button>
          <b-button class="btn-day" @click="onCalendar(1, 'month')">1개월</b-button>
          <b-button class="btn-day" @click="onCalendar(3, 'month')">3개월</b-button>
          <b-button class="btn-day" @click="onCalendar('reset')">전체</b-button>
        </b-form-fieldset>
      </div>
      <div class="search-btn">
        <b-button type="reset" variant="outline-secondary" v-b-tooltip.hover title="초기화"><i class="icon-reload"></i></b-button>
        <b-button type="button" variant="primary" @click="onSearch" v-b-tooltip.hover title="검색"><i class="icon-magnifier"></i></b-button>
      </div>
    </b-form>


    <section class="board-btn">
      <b-button type="button" variant="primary" @click="excelDownload()">
        엑셀 다운로드
      </b-button>
      <b-button type="button" variant="primary" @click="showCreateList">
        등록
      </b-button>
    </section>

    <section class="board">
      <b-table
        hover
        show-empty
        :items="items"
        :fields="fields"
        @row-clicked="details"
      >
        <template slot="referrerTypeCodeName" slot-scope="row">{{row.value.split(' ')[0]}}</template>
        <template slot="referrerUseYn" slot-scope="row">{{row.value? '사용':'미사용'}}</template>
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


    <!-- Create List Modal -->
    <b-modal size="lg" title="선택" v-model="isModalCreate">
      <section class="board">
        <b-table
          hover
          show-empty
          :items="createList.items"
          :fields="createList.fields"
          @row-clicked="creates"
        >
          <template slot="referrerTypeCodeName" slot-scope="row">{{row.value.split(' ')[0]}}</template>
        </b-table>
      </section>

      <div slot="modal-footer">
        <b-button type="button" variant="outline-secondary" @click="isModalCreate = false">취소</b-button>
      </div>
    </b-modal>

  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'referrers',
    data (){
      return {
        fields: {
          referrerId: {label: 'ID'},
          referrerTypeCodeName: {label: '구분', 'class': 'text-left'},
          componentIp: {label: 'IP', 'class': 'text-left'},
          componentHostName: {label: 'Host Name', 'class': 'text-left'},
          popName: {label: 'PoP'},
          createDateTime: {label: '등록일시'},
          modifyDateTime: {label: '수정일시'},
          referrerUseYn: {label: '사용여부'}
        },
        items: [],
        pageInfo: {
          page: 1,
          size: 10,
          resultCount: 1,
          totalCount: 1
        },
        pageOptions: [10, 20, 50, 100],

        queryParams: {},

        searchItem: {
          searchType: 'componentIp',
          searchKeyword: null,
          referrerTypeCode: null,
          popId: null,
          referrerUseYn: null,
          searchDateType: 'createDate',
          searchDateFrom: null,
          searchDateTo: null
        },
        createList: {
          fields: {
            referrerTypeCodeName: {label: '구분', 'class': 'text-left'},
            componentIp: {label: 'IP', 'class': 'text-left'},
            componentHostName: {label: 'Host Name', 'class': 'text-left'},
          },
          items: []
        },
        code: {
          searchType: [{
            code: 'componentIp',
            codeName: 'IP'
          },{
            code: 'componentHostName',
            codeName: 'Host Name'
          },{
            code: 'referrerId',
            codeName: 'ID'
          }],
          searchDateType: [{
            code: 'createDate',
            codeName: '등록일'
          },{
            code: 'modifyDate',
            codeName: '수정일'
          }],
          referrerTypeCode: [],
          popId: [],
          secondAddressCode: []
        },
        isLoad: {
          referrerTypeCode: false,
          popId: false
        },
        isModalCreate: false
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
      },
      referrerTypeCode: {
        get () {
          return this.code.referrerTypeCode.find(obj => obj.code === this.searchItem.referrerTypeCode) || null;
        },
        set (newValue) {
          this.searchItem.referrerTypeCode = newValue !== null ? newValue.code : null;
        }
      },
      popId: {
        get () {
          return this.code.popId.find(obj => obj.popId === this.searchItem.popId) || null;
        },
        set (newValue) {
          this.searchItem.popId = newValue !== null ? newValue.popId : null;
        }
      }
    },

    created (){
      // Referrer List
      this.fetchList();

      // Referrer Type Code
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'COMPONENT_TYPE' }
        })
        .then((res) => {
          this.isLoad.referrerTypeCode = false;
          this.code.referrerTypeCode = res.data.items.filter(({codeName}) => codeName !== 'Edge');
        });
      // PoP List
      this.$https.get('/pops')
        .then((res) => {
          this.isLoad.popId = false;
          this.code.popId = res.data.items;
        });
    },

    methods: {
      details (item) {
        this.$router.push({
          name: 'Referrer 상세',
          params: { id: item.referrerId },
          query: { referrerTypeCode: item.referrerTypeCode }

        })
      },

      creates (item) {
        const {referrerId, referrerTypeCode, referrerTypeCodeName, componentIp, componentHostName } = item;
        this.$router.push({
          name: 'Referrer 등록',
          query: {
            q: JSON.stringify({
              referrerId,
              referrerTypeCode,
              referrerTypeCodeName,
              componentIp,
              componentHostName
            })
          }})
      },

      fetchList (params = {}){
        const defaultParams = {
          page: this.pageInfo.page,
          size: this.pageInfo.size,
          q: this.queryParams
        };

        this.$https.get('/referrers', {...defaultParams, ...params})
          .then((res) => {
            this.items = res.data.items;
            this.pageInfo = res.data.pageInfo;
          });
      },

      showCreateList (){
        this.isModalCreate = !this.isModalCreate;
        this.$https.get('/referrers/components')
          .then((res) => {
            this.createList.items = res.data.items;
          });
      },

      onCalendar (day, type){
        this.searchItem.searchDateTo = moment().format('YYYY-MM-DD')

        if (day === 'today'){
          this.searchItem.searchDateFrom = moment().format('YYYY-MM-DD')
        } else if (day === 'reset'){
          this.searchItem.searchDateFrom = null;
          this.searchItem.searchDateTo = null;
        } else {
          this.searchItem.searchDateFrom = moment().subtract(day, type).format('YYYY-MM-DD');
        }
      },

      onSearch (){
        this.queryParams = {};

        Object.keys(this.searchItem).forEach(key => {
          if (this.searchItem[key] !== null && this.searchItem[key] !== ''){
            this.queryParams[key] = (key === 'referrerUseYn')
              ? (this.searchItem[key] === '사용')
              : this.searchItem[key];
          }
        });

        this.fetchList({ page: 1 });
      },

      onReset (){
        Object.keys(this.searchItem).forEach((key) => {
          if (key === 'searchType'){
            this.searchItem[key] = 'componentIp';
          } else if (key === 'searchDateType') {
            this.searchItem[key] = 'createDate';
          } else {
            this.searchItem[key] = null;
          }
        });
        this.queryParams = {};
        this.fetchList();
      },

      onRowSelect (size){
        this.fetchList({ page: 1, size });
      },

      onPagination (page){
        this.fetchList({ page });
      },

      excelDownload(){
        const queryParams = JSON.stringify(this.queryParams);
        const q = encodeURI(queryParams);
        return window.location.href = '/api/excel/referrers/download?q=' + q;
      }
    }
  }
</script>
