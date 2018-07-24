<template>
  <div class="animated fadeIn">

    <b-form class="formView" :validated="inValidForm" novalidate>
      <!-- ServiceType Name -->
      <b-form-fieldset
        description=""
        :invalid-feedback="feedback.serviceTypeName"
        :horizontal="true">
        <template slot="label">
          Name<i class="require">*</i>
        </template>

        <b-form-input
          v-model="items.serviceTypeName"
          type="text"
          placeholder=""
          :state="valid.serviceTypeName"
          @input="serviceTypeNameExists = null"
          required
        ></b-form-input>
        <b-button variant="in-table" @click="fetchNameExists">중복확인</b-button>
        <span class="ico ml-2 mid" v-if="serviceTypeNameExists !== null">
          <i v-if="serviceTypeNameExists === 'success'" class="fa fa-check-circle"></i>
          <i v-if="serviceTypeNameExists === 'fail'" class="fa fa-times-circle"></i>
        </span>

      </b-form-fieldset>

      <!-- Domain -->
      <b-form-fieldset
        :invalid-feedback="$valid.msg.select"
        :horizontal="true">
        <template slot="label">
          Protocol<i class="require">*</i>
        </template>
        <multiselect
          v-model="serviceTypeProtocolList"
          class="multiple"
          :class="{'invalid': !valid.serviceTypeProtocolList }"
          track-by="code"
          label="codeName"
          :multiple="true"
          :showLabels="false"
          :options="code.serviceTypeProtocolList"
          :loading="isLoad.serviceTypeProtocolList"
          placeholder="Select service type protocol"
        ></multiselect>

      </b-form-fieldset>

      <div class="form-row">

        <!-- RankSize -->
        <b-form-fieldset

          label="Rank Size<i class='require'>*</i>"
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <b-form-input
            v-model="items.rankSize"
            type="number"
            min="1" max="99999999999"
            required
          ></b-form-input>

        </b-form-fieldset>

        <!-- RankCount -->
        <b-form-fieldset
          label="Rank Count<i class='require'>*</i>"
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <b-form-input
            v-model="items.rankCount"
            type="number"
            min="1" max="99999999999"
            required
          ></b-form-input>
        </b-form-fieldset>
      </div>

      <!-- serviceTypeUseYn -->
      <b-form-fieldset
        label="hashDivisor<i class='require'>*</i>"
        :invalid-feedback="$valid.msg.require"
        :horizontal="true">
        <b-form-input
          v-model="items.hashDivisor"
          type="text"
          required
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
          v-model="items.serviceTypeUseYn"
        ></c-switch>
      </b-form-fieldset>

    </b-form>

    <div class="page-btn">
      <b-button type="button" variant="outline-secondary" :to="{ name: 'ServiceType 관리' }">취소</b-button>
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

    data() {
      return {
        items: {
          serviceTypeName: '',
          rankSize: null,
          rankCount: null,
          hashDivisor: null,
          serviceTypeUseYn: true,
          serviceTypeProtocolList: [],
        },
        code: {
          serviceTypeProtocolList: [],
          protocolList: []
        },
        isLoad: {
          serviceTypeProtocolList: true
        },

        serviceTypeNameExists: null,
        inValidForm: false
      }
    },

    computed: {
      serviceTypeProtocolList: {
        get() {
          return this.items.serviceTypeProtocolList.length > 0
            ? this.items.serviceTypeProtocolList.map(val => this.code.serviceTypeProtocolList.find(obj => obj.code === val.protocolCode))
            : [];
        },
        set(newValue) {
          this.items.serviceTypeProtocolList = newValue.length > 0
            ? newValue.map(obj => ({protocolCode: obj.code}))
            : [];
        }
      },

      // validation
      valid() {
        return {
          // 한글자라도 입력이 됐을 때 영문대소문자와 숫자만 입력됐는지 테스트한다.
          serviceTypeName: (this.items.serviceTypeName === null || this.items.serviceTypeName.length === 0)
            ? null : (this.items.serviceTypeName.length > 0 && /^[A-Za-z0-9]*$/.test(this.items.serviceTypeName)),
          serviceTypeProtocolList: this.items.serviceTypeProtocolList.length
        }
      },

      // validation feedback
      feedback() {
        return {
          serviceTypeName: (!(/^[A-Za-z0-9]*$/.test(this.items.serviceTypeName)) && this.items.serviceTypeName.length > 0) ?
            '영문, 숫자만 입력하십시오.'
            : (this.serviceTypeNameExists === null && this.items.serviceTypeName.length > 0) ?
              '중복확인은 필수입니다.'
              : (this.serviceTypeNameExists === 'not') ?
                '입력된 항목이 없습니다.'
                : (this.serviceTypeNameExists === 'fail') ?
                  '이미 등록된 Service Name이 있습니다.'
                  : this.items.serviceTypeName.length === 0 ?
                    this.$valid.msg.require : ''
        }
      }
    },

    created() {

      // Fetch Service Type Protocol Code
      this.$https.get('/system/commonCode', {
        q: {groupCode: 'PROTOCOL'}
      })
        .then((res) => {
          this.isLoad.serviceTypeProtocolList = false;
          this.code.serviceTypeProtocolList = res.data.items.map(r => {
            r.codeName = r.codeName.toUpperCase();
            return r
          })
        });
    },

    methods: {

      fetchNameExists() {
        if (!this.items.serviceTypeName) {
          this.serviceTypeNameExists = 'not';
          return;
        }
        this.$https.get('/servicetype/name', {
          serviceTypeName: this.items.serviceTypeName
        })
          .then((res) => {
            this.serviceTypeNameExists = res.data.result === 'Success' ? 'success' : 'fail';
          });
      },

      onSubmit() {
        const submitItems = {
          ...this.items
        };
        // History
        this.items.modifyHistReason = '등록';

        if (this.validate(submitItems)) {
          this.$https.put('/servicetype/type1', submitItems)
            .then((res) => {
              this.$router.push({name: 'ServiceType 상세', params: {id: res.data.items.serviceTypeId}})
            })
            .catch((error) => {
              console.log(error);
            });
        }
      },

      validate(submitItems) {
        const {
          serviceTypeName,
          serviceTypeProtocolList,
          rankSize,
          rankCount,
          hashDivisor,
          serviceTypeUseYn,
        } = submitItems;

        let validateItems = submitItems

        const validate = (this.$valid.all(validateItems));

        this.inValidForm = !validate;

        return validate;
      },
    }
  }
</script>
