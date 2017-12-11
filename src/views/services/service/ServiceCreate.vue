<template>
  <div class="animated fadeIn">
    <b-card>
      <!-- Account -->
      <b-form-fieldset
        label="Account"
        :label-cols="3"
        :horizontal="true">
        <multiselect
          v-model="accountId"
          :options="code.account"
          :showLabels="false"
          :custom-label="getSelectLabel"
          :loading="isLoad.account"
          placeholder="Select account"
        ></multiselect>
      </b-form-fieldset>

      <!-- Service Name -->
      <b-form-fieldset
        label="Service Name"
        description="Service Name은 도메인에 포함되기 때문에 영문, 숫자만 입력 가능합니다."
        :label-cols="3"
        :horizontal="true">
        <b-input-group>
          <b-form-input
            v-model="item.serviceName"
            type="text"
            placeholder="Enter service name">
          </b-form-input>
          <b-input-group-button slot="right" class="ml-2">
            <b-button variant="outline-secondary">중복확인</b-button>
          </b-input-group-button>
        </b-input-group>
      </b-form-fieldset>

      <!-- Service Type -->
      <b-form-fieldset
        label="Service Type"
        :label-cols="3"
        :horizontal="true">

        <multiselect
          v-model="serviceTypeCode"
          :multiple="true"
          :showLabels="false"
          :options="code.serviceType"
          :custom-label="getSelectLabel"
          :loading="isLoad.serviceType"
          placeholder="Select service type"
        ></multiselect>
      </b-form-fieldset>

      <!-- Domain -->
      <b-form-fieldset
        label="Domain"
        :label-cols="3"
        :horizontal="true">
        <ul class="icons-list">
          <li v-for="(domain, index) in item.serviceDomainList">
            <i class="bg-primary">{{ getCodeVal(domain.serviceTypeCode) }}</i>
            <div class="desc">
              <small>Domain</small>
              <div class="title">
                <multiselect
                  label="domainProtocolCode"
                  v-model="domain.domainProtocolCode"
                  class="inline sm protocol"
                  :showLabels="false"
                  :options="code.domainProtocol"
                  :custom-label="getSelectLabel"
                  :loading="isLoad.domainProtocol"
                  placeholder="://"
                ></multiselect>
                {{ getCodeVal(domain.serviceTypeCode) | lowercase }}.{{ item.serviceName }}.vessels.com
              </div>
            </div>
            <div class="value">
              <div class="small text-muted">Hashing Type</div>
              <multiselect
                v-model="domain.domainHashingTypeCode"
                class="inline sm"
                style="width: 120px"
                :showLabels="false"
                :options="code.domainHashing"
                :custom-label="getSelectLabel"
                :loading="isLoad.domainHashing"
                placeholder="Select"
              ></multiselect>
            </div>
          </li>
        </ul>

      </b-form-fieldset>

      <!-- CNAME -->
      <b-form-fieldset
        label="CNAME 사용여부"
        :label-cols="3"
        :horizontal="true">
        <c-switch
          type="icon"
          variant="primary"
          v-bind="{on: '\uf00c', off: '\uf00d'}"
          :pill="true"
          :checked="item.cnameUseYn"/>
      </b-form-fieldset>

      <!-- SSL 인증서 -->
      <b-form-fieldset
        label="SSL 인증서"
        :label-cols="3"
        :horizontal="true">
        <c-switch
          type="icon"
          variant="primary"
          v-bind="{on: '\uf00c', off: '\uf00d'}"
          :pill="true"
          :checked="item.sslCertUseYn"/>
      </b-form-fieldset>

      <!-- 사용여부 -->
      <b-form-fieldset
        label="사용여부"
        :label-cols="3"
        :horizontal="true">
        <c-switch
          type="icon"
          variant="primary"
          v-bind="{on: '\uf00c', off: '\uf00d'}"
          :pill="true"
          :checked="item.serviceUseYn"/>
      </b-form-fieldset>

      <div slot="footer" class="form-btn">
        <b-button type="submit" size="sm" variant="primary" @click="save"><i class="fa fa-dot-circle-o"></i> 저장</b-button>
        <b-button type="reset" size="sm" variant="danger" :to="{ name: 'Service 관리' }"><i class="fa fa-ban"></i> 취소</b-button>
      </div>
    </b-card>
  </div>
</template>

<script>
  import cSwitch from '@/components/Switch'
  export default {
    name: 'services',
    components: {
      cSwitch
    },

    computed: {
      accountId: {
        get () {
          return this.item.accountId !== null
            ? this.code.account.find(obj => obj.accountId === this.item.accountId)
            : null;
        },
        set (newValue) {
          this.item.accountId = newValue !== null
            ? newValue.accountId
            : null;
        }
      },
      serviceTypeCode: {
        get () {
          return this.item.serviceTypeCode.length > 0
            ? this.item.serviceTypeCode.map(val => this.code.serviceType.find(obj => obj.code === val))
            : [];
        },
        set (newValue) {
          this.item.serviceTypeCode = newValue.length > 0
            ? newValue.map(obj => obj.code)
            : [];
          this.item.serviceDomainList = newValue.length > 0
            ? newValue.map(({ code }) => {
                const findObj = this.item.serviceDomainList.find(obj => obj.serviceTypeCode === code);
                return findObj !== undefined ? findObj : {
                  serviceTypeCode: code,
                  domainProtocolCode: null,
                  domainHashingTypeCode: null
                }
              })
            : [];
        }
      }
    },

    data (){
      return {
        item: {
          accountId: null,
          serviceName: '',
          serviceTypeCode: [],
          serviceDomainList: [],
          cnameUseYn: false,
          cnameDomainName: null,
          sslCertUseYn: false,
          sslCert: "",
          sslCertKey: "",
          sslCertExpireDate: "",
          serviceUseYn: false
        },
        code: {
          account: [],
          serviceType: [],
          domainProtocol: [],
          domainHashing: []
        },
        isLoad: {
          account: true,
          serviceType: true,
          domainProtocol: true,
          domainHashing: true
        }
      }
    },

    created (){
      this.$https.get('/account')
        .then((res) => {
          this.isLoad.account = false;
          this.code.account = res.data
      });
      this.$https.get('/system/commonCode/serviceType')
        .then((res) => {
          this.isLoad.serviceType = false;
          this.code.serviceType = res.data
        });
      this.$https.get('/system/commonCode/protocol')
        .then((res) => {
          this.isLoad.domainProtocol = false;
          this.code.domainProtocol = res.data
        });
      this.$https.get('/system/commonCode/hashing')
        .then((res) => {
          this.isLoad.domainHashing = false;
          this.code.domainHashing = res.data
        });
    },

    methods: {
      save (){
        this.item.serviceDomainList = this.item.serviceDomainList.map(obj => {
          return {
            serviceTypeCode: obj.serviceTypeCode,
            domainProtocolCode: obj.domainProtocolCode !== null ? obj.domainProtocolCode.code : null,
            domainHashingTypeCode: obj.domainHashingTypeCode !== null ? obj.domainHashingTypeCode.code : null
          }
        });

        this.$https.post('/services', this.data)
          .then((res) => {
            this.$router.push({ name: 'Service 상세', params: { id: res.data }})
          })
          .catch((error) => {
            console.log(error);
          });
      },

      getCodeVal (code){
        let findObj = this.code.serviceType.find(obj => obj.code === code) || {}
        return findObj['codeValChar1'] || null;
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
