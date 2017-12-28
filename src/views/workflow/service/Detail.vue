<template>
  <div class="animated fadeIn">
    <div class="collapse-title">
      <b-button
        variant="secondary"
        v-b-toggle.formDefault
        :block="true">
        기본정보
        <i class="fa fa-angle-down"></i>
      </b-button>
    </div>
    <b-collapse id="formDefault" visible>
      <b-card>
        <!-- PID -->
        <b-form-fieldset
          label="PID"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="id"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- TID -->
        <b-form-fieldset
          label="TID"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.taskIds"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- Process -->
        <b-form-fieldset
          label="Process"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.processSectionCodeName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- 상태 -->
        <b-form-fieldset
          label="상태"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.processStateCodeName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- 시작 -->
        <b-form-fieldset
          label="시작"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.processBeginDatetime"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- 종료 -->
        <b-form-fieldset
          label="종료"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.processEndDatetime"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>
      </b-card>
    </b-collapse>

    <!-- 상세 -->
    <div class="collapse-title">
      <b-button
        variant="secondary"
        v-b-toggle.detail
        :block="true">
        상세
        <i class="fa fa-angle-down"></i>
      </b-button>
    </div>
    <b-collapse id="detail" visible>
      <pre>{{ detailItems }}</pre>
    </b-collapse>

    <div class="page-btn" v-if="isEdit">
      <b-button type="button" size="sm" variant="primary" @click="onSubmit"><i class="fa fa-dot-circle-o"></i> 저장</b-button>
      <b-button type="button" size="sm" variant="secondary" @click="onView"><i class="fa fa-ban"></i> 취소</b-button>
    </div>
    <div class="page-btn" v-else>
      <b-button type="button" size="sm" variant="danger" class="float-left" @click="onDelete"><i class="fa fa-times"></i> 삭제</b-button>
      <b-button type="button" size="sm" variant="primary" @click="onEdit"><i class="fa fa-pencil"></i> 수정</b-button>
      <b-button type="button" size="sm" variant="secondary" :to="{ name: 'Referrer 관리' }"><i class="fa fa-list"></i> 목록</b-button>
    </div>
  </div>
</template>

<script>
  import cSwitch from '@/components/Switch'
  export default {
    name: 'serviceProcessing',
    props: ['id'],
    components: {
      cSwitch
    },

    data (){
      return {
        name: 'Service Processing 상세',
        originItems: {},
        items: {
          processId : null,
          taskIds : null,
          processSectionCodeName : null,
          processStateCodeName : null,
          processBeginDatetime: null,
          processEndDatetime: null
        },
        detailItems: {},
        isEdit: false
      }
    },

    computed: {
    },

    created (){
      // Detail Data
      this.$https.get(`/serviceprocess/${this.id}`)
        .then((res) => {
          this.items = { ...this.items, ...res.data.items };
          this.originItems = JSON.parse(JSON.stringify(this.items));

          this.fetchDetail();
        });
    },

    methods: {
      fetchDetail (){
        this.$https.get(`/serviceprocess/${this.id}/tasks/${this.items.taskIds}/activities`)
          .then((res) => {
            this.detailItems = { ...res.data.items };
          });
      },

      onEdit (){
        this.isEdit = true;
      },

      onView (){
        this.isEdit = false;
        this.items = JSON.parse(JSON.stringify(this.originItems));
      },

      onSubmit (){
        const { referrerId, popId, referrerUseYn, referrerTypeCode, modifyHistReason } = this.items;

        this.$https.put(`/referrers/${this.id}`, { referrerId, popId, referrerUseYn, referrerTypeCode, modifyHistReason })
          .then(() => {
            this.$router.go(this.$router.currentRoute);
          })
          .catch((error) => {
            console.log(error);
          });
      },

      onDelete (){
        this.modalMessage = '정말 삭제하시겠습니까?';
        this.isModalMessage = true;
      },

      onDeleteData (){
        this.$https.delete(`/referrers/${this.id}?referrerTypeCode=${this.referrerTypeCode}`)
          .then(() => {
            this.$router.push({ name: 'Referrer 관리' });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }
</script>
