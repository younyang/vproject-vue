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

      <div class="form-row">
        <!-- Host Name -->
        <b-form-fieldset
          label="Host Name(Prefix)<i class='require'>*</i>"
          :invalid-feedback="feedback.popHostName"
          :horizontal="true">

          <b-form-input
            v-model="items.popHostName"
            type="text"
            style="width:156px"
            placeholder="Enter PoP Host name"
            :state="valid.popHostName"
            :disabled="this.isReInputed"
            @input="popHostNameExists = null"
            required
          ></b-form-input>
          <b-button v-if="!this.isReInputed" variant="in-table" @click="fetchNameExists">중복확인</b-button>
          <b-button v-if="this.isReInputed" variant="in-table" @click="popHostNameExists=false">재입력</b-button>
          <span class="ico ml-2 mid" v-if="popHostNameExists !== null">
          <i v-if="popHostNameExists === 'success'" class="fa fa-check-circle"></i>
          <i v-if="popHostNameExists === 'fail'" class="fa fa-times-circle"></i>
        </span>
        </b-form-fieldset>

        <!-- region code -->
        <b-form-fieldset
          label="지역 <i class='require'>*</i>"
          :invalid-feedback="$valid.msg.select"
          :horizontal="true">
          <multiselect
            v-model="geoCode"
            :showLabels="false"
            :options="code.geoCode"
            :loading="isLoad.geoCode"
            :class="{'invalid': !valid.geoCode }"
            track-by="code"
            label="codeName"
            style="width:156px"
            placeholder="선택"
          ></multiselect>
        </b-form-fieldset>
      </div>

      <!-- data center -->
      <b-form-fieldset
        label="Data Center<i class='require'>*</i>"
        :invalid-feedback="$valid.msg.select"
        :horizontal="true">
        <multiselect
          v-model="dataCenterCode"
          :showLabels="false"
          :options="code.dataCenterCode"
          :loading="isLoad.dataCenterCode"
          :class="{'invalid': !valid.dataCenterCode }"
          track-by="code"
          label="codeName"
          style="width:156px"
          placeholder="선택"
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
          v-model="items.bandwidth"
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

    data() {
      return {
        items: {
          popName: '',
          popHostName: '',
          geoCode: '',
          qualitySolutionTeamCode: null,
          dataCenterCode: null,
          bandwidth: 0,
          popUseYn: true,
          referrerYn: false,
          highReferrerYn: false,
        },
        code: {
          qualitySolutionTeamCode: [],
          dataCenterCode: [],
          geoCode: []
        },
        isLoad: {
          qualitySolutionTeamCode: true,
          dataCenterCode: true,
          geoCode: true
        },

        popHostNameExists: null,
        inValidForm: false
      }
    },

    computed: {
      popCtprvnCode: {
        get() {
          return this.code.popCtprvnCode.find(obj => obj.addressCode === this.items.popCtprvnCode) || null;
        },
        set(newValue) {
          this.items.popCtprvnCode = newValue !== null ? newValue.addressCode : null;
        }
      },
      popSigCode: {
        get() {
          return this.code.popSigCode.find(obj => obj.addressCode === this.items.popSigCode) || null;
        },
        set(newValue) {
          this.items.popSigCode = newValue !== null ? newValue.addressCode : null;
        }
      },
      qualitySolutionTeamCode: {
        get() {
          return this.code.qualitySolutionTeamCode.find(obj => obj.code === this.items.qualitySolutionTeamCode) || null;
        },
        set(newValue) {
          this.items.qualitySolutionTeamCode = newValue !== null ? newValue.code : null;
        }
      },
      dataCenterCode: {
        get() {
          return this.code.dataCenterCode.find(obj => obj.code === this.items.dataCenterCode) || null;
        },
        set(newValue) {
          this.items.dataCenterCode = newValue !== null ? newValue.code : null;
        }
      },
      geoCode: {
        get() {
          return this.code.geoCode.find(obj => obj.code === this.items.geoCode) || null;
        },
        set(newValue) {
          this.items.geoCode = newValue !== null
            ? newValue.code : null;
        }
      },

      isReInputed() {
        return this.popHostNameExists === 'success' ? true : false
      },

      // validation
      valid() {
        return {
          popHostName: (this.popHostNameExists === null && this.items.popHostName.length === 0) ?
            this.popHostNameExists :
            (this.items.popHostName.length > 0 &&
              /^[A-Za-z0-9]*$/.test(this.items.popHostName) &&
              this.popHostNameExists === 'success'),
          referrer: !(!this.items.referrerYn && !this.items.highReferrerYn),
          qualitySolutionTeamCode: this.items.qualitySolutionTeamCode !== null,
          dataCenterCode: this.items.dataCenterCode !== null,
          geoCode: this.items.geoCode !== null
        }
      },

      // validation feedback
      feedback() {
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
                    this.$valid.msg.require : ''
        }
      }
    },

    created() {

      // 품질솔루션팀 Code
      this.$https.get('/system/commonCode', {
        q: {groupCode: 'QUALITY_TEAM'}
      })
        .then((res) => {
          this.isLoad.qualitySolutionTeamCode = false;
          this.code.qualitySolutionTeamCode = res.data.items;
        });
      // dataCenter Code
      this.$https.get('/system/commonCode', {
        q: {groupCode: 'DATACENTER'}
      })
        .then((res) => {
          this.isLoad.dataCenterCode = false;
          this.code.dataCenterCode = res.data.items;
        });
      // region Code
      this.$https.get('/system/commonCode', {
        q: {groupCode: 'GEO'}
      })
        .then((res) => {
          this.isLoad.geoCode = false;
          this.code.geoCode = res.data.items;
        });
    },

    methods: {
      onSubmit() {
        console.log('Class: methods, Function: onSubmit, Line 356 (): '
        , );
        // History
        this.items.modifyHistReason = '등록';
        const validate = (this.$valid.all(this.items) && this.popHostNameExists === 'success');
        this.inValidForm = !validate;

        // POST
        if (validate) {
          this.$https.post('/pops', this.items)
            .then((res) => {
              this.$router.push({name: 'Pop 상세', params: {id: res.data.items}})
            })
            .catch((error) => {
              console.log(error);
            });
        }
      },

      fetchNameExists() {
        if (!this.items.popHostName) {
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

    }
  }
</script>
