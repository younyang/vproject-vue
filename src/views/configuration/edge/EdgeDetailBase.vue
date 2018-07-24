<template>
  <div class="animated fadeIn">
    <content-header
      :title="items.hostName"
      :small="items.ip"
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
        <!-- ID -->
        <b-form-fieldset
          label="Edge ID"
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
          :horizontal="true">
          <b-form-input
            :value="items.hostName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- PoP -->
        <b-form-fieldset
          label="PoP"
          :horizontal="true">
          <div class="badge-list">
            <span class="badge sm" v-for="item in popIdArray">
              {{ item.popName }}
            </span>
          </div>
        </b-form-fieldset>

        <!-- 구분 -->
        <b-form-fieldset
          label="구분"
          :horizontal="true">
          <b-form-input
            :value="items.edgeRelayName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- Service Type -->
        <b-form-fieldset
          label="Service Type / Protocol"
          :horizontal="true">

          <div class="badge-list">
            <span class="badge sm" v-for="item in serviceTypeCode">
              {{ item.serviceTypeName }}
            </span>
          </div>
          <b-button
            v-if="isEditableServiceType"
            variant="in-table-icon"
            v-b-tooltip.hover
            :title="`Service Type 수정`"
            @click="isModalServiceType = !isModalServiceType"
          ><i class="fa fa-pencil"></i>
          </b-button>
        </b-form-fieldset>

        <!-- 지역 :: Edit -->
        <b-form-fieldset
          v-if="isEdit"
          :invalid-feedback="$valid.msg.select"
          :horizontal="true">
          <template slot="label">
            지역<i class="require">*</i>
          </template>
          <multiselect
            v-model="geoCode"
            :showLabels="false"
            :searchable="false"
            :options="code.geoCode"
            :loading="isLoad.geoCode"
            :class="{'invalid': !valid.geoCode }"
            track-by="code"
            label="codeName"
            style="width:156px"
            placeholder="선택"
          ></multiselect>
        </b-form-fieldset>

        <!-- 지역 :: View -->
        <b-form-fieldset
          label="지역"
          :horizontal="true"
          v-else>
          <b-form-input
            :value="items.geoCodeName"
            type="text"
            plaintext
          ></b-form-input>
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
            :value="items.edgeAddress"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- Bandwidth -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <template slot="label">
            Bandwidth(Gbps)<i v-if="isEdit" class="require">*</i>
          </template>
          <cleave
            v-if="isEdit"
            v-model="items.bandwidth"
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
          <!-- 수정일시 -->
          <b-form-fieldset
            v-if="items.modifyDateTime"
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

        <!-- 배포상태-->
        <b-form-fieldset
          v-if="items.processId"
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
        <b-form-fieldset
          v-if="!items.processId&&!isHistory"
          label="배포상태"
          :horizontal="true">
          <input
            type="text"
            readonly="readonly"
            class="form-control-plaintext"
            style="width:50px"
            value="대기"
          >
        </b-form-fieldset>

      </b-form>
    </b-collapse>

    <div class="page-btn" v-if="isEdit">
      <b-button type="button" variant="outline-secondary" @click="onView">취소</b-button>
      <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
    </div>

    <div class="page-btn" v-else>
      <b-button type="button" variant="outline-secondary" class="float-left" @click="onDelete">삭제</b-button>
      <b-button type="button" variant="outline-secondary" @click="showHistory">이력관리</b-button>
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Edge 관리' }">목록</b-button>
      <b-button type="button" variant="primary" @click="onEdit">수정</b-button>
    </div>


    <!-- Service Type 수정 Modal -->
    <b-modal id="serviceModal" size="lg" v-model="isModalServiceType" @hide="onResetService">
      <template slot="modal-title">
        {{ items.serviceName }}
        <small> > Service Type/Protocol</small>
      </template>

      <b-form class="formView" :validated="inValidServiceForm" novalidate>
        <b-form-fieldset
          label="구분"
          :horizontal="true">
          <b-form-radio-group
            :options="[{ text: '추가', value: 'ADD'},{ text: '삭제', value: 'DELETE'}]"
            v-model="serviceItems.command"
            @change="resetServiceType"
          ></b-form-radio-group>
        </b-form-fieldset>
        <b-form-fieldset
          :invalid-feedback="feedback.serviceTypeCode"
          :horizontal="true">
          <template slot="label">
            ServiceType/Protocol <i class="require" v-if="serviceItems.command ==='DELETE'">*</i>
          </template>

          <multiselect
            v-model="serviceTypeCode"
            class="multiple"
            :class="{'is-invalid': !valid.serviceTypeCode }"
            :role="serviceItems.command ==='ADD' ? 'addMode' : 'delMode'"
            track-by="serviceTypeAndProtocolCode"
            label="serviceTypeName"
            :multiple="true"
            :searchable="false"
            :showLabels="false"
            :closeOnSelect="false"
            :options="code.serviceTypeCode"
            :loading="isLoad.serviceTypeCode"
            @select="onSelectType"
            @remove="onRemoveType"
          ></multiselect>
        </b-form-fieldset>
        <b-form-fieldset
          label="변경이력<i class='require'>*</i>"
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <b-form-textarea :rows="6" v-model="serviceItems.modifyHistReason" required></b-form-textarea>
        </b-form-fieldset>
      </b-form>

      <div slot="modal-footer">
        <b-button type="button" variant="primary" @click="onSubmitService">저장</b-button>
        <b-button type="button" variant="outline-secondary" @click="onResetService">취소</b-button>
      </div>
    </b-modal>


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
    name: 'edgeDetailBase',
    props: ['id'],
    components: {
      ContentHeader,
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
          edgeRelayYn : null,
          edgeRelayName : null,
          serviceTypeCode: [],
          edgeDomainCode: [],
          edgeDomainName: null,
          edgeUseYn: null,
          modifyHistReason : "Edge 수정",
          popIdArray: [],
          popCtprvnCode: null,
          popSigCode: null,
          edgeAddress: '',
          bandwidth: 0,
          geoCode: null,
          geoCodeName: ''
        },
        serviceItems: {
          command: "ADD",
          serviceTypeCode: [],
          modifyHistReason: "서비스 타입 수정"
        },
        code: {
          serviceTypeCode: [],
          serviceTypeCodeAll: [],
          popIdArray: [],
          popIdAll: [],
          popCtprvnCode: [],
          popSigCode: [],
          geoCode: []
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
          popId: true,
          serviceTypeCode: true,
          popCtprvnCode: true,
          popSigCode: true,
          geoCode: true
        },

        isEdit: false,
        isModalHistory: false,
        isModalServiceType: false,
        isHistory: false,

        modal: {
          open: false,
          type: 'done',
          msg: '',
          action (){}
        },

        inValidServiceForm: false,
        inValidRemoveServiceType: false,
        inValidForm: false
      }
    },

    computed: {
      serviceTypeCode: {
        get () {
          return this.items.serviceTypeCode.length > 0
            ? this.items.serviceTypeCode.map(val => this.code.serviceTypeCodeAll.find(obj => obj.serviceTypeAndProtocolCode === val))
            : [];
        },
        set (newValue) {
          this.items.serviceTypeCode = newValue.length > 0
            ? newValue.map(obj => obj.serviceTypeAndProtocolCode)
            : [];
        }
      },
      popIdArray: {
        get () {
          return this.items.popIdArray !== null && this.items.popIdArray.length > 0
            ? this.items.popIdArray.map(val => this.code.popIdAll.find(obj => obj.popId === val))
            : [];
        },
        set (newValue) {
          this.items.popIdArray = newValue.length > 0
            ? newValue.map(obj => obj.popId)
            : [];
        }
      },
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
      geoCode: {
        get () {
          return this.code.geoCode.find(obj => obj.code === this.items.geoCode) || null;
        },
        set (newValue) {
          this.items.geoCode = newValue !== null ? newValue.code : null;
        }
      },
      isEditableServiceType (){
        //return !this.isEdit && this.items.edgeRelayName !== 'Relay';
        return !this.isEdit;
      },

      // validate
      valid (){
        return {
          popCtprvnCode: this.items.popCtprvnCode !== null,
          popSigCode: this.items.popSigCode !== null,
          geoCode: this.items.geoCode !== null,
          serviceTypeCode: this.items.serviceTypeCode.length &&
          this.serviceItems.serviceTypeCode.length &&
          !this.inValidRemoveServiceType
        }
      },

      // validation feedback
      feedback (){
        return {
          serviceTypeCode: this.inValidRemoveServiceType ?
            '사용 설정된 PoP이 존재하여 삭제할 수 없습니다. 삭제 후, 다시 시도해주세요.'
            : this.serviceItems.serviceTypeCode.length === 0 ?
            '변경된 사항이 없습니다.'
            : this.items.serviceTypeCode.length === 0 ?
            this.$valid.msg.select : ''
        }
      }
    },

    created (){
      // History
      const historyId = this.$route.query.histories;
      const detailUrl = historyId !== undefined ? `/edges/${this.id}/histories/${historyId}` : `/edges/${this.id}`;

      if (historyId){
        document.querySelector('body.app').classList.add('history-mode')
        this.isHistory = true
      }

      // 주소 Code
      this.fetchAddress();

      // GEO List
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'GEO' }
        })
        .then((res) => {
          this.isLoad.geoCode = false;
          this.code.geoCode = res.data.items;
        });

      const fetchCode = () => this.$https.get('/edges/serviceTypeAndProtocol')
      const fetchCodeService = (res) => {
        this.isLoad.serviceTypeCode = false;
        this.code.serviceTypeCodeAll = res.data.items;
        this.code.serviceTypeCode = res.data.items;
        return this.$https.get('/pops');
      };
      const fetchPoP = (res) => {
        this.isLoad.popId = false;
        this.code.popIdAll = res.data.items;
        return this.$https.get(detailUrl);
      };

      fetchCode()
        .then(fetchCodeService)
        .then(fetchPoP)
        .then(this.fetchDetail);
    },

    methods: {
      fetchDetail (res){
        this.items = { ...this.items, ...res.data.items };
        this.originItems = JSON.parse(JSON.stringify(this.items));
        if (this.items.popCtprvnCode !== ''){
          this.fetchAddress(this.items.popCtprvnCode);
        }
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

      onEdit (){
        this.isEdit = true;
      },

      onView (){
        this.isEdit = false;
        this.items = JSON.parse(JSON.stringify(this.originItems));
      },

      onSubmit (){
        const { popCtprvnCode, popSigCode, bandwidth, edgeUseYn, modifyHistReason, geoCode } = this.items;
        const validate = this.$valid.all({ popCtprvnCode, popSigCode, bandwidth, edgeUseYn, modifyHistReason, geoCode });
        this.inValidForm = !validate;

        if (validate){
          this.$https.put(`/edges/${this.id}`, { popCtprvnCode, popSigCode, bandwidth, edgeUseYn, modifyHistReason, geoCode })
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
        this.$https.delete(`/edges/${this.id}`)
          .then(() => {
            this.$router.push({ name: 'Edge 관리' });
          })
          .catch((error) => {
            console.log(error);
          });
      },

      // Service Type Popup Save
      onSubmitService (){
        const validate = this.$valid.all(this.serviceItems) && this.items.serviceTypeCode.length > 0;
        this.inValidServiceForm = !validate;

        if (validate){
          this.$https.put(`/edges/${this.id}/types`, this.serviceItems)
            .then(() => {
              this.$router.go(this.$router.currentRoute);
            })
            .catch((error) => {
              console.log(error);
              this.onResetService();
            });
        }
      },

      onResetService (){
        this.isModalServiceType = false;
        this.resetServiceType();
        this.serviceItems = {
          command: "ADD",
          serviceTypeCode: [],
          modifyHistReason: "서비스 타입 수정"
        }
      },

      resetServiceType (){
        this.serviceItems.serviceTypeCode = [];
        this.items.serviceTypeCode = [...this.originItems.serviceTypeCode];
      },

      getHistoryLink (rowId){
        return `#/configuration/edges/edge/${this.id}?histories=${rowId}`
      },

      showHistory () {
        this.isModalHistory = !this.isModalHistory;
        this.$https.get(`/edges/${this.id}/histories`)
          .then((res) => {
            this.history.items = res.data.items;
          });
      },

      onSelectType (item){
        this.serviceItems.serviceTypeCode.push(item.serviceTypeAndProtocolCode);
      },

      onRemoveType (item){
        this.$https.get(`services/${this.id}/types`, {
          serviceTypeAndProtocolCode: item.serviceTypeAndProtocolCode
        })
          .then((res) => {
            this.inValidRemoveServiceType = !(res.data.result === 'Success');
            if (this.inValidRemoveServiceType){
              this.items.serviceTypeCode = [...this.originItems.serviceTypeCode];
            }else{
              this.serviceItems.serviceTypeCode.push(item.serviceTypeAndProtocolCode);
            }
          });
      }
    }
  }
</script>
