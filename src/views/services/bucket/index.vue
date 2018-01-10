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
            :showLabels="false"
            :searchable="false"
            :options="code.searchType"
            placeholder="전체"
          ></multiselect>
          <b-form-input type="text" class="keyword" v-model="searchItem.searchKeyword"
                        placeholder="Enter Search text"></b-form-input>
        </b-form-fieldset>

      </div>

      <div class="form-group">
        <b-form-fieldset
          label="Service Type"
          class="..."
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

        <b-form-fieldset
          label="사용여부"
          style="width:60%"
          :horizontal="true">
          <multiselect
            v-model="searchItem.useYn"
            :showLabels="false"
            :searchable="false"
            :options="['사용', '미사용']"
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
            :showLabels="false"
            :searchable="false"
            :options="code.searchDateType"
            placeholder="전체"
          ></multiselect>

          <b-form-input type="date" class="form-date" v-model="searchItem.searchDateFrom"></b-form-input>
          ~
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


    <section class="board-btn">
      <b-button type="button" variant="primary">
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
        <template slot="useYn" scope="row">{{row.value? '사용':'미사용'}}</template>
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
  import moment from 'moment';

  export default {
    name: "bucket",
    data (){
      return {
        fields: {
          bucketId: {label: 'ID'},
          s3BucketId: {label: 'S3 Bucket', 'class': 'text-left'},
          name: {label: 'Bucket Name', 'class': 'text-left'},
          serviceTypeName: {label: 'Service Type'},
          createDateTime: {label: '등록일'},
          modifyDateTime: {label: '수정일'},
          useYn: {label: '사용여부'}
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
          serviceTypeCode: null,
          useYn: null,
          searchDateType: null,
          searchDateFrom: null,
          searchDateTo: null
        },
        code: {
          searchType: [{
            code: 's3bucketId',
            codeName: 'Bucket ID'
          },{
            code: 'name',
            codeName: 'Bucket Name'
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
          serviceTypeCode: true
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
      serviceTypeCode: {
        get () {
          return this.code.serviceTypeCode.find(obj => obj.code === this.searchItem.serviceTypeCode) || null;
        },
        set (newValue) {
          this.searchItem.serviceTypeCode = newValue !== null ? newValue.code : null;
        }
      }
    },


    created (){
      // Edge List
      this.fetchList();

      // Service Type Code
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
      details(item) {
        this.$router.push({
          name: 'Bucket 상세',
          params: {id: item.bucketId}
        })
      },

      creates(item) {
        this.$router.push({
          name: 'Edge 등록',
          query: {
            q: JSON.stringify({id: item.edgeId})
          }
        })
      },

      fetchList(params = {}) {
        const defaultParams = {
          page: this.pageInfo.page,
          size: this.pageInfo.size,
          q: this.queryParams
        };

        this.$https.get('/origin/bucket', {...defaultParams, ...params})
          .then((res) => {
            // Setting Service Type Name
            this.items = res.data.items.map(obj => {
              obj.serviceTypeName = (obj.serviceTypeName) ? obj.serviceTypeName.split(',') : [];
              return obj
            });
            this.pageInfo = res.data.pageInfo;
          });
      },

      onCalendar(day, type) {
        this.searchItem.searchDateTo = moment().format('YYYY-MM-DD')

        if (day === 'today') {
          this.searchItem.searchDateFrom = moment().format('YYYY-MM-DD')
        } else if (day === 'reset') {
          this.searchItem.searchDateFrom = null;
          this.searchItem.searchDateTo = null;
        } else {
          this.searchItem.searchDateFrom = moment().subtract(day, type).format('YYYY-MM-DD');
        }
      },

      onSearch() {
        this.queryParams = {};

        Object.keys(this.searchItem).forEach(key => {
          if (this.searchItem[key] !== null && this.searchItem[key] !== '') {
            this.queryParams[key] = (key === 'useYn')
              ? (this.searchItem[key] === '사용')
              : this.searchItem[key];
          }
        });

        this.fetchList({page: 1});
      },

      onReset() {
        Object.keys(this.searchItem).forEach((key) => {
          if (key === 'searchType') {
            this.searchItem[key] = null;
          } else if (key === 'searchDateType') {
            this.searchItem[key] = null;
          } else {
            this.searchItem[key] = null;
          }
        });
        this.queryParams = {};
        this.fetchList();
      },

      onRowSelect(size) {
        this.fetchList({page: 1, size});
      },

      onPagination(page) {
        this.fetchList({page});
      }
    }
  }
</script>
