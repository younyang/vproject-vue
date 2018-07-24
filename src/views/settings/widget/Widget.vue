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
          label="Display"
          class="label-lg"
          :horizontal="true">
          <multiselect
            v-model="displayCode"
            :showLabels="false"
            :searchable="false"
            :options="code.displayCode"
            :loading="isLoad.displayCode"
            label="codeName"
            track-by="code"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>
      </div>

      <div class="form-row">
        <b-form-fieldset
          label="Target"
          :horizontal="true">
          <multiselect
            v-model="targetCode"
            :showLabels="false"
            :searchable="false"
            :options="code.targetCode"
            :loading="isLoad.targetCode"
            label="codeName"
            track-by="code"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>

        <b-form-fieldset
          label="사용여부"
          class="label-lg"
          :horizontal="true">
          <multiselect
            v-model="searchItem.widgetUseYn"
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
      <b-button type="button" variant="primary" :to="{ name: 'Widget 등록' }">
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
        <template slot="widgetDisplayNames" slot-scope="row">
          <span class="badge" v-for="val in row.value">
            {{ val }}
          </span>
        </template>
        <template slot="widgetTargetNames" slot-scope="row">
          <span class="badge" v-for="val in row.value">
            {{ val }}
          </span>
        </template>
        <template slot="widgetUseYn" slot-scope="row">{{row.value? '사용':'미사용'}}</template>
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
          widgetId: {label: 'ID'},
          widgetName: {label: 'Widget Name', 'class': 'text-left'},
          widgetSourceName: {label: 'Data Source', 'class': 'text-left'},
          widgetDisplayNames: {label: 'Display', 'class': 'text-left'},
          widgetTargetNames:{label: 'Target', 'class': 'text-left'},
          createDateTime: {label: '등록일'},
          modifyDateTime: {label: '수정일'},
          widgetUseYn: {label: '사용여부'}
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
          searchType: 'widgetName',
          searchKeyword: null,
          displayCode: null,
          targetCode: null,
          widgetUseYn: null,
          searchDateType: 'createDate',
          searchDateFrom: null,
          searchDateTo: null
        },
        code: {
          searchType: [{
                code: 'widgetName',
            codeName: 'Widget Name'
          },{
                code: 'widgetSourceName',
            codeName: 'Data Source'
          },{
                code: 'widgetId',
            codeName: 'ID'
          }],
          searchDateType: [{
            code: 'createDate',
            codeName: '등록일'
          },{
            code: 'modifyDate',
            codeName: '수정일'
          }],
          displayCode: [],
          targetCode:[]
        },
        isLoad: {
          displayCode: false,
          targetCode: false
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
      displayCode: {
        get () {
          return this.code.displayCode.find(obj => obj.code === this.searchItem.displayCode) || null;
        },
        set (newValue) {
          this.searchItem.displayCode = newValue !== null ? newValue.code : null;
        }
      },
      targetCode: {
        get () {
          return this.code.targetCode.find(obj => obj.code === this.searchItem.targetCode) || null;
        },
        set (newValue) {
          this.searchItem.targetCode = newValue !== null ? newValue.code : null;
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
          q: { groupCode: 'WIDGET_DISPLAY' }
      })
      .then((res) => {
        this.isLoad.displayCode = false;
        this.code.displayCode = res.data.items;
      });

      this.$https.get('/system/commonCode', {
        q: { groupCode: 'WIDGET_TARGET' }
      })
      .then((res) => {
        this.isLoad.targetCode = false;
        this.code.targetCode = res.data.items;
      });
    },

    methods: {
      details (item) {
        this.$router.push({
          name: 'Widget 상세',
          params: { id: item.widgetId }
        })
      },

      fetchList (params = {}){
        const defaultParams = {
          page: this.pageInfo.page,
          size: this.pageInfo.size,
          q: this.queryParams
        };

        this.$https.get('/setting/widget', {...defaultParams, ...params})
          .then((res) => {
            this.items = res.data.items.map(obj => {
              const widgetDisplayNames = [];
              const widgetTargetNames = [];
              obj.widgetDisplayList.forEach( obj => {
                widgetDisplayNames.push(obj.widgetDisplayName)
              })
              obj.widgetDisplayNames = widgetDisplayNames;

              obj.widgetTargetList.forEach( obj => {
                widgetTargetNames.push(obj.widgetTargetName)
              })
              obj.widgetTargetNames = widgetTargetNames;
              
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
            this.queryParams[key] = (key === 'widgetUseYn' )
              ? (this.searchItem[key] === '사용')
              : this.searchItem[key];
          }
        });

        this.fetchList({ page: 1 });
      },

      onReset (){
        Object.keys(this.searchItem).forEach((key) => {
          if (key === 'searchType'){
            this.searchItem[key] = 'widgetName';
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
        return window.location.href = '/api/setting/widget/excel/download?q=' + q;
      },
    }
  }
</script>
