<template>
  <div class="animated fadeIn">
    <b-form>
      <b-card>

        <!-- name -->
        <b-form-fieldset
          label="Bucket Name *"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            v-model="items.name"
            type="text"
            placeholder="Enter Bucket Name"
          ></b-form-input>
        </b-form-fieldset>


        <!-- S3 Bucket Name -->
        <b-form-fieldset
          label="S3 Bucket ID *"
          description="S3 Bucket ID은 실제 서비스 되는 Origin의 bucket ID 로 도메인에 포함되기 때문에 영문, 숫자만 입력 가능합니다."
          :label-cols="3"
          :horizontal="true">
          <b-input-group>
            <b-form-input
              v-model="items.s3BucketId"
              type="text"
              @change="state.bucketAvailable = false"
              placeholder="Enter S3 Bucket ID">
            </b-form-input>
            <b-input-group-button slot="right" class="ml-2">
              <b-button variant="outline-secondary" @click="available">중복확인</b-button>
            </b-input-group-button>
          </b-input-group>
        </b-form-fieldset>


        <!-- Service Type -->
        <b-form-fieldset
          label="Service Type *"
          :label-cols="3"
          :horizontal="true">

          <multiselect
            v-model="serviceTypeCode"
            :multiple="false"
            :showLabels="false"
            :allowEmpty="false"
            :options="code.serviceTypeCode"
            label="codeName"
            :loading="isLoad.serviceTypeCode"
            track-by="code"
            placeholder="Select service type"
          ></multiselect>
        </b-form-fieldset>


        <!-- Description -->
        <b-form-fieldset
          label="Description"
          :label-cols="3"
          :horizontal="true">
          <b-form-textarea
            v-model="items.description"
            type="text"
            :rows="6"
          ></b-form-textarea>
        </b-form-fieldset>

        <!-- Use YN -->
        <b-form-fieldset
          label="사용 여부 *"
          :label-cols="3"
          :horizontal="true">
          <c-switch
            v-model="items.useYn"
            type="icon"
            variant="success"
            v-bind="{on: '\uf00c', off: '\uf00d'}"
            :pill="true"
          ></c-switch>
        </b-form-fieldset>


        <div slot="footer" class="form-btn">
          <b-button type="button" variant="outline-secondary" :to="{ name: 'Bucket 관리' }">취소</b-button>
          <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
        </div>

      </b-card>
    </b-form>


    <!-- Modal Message -->
    <b-modal hide-footer title="Message" size="sm" v-model="isModalMessage"
             :class="state.bucketAvailable ? 'modal-primary' : 'modal-danger'">
      <div class="d-block text-center">
        <h5>{{ modalMessage }}</h5>
      </div>
      <b-btn class="mt-4" :variant="state.bucketAvailable ? 'outline-primary' : 'outline-danger'" block
             @click="isModalMessage = false">Close
      </b-btn>
    </b-modal>

  </div>
</template>

<script>
  import cSwitch from '@/components/Switch'
  import FormSelect from "bootstrap-vue/src/components/form-select/form-select";

  export default {
    name: "bucket",
    components: {
      FormSelect,
      cSwitch
    },

    data: function () {
      return {
        name: 'Bucket 상세',
        items: {
          s3BucketId: null,
          name: null,
          serviceTypeCode: '',
          description: null,
          useYn: false
        },
        code: {
          serviceTypeCode: []
        },
        isLoad: {
          serviceTypeCode: true
        },
        isModalMessage: false,
        modalMessage: '',
        state: {
          bucketAvailable: false
        }
      }
    },

    computed: {
      serviceTypeCode: {
        get() {
          return this.items.serviceTypeCode !== null ? this.code.serviceTypeCode.find(obj => obj.code) : null;
        },
        set(newValue) {
          console.log(newValue);
          this.items.serviceTypeCode = newValue !== null ? newValue.code : null;
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
          this.code.serviceTypeCode = res.data.items.filter(({code, codeName, codeValChar1}) => {
            const number = code.split('_')[2];
            return !(number.length === 4);
          });
          // default service type code 선택
          this.items.serviceTypeCode = this.code.serviceTypeCode[0].code;
        });

    },

    methods: {
      available() {
        if (this.items.s3BucketId == null || this.items.s3BucketId.length < 4) {
          this.modalMessage = "올바르지 않은 Bucket ID 입니다.";
          this.isModalMessage = true;
          return;
        }

        console.log(this.state.bucketAvailable);

        this.$https.get('/origin/bucket', {type: "available",  bucket: this.items.s3BucketId})
          .then((res) => {
            this.state.bucketAvailable = res.data.items;
            this.modalMessage = this.state.bucketAvailable ? '사용하실 수 있습니다.' : 'Bucket ID 가 중복입니다.';
            this.isModalMessage = true;
          });
      },

      onSubmit(){
        // validation 나중에는 공통으로 작업해야 함
        if(!this.state.bucketAvailable){
          this.modalMessage = "S3 Bucket ID 중복체크가 필요합니다.";
          this.isModalMessage = true;
          return;
        }
        if(this.items.name == null || this.items.name.length < 4){
          this.modalMessage = "올바른 항목을 입력하세요.";
          this.isModalMessage = true;
          return;

        }
        if(this.items.serviceTypeCode == null || this.items.serviceTypeCode == ''){
          this.modalMessage = "서비스 타입을 선택하세요";
          this.isModalMessage = true;
          return;
        }

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
</script>
