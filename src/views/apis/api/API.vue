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
          label="서비스명"
          class="label-lg"
          :horizontal="true">
          <multiselect
            v-model="serviceCode"
            :showLabels="false"
            :searchable="false"
            :options="code.serviceCode"
            :loading="isLoad.serviceCode"
            label="codeName"
            track-by="code"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>
      </div>

      <div class="form-row">
        <b-form-fieldset
          label="Version"
          :horizontal="true">
          <b-form-input type="text" style="width:130px" v-model="searchItem.apiVersion"></b-form-input>
        </b-form-fieldset>

        <b-form-fieldset
          label="Method"
          class="label-lg"
          :horizontal="true">
          <b-form-checkbox-group v-model="searchItem.httpMethodCode" name="httpMethodCode" :options="code.httpMethodCode">
          </b-form-checkbox-group>
        </b-form-fieldset>
      </div>

      <div class="form-row">
        <b-form-fieldset
          label="Adaptor"
          :horizontal="true">
          <multiselect
            v-model="adaptorCode"
            :showLabels="false"
            :searchable="false"
            :options="code.adaptorCode"
            :loading="isLoad.adaptorCode"
            label="codeName"
            track-by="code"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>

        <b-form-fieldset
          label="API 구분"
          class="label-lg"
          :horizontal="true">
          <multiselect
            v-model="apiSectionCode"
            :showLabels="false"
            :searchable="false"
            :options="code.apiSectionCode"
            :loading="isLoad.apiSectionCode"
            label="codeName"
            track-by="code"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>
      </div>

      <div class="form-row">
        <b-form-fieldset
          label="상태"
          :horizontal="true">
          <multiselect
            v-model="apiStateCode"
            :showLabels="false"
            :searchable="false"
            :options="code.apiStateCode"
            :loading="isLoad.apiStateCode"
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
            v-model="searchItem.apiUseYn"
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
      <b-button type="button" variant="primary" @click="excelDownload()">
        엑셀 다운로드
      </b-button>
      <b-button type="button" variant="primary" :to="{ name: 'API 등록' }">
        등록
      </b-button>
    </section>

    <section class="board">
      <ag-grid
        :fields="fields"
        :items="items"
        :onRowSelected="onRowSelected"
      ></ag-grid>
    </section>
  </div>
</template>

