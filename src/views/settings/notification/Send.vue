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
            track-by="code"
            class="noEmpty"
            :allowEmpty="false"
            :showLabels="false"
            :searchable="false"
            :options="code.searchType"
            placeholder="전체"
          ></multiselect>
          <b-form-input type="text" class="keyword" v-model="searchItem.searchKeyword" placeholder="Enter Search text"></b-form-input>
        </b-form-fieldset>

        <b-form-fieldset
          label="Server Type"
          class="label-lg"
          :horizontal="true">
          <multiselect
            v-model="componentTypeCode"
            label="codeName"
            :showLabels="false"
            :searchable="false"
            :loading="isLoad.componentTypeCode"
            :options="code.componentTypeCode"
            track-by="codeName"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>
      </div>

      <div class="form-row">
        <b-form-fieldset
          label="알림 구분"
          class="inline"
          :horizontal="true">
          <multiselect
            v-model="policyTypeCode"
            :showLabels="false"
            :searchable="false"
            :options="code.policyTypeCode"
            :loading="isLoad.policyTypeCode"
            label="codeName"
            track-by="code"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>

        <b-form-fieldset
          label="수신 그룹"
          class="label-lg"
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
      </div>

      <div class="form-row">
        <b-form-fieldset
          label="알림 방법"
          class="inline"
          :horizontal="true">
          <multiselect
            v-model="alarmTypeCode"
            :showLabels="false"
            :searchable="false"
            :options="code.alarmTypeCode"
            :loading="isLoad.alarmTypeCode"
            label="codeName"
            track-by="codeName"
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
            placeholder="전체"
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
        <template slot="groupNames" slot-scope="row">
          <span class="badge" v-for="val in row.value">
            {{ val }}
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
  import moment from 'moment'

  export default {
    name: 'services',
    components: {
      //  ListContent
    },
    data (){
      return {
        fields: {
          alarmPolicyId: {label: 'ID'},
          serverType: {label: 'ServerType', 'class': 'text-left'},
          hostName: {label: 'Host Name', 'class': 'text-left'},
          ip: {label: 'IP', 'class': 'text-left'},
          policyTypeName: {label: '알림 구분', 'class': 'text-left'},
          policyThreshold: {label: '임계치', 'class': 'text-left'},
          policyOutbreak: {label: '발생수치', 'class': 'text-left'},
          policyDurationTime: {label: '지속시간', 'class': 'text-left'},
          groupNames: {label: '수신그룹', 'class': 'text-left'},
          alarmTypeName: {label: '알림 방법', 'class': 'text-left'},
          createDatetime: {label: '전송일', 'class': 'text-left'},
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
          searchType: null,
          searchKeyword: null,
          componentTypeCode: null,
          serverType: null,
          policyTypeCode: null,
          alarmTypeCode: null,
          groupId: null,
          searchDateType: 'createDate',
          searchDateFrom: null,
          searchDateTo: null
        },
        code: {
          searchType: [{
                code: 'hostName',
            codeName: 'Host Name'
          },
          {
                code: 'ip',
            codeName: 'IP'
          }],
          componentTypeCode: [],
          alarmTypeCode: [{
                code: 'ALARM_TYPE_CODE_01',
            codeName: 'Email'
          }],
          searchDateType: [{
            code: 'createDate',
            codeName: '등록일'
          }],
          groupId:[],
          policyTypeCode:[],
        },
        isLoad: {
          componentTypeCode:false,
          alarmTypeCode: false,
          groupId: false,
          policyTypeCode:false,
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
      groupId: {
        get () {
          return this.code.groupId.find(obj => obj.code === this.searchItem.groupId) || null;
        },
        set (newValue) {
          this.searchItem.groupId = newValue !== null ? newValue.groupId : null;
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
      componentTypeCode: {
        get () {
          return this.code.componentTypeCode.find(obj => obj.code === this.searchItem.componentTypeCode) || null;
        },
        set (newValue) {
          this.searchItem.componentTypeCode = newValue !== null ? newValue.code : null;
        }
      },
      alarmTypeCode: {
        get () {
          return this.code.alarmTypeCode.find(obj => obj.code === this.searchItem.alarmTypeCode) || null;
        },
        set (newValue) {
          this.searchItem.alarmTypeCode = newValue !== null ? newValue.code : null;
        }
      },
      policyTypeCode: {
        get () {
          return this.code.policyTypeCode.find(obj => obj.code === this.searchItem.policyTypeCode) || null;
        },
        set (newValue) {
          this.searchItem.policyTypeCode = newValue !== null ? newValue.code : null;
        }
      },
    },

    created (){
      this.fetchList();
      this.$https.get('/setting/operators/groups')
        .then((res) => {
          this.isLoad.groupId = false;
          this.code.groupId = res.data.items;
        });

      this.$https.get('/system/commonCode', {
          q: { groupCode: 'COMPONENT_TYPE' }
        })
        .then((res) => {
          this.isLoad.componentTypeCode = false;
          this.code.componentTypeCode = res.data.items;
        });

      this.$https.get('/system/commonCode', {
          q: { groupCode: 'POLICY_TYPE' }
        })
        .then((res) => {
          this.isLoad.policyTypeCode = false;
          this.code.policyTypeCode = res.data.items;
        });
    },

    methods: {
      details (item) {
        this.$router.push({
          name: '전송 내역 상세',
          params: { id: item.alarmPolicyId }
        })
      },

      fetchList (params = {}){
        const defaultParams = {
          page: this.pageInfo.page,
          size: this.pageInfo.size,
          q: this.queryParams
        };

        this.$https.get('/monitoring/policies/send', {...defaultParams, ...params})
          .then((res) => {
            // Setting API Service Name
            this.items = res.data.items.map(obj => {
              obj.groupNames = (obj.groupNames) ? obj.groupNames.split(',') : [];
              return obj
              console.log("zzz")
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
        this.queryParams = this.searchItem;

        this.fetchList({ page: 1 });
      },

      onReset (){
        Object.keys(this.searchItem).forEach((key) => {
          this.searchItem[key] = null;
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
        return window.location.href = '/api/setting/management/operators/excel/download?q=' + q;
      },
    }
  }
</script>
