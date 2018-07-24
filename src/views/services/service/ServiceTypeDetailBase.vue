<template>
  <div class="animated fadeIn">

    <div class="collapse-title">
      <b-button class="btn-collapse" v-b-toggle.formDefault>
        <i class="fa"></i>
        기본정보
      </b-button>
    </div>

    <!-- 서비스 이름 필드 -->
    <b-collapse id="formDefault" visible>
      <b-form class="formView" :validated="inValidForm" novalidate>
        <!-- Company -->
        <b-form-fieldset
          v-if="!isEdit"
          :horizontal="true">
          <template slot="label">
            Name
          </template>

          <b-form-input
            v-if="!isEdit"
            :value="items.serviceTypeName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <b-form-fieldset
          v-if="isEdit"
          :invalid-feedback="feedback.serviceTypeName"
          :horizontal="true">

          <template slot="label">
            Name
            <i class="require">*</i>
          </template>

          <b-form-input
            v-model="tempItems.serviceTypeName"
            type="text"
            placeholder=""
            :state="valid.serviceTypeName"
            @input="serviceTypeNameExists = null"
            required
          ></b-form-input>
          <b-button variant="in-table" @click="fetchNameExists">중복확인</b-button>
          <span class="ico ml-2 mid" v-if="isEdit && serviceTypeNameExists !== null">
          <i v-if="serviceTypeNameExists === 'success'" class="fa fa-check-circle"></i>
          <i v-if="serviceTypeNameExists === 'fail'" class="fa fa-times-circle"></i>
        </span>
        </b-form-fieldset>

        <!-- 서비스 프로토콜 목록 필드 -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.select"
          :horizontal="true">
          <template slot="label">
            Protocol
            <i v-if="isEdit" class="require">*</i>
          </template>

          <b-form-input
            v-if="!isEdit"
            :value="items.protocolCode"
            plaintext
            type="text"
          ></b-form-input>

          <multiselect
            v-if="isEdit"
            v-model="serviceTypeProtocolList"
            class="multiselect"
            :class="{'invalid': !valid.serviceTypeProtocolList }"
            track-by="codeName"
            label="codeName"
            :multiple="true"
            :showLabels="false"
            :options="code.serviceTypeProtocolList"
            placeholder="Select service type protocol"
          ></multiselect>

        </b-form-fieldset>

        <div class="form-row">

          <!-- 랭크 볼륨 -->
          <b-form-fieldset
            :invalid-feedback="$valid.msg.require"
            :horizontal="true">
            <template slot="label">
              Rank Size
              <i v-if="isEdit" class="require">*</i>
            </template>

            <b-form-input
              v-if="!isEdit"
              :value="items.rankVolumn"
              plaintext
              type="text"
            ></b-form-input>
            <b-form-input
              v-if="isEdit"
              v-model="tempItems.rankVolumn"
              type="number"
              min="1" max="99999999999"
              required
            ></b-form-input>

          </b-form-fieldset>

          <!-- 랭크 개수 -->
          <b-form-fieldset
            :invalid-feedback="$valid.msg.require"
            :horizontal="true">
            <template slot="label">
              Rank Count
              <i v-if="isEdit" class="require">*</i>
            </template>

            <b-form-input
              v-if="!isEdit"
              :value="items.rankCount"
              plaintext
              type="text"
            ></b-form-input>
            <b-form-input
              v-if="isEdit"
              v-model="tempItems.rankCount"
              type="number"
              min="1" max="99999999999"
              required
            ></b-form-input>
          </b-form-fieldset>
        </div>

        <!-- hash 값 필드 -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">

          <template slot="label">
            Hash
            <i v-if="isEdit" class="require">*</i>
          </template>

          <b-form-input
            v-if="!isEdit"
            :value="items.hashDivisor"
            plaintext
            type="text"
          ></b-form-input>
          <b-form-input
            v-if="isEdit"
            v-model="tempItems.hashDivisor"
            type="text"
            required
          ></b-form-input>
        </b-form-fieldset>

        <!-- 사용여부 필드 -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">

          <template slot="label">
            사용여부
            <i v-if="isEdit" class="require">*</i>
          </template>

          <span
            v-if="!isEdit"
            class="badge"
            :class="{'primary' : items.serviceTypeUseYn }"
          >{{ items.serviceTypeUseYn ? '사용' : '미사용' }}
          </span>
          <b-button
            v-if="!isEdit"
            variant="in-table-icon"
            v-b-tooltip.hover
            :title="`ServiceType 사용여부 수정`"
            @click="checkIsEditable(onEditUseYn)"
          ><i class="fa fa-pencil"></i>
          </b-button>
          <c-switch
            v-if="isEdit"
            type="text"
            class="v-switch"
            on="사용"
            off="미사용"
            v-model="tempItems.serviceTypeUseYn"
          ></c-switch>
        </b-form-fieldset>

        <!-- 변경이력 핊드 -->
        <b-form-fieldset
          v-if="isEdit"
          label="변경이력<i class='require'>*</i>"
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <b-form-textarea
            v-model="tempItems.modifyHistReason"
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
      <span>
        <b-button type="button" variant="outline-secondary" class="float-left"
                  @click="checkIsEditable(onDelete)">삭제</b-button>
        <b-button type="button" variant="outline-secondary" @click="showHistory">이력관리</b-button>
        <b-button type="button" variant="outline-secondary"
                  :to="{ name: 'ServiceType 관리' }">목록</b-button>
        <b-button type="button" variant="primary" @click="checkIsEditable(onEdit)">수정</b-button>
      </span>
    </div>

    <!-- 사용여부 수정 Modal -->
    <b-modal size="lg" v-model="isModalUseYn"
             @show="onOpenUseYn" @hide="onResetUseYn">
      <template slot="modal-title">
        {{ items.serviceTypeCode }}
        <small> > 사용 여부</small>
      </template>

      <b-form class="formView" :validated="inValidUseForm" novalidate>
        <b-form-fieldset
          label="사용 여부"
          :horizontal="true">
          <c-switch
            type="text"
            class="v-switch"
            on="사용"
            off="미사용"
            v-model="serviceTypeUseYnItems.serviceTypeUseYn"
          ></c-switch>
        </b-form-fieldset>
        <b-form-fieldset
          label="변경이력<i class='require'>*</i>"
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <b-form-textarea :rows="6" v-model="serviceTypeUseYnItems.modifyHistReason"
                           required></b-form-textarea>
        </b-form-fieldset>
      </b-form>

      <div slot="modal-footer">
        <b-button type="button" variant="primary" @click="onSubmitUseYn">저장</b-button>
        <b-button type="button" variant="outline-secondary" @click="onResetUseYn">취소</b-button>
      </div>
    </b-modal>

    <!-- 이력관리 Modal -->
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

      <div slot="modal-footer" class="mx-auto">
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
  // import ContentHeader from '@/components/ContentHeader'
  import cSwitch from '@/components/Switch'

  /**
   * @vue-data {Object} item - 현재 서비스 타입 정보
   * @vue-data {Object} originItems - 초기 서비스 타입 정보
   * @vue-data {Object} serviceTypeUseYnItems - 모달창에 사용되는 임시 서비스타입 사용여부
   * @vue-computed {String} message
   */
  export default {
    name: 'service',
    props: ['id'],
    components: {
      // ContentHeader,
      cSwitch
    },

    data() {
      return {
        name: 'Service 상세',
        originItems: {},
        tempItems: {},
        items: {
          protocolCode: [],
          serviceTypeName: "",
          serviceTypeCode: '',
          rankVolumn: '',
          rankCount: '',
          hashDivisor: '',
          serviceTypeUseYn: false,
          createDateTime: "",
          modifyDateTime: "",
          isEditable: false,
          serviceTypeDomainName: '',
          modifyHistReason: '',
          processStateCode: null,
          processId: null
        },
        code: {
          serviceTypeProtocolList: [],
          tempServiceTypeProtocolList: [],
          protocolList: [],
          serviceTypeCode: []
        },
        history: {
          fields: {
            createId: {label: '등록/수정자', 'class': 'text-left'},
            histBeginDateTime: {label: '등록/수정일시'},
            modifyType: {label: '구분'},
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

        isEdit: false,
        isModalHistory: false,
        isModalServiceType: false,
        isModalUseYn: false,

        // 기본 경고 modal 창의 기본 구조
        modal: {
          open: false,
          type: 'done',
          msg: '',
          action() {
          },
          hideCancelBtn: false
        },

        serviceTypeUseYnItems: {
          serviceTypeUseYn: null,
          modifyHistReason: "서비스 타입 사용 여부 변경"
        },

        serviceTypeNameExists: null,

        inValidServiceForm: false,
        inValidRemoveServiceType: false,
        inValidUseForm: false,
        inValidForm: false
      }

    },

    computed: {
      // 서비스타입 프로토콜 목록은
      serviceTypeProtocolList: {
        get() {
          return this.code.tempServiceTypeProtocolList.length > 0
            ? this.code.tempServiceTypeProtocolList.map(val => this.code.serviceTypeProtocolList.find(obj => obj.code === val.protocolCode))
            : [];
        },
        set(newValue) {
          this.code.tempServiceTypeProtocolList = newValue.length > 0
            ? newValue.map(obj => ({protocolCode: obj.code}))
            : [];
        }
      },

      valid() {
        return {
          // 한글자라도 입력이 됐을 때 영문대소문자와 숫자만 입력됐는지 테스트한다.
          serviceTypeName: (this.tempItems.serviceTypeName === null || this.tempItems.serviceTypeName.length === 0)
            ? null : (this.tempItems.serviceTypeName.length > 0 && /^[A-Za-z0-9]*$/.test(this.tempItems.serviceTypeName)),
          serviceTypeProtocolList: this.code.serviceTypeProtocolList.length,

          // serviceTypeCode: this.tempItems.serviceTypeCode.length &&
          // this.serviceItems.serviceTypeCode.length &&
          // !this.inValidRemoveServiceType
        }
      },

      // validation feedback
      feedback() {
        return {
          serviceTypeName: (!(/^[A-Za-z0-9]*$/.test(this.tempItems.serviceTypeName)) && this.tempItems.serviceTypeName.length > 0) ?
            '영문, 숫자만 입력하십시오.'
            : (this.serviceTypeNameExists === null && this.tempItems.serviceTypeName.length > 0) ?
              '중복확인은 필수입니다.'
              : (this.serviceTypeNameExists === 'not') ?
                '입력된 항목이 없습니다.'
                : (this.serviceTypeNameExists === 'fail') ?
                  '이미 등록된 Service Name이 있습니다.'
                  : this.items.serviceTypeName.length === 0 ?
                    this.$valid.msg.require : ''

          // serviceTypeCode: this.inValidRemoveServiceType ?
          //   '사용 설정된 PoP이 존재하여 삭제할 수 없습니다. 삭제 후, 다시 시도해주세요.'
          //   : this.serviceItems.serviceTypeCode.length === 0 ?
          //     '변경된 사항이 없습니다.'
          //     : this.items.serviceTypeCode.length === 0 ?
          //       this.$valid.msg.select : ''
        }
      }
    },

    created() {

      // 이력관리 보기 처리
      const historyId = this.$route.query.histories;
      this.detailUrl = historyId !== undefined ? `/servicetype/${this.id}/histories/${historyId}` : `/servicetype/${this.id}`;

      if (historyId) {
        document.querySelector('body.app').classList.add('history-mode');
      }

      // Detailed Service Type Info
      // this.$https.get(`/servicetype/${this.id}`)
      this.$https.get(this.detailUrl)
        .then((res) => {
          this.items = res.data.items
          // 초기값을 가진 객체를 딥복제 -  추후 변경된 값 복구를 위해서
          this.originItems = JSON.parse(JSON.stringify(this.items))

        });

      // Fetch Service Type Protocol Code
      this.$https.get('/system/commonCode', {
        q: {groupCode: 'PROTOCOL'}
      })
        .then((res) => {
          this.code.serviceTypeProtocolList = res.data.items.map(r => {
            r.codeName = r.codeName.toUpperCase();
            return r
          })
        });
    },


    methods: {

      // 서비스 이름이 존재하는지 중복확인
      fetchNameExists() {
        if (!this.tempItems.serviceTypeName) {
          this.serviceTypeNameExists = 'not';
          return;
        }
        this.$https.get('/servicetype/name', {
          serviceTypeName: this.tempItems.serviceTypeName
        })
          .then((res) => {
            this.serviceTypeNameExists = res.data.result === 'Success' ? 'success'
              // 변경 전 이름과 같을 경우는 중복체크를 통과시킨다.
              : this.items.serviceTypeName === this.tempItems.serviceTypeName ? 'success'
                : 'fail';
          });
      },

      checkIsEditable(func) {
        const isEditable = this.items.isEditable ? this.items.isEditable : ''
        const name = (typeof func === "function" && func.name) ? func.name : null

        if (isEditable == true && name) {

          (name === 'bound onEditUseYn') ? this.onEditUseYn() // 수정
            : (name === 'bound onEdit') ? this.onEdit() // 사용여부 수정
            : (name === 'bound onDelete') ? this.onDelete() : '' // 삭제

        } else {
          this.onCannotEdit()
        }
      },

      onEditUseYn() {
        this.isModalUseYn = !this.isModalUseYn
      },

      // 수정 시작
      onEdit() {
        this.isEdit = true;
        this.tempItems = JSON.parse(JSON.stringify(this.originItems));
        // 프로토콜 이름과 맞는 프로토콜 정보를 뽑아서 임시 서비스 프로토콜 목록에 넣는다.

        this.tempItems.protocolCode.split(",")
          .forEach(name =>
            this.code.tempServiceTypeProtocolList.push(
              this.code.serviceTypeProtocolList.filter(row => row.codeName === name).map(obj => ({protocolCode: obj.code}))[0]
            )
          )
      },

      // 수정 취소
      onView() {
        this.isEdit = false;
        this.tempItems = {};
        this.code.tempServiceTypeProtocolList = []
      },

      // 수정 저장
      onSubmit() {
        let serviceTypeProtocolList = this.code.tempServiceTypeProtocolList
        // 서비스타입 수정하는데 필요없는 정보 제거
        delete this.tempItems.isEditable
        const submitItems = {
          ...this.tempItems,
          serviceTypeProtocolList,
        };

        // feedback 을 같이 검사해야 중복확인 안 된 상태에서의 저장을 막을 수있다.
        if (this.validate(submitItems) && !this.feedback.serviceTypeName) {
          this.$https.put(`/servicetype/${this.id}/type2`, submitItems)
            .then((res) => {
              this.$router.go(this.$router.currentRoute);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      },

      onCannotEdit() {
        this.modal = {
          open: true,
          type: 'error',
          msg: `현재 사용중인 Type은 삭제할 수 없습니다. \n` +
          '해제 후, 다시 시도해주세요.\n',
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
        this.$https.delete(`/servicetype/${this.id}/type3`)
          .then((res) => {
            this.$router.push({name: 'ServiceType 관리'});
          })
          .catch((error) => {
            console.log(error);
          });
      },

      // 사용여부 모달이 열릴 때 현재 초기 사용여부 값을 모달 창 내부 변수에 복제한다.
      onOpenUseYn() {
        this.serviceTypeUseYnItems.serviceTypeUseYn = this.originItems.serviceTypeUseYn
      },

      // 사용여부 모달 확인버튼이 눌릴 때 사용여부 값을 서버에 전송하고 변경 값을 연관된 외부 변수에 적용한다.
      onSubmitUseYn() {
        const validate = this.$valid.all(this.serviceTypeUseYnItems);
        this.inValidUseForm = !validate;

        if (validate) {
          this.$https.put(`/servicetype/${this.id}/use`, this.serviceTypeUseYnItems)
            .then(() => {
              this.isModalUseYn = false;
              // items 와 originItems
              this.items.serviceTypeUseYn = this.serviceTypeUseYnItems.serviceTypeUseYn
              this.originItems.serviceTypeUseYn = this.serviceTypeUseYnItems.serviceTypeUseYn
            })
            .catch((error) => {
              console.log(error);
              this.onResetUseYn();
            });
        }
      },

      // 사용여부 모달 취소 혹은 닫힐 때 내부 변수값을 초기화한다.
      onResetUseYn() {
        this.isModalUseYn = false;
        this.serviceTypeUseYnItems = {
          serviceTypeUseYn: null,
          modifyHistReason: "서비스 사용 여부 변경"
        }
      },

      validate(submitItems) {

        const {
          serviceTypeName,
          serviceTypeProtocolList,
          rankVolumn,
          rankCount,
          hashDivisor,
          serviceTypeUseYn,
          modifyHistReason
        } = submitItems;

        let validateItems = {
          serviceTypeName,
          serviceTypeProtocolList,
          rankVolumn,
          rankCount,
          hashDivisor,
          serviceTypeUseYn,
          modifyHistReason
        }

        const validate = this.$valid.all(validateItems);

        this.inValidForm = !validate;
        return validate;
      },

      getHistoryLink(rowId) {
        return `#/service/servicetype/${this.id}?histories=${rowId}`
      },

      showHistory() {
        this.isModalHistory = !this.isModalHistory;
        this.$https.get(`/servicetype/${this.id}/histories`)

          .then((res) => {
            this.history.items = res.data.items;
          });
      },
    }
  }
</script>