<script>
  import moment from 'moment';
  import AgGrid from '@/components/Grid';

  export default {
    name: 'services',
    components: {
      AgGrid
    },
    data (){
      return {
        gridOptions: {},

        fields: [
          { headerName: 'ID', field: 'apiId' },
          { headerName: '서비스명', field: 'serviceCodeName' },
          { headerName: 'API명', field: 'apiName' },
          { headerName: 'Northbound URL', field: 'nbBaseUrl' },
          { headerName: 'Version', field: 'apiVersion' },
          { headerName: 'Method', field: 'httpMethodCodeName' },
          { headerName: '상태', field: 'apiStateCodeName' },
          { headerName: 'Adaptor', field: 'adaptorCodeName' },
          { headerName: 'API 구분', field: 'apiSectionCodeName' },
          { headerName: '등록일시', field: 'createDateTime' },
          { headerName: '수정일시', field: 'modifyDateTime' },
          { headerName: '사용여부', field: 'apiUseYn' },
        ],
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
          searchType: 'apiName',
          searchKeyword: null,
          serviceCode: null,
          adaptorCode: null,
          httpMethodCode: [],
          apiVersion: null,
          apiSectionCode: null,
          apiStateCode: null,
          apiUseYn: null,
          searchDateType: 'createDate',
          searchDateFrom: null,
          searchDateTo: null
        },
        code: {
          searchType: [{
              code: 'apiName',
              codeName: 'API Name'
            },{
              code: 'nbBaseUrl',
              codeName: 'Northbound URL'
            },{
              code: 'apiId',
              codeName: 'ID'
            }
          ],
          searchDateType: [{
              code: 'createDate',
              codeName: '등록일'
            },{
              code: 'modifyDate',
              codeName: '수정일'
            }
          ],
          serviceCode: [],
          adaptorCode: [],
          httpMethodCode: [],
          apiStateCode: [],
          apiSectionCode: []
        },
        isLoad: {
          serviceCode: false,
          adaptorCode: false,
          httpMethodCode: false,
          apiStateCode: false,
          apiSectionCode: false
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
      serviceCode: {
        get () {
          return this.code.serviceCode.find(obj => obj.code === this.searchItem.serviceCode) || null;
        },
        set (newValue) {
          this.searchItem.serviceCode = newValue !== null ? newValue.code : null;
        }
      },
      adaptorCode: {
        get () {
          return this.code.adaptorCode.find(obj => obj.code === this.searchItem.adaptorCode) || null;
        },
        set (newValue) {
          this.searchItem.adaptorCode = newValue !== null ? newValue.code : null;
        }
      },
      apiSectionCode: {
        get () {
          return this.code.apiSectionCode.find(obj => obj.code === this.searchItem.apiSectionCode) || null;
        },
        set (newValue) {
          this.searchItem.apiSectionCode = newValue !== null ? newValue.code : null;
        }
      },
      apiStateCode: {
        get () {
          return this.code.apiStateCode.find(obj => obj.code === this.searchItem.apiStateCode) || null;
        },
        set (newValue) {
          this.searchItem.apiStateCode = newValue !== null ? newValue.code : null;
        }
      }
    },

    created (){

      this.fetchList();

      this.$https.get('/system/commonCode', {q: { groupCode: 'API_SERVICE' }})
        .then((res) => {
          this.isLoad.serviceCode = false;
          this.code.serviceCode = res.data.items;
      });

      this.$https.get('/system/commonCode', {q: { groupCode: 'API_ADAPTOR' }})
        .then((res) => {
          this.isLoad.adaptorCode = false;
          this.code.adaptorCode = res.data.items;
      });

      this.$https.get('/system/commonCode', {q: { groupCode: 'API_SECTION' }})
        .then((res) => {
          this.isLoad.apiSectionCode = false;
          this.code.apiSectionCode = res.data.items;
      });

      this.$https.get('/system/commonCode', {q: { groupCode: 'HTTP_METHOD' }})
        .then((res) => {
          this.isLoad.httpMethodCode = false;
          const httpMethodCodeList = [];
          res.data.items.forEach(obj => {
            httpMethodCodeList.push({
              text: obj.codeName,
              value: obj.code
            })
          });
          this.code.httpMethodCode = httpMethodCodeList;
      });

      this.$https.get('/system/commonCode', {q: { groupCode: 'API_STATE' }})
        .then((res) => {
          this.isLoad.apiStateCode = false;
          this.code.apiStateCode = res.data.items;
      });
    },

    methods: {
      onRowSelected (item){
        this.$router.push({ name: 'API 상세', params: { id: item.apiId }})

      },

      fetchList (params = {}){
        const defaultParams = {
          //page: this.pageInfo.page,
          //size: this.pageInfo.size,
          q: this.queryParams
        };

        this.$https.get('/apiManagement/apis', {...defaultParams, ...params})
          .then((res) => {
            // Setting Service Type Name
            this.items = res.data.items.map(obj => {
              obj.nbBaseUrl = obj.nbBaseUrl.substring(obj.nbBaseUrl.indexOf('/', 10));
              return obj;
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
            this.queryParams[key] = (key === 'apiUseYn')
              ? (this.searchItem[key] === '사용')
              : this.searchItem[key];
          }
        });

        this.fetchList({ page: 1 });
      },

      onReset (){
        Object.keys(this.searchItem).forEach((key) => {
          if (key === 'searchType'){
            this.searchItem[key] = 'apiName';
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
        return window.location.href = '/api/excel/apis/download?q=' + q;
      },
    }
  }
</script>
