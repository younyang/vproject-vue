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
        <!-- Bucket Id -->
        <b-form-fieldset
          label="ID"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="id"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- S3 Bucket Id-->
        <b-form-fieldset
          label="S3 Bucket"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.s3BucketId"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- name -->
        <b-form-fieldset
          label="Bucket Name"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            v-if="isEdit"
            v-model="items.name"
            type="text"
          ></b-form-input>
          <b-form-input
            v-else
            :value="items.name"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- Service Type -->
        <b-form-fieldset
          label="Service Type"
          :label-cols="3"
          :horizontal="true">
          <span class="badge badge-success badge-pill">
            {{ items.serviceTypeName }}
          </span>
        </b-form-fieldset>

        <!-- Description -->
        <b-form-fieldset
          label="Description"
          :label-cols="3"
          :horizontal="true">
          <b-form-textarea
            v-if="isEdit"
            v-model="items.description"
            :rows="6"
          ></b-form-textarea>
          <b-form-textarea
            v-else
            :value="items.description"
            :rows="6"
          ></b-form-textarea>
        </b-form-fieldset>

        <!-- 사용여부 -->
        <b-form-fieldset
          label="사용여부"
          :label-cols="3"
          :horizontal="true">
          <c-switch
            v-if="isEdit"
            type="icon"
            variant="success"
            v-bind="{on: '\uf00c', off: '\uf00d'}"
            :pill="true"
            v-model="items.useYn"
          ></c-switch>
          <b-badge
            v-else
            pill
            :variant="items.useYn ? 'success' : 'secondary'">
            {{ items.useYn ? '사용' : '미사용' }}
          </b-badge>
        </b-form-fieldset>


        <!-- 변경이력 -->
        <b-form-fieldset
          v-if="isEdit"
          label="변경이력"
          :label-cols="3"
          :horizontal="true">
          <b-form-textarea
            v-model="items.reason"
            :rows="6">
          </b-form-textarea>
        </b-form-fieldset>

      </b-card>
    </b-collapse>


    <!-- 처리이력 -->
    <div class="collapse-title" v-if="!isEdit">
      <b-button
        variant="secondary"
        v-b-toggle.history
        :block="true">
        처리이력
        <i class="fa fa-angle-down"></i>
      </b-button>
    </div>
    <b-collapse id="history" v-if="!isEdit">
      <b-card>
        <!-- 등록일 -->
        <b-form-fieldset
          label="등록일"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.createDateTime"
            plaintext
            type="text"></b-form-input>
        </b-form-fieldset>
        <!-- 등록자 -->
        <b-form-fieldset
          label="등록자"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.createId"
            plaintext
            type="text"></b-form-input>
        </b-form-fieldset>
        <!-- 수정일 -->
        <b-form-fieldset
          v-if="items.modifyDateTime"
          label="수정일"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.modifyDateTime"
            plaintext
            type="text"></b-form-input>
        </b-form-fieldset>
        <!-- 수정자 -->
        <b-form-fieldset
          v-if="items.modifyDateTime"
          label="수정자"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.modifyId"
            plaintext
            type="text"></b-form-input>
        </b-form-fieldset>
      </b-card>
    </b-collapse>


    <div class="page-btn" v-if="isEdit">
      <b-button type="button" variant="outline-secondary" @click="onView">취소</b-button>
      <b-button type="button" variant="primary">저장</b-button>
    </div>
    <div class="page-btn" v-else>
      <b-button type="button" variant="outline-secondary" class="float-left" @click="onDelete">삭제</b-button>
      <b-button type="button" variant="outline-secondary" @click="showHistory">이력관리</b-button>
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Bucket 관리' }">목록</b-button>
      <b-button type="button" variant="primary" @click="onEdit">수정</b-button>
    </div>

  </div>
</template>

<script>
  import cSwitch from '@/components/Switch'

  export default {
    name: "detail",
    props: ["id"],
    components: {
      cSwitch
    },

    data (){
      return {
        name: 'Bucket 상세',
        originItems: {},
        items: {
          bucketId: null,
          s3BucketId: null,
          name: null,
          description: null,
          serviceTypeCode: null,
          serviceTypeName: null,
          useYn: null,
          createDatetime: null,
          modifyDateTime: null,
          reason: null
        },
        history: {
          fields: {
            createId: {label: '등록/수정자', 'class': 'text-left'},
            histBeginDateTime: {label: '등록/수정일시'},
            modifyHistReason: {label: '변경이력', 'class': 'text-left'},
            histMgmtId: {label: '보기'}
          },
          items: []
        },
        isLoad: {
          serviceTypeCode: true
        },
        isEdit: false,
        isModalHistory: false,
        isModalMessage: false,
        modalMessage: '',
        isModalService: false,
        isServiceAdd: true,
        modalService: {
          serviceTypeCode: [],
          history: ''
        }
      }
    },

    computed: {

    },

    created (){
      // History
      // const historyId = this.$route.query.histories;
      const detailUrl = `/origin/bucket/${this.id}`;
      //
      // if (historyId){
      //   document.querySelector('body.app').classList.add('history-mode')
      // }

      // Detail Data
      this.$https.get(detailUrl, {history:true, policy:true})
        .then((res) => {
          this.items = { ...this.items, ...res.data.items };
          this.originItems = JSON.parse(JSON.stringify(this.items));
          this.history.items = JSON.parse(JSON.stringify(res.data.items.histories));
        });
    },

    methods: {
      onEdit (){
        this.isEdit = true;
      },

      onView (){
        this.isEdit = false;
        this.items = JSON.parse(JSON.stringify(this.originItems));
      },

      onDelete(){

      },
      showHistory(){

      }
    }


  }
</script>

<style scoped>

</style>
