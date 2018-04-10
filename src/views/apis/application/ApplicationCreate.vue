<template>
  <div class="animated fadeIn">
    <b-form class="formView" :validated="inValidForm" novalidate>
      <!-- Application Name -->
      <b-form-fieldset
        description="※ 국문/영문/숫자 및 ‘-’, ‘_’ 입력 가능"
        :invalid-feedback="$valid.msg.require"
        :horizontal="true">
        <template slot="label">
          Application Name<i class="require">*</i>
        </template>

        <b-form-input
          v-model="items.applicationName"
          type="text"
          placeholder="Enter application name"
          required
        ></b-form-input>
      </b-form-fieldset>

      <!-- Service 선택 -->
      <b-form-fieldset
        :invalid-feedback="$valid.msg.select"
        :horizontal="true">
        <template slot="label">
          Service 선택<i class="require">*</i>
        </template>

        <multiselect
          class="multiple"
          :class="{'invalid': !(items.service.length) }"
          track-by="code"
          label="codeName"
          :multiple="true"
          :showLabels="false"
          :options="[{ code: 1, codeName: 'Edge'}, { code: 2, codeName: 'Low Referrer'}]"
        ></multiselect>
      </b-form-fieldset>

      <!-- 설명 -->
      <b-form-fieldset
        label="설명"
        :horizontal="true">
        <b-form-textarea
          v-model="items.description"
          :rows="6"
        ></b-form-textarea>
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
          v-model="items.applicationUseYn"
        ></c-switch>
      </b-form-fieldset>
    </b-form>

    <div class="page-btn">
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Application 관리' }">취소</b-button>
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
          applicationName: '',
          service: [],
          description: '',
          applicationUseYn: true
        },
        code: {
        },
        isLoad: {
        },

        inValidForm: false
      }
    },

    computed: {
    },

    created (){
    },

    methods: {
      onSubmit (){
      },

      validate (submitItems){
      }
    }
  }
</script>
