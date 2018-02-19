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

        <b-form-fieldset>
          label="Service Type"
          class="label-lg"
          :horizontal="true">
          <multiselect
            v-model="serviceTypeCode"
            :showLabels="false"
            :searchable="false"
            :options="code.serviceTypeCode"
            :loading="isLoad.serviceTypeCode"
            label="codeName"
            track-by="code"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>
      </div>

      <div class="form-row">
        <b-form-fieldset
          label="CNAME"
          :horizontal="true">
          <multiselect
            v-model="searchItem.cnameUseYn"
            :showLabels="false"
            :searchable="false"
            :options="['사용', '미사용']"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>

        <b-form-fieldset
          label="SSL 인증서"
          class="label-lg"
          :horizontal="true">
          <multiselect
            v-model="searchItem.sslCertUseYn"
            :showLabels="false"
            :searchable="false"
            :options="['사용', '미사용']"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>
      </div>

      <div class="form-row">
        <b-form-fieldset
          label="사용여부"
          :horizontal="true">
          <multiselect
            v-model="searchItem.serviceUseYn"
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
      <b-button type="button" variant="primary">
        엑셀 다운로드
      </b-button>
      <b-button type="button" variant="primary" :to="{ name: 'Service 등록' }">
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
        <template slot="serviceTypeName" scope="row">
          <span class="badge" v-for="val in row.value">
            {{ val }}
          </span>
        </template>
        <template slot="cnameUseYn" scope="row">{{row.value? '사용':'미사용'}}</template>
        <template slot="sslCertUseYn" scope="row">{{row.value? '사용':'미사용'}}</template>
        <template slot="serviceUseYn" scope="row">{{row.value? '사용':'미사용'}}</template>
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
  import moment from 'moment'

  export default {
    name: 'services',
    components: {
      //  ListContent
    },
    data (){
      return {
        fields: {
          serviceId: {label: 'ID'},
          serviceName: {label: 'Service Name', 'class': 'text-left'},
          serviceTypeName: {label: 'Service Type', 'class': 'text-left'},
          companyName: {label: 'Company'},
          cnameUseYn: {label: 'CNAME'},
          sslCertUseYn: {label: 'SSL 인증서'},
          createDateTime: {label: '등록일시'},
          modifyDateTime: {label: '수정일시'},
          serviceUseYn: {label: '사용여부'}
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
          searchType: 'service',
          searchKeyword: null,
          serviceTypeCode: null,
          cnameUseYn: null,
          sslCertUseYn: null,
          serviceUseYn: null,
          searchDateType: 'createDate',
          searchDateFrom: null,
          searchDateTo: null
        },
        code: {
          searchType: [{
            code: 'service',
            codeName: 'Service Name'
          },{
            code: 'company',
            codeName: 'Company'
          }],
          searchDateType: [{
            code: 'createDate',
            codeName: '등록일'
          },{
            code: 'modifyDate',
            codeName: '수정일'
          }],
          serviceTypeCode: []
        },
        isLoad: {
          serviceTypeCode: false
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
      },
      serviceTypeCode: {
        get () {
          return this.code.serviceTypeCode.find(obj => obj.code === this.searchItem.serviceTypeCode) || null;
        },
        set (newValue) {
          this.searchItem.serviceTypeCode = newValue !== null ? newValue.code : null;
        }
      },
    },

    created (){
      this.fetchList();

      this.$https.get('/system/commonCode', {
          q: { groupCode: 'SERVICE_TYPE' }
        })
        .then((res) => {
          this.isLoad.serviceTypeCode = false;
          this.code.serviceTypeCode = res.data.items.filter(({code}) => {
            return code.split('_')[2].length === 2
          });
        });
    },

    methods: {
      details (item) {
        this.$router.push({ name: 'Service 상세', params: { id: item.serviceId }})
      },

      fetchList (params = {}){
        const defaultParams = {
          page: this.pageInfo.page,
          size: this.pageInfo.size,
          q: this.queryParams
        };

        this.$https.get('/services', {...defaultParams, ...params})
          .then((res) => {
            // Setting Service Type Name
            this.items = res.data.items.map(obj => {
              obj.serviceTypeName = (obj.serviceTypeName) ? obj.serviceTypeName.split(',') : [];
              return obj
            });
            this.pageInfo = res.data.pageInfo;
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

        // UseYn data convert
        Object.keys(this.searchItem).forEach(key => {
          if (this.searchItem[key] !== null && this.searchItem[key] !== ''){
            this.queryParams[key] = (key === 'cnameUseYn' || key === 'sslCertUseYn' || key === 'serviceUseYn')
              ? (this.searchItem[key] === '사용')
              : this.searchItem[key];
          }
        });

        this.fetchList({ page: 1 });
      },

      onReset (){
        Object.keys(this.searchItem).forEach((key) => {
          if (key === 'searchType'){
            this.searchItem[key] = 'service';
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
      }
    }
  }
</script>

