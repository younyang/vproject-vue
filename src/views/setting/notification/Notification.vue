<template>
  <div class="animated fadeIn">
    <b-form class="searchBox" @reset="onReset">
      <div class="form-row">
        <b-form-fieldset
          label="알림 구분"
          class="inline"
          :horizontal="true">
          <multiselect
            v-model="componentTypeCode"
            label="codeName"
            :showLabels="false"
            :searchable="false"
            :loading="isLoad.componentTypeCode"
            :options="code.componentTypeCode"
            track-by="code"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>

        <b-form-fieldset
          label="알림 방법"
          class="label-lg"
          :horizontal="true">
          <multiselect
            v-model="alarmTypeCode"
            label="codeName"
            :showLabels="false"
            :searchable="false"
            :options="code.alarmTypeCode"
            :loading="isLoad.alarmTypeCode"
            track-by="code"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>
      </div>

      <div class="form-row">
        <b-form-fieldset
          label="수신 그룹"
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
          label="사용여부"
          class="label-lg"
          :horizontal="true">
          <multiselect
            v-model="searchItem.alarmPolicyUseYn"
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
          serverType: {label: 'ServerType', 'class': 'text-left'},
          alarmPolicyCompCount: {label: '알림 설정', 'class': 'text-left'},
          groupNames: {label: '수신 그룹', 'class': 'text-left'},
          alarmTypeName: {label: '알림 방법', 'class': 'text-left'},
          modifyDatetime:{label: '수정일', 'class': 'text-left'},
          alarmPolicyUseYnName: {label: '사용여부', 'class': 'text-left'},
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
          componentTypeCode: null,
          alarmPolicyUseYn: null,
          alarmTypeCode: null,
          groupId: null,
          searchDateType: 'createDate',
          searchDateFrom: null,
          searchDateTo: null
        },
        code: {
          componentTypeCode: [],
          alarmTypeCode: [{
                code: 'ALARM_TYPE_CODE_01',
            codeName: 'Email'
          }],
          searchDateType: [{
            code: 'createDate',
            codeName: '등록일'
          },{
            code: 'modifyDate',
            codeName: '수정일'
          }],
          groupId:[],
        },
        isLoad: {
          componentTypeCode:false,
          alarmTypeCode: false,
          groupId: false,
        }
      }
    },

    computed: {
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
      }
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
    },

    methods: {
      details (item) {
        this.$router.push({
          name: 'Notification 상세',
          params: { id: item.alarmPolicyId }
        })
      },

      fetchList (params = {}){
        const defaultParams = {
          page: this.pageInfo.page,
          size: this.pageInfo.size,
          q: this.queryParams
        };

        this.$https.get('/monitoring/policies', {...defaultParams, ...params})
          .then((res) => {
            // Setting API Service Name
            this.items = res.data.items.map(obj => {
              obj.groupNames = (obj.groupNames) ? obj.groupNames.split(',') : [];
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
            this.queryParams[key] = (key === 'alarmPolicyUseYn' )
              ? (this.searchItem[key] === '사용')
              : this.searchItem[key];
          }
        });

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
