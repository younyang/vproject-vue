<template>
  <div class="animated fadeIn">
    <b-form class="formView" :validated="inValidForm" novalidate>
      <!-- Company -->
      <b-form-fieldset
        :invalid-feedback="$valid.msg.select"
        :horizontal="true">
        <template slot="label">
          Company<i class="require">*</i>
        </template>

        <multiselect
          v-model="companyCode"
          track-by="code"
          label="codeName"
          :class="{'invalid': !valid.companyCode }"
          :options="code.companyCode"
          :showLabels="false"
          :loading="isLoad.companyCode"
          placeholder="Select company"
        ></multiselect>
      </b-form-fieldset>

      <!-- Service Name -->
      <b-form-fieldset
        description="※ Service Name은 도메인에 포함되기 때문에 영문, 숫자만 입력 가능합니다."
        :invalid-feedback="feedback.serviceName"
        :horizontal="true">
        <template slot="label">
          Service Name<i class="require">*</i>
        </template>

        <b-form-input
          v-model="items.serviceName"
          type="text"
          placeholder="Enter service name"
          :state="valid.serviceName"
          @input="serviceNameExists = null"
          :formatter="lowerFomatter"
          required
        ></b-form-input>
        <b-button variant="in-table" @click="fetchNameExists">중복확인</b-button>
        <span class="ico ml-2 mid" v-if="serviceNameExists !== null">
          <i v-if="serviceNameExists === 'success'" class="fa fa-check-circle"></i>
          <i v-if="serviceNameExists === 'fail'" class="fa fa-times-circle"></i>
        </span>
      </b-form-fieldset>

      <!-- Service Type -->
      <b-form-fieldset
        :invalid-feedback="$valid.msg.select"
        :horizontal="true">
        <template slot="label">
          Service Type<i class="require">*</i>
        </template>

        <multiselect
          v-model="serviceTypeCode"
          class="multiple"
          :class="{'invalid': !valid.serviceTypeCode }"
          track-by="code"
          label="codeName"
          :multiple="true"
          :showLabels="false"
          :options="code.serviceTypeCode"
          :loading="isLoad.serviceTypeCode"
          @select="onSelectType"
          @remove="onRemoveType"
          placeholder="Select service type"
        ></multiselect>
      </b-form-fieldset>

      <!-- Domain -->
      <b-form-fieldset
        label="Domain"
        :horizontal="true">
        <small class="form-text-alone text-muted" v-if="!items.serviceDomainList.length">※ Service Name, Service Type 선택 시, 자동 생성</small>

        <!-- domain list -->
        <b-table
          v-if="items.serviceDomainList.length"
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
      </b-form-fieldset>

      <!-- CNAME -->
      <b-form-fieldset
        label="CNAME 사용여부"
        :horizontal="true">
        <c-switch
          type="text"
          class="v-switch"
          on="사용"
          off="미사용"
          v-model="items.cnameUseYn"
        ></c-switch>
      </b-form-fieldset>

      <!-- CNAME Domain -->
      <b-form-fieldset
        v-if="items.cnameUseYn"
        label="CNAME 도메인<i class='require'>*</i>"
        :invalid-feedback="$valid.msg.require"
        :horizontal="true">
        <b-form-input
          v-model="items.cnameDomainName"
          type="text"
          required
        ></b-form-input>
      </b-form-fieldset>

      <!-- SSL 인증서 -->
      <b-form-fieldset
        label="SSL 인증서"
        :horizontal="true">
        <c-switch
          type="text"
          class="v-switch"
          on="사용"
          off="미사용"
          v-model="items.sslCertUseYn"
        ></c-switch>
      </b-form-fieldset>

      <!-- SSL 인증서 정보 입력-->
      <b-form-fieldset
        v-if="items.sslCertUseYn"
        label="SSL 인증서<i class='require'>*</i>"
        :horizontal="true">

        <div class="form-in-view">
          <!-- Cert -->
          <b-form-fieldset
            label="Cert<i class='require'>*</i>"
            :invalid-feedback="$valid.msg.require"
            :horizontal="true">
            <b-form-textarea
              v-model="items.sslCert"
              :rows="2"
              required
            ></b-form-textarea>
          </b-form-fieldset>

          <!-- Key -->
          <b-form-fieldset
            label="Key<i class='require'>*</i>"
            :invalid-feedback="$valid.msg.require"
            :horizontal="true">
            <b-form-textarea
              v-model="items.sslCertKey"
              :rows="2"
              required
            ></b-form-textarea>
          </b-form-fieldset>

          <!-- 만료일 -->
          <b-form-fieldset
            label="만료일"
            :invalid-feedback="$valid.msg.require"
            :horizontal="true">
            <b-form-input
              type="date"
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
        <c-switch
          type="text"
          class="v-switch"
          on="사용"
          off="미사용"
          v-model="items.serviceUseYn"
        ></c-switch>
      </b-form-fieldset>
    </b-form>

    <div class="page-btn">
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Service 관리' }">취소</b-button>
      <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
    </div>
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
          companyCode: null,
          serviceName: '',
          serviceTypeCode: [],
          serviceDomainList: [],
          cnameUseYn: true,
          cnameDomainName: "",
          sslCertUseYn: true,
          sslCert: "",
          sslCertKey: "",
          sslCertExpireDate: "",
          serviceUseYn: true
        },
        code: {
          companyCode: [],
          serviceTypeCode: [],
          serviceTypeCodeAll: [],
          domainProtocolCode: [],
          domainHashingTypeCode: []
        },
        isLoad: {
          companyCode: true,
          serviceTypeCode: true,
          domainProtocolCode: true,
          domainHashingTypeCode: true
        },

        serviceNameExists: null,
        inValidForm: false
      }
    },

    computed: {
      companyCode: {
        get () {
          return this.code.companyCode.find(({ code }) => code === this.items.companyCode) || null;
        },
        set (newValue) {
          this.items.companyCode = newValue !== null ? newValue.code : '';
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

      // validation
      valid (){
        return {
          serviceName: (this.serviceNameExists === null && this.items.serviceName.length === 0) ?
            this.serviceNameExists :
            (this.items.serviceName.length > 0 &&
            /^[A-Za-z0-9]*$/.test(this.items.serviceName) &&
            this.serviceNameExists === 'success'),
          companyCode: this.items.companyCode === null ?
            this.items.companyCode :
            this.items.companyCode.length > 0,
          serviceTypeCode: this.items.serviceTypeCode.length
        }
      },

      // validation feedback
      feedback (){
        return {
          serviceName: (!(/^[A-Za-z0-9]*$/.test(this.items.serviceName)) && this.items.serviceName.length > 0) ?
            '영문, 숫자만 입력하십시오.'
            : (this.serviceNameExists === null && this.items.serviceName.length > 0) ?
            '중복확인은 필수입니다.'
            : (this.serviceNameExists === 'not') ?
            '입력된 항목이 없습니다.'
            : (this.serviceNameExists === 'fail') ?
            '이미 등록된 Service Name이 있습니다.'
            : this.items.serviceName.length === 0 ?
            this.$valid.msg.require : ''
        }
      }
    },

    created (){
      // Company Code
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'COMPANY' }
        })
        .then((res) => {
          this.isLoad.companyCode = false;
          this.code.companyCode = res.data.items;
      });
      // Service Type Code
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'SERVICE_TYPE' }
        })
        .then((res) => {
          this.isLoad.serviceTypeCode = false;
          this.code.serviceTypeCodeAll = res.data.items;
          this.code.serviceTypeCode = res.data.items.filter(({code}) => {
            const codeSplit = code.split('_')[2];
            return codeSplit.length === 4;
          });
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
        // History
        this.items.modifyHistReason = '등록';

        if (this.validate(submitItems)){
          this.$https.post('/services', submitItems)
            .then((res) => {
              this.$router.push({ name: 'Service 상세', params: { id: res.data.items }})
            })
            .catch((error) => {
              console.log(error);
            });

        }
      },

      fetchNameExists (){
        if (!this.items.serviceName){
          this.serviceNameExists = 'not';
          return;
        }
        this.$https.get('/services/name', {
            serviceName: this.items.serviceName
          })
          .then((res) => {
            this.serviceNameExists = res.data.result === 'Success' ? 'success' : 'fail';
          });
      },

      validate (submitItems){
        const {
          companyCode,
          serviceName,
          serviceTypeCode,
          cnameDomainName,
          sslCert,
          sslCertKey,
          sslCertExpireDate,
        } = submitItems;

        let validateItems = { companyCode, serviceName, ...serviceTypeCode };
        if (this.items.cnameUseYn){
          validateItems = {...validateItems, cnameDomainName };
        }
        if (this.items.sslCertUseYn){
          validateItems = {...validateItems, sslCert, sslCertKey, sslCertExpireDate };
        }
        const validate = (this.$valid.all(validateItems) && this.serviceNameExists === 'success');

        this.inValidForm = !validate;
        return validate;
      },

      onSelectType (item){
        const domain = this.getServiceDomain(item);
        const isContain = this.items.serviceDomainList.length ?
          this.items.serviceDomainList.find(({ serviceTypeCode }) => serviceTypeCode.code === domain.code)
          : false;
        if (!isContain){
          this.items.serviceDomainList.push({
            serviceTypeCode: domain,
            domainProtocolCode: this.code.domainProtocolCode[0],
            domainHashingTypeCode: this.code.domainHashingTypeCode[0]
          });
        }
      },

      onRemoveType (item){
        const domain = this.getServiceDomain(item);
        const isContain = this.items.serviceTypeCode.filter(val => {
          return domain.code === val.slice(0, val.length - 2);
        }).length > 0;

        if (!isContain){
          this.items.serviceDomainList = this.items.serviceDomainList.filter(({serviceTypeCode}) => {
            return serviceTypeCode.code !== domain.code
          });
        }
      },

      lowerFomatter (value) {
        return value.toLowerCase()
      },

      getServiceDomain (item){
        const codeSplit = item.code.split('_')[2];
        return codeSplit.length === 4 ?
          this.code.serviceTypeCodeAll.find(({ code }) => item.code.slice(0, item.code.length - 2) === code)
          : code;
      }
    }
  }
</script>
