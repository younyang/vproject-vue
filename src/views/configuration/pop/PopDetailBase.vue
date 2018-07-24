<template>
  <div class="animated fadeIn">
    <content-header
      :title="items.popName"
      :name="name">
    </content-header>

    <div class="collapse-title">
      <b-button class="btn-collapse" v-b-toggle.formDefault>
        <i class="fa"></i>
        기본정보
      </b-button>
    </div>
    <b-collapse id="formDefault" visible>
      <b-form class="formView" :validated="inValidForm" novalidate>
        <!-- PoP Id -->
        <b-form-fieldset
          v-if="!isEdit"
          label="ID"
          :horizontal="true">

          <b-form-input
            :value="id"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- PoP Name -->
        <b-form-fieldset
          :horizontal="true">
          <template slot="label">
            PoP Name
            <!--<i v-if="isEdit" class="require">*</i>-->
          </template>
          <b-form-input
            :value="items.popName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <div class="form-row">
          <!-- Host Name -->
          <b-form-fieldset
            :horizontal="true">
            <template slot="label">
              Host Name(Prefix)
            </template>
            <b-form-input
              :value="items.popHostName"
              type="text"
              plaintext
            ></b-form-input>
          </b-form-fieldset>

          <!-- region code -->
          <b-form-fieldset
            :invalid-feedback="$valid.msg.select"
            :horizontal="true">
            <template slot="label">
              지역
            </template>
            <b-form-input
              :value="items.geoCodeName"
              type="text"
              plaintext
            ></b-form-input>
          </b-form-fieldset>
        </div>

        <!-- Data Center -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.select"
          :horizontal="true">
          <template slot="label">
            Data Center<i v-if="isEdit" class="require">*</i>
          </template>
          <multiselect
            v-if="isEdit"
            v-model="dataCenterCode"
            :showLabels="false"
            :options="code.dataCenterCode"
            :loading="isLoad.dataCenterCode"
            :class="{'invalid': !valid.dataCenterCode }"
            track-by="code"
            label="codeName"
            placeholder="선택"
          ></multiselect>
          <b-form-input
            v-else
            :value="items.dataCenterCodeName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <b-form-fieldset
          :invalid-feedback="$valid.msg.select"
          :horizontal="true">
          <template slot="label">
            품질솔루션팀<i v-if="isEdit" class="require">*</i>
          </template>
          <multiselect
            v-if="isEdit"
            v-model="qualitySolutionTeamCode"
            :showLabels="false"
            :options="code.qualitySolutionTeamCode"
            :loading="isLoad.qualitySolutionTeamCode"
            :class="{'invalid': !valid.qualitySolutionTeamCode }"
            track-by="code"
            label="codeName"
            placeholder="선택"
          ></multiselect>
          <b-form-input
            v-else
            :value="items.qualitySolutionTeamCodeName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- Service List -->
        <b-form-fieldset
          label="Service"
          :horizontal="true">
          <b-table
            hover
            show-empty
            :items="serviceList.items"
            :fields="serviceList.fields"
            :current-page="serviceList.pageInfo.page"
            :per-page="serviceList.pageInfo.size"
            thead-class="hidden_header"
          >
            <template slot="distributeBtn" slot-scope="row" style="width :350px">
              <b-button type="button" variant="outline-secondary" @click="onDeploy">배포</b-button>
            </template>


          </b-table>

        </b-form-fieldset>

        <!-- Eag Setting List -->
        <b-form-fieldset
          label="Eag 설정"
          :horizontal="true">
          <b-table
            hover
            show-empty
            :items="eagSettingList.items"
            :fields="eagSettingList.fields"
            :current-page="eagSettingList.pageInfo.page"
            :per-page="eagSettingList.pageInfo.size"
          >

            <template slot="HEAD_serviceName" slot-scope="data">
              <em v-if="!isEdit">{{data.label}}</em>
            </template>

            <template slot="HEAD_serviceTypeName" slot-scope="data">
              <em v-if="!isEdit">{{data.label}}</em>
            </template>

            <template slot="copyRankMin" slot-scope="data">
              <em v-if="!isEdit">{{data.item.copyRankMin}}</em>
              <b-form-input v-else type="text" class="keyword" v-model="data.item.copyRankMin"
                            placeholder="Enter Search text"></b-form-input>
            </template>

            <template slot="copyRankMax" slot-scope="data">
              <em v-if="!isEdit">{{data.item.copyRankMax}}</em>
              <b-form-input v-else type="text" class="keyword" v-model="data.item.copyRankMax"
                            placeholder="Enter Search text"></b-form-input>
            </template>

            <template slot="remainRankMin" slot-scope="data">
              <em v-if="!isEdit">{{data.item.remainRankMin}}</em>
              <b-form-input v-else type="text" class="keyword" v-model="data.item.remainRankMin"
                            placeholder="Enter Search text"></b-form-input>
            </template>

            <template slot="hashValue" slot-scope="data">
              <em v-if="!isEdit">{{data.item.hashValue}}</em>
              <b-form-input v-else type="text" class="keyword" v-model="data.item.hashValue"
                            placeholder="Enter Search text"></b-form-input>
            </template>

          </b-table>

        </b-form-fieldset>

        <!-- Bandwidth -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <template slot="label">
            Bandwidth<i v-if="isEdit" class="require">*</i>
          </template>
          <cleave
            v-if="isEdit"
            v-model="items.bandwidth"
            style="width: 156px;"
            class="form-control inline"
            :options="{ numeral: true, numeralPositiveOnly: true, numeralDecimalScale: 0 }"
            required
          ></cleave>
          {{ (isEdit) ?` Gbps` : ''}}
          <b-form-input
            v-if="!isEdit"
            :value="items.bandwidth + ' Gbps'"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- 사용여부 -->
        <b-form-fieldset
          label="사용여부"
          :horizontal="true">
          <c-switch
            v-if="isEdit"
            type="text"
            class="v-switch"
            on="사용"
            off="미사용"
            v-model="items.popUseYn"
          ></c-switch>
          <span
            v-else
            class="badge"
            :class="{'primary' : items.popUseYn }"
          >{{ items.popUseYn ? '사용' : '미사용' }}
          </span>
        </b-form-fieldset>

        <!-- 변경이력 -->
        <b-form-fieldset
          v-if="isEdit"
          label="변경이력<i class='require'>*</i>"
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <b-form-textarea
            v-model="items.modifyHistReason"
            :rows="6"
            required
          ></b-form-textarea>
        </b-form-fieldset>
      </b-form>
    </b-collapse>


    <!-- 처리이력 -->
    <div class="collapse-title" v-if="!isEdit">
      <b-button class="btn-collapse" v-b-toggle.formHistory>
        <i class="fa"></i>
        처리이력
      </b-button>
    </div>
    <b-collapse id="formHistory" visible v-if="!isEdit">
      <b-form class="formView">
        <div class="form-row">
          <!-- 등록일 -->
          <b-form-fieldset
            label="등록일시"
            :horizontal="true">
            <b-form-input
              :value="items.createDateTime"
              plaintext
              type="text"
            ></b-form-input>
          </b-form-fieldset>
          <!-- 등록자 -->
          <b-form-fieldset
            label="등록자"
            :horizontal="true">
            <b-form-input
              :value="items.createId"
              plaintext
              type="text"
            ></b-form-input>
          </b-form-fieldset>
        </div>

        <div class="form-row">
          <!-- 수정일 -->
          <b-form-fieldset
            label="수정일시"
            :horizontal="true">
            <b-form-input
              :value="items.modifyDateTime"
              plaintext
              type="text"
            ></b-form-input>
          </b-form-fieldset>
          <!-- 수정자 -->
          <b-form-fieldset
            label="수정자"
            :horizontal="true">
            <b-form-input
              :value="items.modifyId"
              plaintext
              type="text"
            ></b-form-input>
          </b-form-fieldset>
        </div>
      </b-form>
    </b-collapse>


    <div class="page-btn" v-if="isEdit">
      <b-button type="button" variant="outline-secondary" @click="onView">취소</b-button>
      <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
    </div>

    <div class="page-btn" v-else>
      <span v-if="isProcessComplete">
        <b-button type="button" variant="outline-secondary" class="float-left"
                  @click="onDelete">삭제</b-button>
        <b-button type="button" variant="outline-secondary" @click="showHistory">이력관리</b-button>
        <b-button type="button" variant="outline-secondary" :to="{ name: 'Pop 관리' }">목록</b-button>
        <b-button type="button" variant="primary" @click="onEdit">수정</b-button>
      </span>
      <span v-else>
        <b-button type="button" variant="outline-secondary" @click="showHistory">이력관리</b-button>
        <b-button type="button" variant="outline-secondary" :to="{ name: 'Pop 관리' }">목록</b-button>
      </span>
    </div>

    <!-- History Modal -->
    <b-modal size="lg" title="이력관리" v-model="isModalHistory">
      <section class="board">
        <b-table
          hover
          show-empty
          :items="history.items"
          :fields="history.fields"
          :current-page="history.pageInfo.page"
          :per-page="history.pageInfo.size"
        >
          <template slot="modifyHistReason" slot-scope="row">
            {{(row.value) ? row.value : "-"}}
          </template>
          <template slot="histMgmtId" slot-scope="row">
            <a :href="getHistoryLink(row.value)" target="_blank">보기</a>
          </template>
        </b-table>
      </section>

      <b-pagination
        v-model="history.pageInfo.page"
        :total-rows="history.pageInfo.totalCount"
        :per-page="history.pageInfo.size"
        class="mt-2"
      ></b-pagination>

      <div slot="modal-footer">
        <b-button type="button" variant="primary" @click="isModalHistory = false">확인</b-button>
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
  import cSwitch from '@/components/Switch'

  export default {
    name: 'pops',
    props: ['id', 'histories'],
    components: {
      ContentHeader,
      cSwitch
    },

    data() {
      return {
        name: 'Pop 상세',
        originItems: {},
        items: {
          popName: '',
          popHostName: '',
          qualitySolutionTeamCode: null,
          qualitySolutionTeamCodeName: '',
          dataCenterCode: null,
          dataCenterCodeName: '',
          bandwidth: 0,
          popUseYn: true,
          serviceNames: null,
          lowReferrerList: [],
          edgeList: [],
          processStateCodeName: null,
          processStateCode: null,
          processId: null,
          geoCode: [],
          geoCodeName: null
        },
        code: {
          qualitySolutionTeamCode: [],
          dataCenterCode: [],
          geoCode: []
        },
        serviceList: {
          items: [],
          fields: {
            serviceName: {label: '이름', variant: 'info'},
            serviceTypeName: {label: '타입', variant: 'info'},
            domainPurpose: {label: '목적', variant: 'info'},
            domainName: {label: '도메인이름', 'class': 'text-left'},
            protocolCnt: {label: '프로토콜', 'class': 'text-left'},
            distributeBtn: {label: '배포',}
          },
          pageInfo: {
            page: 1,
            size: 10,
            totalCount: 1
          }
        },

        eagSettingList: {
          items: [],
          fields: {
            serviceName: {label: '서비스명', variant: 'info', thClass: "table-hidden"},
            serviceTypeName: {label: '서비스타입', variant: 'info', thClass: "table-hidden"},
            copyRankMin: {label: 'copyRankMin'},
            copyRankMax: {label: 'copyRankMax'},
            remainRankMin: {label: 'remainRankMin'},
            hashValue: {label: 'hashValue'}
          },
          pageInfo: {
            page: 1,
            size: 10,
            totalCount: 1
          }
        },
        history: {
          fields: {
            createId: {label: '등록/수정자', 'class': 'text-left'},
            histBeginDateTime: {label: '등록/수정일시'},
            // histTypeName: {label: '구분'},
            modifyHistReason: {label: '변경이력', 'class': 'text-left'},
            histMgmtId: {label: '보기'}
          },
          items: [],
          pageInfo: {
            page: 1,
            size: 10,
            totalCount: 1
          }
        },
        edgeList: {
          items: [],
          fields: {
            serviceName: {label: '서비스명', variant: 'info', thClass: "table-hidden"},
            serviceTypeName: {label: '서비스타입', variant: 'info', thClass: "table-hidden"},
            copyRankMin: {label: 'copyRankMin'},
            copyRankMax: {label: 'copyRankMax'},
            remainRankMin: {label: 'remainRankMin'},
            hashValue: {label: 'hashValue'}
          },
          pageInfo: {
            page: 1,
            size: 10,
            totalCount: 1
          }
        },
        isLoad: {
          qualitySolutionTeamCode: true,
          dataCenterCode: true,
          geoCode: true
        },
        isEdit: false,
        isModalHistory: false,

        modal: {
          open: false,
          type: 'done',
          msg: '',
          action() {
          },
          hideCancelBtn: false
        },

        inValidForm: false
      }
    },

    computed: {
      qualitySolutionTeamCode: {
        get() {
          return this.code.qualitySolutionTeamCode.find(obj => obj.code === this.items.qualitySolutionTeamCode) || null;
        },
        set(newValue) {
          this.items.qualitySolutionTeamCode = newValue !== null ? newValue.code : null;
        }
      },
      dataCenterCode: {
        get() {
          return this.code.dataCenterCode.find(obj => obj.code === this.items.dataCenterCode) || null;
        },
        set(newValue) {
          this.items.dataCenterCode = newValue !== null ? newValue.code : null;
        }
      },
      geoCode: {
        get() {
          return this.code.geoCode.find(obj => obj.code === this.items.geoCode) || null;
        },
        set(newValue) {
          this.items.geoCode = newValue !== null ? newValue.code : null;
        }
      },
      serviceNames() {
        return this.items.serviceNames !== null ? this.items.serviceNames.split(',') : []
      },
      isProcessComplete() {
        return (this.items.processStateCode == null || (
          this.items.processStateCode !== '' &&
          this.items.processStateCode === 'PROCESS_STATE_02'))
      },

      // validation
      valid() {
        return {
          qualitySolutionTeamCode: this.items.qualitySolutionTeamCode !== null,
          // dataCenterCode: this.items.dataCenterCode !== null,
          geoCode: this.items.geoCode !== null
        }
      }
    },

    created() {
      // History
      const historyId = this.$route.query.histories;
      const detailUrl = historyId !== undefined ? `/pops/${this.id}/histories/${historyId}` : `/pops/${this.id}`;

      if (historyId) {
        document.querySelector('body.app').classList.add('history-mode')
      }

      // 품질솔루션팀 Code
      this.$https.get('/system/commonCode', {
        q: {groupCode: 'QUALITY_TEAM'}
      })
        .then((res) => {
          this.isLoad.qualitySolutionTeamCode = false;
          this.code.qualitySolutionTeamCode = res.data.items;
        });

      // Data Center Code
      this.$https.get('/system/commonCode', {
        q: {groupCode: 'DATACENTER'}
      })
        .then((res) => {
          this.isLoad.dataCenterCode = false;
          this.code.dataCenterCode = res.data.items;
        });

      // 세부 자료
      this.$https.get(detailUrl)
        .then((res) => {
          this.items = res.data.items;

          this.serviceList.items = res.items.serviceList
          this.eagSettingList.items = res.items.eagSettingList

          this.originItems = JSON.parse(JSON.stringify(this.items));
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
      onEdit() {
        this.isEdit = true;
        const geoName = this.items.geoCodeName
        this.items.geoCode = this.code.geoCode.filter(obj => obj.codeName === geoName)[0].code
        delete this.serviceList.fields.distributeBtn
      },

      onView() {
        this.isEdit = false;
        this.items = JSON.parse(JSON.stringify(this.originItems));
        this.serviceList.fields.distributeBtn = {label: '배포'}
      },

      onSubmit() {

        // const {qualitySolutionTeamCode, dataCenterCode, modifyHistReason} = this.items;
        const {qualitySolutionTeamCode, dataCenterCode, modifyHistReason} = this.items;
        // const  = this.edge.items.map(r => [r.copyRankMin,r.copyRankMax, r.remainRankMin, r.hashValue] )
        const submitItems = {
          qualitySolutionTeamCode,
          dataCenterCode,
          modifyHistReason
        };
        const validate = this.$valid.all(submitItems);
        this.inValidForm = !validate;

        if (validate) {
          this.$https.put(`/pops/${this.id}`, this.items, this.edgeList.items)
            .then((res) => {
              this.$router.go(this.$router.currentRoute);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      },

      onDeploy() {
        const stateCode = this.items.processStateCodeName
        stateCode && stateCode === '완료'
          ? this.$https.put(`/pops/${this.id}/serviceProcess`)
            .then((res) => {
              this.$router.go(this.$router.currentRoute);
            })
            .catch((error) => {
              console.log(error);
            })
          : this.modal = {
            open: true,
            type: 'error',
            msg: `이전 배포가 완료되지 않아 \n` +
            '수정이 불가능합니다..\n',
            hideCancelBtn: true,
            action: () => {
              this.modal.open = false
              this.modal.hideCancelBtn = false
            }
          };
      },

      onDelete() {
        this.modal = {
          open: true,
          type: 'error',
          msg: '정말로 삭제하시겠습니까?',
          action: this.onDeleteData
        };
      },

      onDeleteData() {
        this.$https.delete(`/pops/${this.id}`)
          .then((res) => {
            this.$router.push({name: 'Pop 관리'});
          })
          .catch((error) => {
            console.log(error);
          });
      },

      getHistoryLink(rowId) {
        return `#/configuration/pop/${this.id}?histories=${rowId}`
      },

      showHistory() {
        this.isModalHistory = !this.isModalHistory;
        this.$https.get(`/pops/${this.id}/histories`)
          .then((res) => {
            this.history.items = res.data.items;
          });
      }
    }
  }
</script>
