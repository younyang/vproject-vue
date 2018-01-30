<template>
  <div class="animated fadeIn">
    <content-header
      :title="items.serviceName"
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
        <!-- Company -->
        <b-form-fieldset
          label="Company"
          :horizontal="true">
          <b-form-input
            :value="items.companyName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- Service Name -->
        <b-form-fieldset
          label="Service Name"
          :horizontal="true">
          <b-form-input
            :value="items.serviceName"
            plaintext
            type="text"
          ></b-form-input>
        </b-form-fieldset>

        <!-- Service Type -->
        <b-form-fieldset
          label="Service Type"
          :horizontal="true">

          <div class="badge-list" v-for="item in items.serviceTypeList">
            <span class="badge sm" v-if="item">
              {{ item.serviceTypeName }}
            </span>
          </div>
          <b-button
            v-if="!isEdit"
            variant="in-table-icon"
            v-b-tooltip.hover
            :title="`Service Type 수정`"
            @click="isModalServiceType = !isModalServiceType"
          ><i class="fa fa-pencil"></i>
          </b-button>
        </b-form-fieldset>

        <!-- Domain -->
        <b-form-fieldset
          label="Domain"
          :horizontal="true">

          <!-- domain Edit list -->
          <b-table
            v-if="items.serviceDomainList.length && isEdit"
            class="sub"
            show-empty
            :items="items.serviceDomainList"
            :fields="{
            serviceTypeCode: {label: '&nbsp;', 'class': 'index'},
            domainProtocolCode: {label: 'Domain<i class=\'require\'>*</i>', 'class': 'text-left'},
            domainHashingTypeCode: {label: 'Hasing type<i class=\'require\'>*</i>', 'class': 'w-25'}
          }"
          >
            <template slot="serviceTypeCode" scope="row">
              {{ row.value.codeValChar1 }}
            </template>

            <template slot="domainProtocolCode" scope="row">
              <multiselect
                label="codeName"
                v-model="row.item.domainProtocolCode"
                class="protocol noEmpty"
                :allowEmpty="false"
                :showLabels="false"
                :searchable="false"
                :options="code.domainProtocolCode"
                :loading="isLoad.domainProtocolCode"
                placeholder="://"
              ></multiselect>
              <span class="font-text-alone">
                <strong class="text-primary">{{ row.item.serviceTypeCode.codeValChar1 | lowercase }}.{{ items.serviceName }}</strong>.vessels.com
              </span>
            </template>

            <template slot="domainHashingTypeCode" scope="row">
              <multiselect
                label="codeName"
                v-model="row.item.domainHashingTypeCode"
                class="noEmpty"
                :allowEmpty="false"
                :showLabels="false"
                :searchable="false"
                :options="code.domainHashingTypeCode"
                :loading="isLoad.domainHashingTypeCode"
              ></multiselect>
            </template>
          </b-table>

          <!-- domain View list -->
          <div
            v-if="items.serviceDomainList.length && !isEdit"
            class="form-in-view">
            <b-form-fieldset
              v-for="(obj, index) in items.serviceDomainList"
              :label="obj.serviceTypeName"
              :key="index"
              :horizontal="true">
              <span class="font-text-alone">
                {{ obj.domainProtocolName }}<strong class="text-primary">{{ obj.serviceTypeName | lowercase }}.{{ items.serviceName }}</strong>.vessels.com
              </span>
            </b-form-fieldset>
          </div>
        </b-form-fieldset>

        <!-- CNAME -->
        <b-form-fieldset
          label="CNAME 사용여부"
          :horizontal="true">
          <c-switch
            v-if="isEdit"
            type="text"
            class="v-switch"
            on="사용"
            off="미사용"
            v-model="items.cnameUseYn"
          ></c-switch>
          <span
            v-else
            class="badge"
            :class="{'primary' : items.cnameUseYn }"
          >{{ items.cnameUseYn ? '사용' : '미사용' }}
          </span>
        </b-form-fieldset>

        <!-- CNAME Domain -->
        <b-form-fieldset
          v-if="items.cnameUseYn"
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <template slot="label">
            CNAME 도메인<i v-if="isEdit" class="require">*</i>
          </template>

          <b-form-input
            v-model="items.cnameDomainName"
            type="text"
            :plaintext="!isEdit"
            required
          ></b-form-input>
        </b-form-fieldset>

        <!-- SSL 인증서 -->
        <b-form-fieldset
          label="SSL 인증서"
          :horizontal="true">
          <c-switch
            v-if="isEdit"
            type="text"
            class="v-switch"
            on="사용"
            off="미사용"
            v-model="items.sslCertUseYn"
          ></c-switch>
          <span
            v-else
            class="badge"
            :class="{'primary' : items.sslCertUseYn }"
          >{{ items.sslCertUseYn ? '사용' : '미사용' }}
          </span>
        </b-form-fieldset>

        <!-- SSL 인증서 정보 입력-->
        <b-form-fieldset
          v-if="items.sslCertUseYn"
          :horizontal="true">
          <template slot="label">
            SSL 인증서<i v-if="isEdit" class="require">*</i>
          </template>

          <div class="form-in-view">
            <!-- Cert -->
            <b-form-fieldset
              :invalid-feedback="$valid.msg.require"
              :horizontal="true">
              <template slot="label">
                Cert<i v-if="isEdit" class="require">*</i>
              </template>
              <b-form-textarea
                v-model="items.sslCert"
                :no-resize="!isEdit"
                :disabled="!isEdit"
                rows="6"
                required
              ></b-form-textarea>
            </b-form-fieldset>

            <!-- Key -->
            <b-form-fieldset
              :invalid-feedback="$valid.msg.require"
              :horizontal="true">
              <template slot="label">
                Key<i v-if="isEdit" class="require">*</i>
              </template>
              <b-form-textarea
                v-model="items.sslCertKey"
                :no-resize="!isEdit"
                :disabled="!isEdit"
                rows="6"
                required
              ></b-form-textarea>
            </b-form-fieldset>

            <!-- 만료일 -->
            <b-form-fieldset
              :invalid-feedback="$valid.msg.require"
              :horizontal="true">
              <template slot="label">
                만료일<i v-if="isEdit" class="require">*</i>
              </template>
              <b-form-input
                type="date"
                :plaintext="!isEdit"
                v-model="items.sslCertExpireDate"
                required
              ></b-form-input>
            </b-form-fieldset>
          </div>
        </b-form-fieldset>

        <!-- 사용여부 -->
        <b-form-fieldset
          label="사용여부"
          :horizontal="true">
          <span
            class="badge"
            :class="{'primary' : items.serviceUseYn }"
          >{{ items.serviceUseYn ? '사용' : '미사용' }}
          </span>
          <b-button
            v-if="!isEdit"
            variant="in-table-icon"
            v-b-tooltip.hover
            :title="`Service 사용여부 수정`"
            @click="isModalUseYn = !isModalUseYn"
          ><i class="fa fa-pencil"></i>
          </b-button>
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
      <span v-if="isProcessComplete">
        <b-button type="button" variant="outline-secondary" class="float-left" @click="onDelete">삭제</b-button>
        <b-button type="button" variant="outline-secondary" @click="showHistory">이력관리</b-button>
        <b-button type="button" variant="outline-secondary" :to="{ name: 'Service 관리' }">목록</b-button>
        <b-button type="button" variant="primary" @click="onEdit">수정</b-button>
      </span>
      <span v-else>
        <b-button type="button" variant="outline-secondary" @click="showHistory">이력관리</b-button>
        <b-button type="button" variant="outline-secondary" :to="{ name: 'Service 관리' }">목록</b-button>
      </span>
    </div>


    <!-- Service Type 수정 Modal -->
    <b-modal id="serviceModal" size="lg" v-model="isModalServiceType" @hide="onResetService">
      <template slot="modal-title">
        {{ items.serviceName }}
        <small> > Service Type</small>
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
            Service Type <i class="require" v-if="serviceItems.command ==='DELETE'">*</i>
          </template>

          <multiselect
            v-model="serviceTypeCode"
            class="multiple"
            :class="{'is-invalid': !valid.serviceTypeCode }"
            :role="serviceItems.command ==='ADD' ? 'addMode' : 'delMode'"
            track-by="code"
            label="codeName"
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


    <!-- 사용여부 수정 Modal -->
    <b-modal size="lg" v-model="isModalUseYn" @hide="onResetUseYn">
      <template slot="modal-title">
        {{ items.serviceName }}
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
            v-model="items.serviceUseYn"
          ></c-switch>
        </b-form-fieldset>
        <b-form-fieldset
          label="변경이력<i class='require'>*</i>"
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <b-form-textarea :rows="6" v-model="serviceUseYnItems.modifyHistReason" required></b-form-textarea>
        </b-form-fieldset>
      </b-form>

      <div slot="modal-footer">
        <b-button type="button" variant="primary" @click="onSubmitUseYn">저장</b-button>
        <b-button type="button" variant="outline-secondary" @click="onResetUseYn">취소</b-button>
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
          <template slot="histMgmtId" scope="row">
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
    name: 'service',
    props: ['id'],
    components: {
      ContentHeader,
      cSwitch
    },

    data (){
      return {
        name: 'Service 상세',
        originItems: {},
        items: {
          serviceName: "",
          companyName: "",
          serviceTypeCode: [],
          serviceTypeList: [],
          serviceDomainList: [],
          cnameUseYn: false,
          cnameDomainName: "",
          sslCertUseYn: false,
          sslCert: "",
          sslCertKey: "",
          sslCertExpireDate: "",
          serviceUseYn: false,
          modifyHistReason: ''
        },
        code: {
          serviceTypeCode: [],
          serviceTypeCodeAll: [],
          domainProtocolCode: [],
          domainHashingTypeCode: []
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

        serviceItems: {
          command: "ADD",
          serviceTypeCode: [],
          modifyHistReason: "서비스 타입 수정"
        },
        serviceUseYnItems: {
          serviceUseYn: null,
          modifyHistReason: "서비스 사용 여부 변경"
        },

        isLoad: {
          serviceTypeCode: true,
          domainProtocolCode: true,
          domainHashingTypeCode: true
        },
        isEdit: false,
        isModalHistory: false,
        isModalServiceType: false,
        isModalUseYn: false,

        modal: {
          open: false,
          type: 'done',
          msg: '',
          action (){}
        },

        inValidServiceForm: false,
        inValidRemoveServiceType: false,
        inValidUseForm: false,
        inValidForm: false
      }
    },

    computed: {
      serviceTypeCode: {
        get () {
          return this.items.serviceTypeCode.length > 0
            ? this.items.serviceTypeCode.map(val => this.code.serviceTypeCode.find(obj => obj.code === val))
            : [];
        },
        set (newValue) {
          this.items.serviceTypeCode = newValue.length > 0
            ? newValue.map(obj => obj.code)
            : [];
        }
      },

      isProcessComplete (){
        return (this.items.processStateCode !== null &&
        this.items.processStateCode !== '' &&
        this.items.processStateCode === 'PROCESS_STATE_02')
      },

      valid (){
        return {
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
      this.detailUrl = historyId !== undefined ? `/services/${this.id}/histories/${historyId}` : `/services/${this.id}`;

      if (historyId){
        document.querySelector('body.app').classList.add('history-mode');
      }

      // fetch Code
      const fetchCode = () => this.$https.get('/system/commonCode', { q: { groupCode: 'SERVICE_TYPE' } });
      const fetchCodeService = (res) => {
        this.isLoad.serviceTypeCode = false;
        this.code.serviceTypeCodeAll = res.data.items;
        this.code.serviceTypeCode = res.data.items.filter(({code}) => {
          const number = code.split('_')[2];
          return number.length === 4;
        });
        return this.$https.get('/system/commonCode', { q: { groupCode: 'DOMAIN_PROTOCOL' } });
      };

      const fetchCodeProtocol = (res) => {
        this.isLoad.domainProtocolCode = false;
        this.code.domainProtocolCode = res.data.items;
        return this.$https.get('/system/commonCode', { q: { groupCode: 'HASHING_TYPE' } });
      };

      const fetchCodeHashing = (res) => {
        this.isLoad.domainHashingTypeCode = false;
        this.code.domainHashingTypeCode = res.data.items;
        return this.$https.get(this.detailUrl);
      };

      fetchCode()
        .then(fetchCodeService)
        .then(fetchCodeProtocol)
        .then(fetchCodeHashing)
        .then(this.fetchDetail);

    },

    methods: {
      fetchDetail (res){
        this.items = res.data.items;
        this.items.serviceDomainList = this.items.serviceDomainList.map(obj => {
          return {
            ...obj,
            domainProtocolCode: this.code.domainProtocolCode.find(({code}) => code === obj.domainProtocolCode),
            domainHashingTypeCode: this.code.domainHashingTypeCode.find(({code}) => code === obj.domainHashingTypeCode),
            serviceTypeCode: this.code.serviceTypeCodeAll.find(({code}) => code === obj.serviceTypeCode),
          }
        });
        this.originItems = JSON.parse(JSON.stringify(this.items));
      },

      onEdit (){
        this.isEdit = true;
      },

      onView (){
        this.isEdit = false;
        this.items = JSON.parse(JSON.stringify(this.originItems));
      },

      onSubmit (){
        const submitItems = {
          ...this.items,
          serviceDomainList: this.items.serviceDomainList.length ?
            this.items.serviceDomainList.map(({ serviceTypeCode,domainProtocolCode,domainHashingTypeCode }) => {
              let code = serviceTypeCode.code;
              let codeSplit = serviceTypeCode.code.split('_')[2];
              return {
                serviceTypeCode: codeSplit.length === 4 ? code.slice(0,code.length-2) : code,
                domainProtocolCode: domainProtocolCode.code,
                domainHashingTypeCode: domainHashingTypeCode.code
              }
            }) : []
        };

        if (this.validate(submitItems)){
          this.$https.put(`/services/${this.id}`, submitItems)
            .then((res) => {
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
        }
      },

      onDeleteData (){
        this.$https.delete(`/services/${this.id}`)
          .then((res) => {
            this.$router.push({ name: 'Service 관리' });
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
          this.$https.put(`/services/${this.id}/types`, this.serviceItems)
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

      // Service UseYn Popup Save
      onSubmitUseYn (){
        this.serviceUseYnItems.serviceUseYn = this.items.serviceUseYnItems;

        const validate = this.$valid.all(this.serviceUseYnItems);
        this.inValidUseForm = !validate;


        if (validate) {
          this.$https.put(`/services/${this.id}/use`, this.serviceUseYnItems)
            .then(() => {
              this.isModalUseYn = false;
            })
            .catch((error) => {
              console.log(error);
              this.onResetUseYn();
            });
        }
      },

      onResetUseYn (){
        this.isModalUseYn = false;
        this.items.serviceUseYn = this.originItems.serviceUseYn;
        this.serviceUseYnItems = {
          serviceUseYn: this.items.serviceUseYn,
          modifyHistReason: "서비스 사용 여부 변경"
        }
      },

      validate (submitItems){
        const {
          cnameDomainName,
          sslCert,
          sslCertKey,
          sslCertExpireDate,
          modifyHistReason
        } = submitItems;

        let validateItems = { modifyHistReason };
        if (this.items.cnameUseYn){
          validateItems = {...validateItems, cnameDomainName };
        }
        if (this.items.sslCertUseYn){
          validateItems = {...validateItems, sslCert, sslCertKey, sslCertExpireDate };
        }
        const validate = this.$valid.all(validateItems);

        this.inValidForm = !validate;
        return validate;
      },

      getHistoryLink (rowId){
        return `#/service/service/${this.id}?histories=${rowId}`
      },

      showHistory () {
        this.isModalHistory = !this.isModalHistory;
        this.$https.get(`/services/${this.id}/histories`)
          .then((res) => {
            this.history.items = res.data.items;
          });
      },

      onSelectType (item){
        this.serviceItems.serviceTypeCode.push(item.code);
      },

      onRemoveType (item){
        this.$https.get(`services/${this.id}/types`, {
            serviceType: item.code
          })
          .then((res) => {
            this.inValidRemoveServiceType = !(res.data.result === 'Success');
            if (this.inValidRemoveServiceType){
              this.items.serviceTypeCode = [...this.originItems.serviceTypeCode];
            }else{
              this.serviceItems.serviceTypeCode.push(item.code);
            }
          });
      }
    }
  }
</script>
