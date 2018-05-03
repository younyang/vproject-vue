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
          label="회사명"
          class="label-lg"
          :horizontal="true">
          <multiselect
            v-model="companyCode"
            :showLabels="false"
            :searchable="false"
            :options="code.companyCode"
            :loading="isLoad.companyCode"
            label="codeName"
            track-by="code"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>
      </div>

      <div class="form-row">
        <b-form-fieldset
          label="그룹"
          :horizontal="true">
          <multiselect
            v-model="groupId"
            :showLabels="false"
            :searchable="false"
            :options="code.groupId"
            :loading="isLoad.groupId"
            label="groupName"
            track-by="groupId"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>

        <b-form-fieldset
          label="서비스"
          class="label-lg"
          :horizontal="true">
          <multiselect
            v-model="serviceId"
            :showLabels="false"
            :searchable="false"
            :options="code.serviceId"
            :loading="isLoad.serviceId"
            label="serviceName"
            track-by="serviceId"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>
      </div>

      <div class="form-row">
        <b-form-fieldset
          label="계정잠김여부"
          :horizontal="true">
          <multiselect
            v-model="searchItem.accountLockYn"
            :showLabels="false"
            :searchable="false"
            :options="['잠김', '정상']"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>

        <b-form-fieldset
          label="상태"
          class="label-lg"
          :horizontal="true">
          <multiselect
            v-model="operatorStateCode"
            :showLabels="false"
            :searchable="false"
            :options="code.operatorStateCode"
            :loading="isLoad.operatorStateCode"
            label="codeName"
            track-by="code"
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
      <b-button type="button" variant="primary" @click="excelDownload">
        엑셀 다운로드
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
        <template slot="operatorServiceNames" slot-scope="row">
          <span class="badge" v-for="val in row.value">
            {{ val }}
          </span>
        </template>
        <template slot="operatorGroupNames" slot-scope="row">
          <span class="badge" v-for="val in row.value">
            {{ val }}
          </span>
        </template>
        <template slot="accountLockYn" slot-scope="row">{{row.value? '잠김':'정상'}}</template>
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
          operatorId: {label: 'ID'},
          operatorName: {label: '이름', 'class': 'text-left'},
          companyName: {label: '회사명', 'class': 'text-left'},
          deptName: {label: '부서', 'class': 'text-left'},
          operatorGroupNames:{label: '그룹', 'class': 'text-left'},
          operatorServiceNames: {label: '서비스', 'class': 'text-left'},
          email: {label: '이메일', 'class': 'text-left'},
          joinApprovalDatetime: {label: '가입승인일시'},
          modifyDateTime: {label: '수정일시'},
          accountLockYn: {label: '계정잠김여부'},
          operatorStateName: {label: '상태'}
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
          searchType: 'operatorId',
          searchKeyword: null,
          companyCode: null,
          groupId: null,
          serviceId: null,
          accountLockYn: null,
          operatorStateCode: null,
          searchDateType: 'createDate',
          searchDateFrom: null,
          searchDateTo: null
        },
        code: {
          searchType: [{
                code: 'operatorId',
            codeName: 'ID'
          },{
                code: 'operatorName',
            codeName: '이름'
          },{
                code: 'email',
            codeName: '이메일'
          }],
          searchDateType: [{
            code: 'createDate',
            codeName: '등록일'
          },{
            code: 'modifyDate',
            codeName: '수정일'
          }],
          companyCode: [],
          groupId:[],
          serviceId:[],
          operatorStateCode:[]
        },
        isLoad: {
          companyCode: false,
          groupId: false,
          serviceId: false,
          operatorStateCode: false
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
      companyCode: {
        get () {
          return this.code.companyCode.find(obj => obj.code === this.searchItem.companyCode) || null;
        },
        set (newValue) {
          this.searchItem.companyCode = newValue !== null ? newValue.code : null;
        }
      },
      groupId: {
        get () {
          return this.code.groupId.find(obj => obj.code === this.searchItem.groupId) || null;
        },
        set (newValue) {
          this.searchItem.groupId = newValue !== null ? newValue.groupId : null;
        }
      },
      serviceId: {
        get () {
          return this.code.serviceId.find(obj => obj.code === this.searchItem.serviceId) || null;
        },
        set (newValue) {
          this.searchItem.serviceId = newValue !== null ? newValue.serviceId : null;
        }
      },
      operatorStateCode: {
        get () {
          return this.code.operatorStateCode.find(obj => obj.code === this.searchItem.operatorStateCode) || null;
        },
        set (newValue) {
          this.searchItem.operatorStateCode = newValue !== null ? newValue.code : null;
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
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'COMPANY' }
        })
        .then((res) => {
          this.isLoad.companyCode = false;
          this.code.companyCode = res.data.items;
        });

        this.$https.get('/setting/operators/groups')
          .then((res) => {
            this.isLoad.groupId = false;
            this.code.groupId = res.data.items;
          });

        this.$https.get('/setting/operators/services')
          .then((res) => {
            this.isLoad.serviceId = false;
            this.code.serviceId = res.data.items;
          });

        this.$https.get('/system/commonCode', {
            q: { groupCode: 'OPERATOR_STATE' }
          })
          .then((res) => {
            this.isLoad.operatorStateCode = false;
            this.code.operatorStateCode = res.data.items;
          });
    },

    methods: {
      details (item) {
        this.$router.push({
          name: 'Operator 상세',
          params: { id: item.operatorId }
        })
      },

      fetchList (params = {}){
        const defaultParams = {
          page: this.pageInfo.page,
          size: this.pageInfo.size,
          q: this.queryParams
        };

        this.$https.get('/setting/management/operators', {...defaultParams, ...params})
          .then((res) => {
            // Setting API Service Name

            this.items = res.data.items.map(obj => {
              // obj.operatorServiceNames = (obj.operatorServiceList) ? obj.operatorServiceList.serviceName : [];
              // obj.operatorServiceNames = ['11','22'];
              const operatorServiceNames = [];
              const operatorGroupNames = [];
              obj.operatorServiceList.forEach( obj => {
                operatorServiceNames.push(obj.serviceName)
              })
              obj.operatorServiceNames = operatorServiceNames;
              obj.operatorGroupList.forEach( obj => {
                operatorGroupNames.push(obj.groupName)
              })
              obj.operatorGroupNames = operatorGroupNames;
              // console.log(this.items.operatorServiceNames);
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
            this.queryParams[key] = (key === 'accountLockYn' )
              ? (this.searchItem[key] === '잠김')
              : this.searchItem[key];
          }
        });

        this.fetchList({ page: 1 });
      },

      onReset (){
        Object.keys(this.searchItem).forEach((key) => {
          if (key === 'searchType'){
            this.searchItem[key] = 'operatorId';
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
        return window.location.href = '/api/excel/apps/download?q=' + q;
      },
    }
  }
</script>
