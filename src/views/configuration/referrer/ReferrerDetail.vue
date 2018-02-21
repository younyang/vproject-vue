<template>
  <div class="animated fadeIn">
    <div class="collapse-title">
      <b-button class="btn-collapse" v-b-toggle.formDefault>
        <i class="fa"></i>
        기본정보
      </b-button>
    </div>

    <b-collapse id="formDefault" visible>
      <b-form class="formView" :validated="inValidForm" novalidate>
        <!-- Referrer Id -->
        <b-form-fieldset
          label="ID"
          :horizontal="true">
          <b-form-input
            :value="id"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- 구분 -->
        <b-form-fieldset
          label="구분"
          :horizontal="true">
          <b-form-input
            :value="items.referrerTypeCodeName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- IP -->
        <b-form-fieldset
          label="IP"
          :horizontal="true">
          <b-form-input
            :value="items.componentIp"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- Host Name -->
        <b-form-fieldset
          label="Host Name"
          :horizontal="true">
          <b-form-input
            :value="items.componentHostName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- PoP 선택 -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.select"
          :horizontal="true">
          <template slot="label">
            PoP 선택<i v-if="isEdit" class="require">*</i>
          </template>
          <multiselect
            v-if="isEdit"
            v-model="popId"
            track-by="popId"
            label="popName"
            :showLabels="false"
            :options="code.popId"
            :loading="isLoad.popId"
            :class="{'invalid': !valid.popId }"
            placeholder="Select PoP"
          ></multiselect>
          <b-form-input
            v-else
            :value="items.popName"
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
            v-model="items.referrerUseYn"
          ></c-switch>
          <span
            v-else
            class="badge"
            :class="{'primary' : items.referrerUseYn }"
          >{{ items.referrerUseYn ? '사용' : '미사용' }}
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

    <!-- Policy -->
    <div class="collapse-title" v-if="!isEdit">
      <b-button class="btn-collapse" v-b-toggle.formPolicy>
        <i class="fa"></i>
        Policy
      </b-button>
    </div>

    <b-collapse id="formPolicy" visible  v-if="!isEdit">
      <!-- High Referrer -->
      <div class="referrer-content" v-if="isReferrerType === 'high'">
        <div class="link-list">
          <a href="#/configuration/referrers/ipRestriction" class="btn btn-in-table" target="_blank">IP Restriction 설정</a>
          <a href="#/configuration/referrers/popPreference" class="btn btn-in-table" target="_blank">PoP Preference 설정</a>
        </div>

        <div class="formView">
          <b-form-fieldset
            label="IP Restriction"
            :horizontal="true">
            <div class="form-in-view">
              <b-form-fieldset
                v-for="(ip, index) in items.ipRestrictionList"
                :key="index"
                :label="String(index + 1)"
                :horizontal="true">
                <span class="domain-text">{{ ip }}</span>
              </b-form-fieldset>
            </div>
          </b-form-fieldset>

          <b-form-fieldset
            label="PoP Preference"
            :horizontal="true">
            <div class="form-in-view">
              <b-form-fieldset
                v-for="(popData, index) in items.preferenceList"
                :key="popData.popId"
                :label="popData.serviceName"
                :horizontal="true">
                <span v-if="popData.targetPopIdName1">{{ popData.targetPopIdName1 || `&nbsp;` }}</span>
                <span v-if="popData.targetPopIdName2">- {{ popData.targetPopIdName2 || `&nbsp;` }}</span>
                <span v-if="popData.targetPopIdName3">- {{ popData.targetPopIdName3 || `&nbsp;` }}</span>
                <span v-if="popData.targetPopIdName4">- {{ popData.targetPopIdName4 || `&nbsp;` }}</span>
                <span v-if="popData.targetPopIdName5">- {{ popData.targetPopIdName5 || `&nbsp;` }}</span>
              </b-form-fieldset>
            </div>
          </b-form-fieldset>
        </div>
      </div>

      <!-- Low Referrer -->
      <div class="referrer-content" v-if="isReferrerType === 'low'">
        <div class="link-list">
          <a href="#/configuration/referrers/onetime" class="btn btn-in-table" target="_blank">One-Time URL 설정</a>
        </div>

        <div class="formView">
          <b-form-fieldset
            label="One-Time URL"
            :horizontal="true">
            <div class="form-in-view">
              <b-form-fieldset
                label="expireTime"
                :horizontal="true">
                <span class="form-text-alone">{{ items.oneTimeUrlInfo.expireTime }}</span>
              </b-form-fieldset>
              <b-form-fieldset
                label="ByPass"
                :horizontal="true">
                <span
                  class="badge"
                  :class="{'primary' : items.oneTimeUrlInfo.bypassYn }"
                >{{ items.oneTimeUrlInfo.bypassYn ? '사용' : '미사용' }}
                </span>
              </b-form-fieldset>
            </div>
          </b-form-fieldset>
        </div>
      </div>
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
      <span v-if="isProcessComplete">
        <b-button type="button" variant="outline-secondary" class="float-left" @click="onDelete">삭제</b-button>
        <b-button type="button" variant="outline-secondary" @click="showHistory">이력관리</b-button>
        <b-button type="button" variant="outline-secondary" :to="{ name: 'Referrer 관리' }">목록</b-button>
        <b-button type="button" variant="primary" @click="onEdit">수정</b-button>
      </span>
      <span v-else>
        <b-button type="button" variant="outline-secondary" @click="showHistory">이력관리</b-button>
        <b-button type="button" variant="outline-secondary" :to="{ name: 'Referrer 관리' }">목록</b-button>
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
  import cSwitch from '@/components/Switch'
  export default {
    name: 'referrer',
    props: ['id'],
    components: {
      cSwitch
    },

    data (){
      return {
        name: 'Referrer 상세',
        originItems: {},
        items: {
          referrerId : null,
          popId : null,
          referrerUseYn : false,
          referrerTypeCode : null,
          preferenceList: [],
          ipRestrictionList: [],
          oneTimeUrlInfo: {
            expireTime: null,
            bypassYn: null
          },
          modifyHistReason : "Referrer 수정"
        },
        referrerTypeCode: '',
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
          items: [],
          pageInfo: {
            page: 1,
            size: 10,
            totalCount: 1
          }
        },
        isLoad: {
          popId: true
        },
        isEdit: false,
        isModalHistory: false,
        isReferrerType: '',

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
      popId: {
        get () {
          return this.code.popId.find(obj => obj.popId === this.items.popId) || null;
        },
        set (newValue) {
          this.items.popId = newValue !== null ? newValue.popId : null;
        }
      },

      isProcessComplete (){
        return (this.items.processStateCode !== null &&
        this.items.processStateCode !== '' &&
        this.items.processStateCode === 'PROCESS_STATE_02')
      },

      // validation
      valid (){
        return {
          popId: this.items.popId !== null
        }
      }
    },

    created (){
      if (this.$route.query.referrerTypeCode === undefined){
        alert('잘못된 접근입니다')
        this.$router.push({ name: 'Referrer 관리' })
      }

      // History
      const historyId = this.$route.query.histories;
      const detailUrl = historyId !== undefined ? `/referrers/${this.id}/histories/${historyId}` : `/referrers/${this.id}`;

      if (historyId){
        document.querySelector('body.app').classList.add('history-mode')
      }
      this.referrerTypeCode = this.$route.query.referrerTypeCode;


      // PoP List
      this.$https.get('/pops')
        .then((res) => {
          this.isLoad.popId = false;
          this.code.popId = res.data.items;
        });

      // Detail Data
      this.$https.get(detailUrl, {
          referrerTypeCode: this.referrerTypeCode
        })
        .then((res) => {
          this.items = { ...this.items, ...res.data.items, referrerId: this.id };
          this.originItems = JSON.parse(JSON.stringify(this.items));
          this.isReferrerType = this.referrerTypeCode === 'COMPONENT_TYPE_01' ? 'high' : 'low';
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
        const submitItems = { referrerId, popId, referrerUseYn, referrerTypeCode, modifyHistReason };
        const validate = this.$valid.all(submitItems);

        this.inValidForm = !validate;

        if (validate){
          this.$https.put(`/referrers/${this.id}`, { referrerId, popId, referrerUseYn, referrerTypeCode, modifyHistReason })
            .then(() => {
              this.$router.go(this.$router.currentRoute);
            })
            .catch((error) => {
              console.log(error);
            });
        }
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
        this.$https.delete(`/referrers/${this.id}?referrerTypeCode=${this.referrerTypeCode}`)
          .then(() => {
            this.$router.push({ name: 'Referrer 관리' });
          })
          .catch((error) => {
            console.log(error);
          });
      },

      getHistoryLink (rowId){
        return `#/configuration/referrers/referrer/${this.id}?histories=${rowId}&referrerTypeCode=${this.referrerTypeCode}`
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
