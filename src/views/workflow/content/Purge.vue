<template>
  <div class="animated fadeIn">
    <b-form class="searchBox" @reset="onReset">
      <div class="form-row">
        <b-form-fieldset
          label="검색어"
          class="inline"
          :horizontal="true">
          <multiselect
            v-model="searchWordTypeCode"
            label="codeName"
            class="noEmpty"
            :allowEmpty="false"
            :showLabels="false"
            :searchable="false"
            :options="code.searchWordTypeCode"
          ></multiselect>
          <b-form-input type="text" class="keyword" v-model="searchItem.searchWord" placeholder="Enter Search text"></b-form-input>
        </b-form-fieldset>

        <!--
        <b-form-fieldset
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
        -->
      </div>

      <div class="form-row">
        <!--
        <b-form-fieldset
          label="Genre"
          style="width:60%"
          :horizontal="true">
          <multiselect
            v-model="genreCode"
            :showLabels="false"
            :searchable="false"
            :options="code.genreCode"
            :loading="isLoad.genreCode"
            label="codeName"
            track-by="code"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>
        -->

        <b-form-fieldset
          label="상태"
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

      <div class="form-row">
        <b-form-fieldset
          label="기간"
          class="inline date"
          :horizontal="true">
          <multiselect
            v-model="periodTypeCode"
            label="codeName"
            :allowEmpty="false"
            :showLabels="false"
            :searchable="false"
            :options="code.periodTypeCode"
          ></multiselect>

          <b-form-input type="date" class="form-date" v-model="searchItem.startDate"></b-form-input> ~
          <b-form-input type="date" class="form-date" v-model="searchItem.endDate"></b-form-input>

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
    </section>

    <section class="board">
      <b-table
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
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'purge',
    data (){
      return {
        fields: {
          processId: {label: 'PID'},
          contentId: {label: 'CID'},
          contentName: {label: 'Content', 'class': 'text-left'},
          contentGenreName: {label: 'Genre'},
          contentServiceTypeCode: {label: 'Service Type'},
          contentTotalFileSize: {label: 'Total_file_size', 'class': 'text-right'},
          processBeginDatetime: {label: '요청일시'},
          processEndDatetime: {label: '처리일시'},
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
          searchWordTypeCode: 'CT',
          searchWord: null,
          serviceTypeCode: null,
          genreCode: null,
          processStateCode: null,
          periodTypeCode: 'BEGIN',
          startDate: null,
          endDate: null
        },
        code: {
          searchWordTypeCode: [{
            code: 'CT',
            codeName: 'Content'
          },{
            code: 'P',
            codeName: 'PID'
          },{
            code: 'C',
            codeName: 'CID'
          }],
          periodTypeCode: [{
            code: 'BEGIN',
            codeName: '요청일자'
          },{
            code: 'END',
            codeName: '처리일자'
          }],
          serviceTypeCode: [],
          genreCode: [],
          processStateCode: []
        },
        isLoad: {
          serviceTypeCode: true,
          genreCode: true,
          processStateCode: true
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
      serviceTypeCode: {
        get () {
          return this.code.serviceTypeCode.find(obj => obj.code === this.searchItem.serviceTypeCode) || null;
        },
        set (newValue) {
          this.searchItem.serviceTypeCode = newValue !== null ? newValue.code : null;
        }
      },
      genreCode: {
        get () {
          return this.code.genreCode.find(obj => obj.code === this.searchItem.genreCode) || null;
        },
        set (newValue) {
          this.searchItem.genreCode = newValue !== null ? newValue.code : null;
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
      // Purge List
      this.fetchList();

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
          name: 'Purge 상세',
          params: { id: item.processId }
        })
      },

      fetchList (params = {}){
        const defaultParams = {
          page: this.pageInfo.page,
          size: this.pageInfo.size,
          q: this.queryParams
        };

        this.$https.get('/contentprocess/purges', {...defaultParams, ...params})
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
        this.queryParams = {};
        Object.keys(this.searchItem).forEach(key => {
          if (this.searchItem[key] !== null && this.searchItem[key] !== ''){
            this.queryParams[key] = this.searchItem[key];
          }
        });
        this.fetchList({ page: 1 });
      },

      onReset (){
        Object.keys(this.searchItem).forEach((key) => {
          if (key === 'searchWordTypeCode'){
            this.searchItem[key] = 'CT';
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
      },

      excelDownload(){
        const queryParams = JSON.stringify(this.queryParams);
        const q = encodeURI(queryParams);
        return window.location.href = '/api/excel/content/purges/download?q=' + q;
      }
    }
  }
</script>
