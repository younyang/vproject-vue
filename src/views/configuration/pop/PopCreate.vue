<template>
  <div class="animated fadeIn">
    <b-form class="formView" :validated="inValidForm" novalidate>
      <!-- PoP Name -->
      <b-form-fieldset
        label="PoP Name<i class='require'>*</i>"
        :invalid-feedback="$valid.msg.require"
        :horizontal="true">
        <b-form-input
          v-model="items.popName"
          type="text"
          placeholder="Enter PoP name"
          required
        ></b-form-input>
      </b-form-fieldset>

      <!-- Host Name -->
      <b-form-fieldset
        label="Host Name(Prefix)<i class='require'>*</i>"
        :invalid-feedback="feedback.popHostName"
        :horizontal="true">

        <b-form-input
          v-model="items.popHostName"
          type="text"
          placeholder="Enter PoP Host name"
          :state="valid.popHostName"
          @input="popHostNameExists = null"
          required
        ></b-form-input>
        <b-button variant="in-table" @click="fetchNameExists">중복확인</b-button>
        <span class="ico ml-2 mid" v-if="popHostNameExists !== null">
          <i v-if="popHostNameExists === 'success'" class="fa fa-check-circle"></i>
          <i v-if="popHostNameExists === 'fail'" class="fa fa-times-circle"></i>
        </span>
      </b-form-fieldset>

      <!-- Domain -->
      <b-form-fieldset
        label="Domain<i class='require'>*</i>"
        :invalid-feedback="feedback.domain"
        :horizontal="true">

        <b-button variant="in-table" @click="fetchDomain">생성</b-button>
        <small
          class="form-text-alone ml-2"
          :class="{'invalid': items.popDomainName === null }">
          http(s)://[edge].[content type].<strong class="text-primary">{{ items.popDomainName }}</strong>.[country].[service type].[service name].vessels.com
        </small>
      </b-form-fieldset>

      <!-- 구분 -->
      <b-form-fieldset
        label="구분<i class='require'>*</i>"
        :invalid-feedback="$valid.msg.check"
        :horizontal="true">

        <span :class="{'invalid' : !valid.referrer }">
          <b-form-checkbox v-model="items.referrerYn">Low Referrer</b-form-checkbox>
          <b-form-checkbox v-model="items.highReferrerYn">High Referrer</b-form-checkbox>
        </span>
      </b-form-fieldset>

      <!-- 주소 -->
      <b-form-fieldset
        label="주소<i class='require'>*</i>"
        :invalid-feedback="$valid.msg.select"
        :horizontal="true">
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

      <b-form-fieldset
        label="품질솔루션팀<i class='require'>*</i>"
        :invalid-feedback="$valid.msg.select"
        :horizontal="true">
        <multiselect
          v-model="qualitySolutionTeamCode"
          :showLabels="false"
          :options="code.qualitySolutionTeamCode"
          :loading="isLoad.qualitySolutionTeamCode"
          :class="{'invalid': !valid.qualitySolutionTeamCode }"
          track-by="code"
          label="codeName"
          placeholder="선택"
        ></multiselect>
      </b-form-fieldset>

      <!-- Bandwidth -->
      <b-form-fieldset
        label="Bandwidth<i class='require'>*</i>"
        :invalid-feedback="$valid.msg.require"
        :horizontal="true">
        <cleave
          :value.sync="items.bandwidth"
          style="width: 156px;"
          class="form-control"
          :options="{ numeral: true, numeralPositiveOnly: true, numeralDecimalScale: 0 }"
          required
        ></cleave>
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
          v-model="items.popUseYn"
        ></c-switch>
      </b-form-fieldset>
    </b-form>

    <div class="page-btn">
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Pop 관리' }">취소</b-button>
      <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
    </div>

  </div>
</template>

<script>
  import cSwitch from '@/components/Switch'
  export default {
    name: 'pops',
    components: {
      cSwitch
    },

    data (){
      return {
        items: {
          popName: '',
          popHostName: '',
          popDomainName: null,
          popCtprvnCode : null,
          popSigCode : null,
          qualitySolutionTeamCode : null,
          referrerYn : false,
          highReferrerYn : false,
          bandwidth : 0,
          popUseYn : true
        },
        code: {
          popCtprvnCode: [],
          popSigCode: [],
          qualitySolutionTeamCode: []
        },
        isLoad: {
          popCtprvnCode: true,
          popSigCode: true,
          qualitySolutionTeamCode: true
        },

        popHostNameExists: null,
        inValidForm: false
      }
    },

    computed: {
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
      qualitySolutionTeamCode: {
        get () {
          return this.code.qualitySolutionTeamCode.find(obj => obj.code === this.items.qualitySolutionTeamCode) || null;
        },
        set (newValue) {
          this.items.qualitySolutionTeamCode = newValue !== null ? newValue.code : null;
        }
      },
      // validation
      valid (){
        return {
          popHostName: (this.popHostNameExists === null && this.items.popHostName.length === 0) ?
            this.popHostNameExists :
            (this.items.popHostName.length > 0 &&
            /^[A-Za-z0-9]*$/.test(this.items.popHostName) &&
            this.popHostNameExists === 'success'),
          referrer: !(!this.items.referrerYn && !this.items.highReferrerYn),
          popCtprvnCode: this.items.popCtprvnCode !== null,
          popSigCode: this.items.popSigCode !== null,
          qualitySolutionTeamCode: this.items.qualitySolutionTeamCode !== null
        }
      },

      // validation feedback
      feedback (){
        return {
          popHostName: (!(/^[A-Za-z0-9]*$/.test(this.items.popHostName)) && this.items.popHostName.length > 0) ?
            '영문, 숫자만 입력하십시오.'
            : (this.popHostNameExists === null && this.items.popHostName.length > 0) ?
            '중복확인은 필수입니다.'
            : (this.popHostNameExists === 'not') ?
            '입력된 항목이 없습니다.'
            : (this.popHostNameExists === 'fail') ?
            '이미 등록된 Host Name이 있습니다.'
            : this.items.popHostName.length === 0 ?
            this.$valid.msg.require : '',
          domain: this.items.popDomainName === null ?
            'Domain name 생성이 필요합니다.' : ''
        }
      }
    },

    created (){
      // 주소 Code
      this.fetchAddress();
      // 품질솔루션팀 Code
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'QUALITY_TEAM' }
        })
        .then((res) => {
          this.isLoad.qualitySolutionTeamCode = false;
          this.code.qualitySolutionTeamCode = res.data.items;
        });
    },

    methods: {
      onSubmit (){
        // History
        this.items.modifyHistReason = '등록';
        const validate = (this.$valid.all(this.items) && this.popHostNameExists === 'success');
        this.inValidForm = !validate;

        // POST
        if (validate){
          this.$https.post('/pops', this.items)
            .then((res) => {
              this.$router.push({ name: 'Pop 상세', params: { id: res.data.items }})
            })
            .catch((error) => {
              console.log(error);
            });
        }
      },

      fetchNameExists (){
        if (!this.items.popHostName){
          this.popHostNameExists = 'not';
          return;
        }
        this.$https.get('/pops/hostName/exists', {
            hostName: this.items.popHostName
          })
          .then((res) => {
            this.popHostNameExists = res.data.result === 'Success' ? 'success' : 'fail';
          });
      },

      fetchDomain (){
        this.$https.get('/pops/domain')
          .then((res) => {
            this.items.popDomainName = res.data.items.domain;
          });
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

      onFirstAddress (obj){
        this.fetchAddress(obj.addressCode)
      }
    }
  }
</script>
