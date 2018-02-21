<template>
  <div class="animated fadeIn">
    <content-header
      :title="items.hostName"
      :name="name">
    </content-header>

    <div class="collapse-title">
      <b-button
        variant="secondary"
        v-b-toggle.formDefault
        :block="true">
        기본정보
        <i class="fa fa-angle-down"></i>
      </b-button>
    </div>
    <b-collapse id="formDefault" visible>
      <b-card>
        <!-- ID -->
        <b-form-fieldset
          label="Edge ID"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            v-model="items.edgeId"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- IP -->
        <b-form-fieldset
          label="IP"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            v-model="items.ip"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- Host Name -->
        <b-form-fieldset
          label="Host Name"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.hostName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- PoP 선택 -->
        <b-form-fieldset
          label="PoP 선택 *"
          :label-cols="3"
          :horizontal="true">
          <multiselect
            v-if="isEdit"
            v-model="popId"
            :allowEmpty="false"
            :showLabels="false"
            :searchable="false"
            :options="code.popId"
            :loading="isLoad.popId"
            label="popName"
            placeholder="선택"
          ></multiselect>
          <b-form-input
            v-else
            :value="items.popName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- 구분 -->
        <b-form-fieldset
          label="구분 *"
          :label-cols="3"
          :horizontal="true">
          <b-form-radio-group
            :options="[{ text: 'Edge', value: 'Edge' },{ text: 'Relay', value: 'Relay' }]"
            v-model="items.edgeRelayName"
          ></b-form-radio-group>
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
            v-model="items.referrerUseYn"
          ></c-switch>
          <b-badge
            v-else
            pill
            :variant="items.referrerUseYn ? 'success' : 'secondary'">
            {{ items.referrerUseYn ? '사용' : '미사용' }}
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
      </b-card>
    </b-collapse>

    <!-- Policy -->
    <div class="collapse-title" v-if="!isEdit">
      <b-button
        variant="secondary"
        v-b-toggle.policy
        :block="true">
        Policy
        <i class="fa fa-angle-down"></i>
      </b-button>
    </div>
    <b-collapse id="policy" v-if="!isEdit" visible>
      <!-- High Referrer -->
      <b-card v-if="isReferrerType === 'high'">
        <div slot="header">
          <a href="#/policy/ip-restriction" class="btn btn-sm btn-outline-secondary" target="_blank">IP Restriction 설정</a>
          <a href="#/policy/pop-preference" class="btn btn-sm btn-outline-secondary" target="_blank">PoP Preference 설정</a>
        </div>

        <b-form-fieldset
          label="IP Restriction"
          :label-cols="3"
          :horizontal="true">
          <div class="form-in-group">
            <b-form-fieldset
              v-for="(ip, index) in items.ipRestrictionList"
              :key="index"
              :label="String(index + 1)"
              :label-cols="1"
              :horizontal="true">
              <span class="domain-text">{{ ip }}</span>
            </b-form-fieldset>
          </div>
        </b-form-fieldset>

        <b-form-fieldset
          label="PoP Preference"
          :label-cols="3"
          :horizontal="true">
          <div class="form-in-group">
            <b-form-fieldset
              v-for="(popData, index) in items.preferenceList"
              :key="popData.popId"
              :label="popData.serviceName"
              :label-cols="2"
              :horizontal="true">
              <span class="domain-text">
                {{ popData.targetPopIdName1 }} -
                {{ popData.targetPopIdName2 }} -
                {{ popData.targetPopIdName3 }} -
                {{ popData.targetPopIdName4 }} -
                {{ popData.targetPopIdName5 }}
              </span>
            </b-form-fieldset>
          </div>
        </b-form-fieldset>
      </b-card>

      <!-- Low Referrer -->
      <b-card v-if="isReferrerType === 'low'">
        <div slot="header">
          <a href="#/policy/onetime-url" class="btn btn-sm btn-outline-secondary" target="_blank">One-Time URL 설정</a>
        </div>

        <b-form-fieldset
          label="One-Time URL"
          :label-cols="3"
          :horizontal="true">
          <div class="form-in-group">
            <b-form-fieldset
              label="expireTime"
              :label-cols="4"
              :horizontal="true">
              <b-form-input
                :value="items.oneTimeUrlInfo.expireTime"
                type="text"
                plaintext
              ></b-form-input>
            </b-form-fieldset>
            <b-form-fieldset
              label="ByPass"
              :label-cols="4"
              :horizontal="true">
              <b-badge
                pill
                :variant="items.oneTimeUrlInfo.bypassYn ? 'success' : 'secondary'">
                {{ items.oneTimeUrlInfo.bypassYn ? '사용' : '미사용' }}
              </b-badge>
            </b-form-fieldset>
          </div>
        </b-form-fieldset>
      </b-card>
    </b-collapse>


    <!-- 처리이력 -->
    <div class="collapse-title" v-if="!isEdit">
      <b-button
        variant="secondary"
        v-b-toggle.history
        :block="true">
        처리이력
        <i class="fa fa-angle-down"></i>
      </b-button>
    </div>
    <b-collapse id="history" v-if="!isEdit">
      <b-card>
        <!-- 등록일 -->
        <b-form-fieldset
          label="등록일"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.createDateTime"
            plaintext
            type="text"></b-form-input>
        </b-form-fieldset>
        <!-- 등록자 -->
        <b-form-fieldset
          label="등록자"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.createId"
            plaintext
            type="text"></b-form-input>
        </b-form-fieldset>
        <!-- 수정일 -->
        <b-form-fieldset
          v-if="items.modifyDateTime"
          label="수정일"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.modifyDateTime"
            plaintext
            type="text"></b-form-input>
        </b-form-fieldset>
        <!-- 수정자 -->
        <b-form-fieldset
          v-if="items.modifyDateTime"
          label="수정자"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.modifyId"
            plaintext
            type="text"></b-form-input>
        </b-form-fieldset>
        <!-- 배포상태 -->
        <b-form-fieldset
          label="배포상태"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="deploy.status ? '성공' : '실패'"
            style="width:30px"
            plaintext
            type="text"></b-form-input>
          (<a href="#">{{ deploy.count }}</a>)
        </b-form-fieldset>
      </b-card>
    </b-collapse>

    <div class="page-btn" v-if="isEdit">
      <b-button type="button" variant="outline-secondary" @click="onView">취소</b-button>
      <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
    </div>
    <div class="page-btn" v-else>
      <b-button type="button" variant="outline-secondary" class="float-left" @click="onDelete">삭제</b-button>
      <b-button type="button" variant="outline-secondary" @click="showHistory">이력관리</b-button>
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Referrer 관리' }">목록</b-button>
      <b-button type="button" variant="primary" @click="onEdit">수정</b-button>
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
          <template slot="histMgmtId" slot-scope="row">
            <a :href="getHistoryLink(row.value)" target="_blank">보기</a>
          </template>
        </b-table>
      </section>

      <div slot="modal-footer">
        <b-button type="button" variant="primary" @click="isModalHistory = false"><i class="fa fa-dot-circle-o"></i> 확인</b-button>
      </div>
    </b-modal>

    <!-- Message Modal -->
    <b-modal title="Message" size="sm" v-model="isModalMessage" class="modal-danger">
      <div class="d-block text-center">
        <h5>{{ modalMessage }}</h5>
      </div>
      <div slot="modal-footer">
        <b-button type="button" variant="danger" @click="onDeleteData"><i class="fa fa-dot-circle-o"></i> 삭제</b-button>
        <b-button type="button" variant="secondary" @click="isModalMessage = false"><i class="fa fa-ban"></i> 취소</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import cSwitch from '@/components/Switch'
  export default {
    name: 'edge',
    props: ['id'],
    components: {
      cSwitch
    },

    data (){
      return {
        name: 'Edge 상세',
        originItems: {},
        items: {
          edgeId: null,
          ip : null,
          hostName: null,
          popId : null,
          edgeRelayYn : null,
          edgeRelayName : null,
          serviceTypeCode: [],
          edgeDomainCode: [],
          edgeDomainName: null,
          edgeUseYn: null,
          modifyHistReason : "Edge 수정"
        },
        code: {
          popId: []
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
          popId: true
        },
        isEdit: false,
        isModalHistory: false,
        isModalMessage: false,
        modalMessage: '',

        isReferrerType: '',

        // 배포상태 - 임시
        deploy: {
          status: true,
          count: 11234
        }
      }
    },

    computed: {
      popId: {
        get () {
          return this.code.popId.find(obj => obj.popId === this.items.popId) || null;
        },
        set (newValue) {
          this.items.popId = newValue !== null ? newValue.popId : null;
        }
      }
    },

    created (){
      // History
      const historyId = this.$route.query.histories;
      const detailUrl = historyId !== undefined ? `/edges/${this.id}/histories/${historyId}` : `/edges/${this.id}`;

      if (historyId){
        document.querySelector('body.app').classList.add('history-mode')
      }

      // PoP List
      this.$https.get('/pops')
        .then((res) => {
          this.isLoad.popId = false;
          this.code.popId = res.data.items;
        });

      // Detail Data
      this.$https.get(detailUrl)
        .then((res) => {
          this.items = { ...this.items, ...res.data.items };
          this.originItems = JSON.parse(JSON.stringify(this.items));
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
        const { referrerId, popId, referrerUseYn, referrerTypeCode, modifyHistReason } = this.items;

        this.$https.put(`/referrers/${this.id}`, { referrerId, popId, referrerUseYn, referrerTypeCode, modifyHistReason })
          .then(() => {
            this.$router.go(this.$router.currentRoute);
          })
          .catch((error) => {
            console.log(error);
          });
      },

      onDelete (){
        this.modalMessage = '정말 삭제하시겠습니까?';
        this.isModalMessage = true;
      },

      onDeleteData (){
        this.$https.delete(`/referrers/${this.id}?referrerTypeCode=${this.referrerTypeCode}`)
          .then(() => {
            this.$router.push({ name: 'Referrer 관리' });
          })
          .catch((error) => {
            console.log(error);
          });
      },

      getHistoryLink (rowId){
        return `#/configuration/referrer/${this.id}?histories=${rowId}&referrerTypeCode=${this.referrerTypeCode}`
      },

      showHistory () {
        this.isModalHistory = !this.isModalHistory;
        this.$https.get(`/referrers/${this.id}/histories`,{
            referrerTypeCode: this.referrerTypeCode
          })
          .then((res) => {
            this.history.items = res.data.items;
          });
      }
    }
  }
</script>
