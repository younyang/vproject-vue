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
          label="PoP ID"
          :horizontal="true">
          <b-form-input
            :value="id"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- PoP Name -->
        <b-form-fieldset
          label="PoP Name"
          :horizontal="true">
          <b-form-input
            :value="items.popName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- Host Name -->
        <b-form-fieldset
          label="Host Name(Prefix)"
          :horizontal="true">
          <b-form-input
            :value="items.popHostName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- Domain -->
        <b-form-fieldset
          label="Domain"
          :horizontal="true">
          <span class="domain-text">
            http(s)://[edge].[content type].<strong class="text-danger">{{ items.popDomainName }}</strong>.[country].[service type].[service name].vessels.com
          </span>
        </b-form-fieldset>

        <!-- 주소 :: Edit -->
        <b-form-fieldset
          v-if="isEdit"
          label="주소"
          :horizontal="true">
          <multiselect
            v-model="popCtprvnCode"
            class="inline"
            :showLabels="false"
            :searchable="false"
            :options="code.popCtprvnCode"
            :loading="isLoad.popCtprvnCode"
            :disabled="!isEdit"
            :class="{'view-type': !isEdit}"
            label="addressCodeName"
            style="min-width:130px"
            placeholder="선택"
            @input="onFirstAddress"
          ></multiselect>
          <multiselect
            v-if="popCtprvnCode"
            v-model="popSigCode"
            :showLabels="false"
            :searchable="false"
            :options="code.popSigCode"
            :loading="isLoad.popSigCode"
            label="addressCodeName"
            placeholder="선택"
            class="inline"
            style="min-width: 130px"
          ></multiselect>
        </b-form-fieldset>

        <!-- 주소 :: View -->
        <b-form-fieldset
          label="주소"
          :horizontal="true"
          v-else>
          <b-form-input
            :value="items.popAddress"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <b-form-fieldset
          label="품질솔루션팀"
          :horizontal="true">
          <multiselect
            v-if="isEdit"
            v-model="qualitySolutionTeamCode"
            :showLabels="false"
            :searchable="false"
            :options="code.qualitySolutionTeamCode"
            :loading="isLoad.qualitySolutionTeamCode"
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


        <!-- Service Name -->
        <b-form-fieldset
          v-if="!isEdit"
          label="Service"
          :horizontal="true">
          <span class="badge badge-success badge-pill" v-for="name in serviceNames">
            {{ name }}
          </span>
        </b-form-fieldset>


        <!-- Bandwidth -->
        <b-form-fieldset
          label="Bandwidth"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            v-if="isEdit"
            v-model="items.bandwidth"
            type="text"
            class="w-25"
          ></b-form-input>
          <b-form-input
            v-else
            :value="items.bandwidth"
            type="text"
            class="w-25"
            plaintext
          ></b-form-input>
        </b-form-fieldset>


        <!-- 사용여부 -->
        <b-form-fieldset
          label="사용여부"
          :label-cols="3"
          :horizontal="true">
          <c-switch
            v-if="isEdit"
            type="icon"
            variant="success"
            v-bind="{on: '\uf00c', off: '\uf00d'}"
            :pill="true"
            v-model="items.popUseYn"
          ></c-switch>
          <b-badge
            v-else
            pill
            :variant="items.popUseYn ? 'success' : 'secondary'">
            {{ items.popUseYn ? '사용' : '미사용' }}
          </b-badge>
        </b-form-fieldset>

        <!-- 변경이력 -->
        <b-form-fieldset
          v-if="isEdit"
          label="변경이력"
          :label-cols="3"
          :horizontal="true">
          <b-form-textarea
            v-model="items.modifyHistReason"
            :rows="6">
          </b-form-textarea>
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
            v-if="items.modifyDateTime"
            label="수정일"
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

        <!-- 배포상태 -->
        <b-form-fieldset
          label="배포상태"
          :horizontal="true">
          <input
            type="text"
            readonly="readonly"
            class="form-control-plaintext"
            style="width:50px"
            :value="items.processStateCodeName"
          >
          <a :href="`#/workflow/service/${ items.processId }`" class="btn btn-in-table" target="_blank">{{ items.processId }}</a>
        </b-form-fieldset>
      </b-form>
    </b-collapse>


    <div class="page-btn" v-if="isEdit">
      <b-button type="button" variant="outline-secondary" @click="onView">취소</b-button>
      <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
    </div>

    <div class="page-btn" v-else>
      <span v-if="items.processStateCode === 'PROCESS_STATE_02'">
        <b-button type="button" variant="outline-secondary" class="float-left" @click="onDelete">삭제</b-button>
        <b-button type="button" variant="outline-secondary" @click="onDeploy">배포</b-button>
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
          striped
          bordered
          hover
          show-empty
          :items="history.items"
          :fields="history.fields"
        >
          <template slot="histMgmtId" scope="row">
            <a :href="getHistoryLink(row.value)" target="_blank">보기</a>
          </template>
        </b-table>
      </section>

      <div slot="modal-footer">
        <b-button type="button" size="sm" variant="primary" @click="isModalHistory = false"><i class="fa fa-dot-circle-o"></i> 확인</b-button>
      </div>
    </b-modal>

    <!-- Message Modal -->
    <b-modal ref="messageModalRef" title="Message" size="sm" class="modal-danger">
      <div class="d-block text-center">
        <h5>{{ modalMessage }}</h5>
      </div>
      <div slot="modal-footer">
        <b-button type="button" size="sm" variant="danger" @click="onDeleteData"><i class="fa fa-dot-circle-o"></i> 삭제</b-button>
        <b-button type="button" size="sm" variant="secondary" @click="hideMessage"><i class="fa fa-ban"></i> 취소</b-button>
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

    data (){
      return {
        name: 'Pop 상세',
        originItems: {},
        items: {
          popName: "",
          popHostName: "",
          popDomainName: "",
          popCtprvnCode: "",
          popSigCode: "11230",
          popAddress: "",
          qualitySolutionTeamCode: "",
          qualitySolutionTeamCodeName: "",
          bandwidth: 0,
          popUseYn: true,
          serviceNames: "",
          lowReferrerList: [],
          edgeList: [],
          processStateCodeName: null,
          processStateCode: null,
          processId: null
        },
        code: {
          popCtprvnCode: [],
          popSigCode: [],
          qualitySolutionTeamCode: []
        },
        history: {
          fields: {
            createId: {label: '등록/수정자', 'class': 'text-left'},
            histBeginDateTime: {label: '등록/수정일시'},
            modifyHistReason: {label: '변경이력', 'class': 'text-left'},
            histMgmtId: {label: '보기'}
          },
          items: []
        },
        isLoad: {
          popCtprvnCode: true,
          popSigCode: true,
          qualitySolutionTeamCode: true
        },
        isEdit: false,
        isModalHistory: false,
        modalMessage: '',

        // 배포상태 - 임시
        deploy: {
          status: true,
          count: 11234
        },

        inValidForm: false
      }
    },

    computed: {
      popCtprvnCode: {
        get () {
          return this.code.popCtprvnCode.find(obj => obj.addressCode === this.items.popCtprvnCode) || null;
        },
        set (newValue) {
          this.items.popCtprvnCode = newValue !== null ? newValue.addressCode : null;
        }
      },
      popSigCode: {
        get () {
          return this.code.popSigCode.find(obj => obj.addressCode === this.items.popSigCode) || null;
        },
        set (newValue) {
          this.items.popSigCode = newValue !== null ? newValue.addressCode : null;
        }
      },
      qualitySolutionTeamCode: {
        get () {
          return this.code.qualitySolutionTeamCode.find(obj => obj.code === this.items.qualitySolutionTeamCode) || null;
        },
        set (newValue) {
          this.items.qualitySolutionTeamCode = newValue !== null ? newValue.code : null;
        }
      },
      serviceNames (){
        return this.items.serviceNames !== null ? this.items.serviceNames.split(',') : []
      }
    },

    created (){
      // History
      const historyId = this.$route.query.histories;
      const detailUrl = historyId !== undefined ? `/pops/${this.id}/histories/${historyId}` : `/pops/${this.id}`;

      if (historyId){
        document.querySelector('body.app').classList.add('history-mode')
      }

      // 주소 Code
      this.fetchAddress();

      // 품질솔루션팀 Code
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'QUALITY_TEAM' }
        })
        .then((res) => {
          this.isLoad.qualitySolutionTeamCode = false;
          this.code.qualitySolutionTeamCode = res.data.items;
        });

      // Detail Data
      this.$https.get(detailUrl)
        .then((res) => {
          this.items = res.data.items;
          this.originItems = JSON.parse(JSON.stringify(this.items));

          if (this.items.popCtprvnCode !== ''){
            this.fetchAddress(this.items.popCtprvnCode);
          }
        });

    },

    methods: {
      onEdit (){
        this.isEdit = true;
      },

      onView (){
        this.isEdit = false;
        this.items = JSON.parse(JSON.stringify(this.originItems));
      },

      onSubmit (){
        this.$https.put(`/pops/${this.id}`, this.items)
          .then((res) => {
            this.$router.go(this.$router.currentRoute);
          })
          .catch((error) => {
            console.log(error);
          });
      },

      onDeploy (){
        this.$https.put(`/pops/${this.id}/serviceProcess`)
          .then((res) => {
            this.$router.go(this.$router.currentRoute);
          })
          .catch((error) => {
            console.log(error);
          });
      },

      onDelete (){
        this.modalMessage = '정말 삭제하시겠습니까?';
        this.showMessage();
      },

      onDeleteData (){
        this.$https.delete(`/pops/${this.id}`)
          .then((res) => {
            this.$router.push({ name: 'Pop 관리' });
          })
          .catch((error) => {
            console.log(error);
          });
      },

      onFirstAddress (obj){
        this.fetchAddress(obj.addressCode)
      },

      fetchAddress (param =''){
        this.$https.get('/pops/address', {
          firstDepth: param
        })
          .then((res) => {
            if (param === ''){
              this.isLoad.popCtprvnCode = false;
              this.code.popCtprvnCode = res.data.items;
            } else {
              this.isLoad.popSigCode = false;
              this.code.popSigCode = res.data.items;
            }
          });
      },

      getHistoryLink (rowId){
        return `#/configuration/pop/${this.id}?histories=${rowId}`
      },

      showHistory () {
        this.isModalHistory = !this.isModalHistory;
        this.$https.get(`/pops/${this.id}/histories`)
          .then((res) => {
            this.history.items = res.data.items;
          });
      },

      showMessage () {
        this.$refs.messageModalRef.show()
      },
      hideMessage () {
        this.$refs.messageModalRef.hide()
      }
    }
  }
</script>
