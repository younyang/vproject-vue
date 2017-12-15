<template>
  <div class="animated fadeIn">
    <b-form>
      <b-card>
        <!-- Account -->
        <b-form-fieldset
          label="Account *"
          :label-cols="3"
          :horizontal="true">
          <multiselect
            v-model="accountId"
            :options="code.accountId"
            :showLabels="false"
            :custom-label="getSelectLabel"
            :loading="isLoad.accountId"
            placeholder="Select account"
          ></multiselect>
        </b-form-fieldset>

        <!-- Service Name -->
        <b-form-fieldset
          label="Service Name *"
          description="Service Name은 도메인에 포함되기 때문에 영문, 숫자만 입력 가능합니다."
          :label-cols="3"
          :horizontal="true">
          <b-input-group>
            <b-form-input
              v-model="items.serviceName"
              type="text"
              placeholder="Enter service name">
            </b-form-input>
            <b-input-group-button slot="right" class="ml-2">
              <b-button variant="outline-secondary" @click="fetchNameExists">중복확인</b-button>
            </b-input-group-button>
          </b-input-group>
        </b-form-fieldset>

        <!-- Service Type -->
        <b-form-fieldset
          label="Service Type *"
          :label-cols="3"
          :horizontal="true">

          <multiselect
            v-model="serviceTypeCode"
            :multiple="true"
            :showLabels="false"
            :options="code.serviceTypeCode"
            :custom-label="getSelectLabel"
            :loading="isLoad.serviceTypeCode"
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
                    :options="code.domainProtocolCode"
                    :custom-label="getSelectLabel"
                    :loading="isLoad.domainProtocolCode"
                    placeholder="://"
                  ></multiselect>
                  {{ domain.serviceCodeVal | lowercase }}.{{ items.serviceName }}.vessels.com
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
                  :options="code.domainHashingTypeCode"
                  :custom-label="getSelectLabel"
                  :loading="isLoad.domainHashingTypeCode"
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
            v-model="items.cnameUseYn"
            :pill="true"
          ></c-switch>
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
            v-model="items.sslCertUseYn"
            :pill="true"
          ></c-switch>
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
            v-model="items.serviceUseYn"
            :pill="true"
          ></c-switch>
        </b-form-fieldset>

        <div slot="footer" class="form-btn">
          <b-button type="button" size="sm" variant="primary" @click="onSubmit"><i class="fa fa-dot-circle-o"></i> 저장</b-button>
          <b-button type="button" size="sm" variant="secondary" :to="{ name: 'Service 관리' }"><i class="fa fa-ban"></i> 취소</b-button>
        </div>
      </b-card>
    </b-form>

    <b-modal hide-footer title="Message" size="sm" v-model="isModalMessage" :class="state.serviceName ? 'modal-primary' : 'modal-danger'">
      <div class="d-block text-center">
        <h5>{{ modalMessage }}</h5>
      </div>
      <b-btn class="mt-4" :variant="state.serviceName ? 'outline-primary' : 'outline-danger'" block @click="isModalMessage = false">Close</b-btn>
    </b-modal>
  </div>
</template>

<script>
  import cSwitch from '@/components/Switch'
  export default {
    name: 'services',
    components: {
      cSwitch
    },

    data (){
      return {
        items: {
          accountId: null,
          serviceName: "",
          serviceTypeCode: [],
          serviceDomainList: [],
          cnameUseYn: true,
          sslCertUseYn: true,
          serviceUseYn: true
        },
        code: {
          accountId: [],
          serviceTypeCode: [],
          domainProtocolCode: [],
          domainHashingTypeCode: []
        },
        isLoad: {
          accountId: true,
          serviceTypeCode: true,
          domainProtocolCode: true,
          domainHashingTypeCode: true
        },
        isModalMessage: false,
        modalMessage: '',
        state: {
          serviceName: true
        }
      }
    },

    computed: {
      accountId: {
        get () {
          return this.code.accountId.find(obj => obj.accountId === this.items.accountId) || null;
        },
        set (newValue) {
          this.items.accountId = newValue !== null ? newValue.accountId : null;
        }
      },
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
      serviceDomainList (){
        return this.items.serviceDomainList.length > 0
          ? this.items.serviceDomainList.map(obj => {
            const serviceCode = this.getCodeObj(obj.serviceTypeCode);
            return Object.assign({}, obj, {
              domainProtocolCode: this.code.domainProtocolCode.find(({code}) => code === obj.domainProtocolCode),
              domainHashingTypeCode: this.code.domainHashingTypeCode.find(({code}) => code === obj.domainHashingTypeCode),
              serviceCodeVal: serviceCode.codeValChar1,
              serviceCodeName: serviceCode.codeName
            })
          })
          : [];
      }
    },

    created (){
      // Account Code
      this.$https.get('/services/accounts')
        .then((res) => {
          this.isLoad.accountId = false;
          this.code.accountId = res.data.items;
      });
      // Service Type Code
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'SERVICE_TYPE' }
        })
        .then((res) => {
          this.isLoad.serviceTypeCode = false;
          this.code.serviceTypeCode = res.data.items;
        });
      // Domain Protocol Code
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'DOMAIN_PROTOCOL' }
        })
        .then((res) => {
          this.isLoad.domainProtocolCode = false;
          this.code.domainProtocolCode = res.data.items;
        });
      // Domain Hahing Type Code
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'HASHING_TYPE' }
        })
        .then((res) => {
          this.isLoad.domainHashingTypeCode = false;
          this.code.domainHashingTypeCode = res.data.items;
        });
    },

    methods: {
      onSubmit (){
        // Service Domain List
        this.items.serviceDomainList = this.serviceDomainList.map(obj => {
          return {
            serviceTypeCode: obj.serviceTypeCode,
            domainProtocolCode: obj.domainProtocolCode !== null ? obj.domainProtocolCode.code : null,
            domainHashingTypeCode: obj.domainHashingTypeCode !== null ? obj.domainHashingTypeCode.code : null
          }
        });
        // History
        this.items.modifyHistReason = '등록';

        this.$https.post('/services', this.items)
          .then((res) => {
            this.$router.push({ name: 'Service 상세', params: { id: res.data.items }})
          })
          .catch((error) => {
            console.log(error);
          });
      },

      fetchNameExists (){
        this.$https.get('/services/name', {
            serviceName: this.items.serviceName
          })
          .then((res) => {
            const isSuccess = res.data.result === 'Success';
            this.state.serviceName = isSuccess;
            this.modalMessage = isSuccess ? '사용하실 수 있습니다.' : 'Service Name 이 중복입니다.';
            if (!isSuccess){
              this.items.serviceName = '';
            }
            this.isModalMessage = true;
          });
      },

      getCodeObj (code){
        return this.code.serviceTypeCode.find(obj => obj.code === code) || {};
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
          this.items.serviceDomainList.push({
            serviceTypeCode: item.code,
            domainProtocolCode: this.code.domainProtocolCode[0].code,
            domainHashingTypeCode: this.code.domainHashingTypeCode[0].code
          });
        }
      },

      onRemoveType (item){
        this.items.serviceDomainList = this.item.serviceDomainList.filter(({serviceTypeCode}) => {
          return serviceTypeCode !== item.code
        });
      }
    }
  }
</script>
