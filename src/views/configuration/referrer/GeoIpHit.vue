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
            :allowEmpty="false"
            :showLabels="false"
            :searchable="false"
            :options="code.searchType"
          ></multiselect>
          <b-form-input type="text" class="keyword" v-model="searchItem.searchKeyword" placeholder="Enter Search text"></b-form-input>
        </b-form-fieldset>
      </div>

      <div class="form-row">
        <b-form-fieldset
          label="지역"
          :horizontal="true">
          <multiselect
            v-model="communityTagType"
            :showLabels="false"
            :searchable="false"
            :options="code.communityTagType"
            label="codeName"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>
      </div>
      <div class="search-btn">
        <b-button type="reset" variant="outline-secondary" v-b-tooltip.hover title="초기화"><i class="icon-reload"></i></b-button>
        <b-button type="button" variant="primary" @click="onSearch" v-b-tooltip.hover title="검색"><i class="icon-magnifier"></i></b-button>
      </div>
    </b-form>

    <section class="board">
      <b-table
        show-empty
        :items="items"
        :fields="fields">
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
  export default {
    name: 'geoIpHit',
    data (){
      return {
        fields: {
          routingIpId: {label: 'ID'},
          network: {label: '네트워크', 'class': 'text-left'},
          communityTag: {label: '커뮤니티 태그'},
          start: {label: 'Start'},
          end: {label: 'End'},
          nextHop:  {label: 'NextHop'},
          metric:  {label: 'Metric'},
          locPrf:  {label: 'LocPrf'},
          weight:  {label: 'Weight'},
          path:  {label: 'Path'}
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
          searchType: 'ip',
          searchKeyword: null,
          communityTagType: null
        },
        code: {
          searchType: [{
            code: 'ip',
            codeName: 'IP주소'
          }],
          communityTagType: []
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
      communityTagType: {
        get () {
          return this.code.communityTagType.find(obj => obj.codeValChar1 === this.searchItem.communityTagType) || null;
        },
        set (newValue) {
          this.searchItem.communityTagType = newValue !== null ? newValue.codeValChar1 : null;
        }
      }
    },

    created (){
      // Routing IP List
      this.fetchList();
      // Community Tag List
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'GEO' }
        })
        .then((res) => {
          this.code.communityTagType = res.data.items;
        });
    },

    methods: {
      fetchList (params = {}){
        const defaultParams = {
          page: this.pageInfo.page,
          size: this.pageInfo.size,
          q: this.queryParams
        }
        this.$https.get('/policy/geoIpHit', {...defaultParams, ...params})
          .then((res) => {
            this.items = res.data.items
            this.pageInfo = res.data.pageInfo
          })
      },

      onSearch (){
        this.queryParams = this.searchItem;
        this.fetchList({ page: 1 });
      },

      onRowSelect (size){
        this.fetchList({ page: 1, size });
      },

      onReset (){
        Object.keys(this.searchItem).forEach((key) => {
          if (key === 'searchType'){
            this.searchItem[key] = 'ip';
          } else {
              this.searchItem[key] = null;
          }
        });
        this.queryParams = {};
        this.fetchList();
      },

      onPagination (page){
        this.fetchList({ page });
      }
    }
  }
</script>
