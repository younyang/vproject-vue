<template>
  <div class="animated fadeIn">
    <b-form class="formView" :validated="inValidForm" novalidate>
    </b-form>


    <div class="page-btn">
      <b-button type="button" variant="outline-secondary" :to="{ name: 'API 관리' }">취소</b-button>
      <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
    </div>

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
          apiId: {label: 'ID'},
          serviceCodeName: {label: '서비스명', 'class': 'text-left'},
          apiName: {label: 'API명', 'class': 'text-left'},
          nbBaseUrl: {label: 'Northbound URL', 'class': 'text-left'},
          apiVersion: {label: 'Version'},
          httpMethodCodeName: {label: 'Method'},
          apiStateCodeName: {label: '상태'},
          adaptorCodeName: {label: 'Adaptor'},
          apiSectionCodeName: {label: 'API 구분'},
          createDateTime: {label: '등록일시'},
          modifyDateTime: {label: '수정일시'},
          apiUseYn: {label: '사용여부'}
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
      details (item) {
        this.$router.push({ name: 'API 상세', params: { id: item.apiId }})
      },

      fetchList (params = {}){
        const defaultParams = {
          page: this.pageInfo.page,
          size: this.pageInfo.size,
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
        return window.location.href = '/api/excel/services/download?q=' + q;
      },
    }
  }
</script>
