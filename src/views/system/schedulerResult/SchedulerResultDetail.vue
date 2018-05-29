<template>
  <div class="animated fadeIn">
    <div class="collapse-title">
        처리내역
    </div>
    <b-form class="formView" :validated="inValidForm" novalidate>
      <!-- Scheduler Name -->
      <b-form-fieldset
        label="Scheduler Name"
        :horizontal="true">
        <b-form-input
          v-model="items.scheduleName"
          type="text"
          plaintext
        ></b-form-input>
      </b-form-fieldset>

      <!-- 처리 결과 -->
      <b-form-fieldset
        label="처리 결과"
        :horizontal="true">
        <span
          class="badge"
          :class="{'primary' : items.successYn }"
        >{{ items.successYn ? '성공' : '실패' }}
        </span>
      </b-form-fieldset>

      <!-- 처리 내역 상세 -->
      <b-form-fieldset
        label="처리 내역 상세"
        :horizontal="true">
        <b-form-textarea
          v-model="items.log"
          :rows="6"
          plaintext
        ></b-form-textarea>
      </b-form-fieldset>

      <!-- 처리 일시 -->
      <b-form-fieldset
        label="처리 일시"
        :horizontal="true">
        <b-form-input
          v-model="items.createDateTime"
          type="text"
          plaintext
        ></b-form-input>
      </b-form-fieldset>
    </b-form>

    <div class="page-btn">
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Scheduler-Result 목록' }">목록</b-button>
    </div>

  </div>
</template>

<script>
  import ContentHeader from '@/components/ContentHeader'
  import cSwitch from '@/components/Switch'
  export default {
    name: 'service',
    props: ['id'],
    components: {
      ContentHeader,
      cSwitch
    },

    data (){
      return {
        name: 'Scheduler - Result',
        items: {
          createId: null,
          scheduleName: null,
          log: null,
          successYn: null
        },
        code: {
        },
        isEdit: false,
        inValidForm: false
      }
    },

    computed: {
    },

    created (){

      const detailUrl = `/system/scheduleLogs/${this.id}`;
      console.log(detailUrl);
      // Detail Data
      this.$https.get(detailUrl)
        .then((res) => {
          this.items = { ...this.items, ...res.data.items };
        });
    },

    methods: {
    }
  }
</script>
