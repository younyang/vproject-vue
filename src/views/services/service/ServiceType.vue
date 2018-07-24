<template>
  <div class="animated fadeIn">
    <b-form class="searchBox" @reset="onReset">
      <div class="form-row">
        <b-form-fieldset
          label="Name"
          class="inline"
          :horizontal="true">
          <b-form-input type="text" class="keyword" v-model="searchItem.searchServiceTypeName"
                        placeholder=""></b-form-input>
        </b-form-fieldset>

        <b-form-fieldset
          label="Protocol"
          class="label-lg"
          :horizontal="true">
          <multiselect
            v-model="searchItem.searchProtocolCode"
            :showLabels="false"
            :searchable="false"
            :options="code.protocolList"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>
      </div>

      <!--:options="['HLS', 'DASH', 'RTSP','ADV','FILE','IMG']"-->
      <div class="form-row">

        <b-form-fieldset
          label="Rank Size"
          class="inline"
          :horizontal="true">

          <b-form-input type="number" class="form-size" min="1" max="99999999999"
                        v-model="searchItem.searchRankVolumnFrom"></b-form-input>
          ~
          <b-form-input type="number" class="form-size" min="1" max="99999999999"
                        v-model="searchItem.searchRankVolumnTo"></b-form-input>
        </b-form-fieldset>

        <b-form-fieldset
          label="Rank Count"
          class="inline label-lg"
          :horizontal="true">

          <b-form-input type="number" class="form-size" min="1" max="99999999999"
                        v-model="searchItem.searchRankCountFrom"></b-form-input>
          ~
          <b-form-input type="number" class="form-size" min="1" max="99999999999"
                        v-model="searchItem.searchRankCountTo"></b-form-input>
        </b-form-fieldset>
      </div>

      <div class="form-row">

        <b-form-fieldset
          label="Hash"
          class="inline"
          :horizontal="true">

          <b-form-input type="text" class="keyword" v-model="searchItem.searchHashDivisor"
                        placeholder=""></b-form-input>
        </b-form-fieldset>

        <b-form-fieldset
          label="사용여부"
          class="label-lg"
          :horizontal="true">
          <multiselect
            v-model="searchItem.searchServiceTypeUseYn"
            :showLabels="false"
            :searchable="false"
            :options="['사용', '미사용']"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>
      </div>
      <div class="search-btn">
        <b-button type="reset" variant="outline-secondary" v-b-tooltip.hover title="초기화"><i class="icon-reload"></i>
        </b-button>
        <b-button type="button" variant="primary" @click="onSearch" v-b-tooltip.hover title="검색"><i
          class="icon-magnifier"></i></b-button>
      </div>
    </b-form>


    <section class="board-btn">
      <b-button type="button" variant="primary" :to="{ name: 'ServiceType 등록' }">
        등록
      </b-button>
    </section>

    <section class="board">
      <b-table
        hover
        show-empty
        :items="items"
        :fields="fields"
        :current-page="pageInfo.page"
        :per-page="pageInfo.size"
        @row-clicked="details"
      >
        <template slot="serviceTypeUseYn" slot-scope="row">{{row.value? '사용':'미사용'}}</template>
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
        :total-rows="pageInfo.totalCount"
        :per-page="pageInfo.size"
        v-model="pageInfo.page"
        class="mt-2"
      ></b-pagination>
    </section>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'serviceType',
    components: {
      //  ListContent
    },
    data() {
      return {
        fields: {
          serviceTypeId: {label: 'ID'},
          serviceTypeName: {label: 'Name', 'class': 'text-left'},
          protocolCode: {label: 'Protocol', 'class': 'text-left'},
          rankVolumn: {label: 'Rank Size', 'class': 'text-left'},
          rankCount: {label: 'Rank Count', 'class': 'text-left'},
          hashDivisor: {label: 'Hash', 'class': 'text-left'},
          serviceTypeUseYn: {label: '사용여부'}
        },
        items: [],
        pageInfo: {
          page: 1, // currentPage
          size: 10, // perPage
          resultCount: 1,
          totalCount: 1 // totalRows
        },
        pageOptions: [10, 20, 50, 100],

        queryParams: {},

        searchItem: {
          searchType: 'serviceType',
          searchServiceTypeName: null,
          searchProtocolCode: null,
          searchRankVolumnFrom: null,
          searchRankVolumnTo: null,
          searchRankCountFrom: null,
          searchRankCountTo: null,
          searchHashDivisor: null,
          searchServiceTypeUseYn: null,
        },
        code: {
          serviceTypeProtocol: [], // [{ code: PROTOCOL_1 , name: HLS}, ...]
          protocolList: []
        }
      }
    },

    computed: {},

    created() {
      this.fetchList()
      this.fetchProtocolCodes()
    },

    methods: {
      details(item) {
        this.$router.push({name: 'ServiceType 상세', params: {id: item.serviceTypeId}})
      },

      fetchProtocolCodes() {
        this.$https.get('/system/commonCode', {
          q: {groupCode: 'PROTOCOL'}
        })
          .then((res) => {
            this.code.serviceTypeProtocol = res.data.items.map(r => ({code: r.code, name: r.codeValChar1}))
            this.code.serviceTypeProtocol.forEach(row => this.code.protocolList.push(row.name))
          });
      },

      fetchList() {
        const defaultParams = (this.queryParams === {}) ? null : {
          q: this.queryParams
        };
        this.$https.get('/servicetype', {...defaultParams})
          .then((res) => {
            // Setting Service Type Name
            this.items = res.data.items.map(obj => {
              obj.protocolCode = (obj.protocolCode) ? obj.protocolCode.toUpperCase() : [];
              return obj
            })
          });

        // todo 테스트 후 제거 - 페이징 테스트용 더미 자료

        // this.items = [
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "hls"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "dash"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "rtsp"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "ADV",
        //     "serviceTypeName": "ADV",
        //     "serviceTypeId": 190,
        //     "rankCount": 100,
        //     "rankVolumn": 50,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "http"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "FILE",
        //     "serviceTypeName": "FILE",
        //     "serviceTypeId": 191,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "ftp"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "IMG",
        //     "serviceTypeName": "IMG",
        //     "serviceTypeId": 192,
        //     "rankCount": 50,
        //     "rankVolumn": 50,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "http"
        //   },
        //   {
        //     "createDateTime": "2018-07-11 10:31:48",
        //     "modifyDateTime": null,
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "test22",
        //     "serviceTypeId": 197,
        //     "rankCount": 1,
        //     "rankVolumn": 1,
        //     "hashDivisor": 1,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "hls"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "dash"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "rtsp"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "ADV",
        //     "serviceTypeName": "ADV",
        //     "serviceTypeId": 190,
        //     "rankCount": 100,
        //     "rankVolumn": 50,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "http"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "FILE",
        //     "serviceTypeName": "FILE",
        //     "serviceTypeId": 191,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "ftp"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "IMG",
        //     "serviceTypeName": "IMG",
        //     "serviceTypeId": 192,
        //     "rankCount": 50,
        //     "rankVolumn": 50,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "http"
        //   },
        //   {
        //     "createDateTime": "2018-07-11 10:31:48",
        //     "modifyDateTime": null,
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "test22",
        //     "serviceTypeId": 197,
        //     "rankCount": 1,
        //     "rankVolumn": 1,
        //     "hashDivisor": 1,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "hls"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "dash"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "rtsp"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "ADV",
        //     "serviceTypeName": "ADV",
        //     "serviceTypeId": 190,
        //     "rankCount": 100,
        //     "rankVolumn": 50,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "http"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "FILE",
        //     "serviceTypeName": "FILE",
        //     "serviceTypeId": 191,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "ftp"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "IMG",
        //     "serviceTypeName": "IMG",
        //     "serviceTypeId": 192,
        //     "rankCount": 50,
        //     "rankVolumn": 50,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "http"
        //   },
        //   {
        //     "createDateTime": "2018-07-11 10:31:48",
        //     "modifyDateTime": null,
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "test22",
        //     "serviceTypeId": 197,
        //     "rankCount": 1,
        //     "rankVolumn": 1,
        //     "hashDivisor": 1,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "hls"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "dash"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "rtsp"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "ADV",
        //     "serviceTypeName": "ADV",
        //     "serviceTypeId": 190,
        //     "rankCount": 100,
        //     "rankVolumn": 50,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "http"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "FILE",
        //     "serviceTypeName": "FILE",
        //     "serviceTypeId": 191,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "ftp"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "IMG",
        //     "serviceTypeName": "IMG",
        //     "serviceTypeId": 192,
        //     "rankCount": 50,
        //     "rankVolumn": 50,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "http"
        //   },
        //   {
        //     "createDateTime": "2018-07-11 10:31:48",
        //     "modifyDateTime": null,
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "test22",
        //     "serviceTypeId": 197,
        //     "rankCount": 1,
        //     "rankVolumn": 1,
        //     "hashDivisor": 1,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "hls"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "dash"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "rtsp"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "ADV",
        //     "serviceTypeName": "ADV",
        //     "serviceTypeId": 190,
        //     "rankCount": 100,
        //     "rankVolumn": 50,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "http"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "FILE",
        //     "serviceTypeName": "FILE",
        //     "serviceTypeId": 191,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "ftp"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "IMG",
        //     "serviceTypeName": "IMG",
        //     "serviceTypeId": 192,
        //     "rankCount": 50,
        //     "rankVolumn": 50,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "http"
        //   },
        //   {
        //     "createDateTime": "2018-07-11 10:31:48",
        //     "modifyDateTime": null,
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "test22",
        //     "serviceTypeId": 197,
        //     "rankCount": 1,
        //     "rankVolumn": 1,
        //     "hashDivisor": 1,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "hls"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "dash"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "rtsp"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "ADV",
        //     "serviceTypeName": "ADV",
        //     "serviceTypeId": 190,
        //     "rankCount": 100,
        //     "rankVolumn": 50,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "http"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "FILE",
        //     "serviceTypeName": "FILE",
        //     "serviceTypeId": 191,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "ftp"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "IMG",
        //     "serviceTypeName": "IMG",
        //     "serviceTypeId": 192,
        //     "rankCount": 50,
        //     "rankVolumn": 50,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "http"
        //   },
        //   {
        //     "createDateTime": "2018-07-11 10:31:48",
        //     "modifyDateTime": null,
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "test22",
        //     "serviceTypeId": 197,
        //     "rankCount": 1,
        //     "rankVolumn": 1,
        //     "hashDivisor": 1,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "hls"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "dash"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "rtsp"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "ADV",
        //     "serviceTypeName": "ADV",
        //     "serviceTypeId": 190,
        //     "rankCount": 100,
        //     "rankVolumn": 50,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "http"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "FILE",
        //     "serviceTypeName": "FILE",
        //     "serviceTypeId": 191,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "ftp"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "IMG",
        //     "serviceTypeName": "IMG",
        //     "serviceTypeId": 192,
        //     "rankCount": 50,
        //     "rankVolumn": 50,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "http"
        //   },
        //   {
        //     "createDateTime": "2018-07-11 10:31:48",
        //     "modifyDateTime": null,
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "test22",
        //     "serviceTypeId": 197,
        //     "rankCount": 1,
        //     "rankVolumn": 1,
        //     "hashDivisor": 1,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "hls"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "dash"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "rtsp"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "ADV",
        //     "serviceTypeName": "ADV",
        //     "serviceTypeId": 190,
        //     "rankCount": 100,
        //     "rankVolumn": 50,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "http"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "FILE",
        //     "serviceTypeName": "FILE",
        //     "serviceTypeId": 191,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "ftp"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "IMG",
        //     "serviceTypeName": "IMG",
        //     "serviceTypeId": 192,
        //     "rankCount": 50,
        //     "rankVolumn": 50,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "http"
        //   },
        //   {
        //     "createDateTime": "2018-07-11 10:31:48",
        //     "modifyDateTime": null,
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "test22",
        //     "serviceTypeId": 197,
        //     "rankCount": 1,
        //     "rankVolumn": 1,
        //     "hashDivisor": 1,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "hls"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "dash"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "rtsp"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "ADV",
        //     "serviceTypeName": "ADV",
        //     "serviceTypeId": 190,
        //     "rankCount": 100,
        //     "rankVolumn": 50,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "http"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "FILE",
        //     "serviceTypeName": "FILE",
        //     "serviceTypeId": 191,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "ftp"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "IMG",
        //     "serviceTypeName": "IMG",
        //     "serviceTypeId": 192,
        //     "rankCount": 50,
        //     "rankVolumn": 50,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "http"
        //   },
        //   {
        //     "createDateTime": "2018-07-11 10:31:48",
        //     "modifyDateTime": null,
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "test22",
        //     "serviceTypeId": 197,
        //     "rankCount": 1,
        //     "rankVolumn": 1,
        //     "hashDivisor": 1,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "hls"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "dash"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "rtsp"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "ADV",
        //     "serviceTypeName": "ADV",
        //     "serviceTypeId": 190,
        //     "rankCount": 100,
        //     "rankVolumn": 50,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "http"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "FILE",
        //     "serviceTypeName": "FILE",
        //     "serviceTypeId": 191,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "ftp"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "IMG",
        //     "serviceTypeName": "IMG",
        //     "serviceTypeId": 192,
        //     "rankCount": 50,
        //     "rankVolumn": 50,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "http"
        //   },
        //   {
        //     "createDateTime": "2018-07-11 10:31:48",
        //     "modifyDateTime": null,
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "test22",
        //     "serviceTypeId": 197,
        //     "rankCount": 1,
        //     "rankVolumn": 1,
        //     "hashDivisor": 1,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "hls"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "dash"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "rtsp"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "ADV",
        //     "serviceTypeName": "ADV",
        //     "serviceTypeId": 190,
        //     "rankCount": 100,
        //     "rankVolumn": 50,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "http"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "FILE",
        //     "serviceTypeName": "FILE",
        //     "serviceTypeId": 191,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "ftp"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "IMG",
        //     "serviceTypeName": "IMG",
        //     "serviceTypeId": 192,
        //     "rankCount": 50,
        //     "rankVolumn": 50,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "http"
        //   },
        //   {
        //     "createDateTime": "2018-07-11 10:31:48",
        //     "modifyDateTime": null,
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "test22",
        //     "serviceTypeId": 197,
        //     "rankCount": 1,
        //     "rankVolumn": 1,
        //     "hashDivisor": 1,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "hls"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "dash"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "rtsp"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "ADV",
        //     "serviceTypeName": "ADV",
        //     "serviceTypeId": 190,
        //     "rankCount": 100,
        //     "rankVolumn": 50,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "http"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "FILE",
        //     "serviceTypeName": "FILE",
        //     "serviceTypeId": 191,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "ftp"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "IMG",
        //     "serviceTypeName": "IMG",
        //     "serviceTypeId": 192,
        //     "rankCount": 50,
        //     "rankVolumn": 50,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "http"
        //   },
        //   {
        //     "createDateTime": "2018-07-11 10:31:48",
        //     "modifyDateTime": null,
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "test22",
        //     "serviceTypeId": 197,
        //     "rankCount": 1,
        //     "rankVolumn": 1,
        //     "hashDivisor": 1,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "hls"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "dash"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "rtsp"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "ADV",
        //     "serviceTypeName": "ADV",
        //     "serviceTypeId": 190,
        //     "rankCount": 100,
        //     "rankVolumn": 50,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "http"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "FILE",
        //     "serviceTypeName": "FILE",
        //     "serviceTypeId": 191,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "ftp"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "IMG",
        //     "serviceTypeName": "IMG",
        //     "serviceTypeId": 192,
        //     "rankCount": 50,
        //     "rankVolumn": 50,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "http"
        //   },
        //   {
        //     "createDateTime": "2018-07-11 10:31:48",
        //     "modifyDateTime": null,
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "test22",
        //     "serviceTypeId": 197,
        //     "rankCount": 1,
        //     "rankVolumn": 1,
        //     "hashDivisor": 1,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "hls"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "dash"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "rtsp"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "ADV",
        //     "serviceTypeName": "ADV",
        //     "serviceTypeId": 190,
        //     "rankCount": 100,
        //     "rankVolumn": 50,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "http"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "FILE",
        //     "serviceTypeName": "FILE",
        //     "serviceTypeId": 191,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "ftp"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "IMG",
        //     "serviceTypeName": "IMG",
        //     "serviceTypeId": 192,
        //     "rankCount": 50,
        //     "rankVolumn": 50,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "http"
        //   },
        //   {
        //     "createDateTime": "2018-07-11 10:31:48",
        //     "modifyDateTime": null,
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "test22",
        //     "serviceTypeId": 197,
        //     "rankCount": 1,
        //     "rankVolumn": 1,
        //     "hashDivisor": 1,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "hls"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "dash"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "rtsp"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "ADV",
        //     "serviceTypeName": "ADV",
        //     "serviceTypeId": 190,
        //     "rankCount": 100,
        //     "rankVolumn": 50,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "http"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "FILE",
        //     "serviceTypeName": "FILE",
        //     "serviceTypeId": 191,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "ftp"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "IMG",
        //     "serviceTypeName": "IMG",
        //     "serviceTypeId": 192,
        //     "rankCount": 50,
        //     "rankVolumn": 50,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "http"
        //   },
        //   {
        //     "createDateTime": "2018-07-11 10:31:48",
        //     "modifyDateTime": null,
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "test22",
        //     "serviceTypeId": 197,
        //     "rankCount": 1,
        //     "rankVolumn": 1,
        //     "hashDivisor": 1,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "hls"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "dash"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "VOD",
        //     "serviceTypeId": 189,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "rtsp"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "ADV",
        //     "serviceTypeName": "ADV",
        //     "serviceTypeId": 190,
        //     "rankCount": 100,
        //     "rankVolumn": 50,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "http"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "FILE",
        //     "serviceTypeName": "FILE",
        //     "serviceTypeId": 191,
        //     "rankCount": 50,
        //     "rankVolumn": 20,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": true,
        //     "protocolCode": "ftp"
        //   },
        //   {
        //     "createDateTime": "2018-07-10 10:51:36",
        //     "modifyDateTime": "2018-07-10 10:51:36",
        //     "serviceId": null,
        //     "serviceTypeCode": "IMG",
        //     "serviceTypeName": "IMG",
        //     "serviceTypeId": 192,
        //     "rankCount": 50,
        //     "rankVolumn": 50,
        //     "hashDivisor": 0,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "http"
        //   },
        //   {
        //     "createDateTime": "2018-07-11 10:31:48",
        //     "modifyDateTime": null,
        //     "serviceId": null,
        //     "serviceTypeCode": "VOD",
        //     "serviceTypeName": "test22",
        //     "serviceTypeId": 197,
        //     "rankCount": 1,
        //     "rankVolumn": 1,
        //     "hashDivisor": 1,
        //     "serviceTypeDomainName": "",
        //     "useYn": false,
        //     "protocolCode": "hls"
        //   }
        // ]
        this.pageInfo.totalCount = this.items.length
      },

      onSearch() {
        this.queryParams = {};
        Object.keys(this.searchItem).forEach(key => {
          if (this.searchItem[key] !== null && this.searchItem[key] !== '') {
            this.queryParams[key] =
              key === 'searchServiceTypeUseYn'
                ? this.searchItem[key] === '사용' ? true : false
                : key === 'searchProtocolCode'
                  ? this.code.serviceTypeProtocol.filter(r => r.name === this.searchItem[key])[0].code
                  : this.searchItem[key];
          }
        });

        this.fetchList();
      },

      onReset() {
        Object.keys(this.searchItem).forEach((key) => {
          if (key === 'searchType') {
            this.searchItem[key] = 'searchType';
          } else {
            this.searchItem[key] = null;
          }
        });
        this.queryParams = {};
        this.fetchList();
      },

      onRowSelect(size) {
        this.pageInfo.size = size
      },
    }
  }
</script>
