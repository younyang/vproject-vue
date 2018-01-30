<template>
  <div class="animated fadeIn">
    <b-form class="formView" :validated="inValidForm" novalidate>
      <!-- name -->
      <b-form-fieldset
        label="Bucket Name <i class='require'>*</i>"
        :invalid-feedback="$valid.msg.require"
        :horizontal="true">
        <b-form-input
          v-model="items.name"
          type="text"
          required
          placeholder="Enter Bucket Name"
        ></b-form-input>
      </b-form-fieldset>


      <!-- S3 Bucket Name -->
      <b-form-fieldset
        label="S3 Bucket ID<i class='require'>*</i>"
        :invalid-feedback="feedback.s3BucketId"
        description="S3 Bucket ID은 실제 서비스 되는 Origin의 bucket ID 로 도메인에 포함되기 때문에 영문, 숫자만 입력 가능합니다."
        :horizontal="true">

        <b-form-input
          v-model="items.s3BucketId"
          type="text"
          placeholder="Enter S3 Bucket Id"
          :state="valid.s3BucketId"
          @input="s3BucketIdExists = null"
          required
        ></b-form-input>
        <b-button variant="in-table" @click="available">중복확인</b-button>
        <span class="ico ml-2 mid" v-if="s3BucketIdExists !== null">
          <i v-if="s3BucketIdExists === 'success'" class="fa fa-check-circle"></i>
          <i v-if="s3BucketIdExists === 'fail'" class="fa fa-times-circle"></i>
        </span>
      </b-form-fieldset>


      <!-- Service Type -->
      <b-form-fieldset
        label="Service Type<i class='require'>*</i>"
        :invalid-feedback="$valid.msg.select"
        :horizontal="true">

        <multiselect
          v-model="serviceTypeCode"
          :class="{'invalid': !valid.serviceTypeCode }"
          track-by="code"
          label="codeName"
          :showLabels="false"
          :options="code.serviceTypeCode"
          :loading="isLoad.serviceTypeCode"
          placeholder="Select service type"
        ></multiselect>

      </b-form-fieldset>


      <!-- Description -->
      <b-form-fieldset
        label="Description"
        :horizontal="true">
        <b-form-textarea
          v-model="items.description"
          type="text"
          :rows="6"
        ></b-form-textarea>
      </b-form-fieldset>

      <!-- Use YN -->
      <b-form-fieldset
        label="사용 여부<i class='require'>*</i>"
        :horizontal="true">
        <c-switch
          type="text"
          class="v-switch"
          on="사용"
          off="미사용"
          v-model="items.useYn"
        ></c-switch>
      </b-form-fieldset>
    </b-form>

    <div class="page-btn">
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Bucket 관리' }">취소</b-button>
      <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
    </div>

  </div>
</template>

<script>
  import cSwitch from '@/components/Switch'

  export default {
    name: "bucket",
    components: {
      cSwitch
    },

    data: function () {
      return {
        items: {
          s3BucketId: '',
          name: null,
          serviceTypeCode: null,
          description: null,
          useYn: false
        },
        code: {
          serviceTypeCode: []
        },
        isLoad: {
          serviceTypeCode: true
        },

        s3BucketIdExists: null,
        inValidForm: false
      }
    },

    computed: {
      serviceTypeCode: {
        get () {
          return this.items.serviceTypeCode !== null ? this.code.serviceTypeCode.find(obj => obj.code) : null;
        },
        set (newValue) {
          this.items.serviceTypeCode = newValue !== null ? newValue.code : null;
        }
      },

      // validation
      valid (){
        return {
          s3BucketId: (this.s3BucketIdExists === null && this.items.s3BucketId.length === 0) ?
            this.s3BucketIdExists :
            (this.items.s3BucketId.length > 0 &&
            /^[A-Za-z0-9\-]*$/.test(this.items.s3BucketId) &&
            this.s3BucketIdExists === 'success'),
          serviceTypeCode: this.items.serviceTypeCode !== null
        }
      },

      // validation feedback
      feedback (){
        return {
          s3BucketId: (!(/^[A-Za-z0-9\-]*$/.test(this.items.s3BucketId)) && this.items.s3BucketId.length > 0) ?
            '영문, 숫자, "-" 만 입력하십시오.'
            : (this.s3BucketIdExists === null && this.items.s3BucketId.length > 0) ?
            '중복확인은 필수입니다.'
            : (this.s3BucketIdExists === 'not') ?
            '입력된 항목이 없습니다.'
            : (this.s3BucketIdExists === 'fail') ?
            '이미 등록된 S3 BucketId가 있습니다.'
            : this.items.s3BucketId.length === 0 ?
            this.$valid.msg.require : ''
        }
      }
    },

    created() {
      // Service Type Code
      this.$https.get('/system/commonCode', {
          q: {groupCode: 'SERVICE_TYPE'}
        })
        .then((res) => {
          this.isLoad.serviceTypeCode = false;
          this.code.serviceTypeCode = res.data.items.filter(({code}) => {
            const codeSplit = code.split('_')[2];
            return !(codeSplit.length === 4);
          });
        });
    },

    methods: {
      available() {
        if (!this.items.s3BucketId){
          this.s3BucketIdExists = 'not';
          return;
        }
        this.$https.get('/origin/bucket', {
          type: 'available',
          bucket: this.items.s3BucketId
        })
        .then((res) => {
          this.s3BucketIdExists = res.data.items ? 'success' : 'fail';
        });
      },

      onSubmit(){
        const validate = (this.$valid.all(this.items) && this.s3BucketIdExists === 'success');
        this.inValidForm = !validate;

        if (validate){
          this.$https.post('/origin/bucket', this.items)
            .then((res) => {
              this.$router.push({ name: 'Bucket 상세', params: { id: res.data.items.bucketId }})
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    }
  }
</script>
