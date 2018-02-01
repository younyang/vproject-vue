<template>
  <div class="animated fadeIn">
    <b-form class="formView" :validated="inValidForm" novalidate>
      <!-- 구분 -->
      <b-form-fieldset
        label="구분"
        :horizontal="true">
        <b-form-input
          :value="getItems.referrerTypeCodeName"
          type="text"
          plaintext
        ></b-form-input>
      </b-form-fieldset>

      <!-- IP -->
      <b-form-fieldset
        label="IP"
        :horizontal="true">
        <b-form-input
          :value="getItems.componentIp"
          type="text"
          plaintext
        ></b-form-input>
      </b-form-fieldset>

      <!-- Host Name -->
      <b-form-fieldset
        label="Host Name"
        :horizontal="true">
        <b-form-input
          :value="getItems.componentHostName"
          type="text"
          plaintext
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
          v-model="items.referrerUseYn"
        ></c-switch>
      </b-form-fieldset>
    </b-form>

    <div class="page-btn">
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Referrer 관리' }">취소</b-button>
      <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
    </div>
  </div>
</template>

<script>
  import cSwitch from '@/components/Switch'
  export default {
    name: 'referrers',
    components: {
      cSwitch
    },

    data (){
      return {
        items: {},
        getItems: {},
        code: {
          popId: []
        },
        isLoad: {
          popId: true
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

      // validation
      valid (){
        return {
          popId: this.items.popId !== null
        }
      }
    },

    created (){
      if (this.$route.query.q === undefined){
        alert('잘못된 접근입니다')
        this.$router.push({ name: 'Referrer 관리' })
      }

      const { referrerId, referrerTypeCode } = JSON.parse(this.$route.query.q);
      this.items = { referrerId, referrerTypeCode, referrerUseYn: true, popId: null };
      this.getItems = JSON.parse(this.$route.query.q);

      // PoP List
      this.$https.get('/pops')
        .then((res) => {
          this.isLoad.popId = false;
          this.code.popId = res.data.items;
        });
    },

    methods: {
      onSubmit (){
        // History
        this.items.modifyHistReason = '등록';

        const validate = this.$valid.all(this.items);
        this.inValidForm = !validate;

        if (validate){
          this.$https.post('/referrers', this.items)
            .then(() => {
              this.$router.push({
                name: 'Referrer 상세',
                params: { id: this.items.referrerId },
                query: { referrerTypeCode: this.items.referrerTypeCode }
              })
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    }
  }
</script>
