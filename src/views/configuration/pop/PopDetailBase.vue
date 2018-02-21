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
          <small class="form-text-alone">
            http(s)://[edge].[content type].<strong class="text-primary">{{ items.popDomainName }}</strong>.[country].[service type].[service name].vessels.com
          </small>
        </b-form-fieldset>

        <!-- 주소 :: Edit -->
        <b-form-fieldset
          v-if="isEdit"
          :invalid-feedback="$valid.msg.select"
          :horizontal="true">
          <template slot="label">
            주소<i class="require">*</i>
          </template>

          <multiselect
            v-model="popCtprvnCode"
            :showLabels="false"
            :searchable="false"
            :options="code.popCtprvnCode"
            :loading="isLoad.popCtprvnCode"
            :class="{'invalid': !valid.popCtprvnCode }"
            @select="onFirstAddress"
            track-by="addressCode"
            label="addressCodeName"
            class="inline"
            style="width:156px"
            placeholder="선택"
          ></multiselect>

          <multiselect
            v-if="popCtprvnCode"
            v-model="popSigCode"
            :showLabels="false"
            :searchable="false"
            :options="code.popSigCode"
            :loading="isLoad.popSigCode"
            :class="{'invalid': !valid.popSigCode }"
            track-by="addressCode"
            label="addressCodeName"
            placeholder="선택"
            class="inline"
            style="width: 160px"
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

        <!-- Service Name -->
        <b-form-fieldset
          v-if="!isEdit"
          label="Service"
          :horizontal="true">
          <div class="badge-list">
            <span class="badge sm" v-for="item in serviceNames">
              {{ item }}
            </span>
          </div>
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
            :value.sync="items.bandwidth"
            style="width: 156px;"
            class="form-control"
            :options="{ numeral: true, numeralPositiveOnly: true, numeralDecimalScale: 0 }"
            required
          ></cleave>
          <b-form-input
            v-else
            :value="items.bandwidth"
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
      <span v-if="!isProcessComplete">
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
          hover
          show-empty
          :items="history.items"
          :fields="history.fields"
          :current-page="history.pageInfo.page"
          :per-page="history.pageInfo.size"
        >
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

    <!-- Message Alert Modal -->
    <b-modal title="Message" size="sm" v-model="modal.open" :class="`modal-${modal.type}`">
      <div class="d-block text-center">
        <p>{{ modal.msg }}</p>
      </div>
      <div slot="modal-footer" class="mx-auto">
        <b-button type="button" variant="primary" @click="modal.action">확인</b-button>
        <b-button type="button" variant="outline-secondary" @click="modal.open = false">취소</b-button>
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
          popName: '',
          popHostName: '',
          popDomainName: null,
          popCtprvnCode: null,
          popSigCode: null,
          popAddress: '',
          qualitySolutionTeamCode: null,
          qualitySolutionTeamCodeName: '',
          bandwidth: 0,
          popUseYn: true,
          serviceNames: null,
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
          items: [],
          pageInfo: {
            page: 1,
            size: 10,
            totalCount: 1
          }
        },
        isLoad: {
          popCtprvnCode: true,
          popSigCode: true,
          qualitySolutionTeamCode: true
        },
        isEdit: false,
        isModalHistory: false,

        modal: {
          open: false,
          type: 'done',
          msg: '',
          action (){}
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
      },
      isProcessComplete (){
        return (this.items.processStateCode !== null &&
                this.items.processStateCode !== '' &&
                this.items.processStateCode === 'PROCESS_STATE_02')
      },

      // validation
      valid (){
        return {
          popCtprvnCode: this.items.popCtprvnCode !== null,
          popSigCode: this.items.popSigCode !== null,
          qualitySolutionTeamCode: this.items.qualitySolutionTeamCode !== null
        }
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
        const validate = this.$valid.all(this.items);
        this.inValidForm = !validate;

        if (validate){
          this.$https.put(`/pops/${this.id}`, this.items)
            .then((res) => {
              this.$router.go(this.$router.currentRoute);
            })
            .catch((error) => {
              console.log(error);
            });
        }
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
        this.modal = {
          open: true,
          type: 'error',
          msg: '정말로 삭제하시겠습니까?',
          action: this.onDeleteData
        };
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
      }
    }
  }
</script>
