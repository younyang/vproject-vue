<template>
  <div class="animated fadeIn">
    <b-form>
      <b-card>
        <!-- 구분 -->
        <b-form-fieldset
          label="구분"
          :label-cols="3"
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
          :label-cols="3"
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
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="getItems.componentHostName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- PoP 선택 -->
        <b-form-fieldset
          label="PoP 선택 *"
          :label-cols="3"
          :horizontal="true">
          <multiselect
            v-model="popId"
            :allowEmpty="false"
            :showLabels="false"
            :searchable="false"
            :options="code.popId"
            :loading="isLoad.popId"
            label="popName"
            placeholder="선택"
          ></multiselect>
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
            :pill="true"
            v-model="items.referrerUseYn"
          ></c-switch>
        </b-form-fieldset>

        <div slot="footer" class="form-btn">
          <b-button type="button" size="sm" variant="primary" @click="onSubmit"><i class="fa fa-dot-circle-o"></i> 저장</b-button>
          <b-button type="button" size="sm" variant="secondary" :to="{ name: 'Referrer 관리' }"><i class="fa fa-ban"></i> 취소</b-button>
        </div>
      </b-card>
    </b-form>
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
        }
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

        // POST
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
</script>
