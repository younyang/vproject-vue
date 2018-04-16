<template>
  <div class="animated fadeIn">
    <b-form class="formView" :validated="inValidForm" novalidate>
      <!-- 구분 -->
      <b-form-fieldset
        label="구분<i class='require'>*</i>"
        :invalid-feedback="$valid.msg.select"
        :horizontal="true">
        <multiselect
          v-model="componentType"
          :showLabels="false"
          :options="code.componentType"
          :loading="isLoad.componentType"
          :class="{'invalid': !valid.componentType }"
          track-by="code"
          label="codeName"
          placeholder="선택"
        ></multiselect>
      </b-form-fieldset>

      <!-- IP -->
      <b-form-fieldset
        label="IP<i class='require'>*</i>"
        :invalid-feedback="$valid.msg.require"
        :horizontal="true">
        <b-form-input
          v-model="items.ip"
          type="text"
          placeholder="Enter IP"
          required
        ></b-form-input>
      </b-form-fieldset>

      <!-- Host Name -->
      <b-form-fieldset
        label="Host Name<i class='require'>*</i>"
        :invalid-feedback="$valid.msg.require"
        :horizontal="true">
        <b-form-input
          v-model="items.hostName"
          type="text"
          placeholder="Enter Host Name"
          required
        ></b-form-input>
      </b-form-fieldset>

      <!-- PoP 선택 -->
      <b-form-fieldset
        label="PoP 선택<i class='require'>*</i>"
        :invalid-feedback="$valid.msg.select"
        :horizontal="true">
        <multiselect
          v-model="popId"
          track-by="popId"
          label="popName"
          :showLabels="false"
          :options="code.popId"
          :loading="isLoad.popId"
          :class="{'invalid': !valid.popId }"
          placeholder="Select PoP"
        ></multiselect>
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
          v-model="items.serverUseYn"
        ></c-switch>
      </b-form-fieldset>
    </b-form>

    <div class="page-btn">
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Server 관리' }">취소</b-button>
      <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
    </div>
  </div>
</template>

<script>
  import cSwitch from '@/components/Switch'
  export default {
    name: 'server',
    components: {
      cSwitch
    },

    data (){
      return {
        items: {
          componentType: null,
          ip: '',
          hostName: '',
          popId: null,
          serverUseYn: true
        },
        code: {
          popId: [],
          componentType: []
        },
        isLoad: {
          popId: true,
          componentType: true
        },
        inValidForm: false
      }
    },

    computed: {
      popId: {
        get () {
          return this.code.popId.find(obj => obj.popId === this.items.popId) || null;
        },
        set (newValue) {
          this.items.popId = newValue !== null ? newValue.popId : null;
        }
      },
      componentType: {
        get () {
          return this.code.componentType.find(obj => obj.code === this.items.componentType) || null;
        },
        set (newValue) {
          this.items.componentType = newValue !== null ? newValue.code : null;
        }
      },

      // validation
      valid (){
        return {
          popId: this.items.popId !== null,
          componentType: this.items.componentType !== null
        }
      }
    },

    created (){

      // PoP List
      this.$https.get('/pops')
        .then((res) => {
          this.isLoad.popId = false;
          this.code.popId = res.data.items;
        });

      // 구분 Code
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'COMPONENT_TYPE' }
        })
        .then((res) => {
          this.isLoad.componentType = false;
          this.code.componentType = res.data.items.filter(({code}) => {
            if(code !== 'COMPONENT_TYPE_01' && code !== 'COMPONENT_TYPE_02' && code !== 'COMPONENT_TYPE_03' ){
              return true;
            }else{
              return false;
            }
          });
        });
    },

    methods: {
      onSubmit (){
        // History
        this.items.modifyHistReason = '등록';

        const validate = this.$valid.all(this.items);
        this.inValidForm = !validate;

        if (validate){
          this.$https.post('/servers', this.items)
            .then((res) => {
              this.$router.push({
                name: 'Server 상세',
                params: { id: res.data.items }})
            })
            .catch((error) => {
              console.log(error);
              alert(error.response.data.error.message);
            });
        }
      }
    }
  }
</script>
