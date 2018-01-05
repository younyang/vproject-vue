<template>
  <div class="animated fadeIn">
    <b-form class="searchBox" @reset="onReset">
      <div class="form-group">
        <b-form-fieldset
          label="검색어"
          style="width:60%"
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

      <div class="form-group">
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

        <b-form-fieldset
          label="상태"
          class="label-lg"
          :horizontal="true">
          <multiselect
            v-model="statusCode"
            :showLabels="false"
            :searchable="false"
            :options="code.statusCode"
            :loading="isLoad.statusCode"
            label="codeName"
            track-by="code"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>
      </div>

      <div class="form-group">
        <b-form-fieldset
          label="기간"
          class="inline"
          style="width:100%"
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
        <b-button type="button" variant="primary" @click="onSearch"><i class="icon-magnifier"></i></b-button>
        <b-button type="reset" variant="outline-secondary"><i class="icon-reload"></i></b-button>
      </div>
    </b-form>

    <div class="row">
      <div class="col">
        <section class="board-btn">
          <b-button type="button" variant="primary">
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
    name: 'purge',
    data (){
      return {
        fields: {
          pid: {label: 'PID'},
          cid: {label: 'CID'},
          content: {label: 'Content', 'class': 'text-left'},
          genre: {label: 'Genre'},
          serviceType: {label: 'Service Type'},
          fileSize: {label: 'Total_file_size', 'class': 'text-right'},
          createDate: {label: '요청일시'},
          modifyDate: {label: '처리일시'},
          status: {label: '상태'}
        },
        items: [{
          pid: 123,
          cid: 456,
          content: '스파이더 맨',
          genre: '영화',
          serviceType: 'CMS',
          fileSize: '200 MB',
          createDate: '2018-05-21 11:00:32',
          modifyDate: '2018-05-21 11:00:32',
          status: '성'
        }],
        pageInfo: {
          page: 1,
          size: 10,
          resultCount: 1,
          totalCount: 1
        },
        pageOptions: [10, 20, 50, 100],

        queryParams: {},

        searchItem: {
          searchType: 'content',
          searchKeyword: null,
          serviceTypeCode: null,
          genreCode: null,
          statusCode: null,
          searchDateType: 'createDate',
          searchDateFrom: null,
          searchDateTo: null
        },
        code: {
          searchType: [{
            code: 'content',
            codeName: 'Content'
          },{
            code: 'pid',
            codeName: 'PID'
          },{
            code: 'cid',
            codeName: 'CID'
          }],
          searchDateType: [{
            code: 'createDate',
            codeName: '등록일'
          },{
            code: 'modifyDate',
            codeName: '수정일'
          }],
          serviceTypeCode: [{
            code: 'SERVICE_01',
            codeName: 'VOD'
          }],
          genreCode: [{
            code: 'GENRE_01',
            codeName: '영화'
          }],
          statusCode: [{
            code: 'STATUS_01',
            codeName: '진행중'
          }]
        },
        isLoad: {
          serviceTypeCode: false,
          genreCode: false,
          statusCode: false
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
      genreCode: {
        get () {
          return this.code.genreCode.find(obj => obj.code === this.searchItem.genreCode) || null;
        },
        set (newValue) {
          this.searchItem.genreCode = newValue !== null ? newValue.code : null;
        }
      },
      statusCode: {
        get () {
          return this.code.statusCode.find(obj => obj.code === this.searchItem.statusCode) || null;
        },
        set (newValue) {
          this.searchItem.statusCode = newValue !== null ? newValue.code : null;
        }
      }
    },

    created (){
      // Preload List
      // this.fetchList();
    },

    methods: {
      details (item) {
        this.$router.push({
          name: 'Purge 상세',
          params: { id: item.pid }
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
