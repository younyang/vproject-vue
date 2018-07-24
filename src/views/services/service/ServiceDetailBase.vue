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
        <!--Company Area Start-->
        <b-form-fieldset
          label="Company"
          :horizontal="true">
          <b-form-input
            :value="items.companyName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>
        <!--Company Area End-->

        <!-- Service Name Area Start-->
        <b-form-fieldset
          label="Service Name"
          :horizontal="true">
          <b-form-input
            :value="items.serviceName"
            plaintext
            type="text"
          ></b-form-input>
        </b-form-fieldset>
        <!-- Service Name Area End-->

        <!-- ServiceType Area Start-->
        <b-form-fieldset
          :horizontal="true">
          <template slot="label">
            Service Type<i class="require">*</i>
          </template>

          <multiselect
            v-if="isEdit"
            v-model="serviceTypeId"
            :showLabels="false"
            :searchable="false"
            :options="code.serviceTypeId"
            :loading="isLoad.serviceTypeId"
            label="serviceTypeName"
            track-by="serviceTypeId"
            placeholder="Select service type"
          ></multiselect>
          <b-form-input
            v-else
            :value="items.serviceTypeName"
            plaintext
            type="text"
          ></b-form-input>
        </b-form-fieldset>

        <!-- ServiceType Area End-->

        <!--Domain Area Start-->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <template slot="label">
            Domain<i class="require" v-if="isEdit">*</i>
          </template>
          <b-form-input
            v-model="items.serviceDomainName"
            type="text"
            placeholder="Enter API name"
            :plaintext="!isEdit"
            required
          ></b-form-input>
        </b-form-fieldset>
        <!--Domain Area End-->

        <!--서비스 유형 area start-->
        <b-form-fieldset
          :horizontal="true">
          <template slot="label">
            서비스 유형<i class="require" v-if="isEdit">*</i>
          </template>
          <b-table
           class="sub"
           show-empty
           :items="items.serviceDomainList"
           :fields="fields"
         >

         <template slot="domainPurposeCode" slot-scope="row">
            <multiselect
              v-if="isEdit"
              v-model="row.item.domainPurposeCode"
              label="codeName"
              class="noEmpty"
              :allowEmpty="false"
              :showLabels="false"
              :searchable="false"
              :options="code.domainPurposeCode"
              :loading="isLoad.domainPurposeCode"
            ></multiselect>
            <span class="form-text-alone"
              v-if="!isEdit"
            >{{ row.item.domainPurposeCode.codeName}}</span>
          </template>

          <template slot="sslYn" slot-scope="row">
            <c-switch
              v-if="isEdit"
              type="text"
              class="v-switch"
              on="https://"
              off="http://"
              v-model="row.item.sslYn"
            ></c-switch>
            <label v-if="isEdit">[uuid].{{items.serviceDomainName}}</label>
            <label v-else>  {{ row.item.sslYn ? 'https://' : 'http://' }}[uuid].{{items.serviceDomainName}}</label>
          </template>

          <template slot="domainPortNumber" slot-scope="row">
            <b-form-input
              v-if="isEdit"
              v-model="row.item.domainPortNumber"
              type="text"
              required
            ></b-form-input>
            <span v-else class="form-text-alone"
            >{{ row.item.domainPortNumber }}</span>
            <div class="invalid-tooltip">{{ $valid.msg.require }}</div>
          </template>

          <template slot="hashingType" slot-scope="row">
             <multiselect
               v-if="isEdit"
               v-model="row.item.hashingType"
               label="codeName"
               class="noEmpty"
               :allowEmpty="false"
               :showLabels="false"
               :searchable="false"
               :options="code.hashingType"
               :loading="isLoad.hashingType"
             ></multiselect>
             <span class="form-text-alone"
               v-if="!isEdit"
             >{{ row.item.hashingType.codeName}}</span>
           </template>
           <template slot="action" slot-scope="row">
             <span class="ico">
               <button type="button" v-if="row.index === 0" @click="onAddRow('serviceDomainList')"><i class="fa fa-plus-circle"></i></button>
               <button type="button" v-if="row.index > 0" @click="onDelRow('serviceDomainList', row.index)"><i class="fa fa-times-circle"></i></button>
             </span>
           </template>
          </b-table>
        </b-form-fieldset>
        <!--서비스 유형 area end-->

        <!-- 사용여부 Area Start-->
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
        <!-- 사용여부 Area End-->

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
          v-if="items.processId !== null"
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
          serviceTypeId: null,
          serviceDomainList: [{
            domainPurposeCode: null,
            sslYn: true,
            domainPortNumber: "",
            hashingType: null,
          }],
          cnameUseYn: false,
          cnameDomainName: "",
          sslCertUseYn: false,
          sslCert: "",
          sslCertKey: "",
          sslCertExpireDate: "",
          serviceUseYn: false,
          modifyHistReason: '',
          processStateCode: null,
          processId: null
        },
        code: {
          serviceTypeId: null,
          domainProtocolCode: [],
          domainPurposeCode :[],
          hashingType:[]
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
          serviceTypeId: null,
          modifyHistReason: "서비스 타입 수정"
        },
        serviceUseYnItems: {
          serviceUseYn: null,
          modifyHistReason: "서비스 사용 여부 변경"
        },

        isLoad: {
          serviceTypeId: true,
          hashingType: true,
          domainPurposeCode:true
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
      serviceTypeId: {
        get () {
          return this.code.serviceTypeId.find(obj => obj.serviceTypeId === this.items.serviceTypeId) || null;
        },
        set (newValue) {
          this.items.serviceTypeId = newValue !== null ? newValue.serviceTypeId : null;
        }
      },

      isProcessComplete (){
        return this.items.processId === null || (this.items.processStateCode !== null &&
        this.items.processStateCode !== '' &&
        this.items.processStateCode === 'PROCESS_STATE_02')
      },


      // validation feedback
      feedback (){
        return {
          serviceTypeId: this.inValidRemoveServiceId ?
            '사용 설정된 PoP이 존재하여 삭제할 수 없습니다. 삭제 후, 다시 시도해주세요.'
            : this.serviceItems.serviceTypeId.length === 0 ?
            '변경된 사항이 없습니다.'
            : this.items.serviceTypeId.length === 0 ?
              this.$valid.msg.select : ''
        }
      },

      fields (){//여기
       const fields = {
          domainPurposeCode: {label: '', 'class': 'text-left'},
          sslYn: {label: '*Domain', 'class': 'text-left'},
          domainPortNumber: {label: 'Port', 'class': 'text-left'},
          hashingType: {label: 'Hashing Type', 'class': 'text-left'}
       };
       return this.isEdit ? { ...fields, action: {label: ''}} : fields;
     }
    },


    created (){
      // History
      const historyId = this.$route.query.histories;
      this.detailUrl = historyId !== undefined ? `/services/${this.id}/histories/${historyId}` : `/services/${this.id}`;

      if (historyId){
        document.querySelector('body.app').classList.add('history-mode');
      }

      // Service Type Code
      this.$https.get('/serviceTypeFilterList', {})
        .then((res) => {
          this.isLoad.serviceTypeId = false;
          this.code.serviceTypeId = res.data.items;
       });

      // Domain Hahing Type Code
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'DOMAIN_PUPOSE' }
        })
        .then((res) => {
          this.isLoad.domainPurposeCode = false;
          this.code.domainPurposeCode = res.data.items;
      });

      // Domain Hahing Type Code
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'HASHING_TYPE' }
        })
        .then((res) => {
          this.isLoad.hashingType = false;
          this.code.hashingType = res.data.items;
        });

      // fetch Code
      const fetchCode = () => this.$https.get('/system/commonCode', { q: { groupCode: 'SERVICE_TYPE' } });

      const fetchCodeHashing = (res) => {
        this.isLoad.domainHashingTypeCode = false;
        this.code.domainHashingTypeCode = res.data.items;
        return this.$https.get(this.detailUrl);
      };

      fetchCode()
        .then(fetchCodeHashing)
        .then(this.fetchDetail);

    },

    methods: {

      onEdit (){
        this.isEdit = true;
        let { serviceDomainList } = this.items;
        let pushItems = {
          domainPurposeCode: this.code.domainPurposeCode[0],
          sslYn: true,
          domainPortNumber: null,
          hashingType: this.code.hashingType[0]
        };
        //test
      },

      onView (){
        this.isEdit = false;
        this.items = JSON.parse(JSON.stringify(this.originItems));
        this.setDomainPurposeCodes();
      },

      fetchDetail (res){
        this.items = res.data.items;
        this.originItems = JSON.parse(JSON.stringify(this.items));
        this.setDomainPurposeCodes();

        console.log(this.items);
      },

      onSubmit (){
      const submitItems = {
        ...this.items,
         serviceDomainList: this.items.serviceDomainList.length ?
           this.items.serviceDomainList.map(({ domainPurposeCode,sslYn,domainPortNumber,hashingType }) => {
             return {
               domainPurposeCode: domainPurposeCode.code,
               sslYn: sslYn,
               domainPortNumber: domainPortNumber,
               hashingType: hashingType.code
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
        };
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
      setDomainPurposeCodes (){
        let { serviceDomainList } = this.items;
        const setCode = (arr) => (!arr.length ||
        (arr.length && (arr[0].name === null || arr[0].name === ''))) ? [] :
          arr.map(({ domainPurposeCode, sslYn, domainPortNumber, hashingType}) => ({
            domainPurposeCode: this.code.domainPurposeCode.find(obj => obj.code === domainPurposeCode),
            sslYn,
            domainPortNumber,
            hashingType: this.code.hashingType.find(obj => obj.code === hashingType)
          }));
        this.items.serviceDomainList = setCode(serviceDomainList);
      },
      onAddRow (item, data = {}){
         this.items[item].push(Object.assign({}, {
           domainPurposeCode: this.code.domainPurposeCode[0],
           sslYn: true,
           domainPortNumber: '',
           hashingType: this.code.hashingType[0]
         }, data));
      },

      onDelRow (item, index){
        this.items[item].splice(index, 1);
      },
    }
  }
</script>
