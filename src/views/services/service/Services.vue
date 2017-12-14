<template>
  <div class="animated fadeIn">
    <b-form @reset="onReset">
      <b-card class="search">
        <div class="form-group row">
          <b-form-fieldset
            class="col-sm-5"
            label="검색어"
            :label-cols="5"
            :horizontal="true">
            <multiselect
              v-model="searchType"
              label="codeName"
              :allowEmpty="false"
              :showLabels="false"
              :searchable="false"
              :options="code.searchType"
            ></multiselect>
          </b-form-fieldset>
          <b-form-fieldset class="col-sm-7 inline-field">
            <b-form-input type="text" v-model="searchItem.searchKeyword" placeholder="Enter Search text"></b-form-input>
          </b-form-fieldset>
        </div>

        <div class="form-group row">
          <b-form-fieldset
            class="col-sm-5"
            label="Service Type"
            :label-cols="5"
            :horizontal="true">
            <multiselect
              v-model="serviceTypeCode"
              :showLabels="false"
              :searchable="false"
              :options="code.serviceTypeCode"
              :loading="isLoad.serviceTypeCode"
              label="codeName"
              placeholder="전체"
            ></multiselect>
          </b-form-fieldset>

          <b-form-fieldset
            class="col-sm-5"
            label="CNAME"
            :label-cols="5"
            :horizontal="true">
            <multiselect
              v-model="searchItem.cnameUseYn"
              :showLabels="false"
              :searchable="false"
              :options="['사용', '미사용']"
              placeholder="전체"
            ></multiselect>
          </b-form-fieldset>
        </div>

        <div class="form-group row">
          <b-form-fieldset
            class="col-sm-5"
            label="SSL 인증서"
            :label-cols="5"
            :horizontal="true">
            <multiselect
              v-model="searchItem.sslCertUseYn"
              :showLabels="false"
              :searchable="false"
              :options="['사용', '미사용']"
              placeholder="전체"
            ></multiselect>
          </b-form-fieldset>

          <b-form-fieldset
            class="col-sm-5"
            label="사용여부"
            :label-cols="5"
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

        <div class="form-group row">
          <b-form-fieldset
            class="col-sm-5"
            label="기간"
            :label-cols="5"
            :horizontal="true">
            <multiselect
              v-model="searchDateType"
              label="codeName"
              :allowEmpty="false"
              :showLabels="false"
              :searchable="false"
              :options="code.searchDateType"
            ></multiselect>
          </b-form-fieldset>
          <b-form-fieldset class="col-sm-7 form-inline inline-field date-field">
            <b-form-input type="date" v-model="searchItem.searchDateFrom"></b-form-input> ~
            <b-form-input type="date" v-model="searchItem.searchDateTo"></b-form-input>

            <b-button-group size="sm">
              <b-button variant="outline-primary" @click="onCalendar('today')">오늘</b-button>
              <b-button variant="outline-primary" @click="onCalendar(7, 'days')">7일</b-button>
              <b-button variant="outline-primary" @click="onCalendar(1, 'month')">1개월</b-button>
              <b-button variant="outline-primary" @click="onCalendar(3, 'month')">3개월</b-button>
              <b-button variant="outline-primary" @click="onCalendar('reset')">전체</b-button>
            </b-button-group>
          </b-form-fieldset>
        </div>
        <div slot="footer">
          <b-button type="button" size="sm" variant="primary" @click="onSearch"><i class="fa fa-search"></i> Search</b-button>
          <b-button type="reset" size="sm" variant="danger"><i class="fa fa-ban"></i> Reset</b-button>
        </div>
      </b-card>
    </b-form>

    <div class="row">
      <div class="col">
        <section class="board-btn">
          <b-button type="button" variant="success">
            <i class="icon-cloud-download"></i>
            엑셀 다운로드
          </b-button>
          <b-button type="button" variant="primary" :to="{ name: 'Service 등록' }">
            <i class="icon-pencil"></i>
            등록
          </b-button>
        </section>

        <section class="board">
          <b-table
            striped
            bordered
            hover
            show-empty
            :items="items"
            :fields="fields"
            @row-clicked="details"
          >
            <template slot="serviceTypeName" scope="row">
              <span class="badge badge-pill badge-success" v-for="val in row.value">
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
    </div><!--/.row-->


  </div>
</template>

<script>
  import db from '@/firebaseInit'
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
          serviceTypeName: {label: 'Service Type'},
          accountName: {label: 'Account'},
          cnameUseYn: {label: 'CNAME'},
          sslCertUseYn: {label: 'SSL 인증서'},
          createDateTime: {label: '등록일'},
          modifyDateTime: {label: '수정일'},
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
          searchType: 'serviceName',
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
            code: 'serviceName',
            codeName: 'Service Name'
          },{
            code: 'accountName',
            codeName: 'Account'
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
              obj.serviceTypeName = (obj.serviceTypeName) ? obj.serviceTypeName.split(' ') : [];
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
            this.searchItem[key] = 'serviceName';
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

