<template>
  <div class="animated fadeIn">
    <b-form>
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
            track-by="code"
            @select="onSelectType"
            @remove="onRemoveType"
            placeholder="Select service type"
          ></multiselect>
        </b-form-fieldset>

        <!-- Domain -->
        <b-form-fieldset
          label="Domain"
          :label-cols="3"
          :horizontal="true">
          <ul class="icons-list">
            <li v-for="(domain, index) in serviceDomainList">
              <i class="bg-primary" v-b-tooltip.hover :title="domain.serviceCodeName">{{ domain.serviceCodeVal }}</i>
              <div class="desc">
                <small>Domain</small>
                <div class="title">
                  <multiselect
                    label="domainProtocolCode"
                    v-model="domain.domainProtocolCode"
                    class="inline sm protocol"
                    :showLabels="false"
                    :allow-empty="true"
                    :options="code.domainProtocol"
                    :custom-label="getSelectLabel"
                    :loading="isLoad.domainProtocol"
                    placeholder="://"
                  ></multiselect>
                  {{ domain.serviceCodeVal | lowercase }}.{{ item.serviceName }}.vessels.com
                </div>
              </div>
              <div class="value">
                <div class="small text-muted">Hashing Type</div>
                <multiselect
                  v-model="domain.domainHashingTypeCode"
                  class="inline sm"
                  style="width: 120px"
                  :showLabels="false"
                  :allow-empty="true"
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
            variant="success"
            v-bind="{on: '\uf00c', off: '\uf00d'}"
            v-model="item.cnameUseYn"
            :pill="true" />
        </b-form-fieldset>

        <!-- SSL 인증서 -->
        <b-form-fieldset
          label="SSL 인증서"
          :label-cols="3"
          :horizontal="true">
          <c-switch
            type="icon"
            variant="success"
            v-bind="{on: '\uf00c', off: '\uf00d'}"
            v-model="item.sslCertUseYn"
            :pill="true" />
        </b-form-fieldset>

        <!-- 사용여부 -->
        <b-form-fieldset
          label="사용여부"
          :label-cols="3"
          :horizontal="true">
          <c-switch
            type="icon"
            variant="success"
            v-bind="{on: '\uf00c', off: '\uf00d'}"
            v-model="item.serviceUseYn"
            :pill="true" />
        </b-form-fieldset>

        <div slot="footer" class="form-btn">
          <b-button type="button" size="sm" variant="primary" @click="onSubmit"><i class="fa fa-dot-circle-o"></i> 저장</b-button>
          <b-button type="button" size="sm" variant="secondary" :to="{ name: 'Service 관리' }"><i class="fa fa-ban"></i> 취소</b-button>
        </div>
      </b-card>
    </b-form>
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
        }
      },
      serviceDomainList (){
        return this.item.serviceDomainList.length > 0
          ? this.item.serviceDomainList.map(obj => {
            const serviceCode = this.getCodeObj(obj.serviceTypeCode);
            return Object.assign({}, obj, {
              domainProtocolCode: this.code.domainProtocol.find(({code}) => code === obj.domainProtocolCode),
              domainHashingTypeCode: this.code.domainHashing.find(({code}) => code === obj.domainHashingTypeCode),
              serviceCodeVal: serviceCode.codeValChar1,
              serviceCodeName: serviceCode.codeName
            })
          })
          : [];
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
          cnameDomainName: '',
          sslCertUseYn: false,
          sslCert: '',
          sslCertKey: '',
          sslCertExpireDate: '',
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
      onSubmit (){
        this.item.serviceDomainList = this.serviceDomainList.map(obj => {
          return {
            serviceTypeCode: obj.serviceTypeCode,
            domainProtocolCode: obj.domainProtocolCode !== null ? obj.domainProtocolCode.code : null,
            domainHashingTypeCode: obj.domainHashingTypeCode !== null ? obj.domainHashingTypeCode.code : null
          }
        });

        this.$https.post('/services', this.item)
          .then((res) => {
            this.$router.push({ name: 'Service 상세', params: { id: res.data }})
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
      },

      onSelectType (item){
        const isContain = this.serviceDomainList.find(({serviceCodeVal}) => serviceCodeVal === item.codeValChar1);
        if (!isContain){
          this.item.serviceDomainList.push({
            serviceTypeCode: item.code,
            domainProtocolCode: this.code.domainProtocol[0].code,
            domainHashingTypeCode: this.code.domainHashing[0].code
          });
        }
      },

      onRemoveType (item){
        this.item.serviceDomainList = this.item.serviceDomainList.filter(({serviceTypeCode}) => {
          return serviceTypeCode !== item.code
        });
      }
    }
  }
</script>
