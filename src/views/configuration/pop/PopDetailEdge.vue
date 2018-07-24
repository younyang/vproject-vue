<template>
  <div class="animated fadeIn">
    <content-header
      :title="items.popName"
      :name="name">
    </content-header>

    <!-- Edge -->
    <div class="collapse-title">
      <b-button class="btn-collapse" v-b-toggle.edge>
        <i class="fa"></i>
        Edge
      </b-button>
    </div>
    <b-collapse id="edge" visible>

      <section class="board">
        <b-table
          show-empty
          :items="items"
          :fields="fields"
        >
          <template slot="edgeRelayYn" slot-scope="row">{{row.value? 'Relay':'Edge'}}</template>
          <template slot="edgeUseYn" slot-scope="row">{{row.value? '사용':'미사용'}}</template>
          <template slot="action" slot-scope="data">
            <b-button type="button" variant="outline-secondary" @click="onDelete(data.item.edgeId)">삭제</b-button>
          </template>
        </b-table>
      </section>
    </b-collapse>

    <div class="page-btn">
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Pop 관리' }">목록</b-button>
      <b-button type="button" variant="outline-secondary" @click="onAdd">추가</b-button>
    </div>


    <!-- Edge 추가(등록) Modal -->
    <b-modal size="lg" v-model="isModalUseYn"
             @show="onOpen" @hide="onReset">
      <template slot="modal-title">
        {{ items.serviceTypeCode }}
        <small> Edge 추가(등록)</small>
      </template>

      <b-form class="searchBox" @reset="onSearchReset">
        <div class="form-row">
          <b-form-fieldset
            label="HostName"
            class="inline label-lg"
            :horizontal="true">
            <b-form-input type="text" class="keyword" v-model="searchItem.searchKeyword"
                          placeholder="Enter Search text"></b-form-input>
          </b-form-fieldset>

          <b-form-fieldset
            label="구분"
            class="label-lg"
            :horizontal="true">
            <multiselect
              v-model="searchItem.edgeRelayYn"
              :showLabels="false"
              :searchable="false"
              :options="['Edge','Relay']"
              placeholder="전체"
            ></multiselect>
          </b-form-fieldset>
        </div>

        <div class="form-row">
          <b-form-fieldset
            label="Service Type-Protocol"
            class="label-lg"
            :horizontal="true">
            <multiselect
              v-model="serviceTypeProtocol"
              :showLabels="false"
              :searchable="false"
              :options="code.serviceTypeProtocol"
              :loading="isLoad.serviceTypeProtocol"
              label="serviceTypeName"
              track-by="serviceTypeAndProtocolCode"
              placeholder="전체"
            ></multiselect>
          </b-form-fieldset>

          <b-form-fieldset
            label="PoP"
            class="label-lg"
            :horizontal="true">
            <multiselect
              v-model="popId"
              :showLabels="false"
              :searchable="false"
              :options="code.popId"
              :loading="isLoad.popId"
              label="popName"
              track-by="popId"
              placeholder="전체"
            ></multiselect>
          </b-form-fieldset>
        </div>
        <div class="search-btn">
          <b-button type="reset" variant="outline-secondary" @click="onSearchReset" v-b-tooltip.hover title="초기화"><i
            class="icon-reload"></i></b-button>
          <b-button type="button" variant="primary" @click="onSearch" v-b-tooltip.hover title="검색">
            <i class="icon-magnifier"></i></b-button>
        </div>
      </b-form>

      <section class="board">
        <b-table
          hover
          show-empty
          :items="edge.items"
          :fields="edge.fields"
        >
          <!-- @change, @click 둘 다 먹지 않아서 . @click.native 씀-->
          <template slot="HEAD_edgeId" slot-scope="item">
            <b-form-checkbox id="checkbox1"
                             v-model="edge.edgeAttachList"
                             @click.native="toggleAll"
                             unchecked-value="">
              <!--v-model="searchItem.edgeAttachList"-->
            </b-form-checkbox>
          </template>

          <template slot="edgeId" slot-scope="row" class="mx-auto">
            <b-form-checkbox id="checkbox1"
                             v-model="edge.edgeAttachList"
                             :value=row.value
                             unchecked-value="">
            </b-form-checkbox>
          </template>

          <template slot="serviceTypeName" slot-scope="row">
          <span class="badge badge-pill badge-success" v-for="val in row.value">
            {{ val }}
          </span>
          </template>
          <template slot="popName" slot-scope="row">
          <span class="badge badge-pill badge-success" v-for="val in row.value">
            {{ val }}
          </span>
          </template>
          <template slot="edgeRelayYn" slot-scope="row">{{row.value? 'Relay':'Edge'}}</template>
          <template slot="edgeUseYn" slot-scope="row">{{row.value? '사용':'미사용'}}</template>
        </b-table>
      </section>

      <div slot="modal-footer" class="mx-auto">
        <b-button type="button" variant="primary" @click="onAttachEdge">선택적용</b-button>
        <b-button type="button" variant="outline-secondary"
                  @click="isModalUseYn = !isModalUseYn">취소
        </b-button>
      </div>
    </b-modal>

    <!-- 일반 경고 메시지 Modal -->
    <b-modal title="Message" size="sm" v-model="modal.open" :class="`modal-${modal.type}`">
      <div class="d-block text-center">
        <p>{{ modal.msg }}</p>
      </div>
      <div slot="modal-footer" class="mx-auto">
        <b-button type="button" variant="primary" @click="modal.action">확인</b-button>
        <b-button v-if="!modal.hideCancelBtn" type="button" variant="outline-secondary"
                  @click="modal.open = false">취소
        </b-button>
      </div>
    </b-modal>

  </div>
