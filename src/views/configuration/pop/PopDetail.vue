<template>
  <div class="animated fadeIn">
    <content-header
      :title="items.popName"
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
        <!-- PoP Name -->
        <b-form-fieldset
          label="PoP Name *"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            v-model="items.popName"
            type="text"
            :plaintext="!isEdit"
            placeholder="Enter PoP name">
          </b-form-input>
        </b-form-fieldset>


        <div slot="footer" class="form-btn" v-if="isEdit">
          <b-button type="button" size="sm" variant="primary" @click="onSubmit"><i class="fa fa-dot-circle-o"></i> 저장</b-button>
          <b-button type="button" size="sm" variant="secondary" @click="onView"><i class="fa fa-ban"></i> 취소</b-button>
        </div>
        <div slot="footer" class="form-btn" v-else>
          <b-button type="button" size="sm" variant="danger" class="float-left" @click="onDelete"><i class="fa fa-times"></i> 삭제</b-button>
          <b-button type="button" size="sm" variant="outline-primary">이력관리</b-button>
          <b-button type="button" size="sm" variant="primary" @click="onEdit"><i class="fa fa-pencil"></i> 수정</b-button>
          <b-button type="button" size="sm" variant="secondary" :to="{ name: 'Service 관리' }"><i class="fa fa-list"></i> 목록</b-button>
        </div>
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
      </b-card>
    </b-collapse>

    <!-- History Modal -->
    <b-modal id="serviceModal" size="lg">
      <template slot="modal-title">
        {{ items.popName }}
        <small> > History</small>
      </template>

      <div slot="modal-footer">
        <b-button type="button" size="sm" variant="primary" @click="onSubmitService"><i class="fa fa-dot-circle-o"></i> 저장</b-button>
        <b-button type="button" size="sm" variant="danger" @click="isModalService=false"><i class="fa fa-ban"></i> 취소</b-button>
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
        name: 'Pop 상세',
        items: {
          popName: "성수",
          popHostName: "pop1",
          popDomainName: "b78e23ss",
          popCtprvnCode: "11",
          popSigCode: "11230",
          popAddress: "서울특별시>동대문구",
          popQualityTeamCode: "QUALITY_TEAM_01",
          popQualityTeamName: "강남",
          bandwidth: 50,
          popUseYn: true,
          serviceNames: "btv,oksusu",
          lowReferrerList: [{
            "rowReferrerId": 1,
            "referrerIp": "1.255.56.67",
            "referrerHostName": "",
            "referrerUseYn": true
          }],
          edgeList: [{
            "edgeId": 1,
            "edgeIp": "1.255.67.89",
            "edgeHostName": "aeoijlk",
            "edgeDomainName": "3234dssf",
            "edgeUseYn": true,
            "edgeRelayYn": true
          }]
        },
        code: {
          popCtprvnCode: [],
          popSigCode: [],
          popQualityTeamCode: []
        },
        isLoad: {
          popCtprvnCode: true,
          popSigCode: true,
          popQualityTeamCode: true
        },
        isDomainName: false,
        state: {
          popHostName: true
        },
        hostmessage: '',
        isEdit: false,
        isModalHistory: false
      }
    },

    computed: {

    },

    created (){

    },

    methods: {
      onEdit (){
        this.isEdit = true;
      },

      onView (){
        this.isEdit = false;
      },

      onSubmit (){
        this.item.serviceDomainList = this.serviceDomainList.map(obj => {
          return {
            serviceTypeCode: obj.serviceTypeCode,
            domainProtocolCode: obj.domainProtocolCode !== null ? obj.domainProtocolCode.code : null,
            domainHashingTypeCode: obj.domainHashingTypeCode !== null ? obj.domainHashingTypeCode.code : null
          }
        });

        delete this.item.deploy;


        this.$https.put(`/services/${this.id}`, this.item)
          .then((res) => {
            this.$router.go(this.$router.currentRoute);
          })
          .catch((error) => {
            console.log(error);
          });
      },

      // Service Type Popup Save
      onSubmitService (){
        console.log(this.modalService)
        /*
        const serviceType = this.serviceType
        const isContain = this.serviceDomainList.find(({serviceCodeVal}) => serviceCodeVal === item.codeValChar1);
        if (!isContain){
          this.item.serviceDomainList.push({
            serviceTypeCode: item.code,
            domainProtocolCode: null,
            domainHashingTypeCode: null
          });
        }*/

      },

      onDelete (){
        this.$https.delete(`/services/${this.id}`)
          .then((res) => {
            this.$router.push({ name: 'Service 관리' });
          })
          .catch((error) => {
            console.log(error);
          });
      },

      getCodeObj (code){
        return this.code.serviceType.find(obj => obj.code === code) || {};
      },

      getSelectLabel (option){
        let codeType = (option.accountName)
          ? 'ACCOUNT'
          : (option.code) ? option.code.split('_')[0] : '';
        let label = '';

        if (codeType === 'ACCOUNT'){
          label = `${option.accountName}/${option.companyName}`;
        } else if (codeType === 'SERVICE'){
          label = option.codeValChar1 !== option.codeName
            ? `${option.codeValChar1} > ${option.codeName}`
            : option.codeName
        } else {
          label = option.codeName
        }
        return label
      }
    }
  }
</script>
