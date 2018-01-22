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
        :invalid-feedback="$valid.msg.require"
        :horizontal="true">
        <b-input-group>
          <b-form-input
            v-model="items.popHostName"
            type="text"
            placeholder="Enter PoP Host name"
            required
          ></b-form-input>
          <b-input-group-button slot="right" class="ml-2">
            <b-button variant="outline-secondary" @click="fetchHostExists">중복확인</b-button>
          </b-input-group-button>
        </b-input-group>
      </b-form-fieldset>

      <!-- Domain -->
      <b-form-fieldset
        label="Domain<i class='require'>*</i>"
        :invalid-feedback="$valid.msg.require"
        :horizontal="true">

        <b-button variant="outline-secondary" @click="fetchDomain">생성</b-button>
        <span class="domain-text ml-2" v-if="isDomainName">
          http(s)://[edge].[content type].<strong class="text-danger">{{ items.popDomainName }}</strong>.[country].[service type].[service name].vessels.com
        </span>
      </b-form-fieldset>

      <!-- 구분 -->
      <b-form-fieldset
        label="구분<i class='require'>*</i>"
        :invalid-feedback="$valid.msg.check"
        :horizontal="true">
        <b-form-checkbox v-model="items.referrerYn">Low Referrer</b-form-checkbox>
        <b-form-checkbox v-model="items.highReferrerYn">High Referrer</b-form-checkbox>
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
          @select="onFirstAddress"
          label="addressCodeName"
          class="inline"
          style="min-width:130px"
          placeholder="선택"
        ></multiselect>

        <multiselect
          v-if="popCtprvnCode"
          v-model="popSigCode"
          :showLabels="false"
          :searchable="false"
          :options="code.popSigCode"
          :loading="isLoad.popSigCode"
          label="addressCodeName"
          placeholder="선택"
          class="inline"
          style="min-width: 130px"
        ></multiselect>
      </b-form-fieldset>

      <b-form-fieldset
        label="품질솔루션팀<i class='require'>*</i>"
        :invalid-feedback="$valid.msg.select"
        :horizontal="true">
        <multiselect
          v-model="qualitySolutionTeamCode"
          :showLabels="false"
          :searchable="false"
          :options="code.qualitySolutionTeamCode"
          :loading="isLoad.qualitySolutionTeamCode"
          label="codeName"
          placeholder="선택"
        ></multiselect>
      </b-form-fieldset>

      <!-- Bandwidth -->
      <b-form-fieldset
        label="Bandwidth<i class='require'>*</i>"
        :invalid-feedback="$valid.msg.require"
        :horizontal="true">
        <b-form-input
          v-model="items.bandwidth"
          type="number"
          class="w-25"
        ></b-form-input>
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

    <b-modal ref="messageModalRef" hide-footer title="Message" size="sm" :class="state.popHostName ? 'modal-primary' : 'modal-danger'">
      <div class="d-block text-center">
        <h5>{{ hostmessage }}</h5>
      </div>
      <b-btn class="mt-4" :variant="state.popHostName ? 'outline-primary' : 'outline-danger'" block @click="hideMessage">Close</b-btn>
    </b-modal>
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
          popName: "",
          popHostName: "",
          popDomainName: "",
          popCtprvnCode : "",
          popSigCode : "",
          qualitySolutionTeamCode : "",
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
        isDomainName: false,
        state: {
          popHostName: true
        },
        hostmessage: '',

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
        // POST
        this.$https.post('/pops', this.items)
          .then((res) => {
            this.$router.push({ name: 'Pop 상세', params: { id: res.data.items }})
          })
          .catch((error) => {
            console.log(error);
          });
      },

      fetchHostExists (){
        this.$https.get('/pops/hostName/exists', {
            hostName: this.items.popHostName
          })
          .then((res) => {
            const isSuccess = res.data.result === 'Success';
            this.state.popHostName = isSuccess;
            this.hostmessage = isSuccess ? '사용하실 수 있습니다.' : 'Host Name 이 중복입니다.';
            if (!isSuccess){
              this.items.popHostName = '';
            }
            this.showMessage();
          });
      },

      fetchDomain (){
        this.$https.get('/pops/domain')
          .then((res) => {
            this.isDomainName = true;
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
      },

      showMessage () {
        this.$refs.messageModalRef.show()
      },
      hideMessage () {
        this.$refs.messageModalRef.hide()
      }
    }
  }
</script>
