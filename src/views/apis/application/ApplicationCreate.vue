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
          v-model="items.appName"
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
          :class="{'invalid': !(valid.serviceCode) }"
          track-by="code"
          label="codeName"
          :multiple="true"
          :showLabels="false"
          :options="code.serviceCode"
          :loading="isLoad.serviceCode"
          @select="onSelectType"
          @remove="onRemoveType"
            placeholder="Select service type"
        ></multiselect>
      </b-form-fieldset>

      <!-- 설명 -->
      <b-form-fieldset
        label="설명"
        :horizontal="true">
        <b-form-textarea
          v-model="items.appDesc"
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
          v-model="items.appUseYn"
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
          appName: '',
          appServiceList:[],
          appDesc: '',
          appUseYn: true
        },
        code: {
          serviceCode: []
        },
        isLoad: {
          serviceCode: true
        },

        inValidForm: false
      }
    },

    computed: {
      serviceCode : {
       get () {
         return this.items.serviceCode.length > 0
         ? this.items.serviceCode.map(val => this.code.serviceCode.find(obj => obj.code === val))
         : [];
       },
       set (newValue) {
         this.items.serviceCode = newValue.length > 0
           ? newValue.map(obj => obj.code)
           : [];
       }
     },

     // validation
     valid (){
       return {
         appName: this.items.appName !== null,
         serviceCode: this.items.appServiceList.length,
         appServiceList: this.items.appServiceList !== null,
         appDesc: this.items.appDesc !== null,
         appUseYn: this.items.appUseYn !== null
       }
     },

    },


    created (){
      // Service Type Code
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'API_SERVICE' }
        })
        .then((res) => {
          this.isLoad.serviceCode = false;
          this.code.serviceCode = res.data.items;
        });
    },

    methods: {
      onSubmit (){
        // const appServiceCase = this.items
        console.log(this.items)
        // History
        this.items.modifyHistReason = '등록';

        const validationItems = {
          appName: this.items.appName,
          appServiceList: this.items.appServiceList,
          appUseYn: this.items.appUseYn
        }
        const validate = this.$valid.all(validationItems);
        this.inValidForm = !validate;
        console.log(validate);
        if (validate){
          this.$https.post('/apiManagement/apps', this.items)
            .then((res) => {
              console.log(res.data.items);
              this.$router.push({ name: 'Application 상세', params: { id: res.data.items }})
            })
            .catch((error) => {
              console.log(error);
            });

        }
      },

      onSelectType(item){
        const code = item.code;
        this.items.appServiceList.push({
          serviceCode: code
        });
      },

      onRemoveType(item){
        const code = item.code;
        this.items.appServiceList = this.items.appServiceList.filter(({serviceCode}) => {
          return serviceCode !== code;
        });
      }
    }
  }
</script>
