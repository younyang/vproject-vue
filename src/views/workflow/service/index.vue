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
              v-model="searchWordTypeCode"
              label="codeName"
              :allowEmpty="false"
              :showLabels="false"
              :searchable="false"
              :options="code.searchWordTypeCode"
            ></multiselect>
          </b-form-fieldset>
          <b-form-fieldset class="col-sm-7 inline-field">
            <b-form-input type="text" v-model="searchItem.searchWord" placeholder="Enter Search text"></b-form-input>
          </b-form-fieldset>
        </div>

        <div class="form-group row">
          <b-form-fieldset
            class="col-sm-5"
            label="Process"
            :label-cols="5"
            :horizontal="true">
            <multiselect
              v-model="processSectionCode"
              :showLabels="false"
              :searchable="false"
              :options="code.processSectionCode"
              :loading="isLoad.processSectionCode"
              label="codeName"
              track-by="code"
              placeholder="전체"
            ></multiselect>
          </b-form-fieldset>

          <b-form-fieldset
            class="col-sm-5"
            label="Task"
            :label-cols="5"
            :horizontal="true">
            <multiselect
              v-model="interlockTargetCode"
              :showLabels="false"
              :searchable="false"
              :options="code.interlockTargetCode"
              :loading="isLoad.interlockTargetCode"
              label="codeName"
              track-by="code"
              placeholder="전체"
            ></multiselect>
          </b-form-fieldset>
        </div>

        <div class="form-group row">
          <b-form-fieldset
            class="col-sm-5"
            label="상태"
            :label-cols="5"
            :horizontal="true">
            <multiselect
              v-model="processStateCode"
              :showLabels="false"
              :searchable="false"
              :options="code.processStateCode"
              :loading="isLoad.processStateCode"
              label="codeName"
              track-by="code"
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
              v-model="periodTypeCode"
              label="codeName"
              :allowEmpty="false"
              :showLabels="false"
              :searchable="false"
              :options="code.periodTypeCode"
            ></multiselect>
          </b-form-fieldset>
          <b-form-fieldset class="col-sm-7 form-inline inline-field date-field">
            <b-form-input type="date" v-model="searchItem.startDate"></b-form-input> ~
            <b-form-input type="date" v-model="searchItem.endDate"></b-form-input>

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
  import moment from 'moment'

  export default {
    name: 'serviceProcessing',
    data (){
      return {
        fields: {
          processId: {label: 'PID'},
          processSectionCodeName: {label: 'Process', 'class': 'text-left'},
          taskNames: {label: 'Task', 'class': 'text-left'},
          createId: {label: '등록자'},
          processBeginDatetime: {label: '시작일시'},
          processEndDatetime: {label: '종료일시'},
          processStateCodeName: {label: '상태'}
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
          searchWordTypeCode: 'P',
          searchWord: null,
          processSectionCode: null,
          interlockTargetCode: null,
          processStateCode: null,
          periodTypeCode: 'BEGIN',
          startDate: null,
          endDate: null
        },
        code: {
          searchWordTypeCode: [{
            code: 'P',
            codeName: 'PID'
          },{
            code: 'T',
            codeName: 'TID'
          },{
            code: 'U',
            codeName: '등록자'
          }],
          periodTypeCode: [{
            code: 'BEGIN',
            codeName: '시작일'
          },{
            code: 'END',
            codeName: '종료일'
          }],
          processSectionCode: [],
          interlockTargetCode: [],
          processStateCode: []
        },
        isLoad: {
          processSectionCode: false,
          interlockTargetCode: false,
          processStateCode: false
        }
      }
    },

    computed: {
      searchWordTypeCode: {
        get () {
          return this.code.searchWordTypeCode.find(obj => obj.code === this.searchItem.searchWordTypeCode) || null;
        },
        set (newValue) {
          this.searchItem.searchWordTypeCode = newValue !== null ? newValue.code : null;
        }
      },
      periodTypeCode: {
        get () {
          return this.code.periodTypeCode.find(obj => obj.code === this.searchItem.periodTypeCode) || null;
        },
        set (newValue) {
          this.searchItem.periodTypeCode = newValue !== null ? newValue.code : null;
        }
      },
      processSectionCode: {
        get () {
          return this.code.processSectionCode.find(obj => obj.code === this.searchItem.processSectionCode) || null;
        },
        set (newValue) {
          this.searchItem.processSectionCode = newValue !== null ? newValue.code : null;
        }
      },
      interlockTargetCode: {
        get () {
          return this.code.interlockTargetCode.find(obj => obj.code === this.searchItem.interlockTargetCode) || null;
        },
        set (newValue) {
          this.searchItem.interlockTargetCode = newValue !== null ? newValue.code : null;
        }
      },
      processStateCode: {
        get () {
          return this.code.processStateCode.find(obj => obj.code === this.searchItem.processStateCode) || null;
        },
        set (newValue) {
          this.searchItem.processStateCode = newValue !== null ? newValue.code : null;
        }
      }
    },

    created (){
      // Referrer List
      this.fetchList();

      // Process Code
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'PROCESS_SECTION' }
        })
        .then((res) => {
          this.isLoad.processSectionCode = false;
          this.code.processSectionCode = res.data.items;
        });
      // Task Code
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'INTERLOCK_TARGET' }
        })
        .then((res) => {
          this.isLoad.interlockTargetCode = false;
          this.code.interlockTargetCode = res.data.items;
        });
      // State Code
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'PROCESS_STATE' }
        })
        .then((res) => {
          this.isLoad.processStateCode = false;
          this.code.processStateCode = res.data.items;
        });
    },

    methods: {
      details (item) {
        this.$router.push({
          name: 'Service Processing 상세',
          params: { id: item.processId }
        })
      },

      fetchList (params = {}){
        const defaultParams = {
          page: this.pageInfo.page,
          size: this.pageInfo.size,
          q: this.queryParams
        };

        this.$https.get('/serviceprocess', {...defaultParams, ...params})
          .then((res) => {
            this.items = res.data.items;
            this.pageInfo = res.data.pageInfo;
          });
      },

      onCalendar (day, type){
        this.searchItem.endDate = moment().format('YYYY-MM-DD')

        if (day === 'today'){
          this.searchItem.startDate = moment().format('YYYY-MM-DD')
        } else if (day === 'reset'){
          this.searchItem.startDate = null;
          this.searchItem.endDate = null;
        } else {
          this.searchItem.startDate = moment().subtract(day, type).format('YYYY-MM-DD');
        }
      },

      onSearch (){
        this.queryParams = {...this.searchItem};
        this.fetchList({ page: 1 });
      },

      onReset (){
        Object.keys(this.searchItem).forEach((key) => {
          if (key === 'searchWordTypeCode'){
            this.searchItem[key] = 'P';
          } else if (key === 'periodTypeCode') {
            this.searchItem[key] = 'BEGIN';
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

