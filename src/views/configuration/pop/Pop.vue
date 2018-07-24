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
          <b-form-input type="text" class="keyword" v-model="searchItem.searchKeyword"
                        placeholder=""></b-form-input>
        </b-form-fieldset>

        <b-form-fieldset
          label="품솔팀"
          class="label-lg"
          :horizontal="true">
          <multiselect
            v-model="qualitySolutionTeamCode"
            :showLabels="false"
            :searchable="false"
            :options="code.qualitySolutionTeamCode"
            :loading="isLoad.qualitySolutionTeamCode"
            label="codeName"
            track-by="code"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>
      </div>

      <!--<div class="form-row">-->
      <!--<b-form-fieldset-->
      <!--label="배포상태"-->
      <!--class="inline date"-->
      <!--:horizontal="true">-->
      <!--<multiselect-->
      <!--v-model="distributeStateCode"-->
      <!--:showLabels="false"-->
      <!--:searchable="false"-->
      <!--:options="code.distributeStateCode"-->
      <!--:loading="isLoad.qualitySolutionTeamCode"-->
      <!--label="codeName"-->
      <!--track-by="code"-->
      <!--placeholder="전체"-->
      <!--&gt;</multiselect>-->
      <!--</b-form-fieldset>-->
      <!--</div>-->

      <div class="form-row">
        <b-form-fieldset
          label="지역"
          class="inline"
          :horizontal="true">
          <multiselect
            v-model="geoCode"
            :showLabels="false"
            :options="code.geoCode"
            :loading="isLoad.geoCode"
            :class="{'invalid': !valid.geoCode }"
            track-by="code"
            label="codeName"
            style="width:156px"
            placeholder="선택"
          ></multiselect>
        </b-form-fieldset>

        <b-form-fieldset
          label="사용여부"
          class="label-lg"
          :horizontal="true">
          <multiselect
            v-model="searchItem.popUseYn"
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

          <b-form-input type="date" class="form-date"
                        v-model="searchItem.searchDateFrom"></b-form-input>
          ~
          <b-form-input type="date" class="form-date"
                        v-model="searchItem.searchDateTo"></b-form-input>

          <b-button class="btn-day" @click="onCalendar('today')">오늘</b-button>
          <b-button class="btn-day" @click="onCalendar(7, 'days')">7일</b-button>
          <b-button class="btn-day" @click="onCalendar(1, 'month')">1개월</b-button>
          <b-button class="btn-day" @click="onCalendar(3, 'month')">3개월</b-button>
          <b-button class="btn-day" @click="onCalendar('reset')">전체</b-button>
        </b-form-fieldset>
      </div>
      <div class="search-btn">
        <b-button type="reset" variant="outline-secondary" v-b-tooltip.hover title="초기화"><i
          class="icon-reload"></i></b-button>
        <b-button type="button" variant="primary" @click="onSearch" v-b-tooltip.hover title="검색"><i
          class="icon-magnifier"></i></b-button>
      </div>
    </b-form>

    <section class="board-btn">
      <b-button type="button" variant="primary" @click="excelDownload()">
        엑셀 다운로드
      </b-button>
      <b-button type="button" variant="primary" :to="{ name: 'Pop 등록' }">
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
        <template slot="popUseYn" slot-scope="row">{{row.value? '사용':'미사용'}}</template>

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
    name: 'pops',
    data() {
      return {
        fields: {
          popId: {label: 'ID'},
          popName: {label: 'Pop Name', 'class': 'text-left'},
          popHostName: {label: 'Host Name(Prefix)', 'class': 'text-left'},
          geoCodeName: {label: '지역'},
          qualitySolutionTeamCodeName: {label: '품솔팀'},
          createDateTime: {label: '등록일시'},
          modifyDateTime: {label: '수정일시'},
          popUseYn: {label: '사용여부'},
          // processStateCodeName: {label: '배포상태'},
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
          searchType: 'popName',
          searchKeyword: null,
          qualitySolutionTeamCode: null,
          geoCode: null,
          popUseYn: null,
          searchDateType: 'createDate',
          searchDateFrom: null,
          searchDateTo: null
        },

        code: {
          searchType: [{
            code: 'popName',
            codeName: 'Pop Name'
          }, {
            code: 'popHostName',
            codeName: 'Host Name'
          }, {
            code: 'popId',
            codeName: 'ID'
          }],
          searchDateType: [{
            code: 'createDate',
            codeName: '등록일'
          }, {
            code: 'modifyDate',
            codeName: '수정일'
          }],
          qualitySolutionTeamCode: [],
          geoCode: [],
          // distributeStateCode: []

        },
        isLoad: {
          qualitySolutionTeamCode: false,
          geoCode: true,
          // distributeStateCode: []
        }
      }
    },

    computed: {
      searchType: {
        get() {
          return this.code.searchType.find(obj => obj.code === this.searchItem.searchType) || null;
        },
        set(newValue) {
          this.searchItem.searchType = newValue !== null ? newValue.code : null;
        }
      },
      searchDateType: {
        get() {
          return this.code.searchDateType.find(obj => obj.code === this.searchItem.searchDateType) || null;
        },
        set(newValue) {
          this.searchItem.searchDateType = newValue !== null ? newValue.code : null;
        }
      },
      qualitySolutionTeamCode: {
        get() {
          return this.code.qualitySolutionTeamCode.find(obj => obj.code === this.searchItem.qualitySolutionTeamCode) || null;
        },
        set(newValue) {
          this.searchItem.qualitySolutionTeamCode = newValue !== null ? newValue.code : null;
        }
      },
      geoCode: {
        get() {
          return this.code.geoCode.find(obj => obj.code === this.searchItem.geoCode) || null;
        },
        set(newValue) {
          this.searchItem.geoCode = newValue !== null
            ? newValue.code : null;
        },
      },
      // distributeStateCode: {
      //   get() {
      //     return this.code.geoCode.find(obj => obj.code === this.items.geoCode) || null;
      //   },
      //   set(newValue) {
      //     this.items.geoCode = newValue !== null
      //       ? newValue.code : null;
      //   }
      // },
    },

    created() {
      // Pop List
      this.fetchList();

      // 품솔팀 Code
      this.$https.get('/system/commonCode', {
        q: {groupCode: 'QUALITY_TEAM'}
      })
        .then((res) => {
          this.isLoad.qualitySolutionTeamCode = false;
          this.code.qualitySolutionTeamCode = res.data.items;
        });

      // region Code
      this.$https.get('/system/commonCode', {
        q: {groupCode: 'GEO'}
      }).then((res) => {
        this.isLoad.geoCode = false;
        this.code.geoCode = res.data.items;
      });
    },

    methods: {
      details(item) {
        this.$router.push({name: 'Pop 상세', params: {id: item.popId}})
      },

      fetchList(params = {}) {
        const defaultParams = {
          page: this.pageInfo.page,
          size: this.pageInfo.size,
          q: this.queryParams
        };

        this.$https.get('/pops', {...defaultParams, ...params})
          .then((res) => {
            this.items = res.data.items;
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
            this.queryParams[key] = (key === 'popUseYn')
              ? (this.searchItem[key] === '사용')
              : this.searchItem[key];
          }
        });

        this.fetchList({page: 1});
      },

      onReset() {
        Object.keys(this.searchItem).forEach((key) => {
          if (key === 'searchType') {
            this.searchItem[key] = 'popName';
          } else if (key === 'searchDateType') {
            this.searchItem[key] = 'createDate';
          } else {
            this.searchItem[key] = null;
          }
        });
        this.queryParams = {};
        this.fetchList();
      },

      // validation
      valid() {
        return {
          qualitySolutionTeamCode: this.items.qualitySolutionTeamCode !== null,
          dataCenterCode: this.items.dataCenterCode !== null,
          geoCode: this.items.geoCode !== null
        }
      },

      onRowSelect(size) {
        this.fetchList({page: 1, size});
      },

      onPagination(page) {
        this.fetchList({page});
      },

      excelDownload() {
        const queryParams = JSON.stringify(this.queryParams);
        const q = encodeURI(queryParams);
        return window.location.href = '/api/excel/pops/download?q=' + q;
      }
    }
  }
</script>