</template>

<script>
  import ContentHeader from '@/components/ContentHeader'

  export default {
    name: 'pops',
    props: ['id'],
    components: {
      ContentHeader
    },

    data() {
      return {
        name: 'Pop 상세',
        fields: {
          edgeId: {label: 'ID', thStyle: 'width:100px'},
          edgeIp: {label: 'IP', thStyle: 'width:200px', 'class': 'text-left'},
          edgeHostName: {label: 'Host Name', 'class': 'text-left'},
          edgeRelayYn: {label: 'Type'},
          edgeUseYn: {label: '상태', thStyle: 'width:120px'},
          action: {label: ''}
        },
        items: [],
        pageInfo: {
          page: 1,
          size: 10,
          resultCount: 1,
          totalCount: 1
        },
        edge: {
          edgeAttachList: [],
          items: [],
          fields: {
            edgeId: {label: ' ', thStyle: 'width:20px', 'class': 'text-center'},
            ip: {label: 'IP', thStyle: 'width:120px', 'class': 'text-left'},
            hostName: {label: 'Host Name', 'class': 'text-left'},
            edgeRelayYn: {label: '구분'},
            // edgeUseYn: {label: '상태', thStyle: 'width:120px'},
            serviceTypeName: {label: 'serviceType-protocol'},
            popName: {label: 'PoP', thStyle: 'width:100px'}
          },
          pageInfo: {
            page: 1,
            size: 10,
            resultCount: 1,
            totalCount: 1
          },
          queryParams: [],
          isAllToggled: false
        },
        code: {
          edgeRelayYn: [{
            value: true,
            label: 'Relay'
          }, {
            value: false,
            label: 'Edge'
          }],
          serviceTypeProtocol: [],
          popId: [],
        },
        isLoad: {
          serviceTypeProtocol: true,
          popId: true,
        },
        searchItem: {
          searchType: 'hostName',
          searchKeyword: null,
          edgeRelayYn: null,
          serviceTypeCode: null,
          popId: null,
        },
        modal: {
          open: false,
          type: 'done',
          msg: '',
          action() {
          },
          hideCancelBtn: false
        },
        isModalUseYn: false
      }
    },

    computed: {
      edgeRelayYn: {
        get() {
          return this.searchItem.edgeRelayYn
        },
        set(newValue) {
          this.searchItem.edgeRelayYn = newValue
        },
      },
      serviceTypeProtocol: {
        get() {
          return this.code.serviceTypeProtocol.filter(obj => obj.serviceTypeAndProtocolCode === this.searchItem.serviceTypeCode)[0] || null;
        },
        set(newValue) {
          this.searchItem.serviceTypeCode = newValue !== null ? newValue.serviceTypeAndProtocolCode : null;
        }
      },
      popId: {
        get() {
          return this.code.popId.find(obj => obj.popId === this.searchItem.popId) || null;
        },
        set(newValue) {
          this.searchItem.popId = newValue !== null ? newValue.popId : null;
        }
      },

    },

    created() {
      // Detail Data
      this.$https.get(`/pops/${this.id}/edges`)
        .then((res) => {
          this.items = res.data.items
        });

      // ServiceTypeCode List
      this.$https.get('/edges/serviceTypeAndProtocol')
        .then((res) => {
          this.isLoad.serviceTypeProtocol = false
          this.code.serviceTypeProtocol = res.data.items
          // .map(obj =>
          // ({
          //   serviceTypeName: obj.serviceTypeName,
          //   serviceTypeId: obj.serviceTypeId
          // }))
        });

      // PoP List
      this.$https.get('/pops')
        .then((res) => {
          this.isLoad.popId = false;
          this.code.popId = res.data.items;
          this.code.popId.push({
            popId: '미선택',
            popName: '미선택'
          })
        });

      this.isLoad.serviceList = false;
    },

    methods: {

      toggleAll() {
        console.log('Class: methods, Function: toggleAll, Line 480 (): '
        , );
        const isAllToggled = this.edge.isAllToggled
        this.edge.isAllToggled = !isAllToggled
        this.edge.edgeAttachList = !isAllToggled ? this.edge.items.map(r => r.edgeId) : []
      },

      onDelete(edgeId) {
        this.modal = {
          open: true,
          type: 'error',
          msg: 'Edge 삭제 시 서비스에 바로 적용 \n' +
          '됩니다. 정말로 삭제하시겠습니까?.\n',
          action: () => this.onDeleteData(edgeId)
        };
      },

      onDeleteData(edgeId) {
        this.$https.delete(`/pops/${this.id}/edges/${edgeId}`)
          .then((res) => {
            this.$router.go(this.$router.currentRoute);
            // this.$router.push({name: 'ServiceType 관리'});
          })
          .catch((error) => {
            console.log(error);
          });
      },

      onAdd() {
        this.modal = {
          open: true,
          type: "info",
          msg: 'Edge 추가 시 서비스에 바로 적용 \n' + '됩니다. 정말로 추가하시겠습니까?',
          action: () => {
            this.fetchEdgeList()
            this.isModalUseYn = !this.isModalUseYn
          },
        };
      },

      onOpen() {

      },

      onReset() {
        this.onSearchReset()
        this.isModalUseYn = !this.isModalUseYn
      },

      onAttachEdge() {
        const defaultParams = {
          edgeList: this.edge.edgeAttachList
        };

        this.$https.post(`/pops/${this.id}/addEdges`, {...defaultParams})
          .then((res) => {
            this.$router.go(this.$router.currentRoute);
          })
          .catch((error) => {
            console.log(error);
          });
      },

      onSearch() {
        this.edge.queryParams = {};

        Object.keys(this.searchItem).forEach(key => {
          if (this.searchItem[key] !== null && this.searchItem[key] !== '') {
            this.edge.queryParams[key] = (key === 'edgeUseYn')
              ? (this.searchItem[key] === '사용')
              : this.searchItem[key];
          }
        });

        this.fetchEdgeList({page: 1});
      },

      onSearchReset() {
        this.resetSearchItem()
        this.fetchEdgeList({page: 1});
      },

      resetSearchItem() {
        Object.keys(this.searchItem).forEach((key) => {
          if (key === 'searchType'){
            this.searchItem[key] = 'hostName';
          } else if (key === 'edgeAttachList') {
            this.searchItem[key] = [];
          } else {
            this.searchItem[key] = null;
          }
        });
        this.edge.queryParams = {};
      },

      fetchEdgeList(params = {}) {
        const defaultParams = {
          page: this.edge.pageInfo.page,
          size: this.edge.pageInfo.size,
          q: this.edge.queryParams
        };

        this.$https.get('/edges', {...defaultParams, ...params})
          .then((res) => {
            // Setting Service Type Name
            this.edge.items = res.data.items.map(obj => {
              obj.serviceTypeName = (obj.serviceTypeName) ? obj.serviceTypeName.split(',') : [];
              obj.popName = (obj.popName) ? obj.popName.split(',') : [];
              return obj
            });
            this.edge.pageInfo = res.data.pageInfo;
          });
      },
    }
  }
</script>
