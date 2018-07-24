<template>
  <div class="animated fadeIn">
    <content-header
      :title="serviceName"
      :name="name">
    </content-header>

    <div class="collapse-title">
      <b-button class="btn-collapse" v-b-toggle.formDefault>
        <i class="fa"></i>
        Origin
      </b-button>
    </div>

    <b-collapse id="formDefault" visible>
      <b-form class="formView" :validated="inValidForm" novalidate>

        <b-form-fieldset
          label="Service Type"
          :horizontal="true">
          <b-form-input
            :value="items.serviceTypeName"
            type="text"
            plaintext
          ></b-form-input>
       </b-form-fieldset>

        <div class="form-row">
          <!-- NAS IP 주소 -->
          <b-form-fieldset
           :invalid-feedback="$valid.msg.require"
           :horizontal="true">
           <template slot="label">
             NAS IP 주소
             <i v-if="isEdit" class="require">*</i>
           </template>
            <b-form-input
              v-if="!isEdit"
              :value="items.nasServerIp"
              type="text"
              plaintext
            ></b-form-input>

            <b-form-input
              v-if="isEdit"
              v-model="tempItems.nasServerIp"
              type="text"
              required
            ></b-form-input>

         </b-form-fieldset>

        <!-- 클라이언트 마운트 경로 -->
          <b-form-fieldset
            :invalid-feedback="$valid.msg.require"
            :horizontal="true">
            <template slot="label">
              클라이언트마운트경로
              <i v-if="isEdit" class="require">*</i>
            </template>

            <b-form-input
              v-if="!isEdit"
              :value="items.clientServiceNasMountPath"
              plaintext
              type="text"
            ></b-form-input>

            <b-form-input
              v-if="isEdit"
              v-model="tempItems.clientServiceNasMountPath"
              type="text"
              required
            ></b-form-input>

          </b-form-fieldset>
       </div>

       <div class="form-row">
       <!-- NAS Mount Path -->
         <b-form-fieldset
           :invalid-feedback="$valid.msg.require"
           :horizontal="true">
           <template slot="label">
             NAS Mount Path
             <i v-if="isEdit" class="require">*</i>
           </template>
           <b-form-input
             v-if="!isEdit"
             :value="items.serviceNasMountPath"
             type="text"
             plaintext
           ></b-form-input>

           <b-form-input
             v-if="isEdit"
             v-model="tempItems.serviceNasMountPath"
             type="text"
             required
           ></b-form-input>

        </b-form-fieldset>

       <!-- NAS Mount Auth Key -->
         <b-form-fieldset
           :invalid-feedback="$valid.msg.require"
           :horizontal="true">
           <template slot="label">
            NAS Mount Auth Key
             <i v-if="isEdit" class="require">*</i>
           </template>

           <b-form-input
             v-if="!isEdit"
             :value="items.serviceNasMountAuthKey"
             plaintext
             type="text"
           ></b-form-input>

           <b-form-input
             v-if="isEdit"
             v-model="tempItems.serviceNasMountAuthKey"
             type="text"
             required
           ></b-form-input>

         </b-form-fieldset>

      </div>

      <!-- 변경이력 -->
      <b-form-fieldset
        v-if="isHistReasonEdit"
        label="변경이력<i class='require'>*</i>"
        :invalid-feedback="$valid.msg.require"
        :horizontal="true">
        <b-form-textarea
          v-model="tempItems.modifyHistReason"
          :rows="6"
          required
        ></b-form-textarea>
      </b-form-fieldset>

      </b-form>
    </b-collapse>
    <!-- 처리이력 -->
    <div class="collapse-title" v-if="!isEdit">
      <b-button class="btn-collapse" v-b-toggle.formHistory>
        <i class="fa"></i>
        처리이력
      </b-button>
    </div>
    <b-collapse id="formHistory" visible v-if="!isEdit">
      <b-form class="formView">
        <div class="form-row">
          <!-- 등록일 -->
          <b-form-fieldset
            label="등록일시"
            :horizontal="true">
            <b-form-input
              :value="items.createDatetime"
              plaintext
              type="text"
            ></b-form-input>
          </b-form-fieldset>
          <!-- 등록자 -->
          <b-form-fieldset
            label="등록자"
            :horizontal="true">
            <b-form-input
              :value="items.createId"
              plaintext
              type="text"
            ></b-form-input>
          </b-form-fieldset>
        </div>

        <div class="form-row">
          <!-- 수정일시 -->
          <b-form-fieldset
            label="수정일시"
            :horizontal="true">
            <b-form-input
              :value="items.modifyDateTime"
              plaintext
              type="text"
            ></b-form-input>
          </b-form-fieldset>
          <!-- 수정자 -->
          <b-form-fieldset
            label="수정자"
            :horizontal="true">
            <b-form-input
              :value="items.modifyId"
              plaintext
              type="text"
            ></b-form-input>
          </b-form-fieldset>
        </div>

        <b-form-fieldset
          v-if="items.processId !== null"
          label="배포상태"
          :horizontal="true">
          <input
            type="text"
            readonly="readonly"
            class="form-control-plaintext"
            style="width:50px"
            :value="items.processStateCodeName"
          >
          <a :href="`#/workflow/service/${ items.processId }`" class="btn btn-in-table" target="_blank">{{ items.processId }}</a>
        </b-form-fieldset>
      </b-form>
    </b-collapse>

    <div class="page-btn" v-if="isEdit">
      <b-button type="button" variant="outline-secondary" v-if="!isCreate"  @click="onView">취소</b-button>
      <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
    </div>
    <div class="page-btn" v-else>
      <b-button type="button" variant="outline-secondary" @click="showHistory">이력관리</b-button>
      <b-button type="button" variant="primary" @click="onEdit">수정</b-button>
    </div>

    <!-- History Modal -->
    <b-modal size="lg" title="이력관리" v-model="isModalHistory">
      <section class="board">
        <b-table
          hover
          show-empty
          :items="history.items"
          :fields="history.fields"
          :current-page="history.pageInfo.page"
          :per-page="history.pageInfo.size"
        >
          <template slot="modifyHistReason" slot-scope="row">
            {{(row.value) ? row.value : "-"}}
          </template>
          <template slot="histMgmtId" slot-scope="row">
            <a :href="getHistoryLink(row.value)" target="_blank">보기</a>
          </template>
        </b-table>
      </section>

      <b-pagination
        v-model="history.pageInfo.page"
        :total-rows="history.pageInfo.totalCount"
        :per-page="history.pageInfo.size"
        class="mt-2"
      ></b-pagination>
      <div slot="modal-footer" class="mx-auto">
        <b-button type="button" variant="primary" @click="isModalHistory = false">확인</b-button>
      </div>
    </b-modal>
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
        name: 'Service 상세',
        originItems: {},
        tempItems: {},
        serviceName:'',
        items: {
          serviceNasMountAuthKey: null,
          serviceNasMountPath: null,
          clientServiceNasMountPath: null,
          nasServerIp: null,
          serviceTypeId: null,
          modifyHistReason: null,
          serviceTypeName: null,
          processStateCode: null,
          processId: null
        },

        code: {
          originSectionCode: [],
          bucket: {}
        },
        history: {
          fields: {
            createId: {label: '등록/수정자'},
            createDatetime: {label: '등록/수정일시'},
            modifyHistReason: {label: '변경이력', 'class': 'text-left'},
            histMgmtId: {label: '보기'}
          },
          items: [],
          pageInfo: {
            page: 1,
            size: 10,
            totalCount: 1
          }
        },
        isLoad: {
          originSectionCode: true,
          originBucketId: true
        },
        isCreate: false,
        isEdit: false,
        isTypeNameShow:true,
        isModalHistory: false,
        isHistReasonEdit: false,
        inValidForm: false
      }
    },

    computed: {
       isProcessComplete (){
         return this.items.processId === null || (this.items.processStateCode !== null &&
         this.items.processStateCode !== '' &&
         this.items.processStateCode === 'PROCESS_STATE_02')
       }
    },

    created (){
      // History
      const historyId = this.$route.query.histories;
      const detailUrl = historyId !== undefined ? `/services/${this.id}/origins/histories/${historyId}` : `/services/${this.id}/origins`;

      if (historyId){
        document.querySelector('body.app').classList.add('history-mode')
      }

      // serviceTypeName 정보를 가져온다
      this.$https.get(`/services/${this.id}`)
        .then((res) => {
         this.items.serviceTypeName = res.data.items.serviceTypeName;
      });

      //origin 정보를 가져온다.
      this.$https.get(detailUrl)
        .then((res) => {
          if (res.data.items === null){
            this.isCreate = true;
            this.isEdit = true;
            this.tempItems = this.items;
          }else{
            this.items = res.data.items;
            this.originItems = JSON.parse(JSON.stringify(this.items));
          }
        });
    },

    methods: {

      onEdit (){
        this.isEdit = true;
        this.isHistReasonEdit = true;
        this.tempItems = JSON.parse(JSON.stringify(this.originItems));
      },

      onView (){
        this.isEdit = false;
        this.isHistReasonEdit = false;
        this.tempItems = {};
        this.items = JSON.parse(JSON.stringify(this.originItems));
      },

      validate (submitItems){
        const {
           serviceNasMountAuthKey,
           serviceNasMountPath,
           clientServiceNasMountPath,
           nasServerIp,
           modifyHistReason,
       } = submitItems;

        let validateItems = {serviceNasMountAuthKey,serviceNasMountPath,clientServiceNasMountPath,nasServerIp};
        if(this.isCreate === false){
            validateItems = {...validateItems, modifyHistReason };
        }
        const validate = this.$valid.all(validateItems);
        this.inValidForm = !validate;
        return validate;
      },

      onSubmit (){
        const submitItems = {
          ...this.tempItems
        };
        const submitAction = (this.isCreate) ?
          () => this.$https.post(`/services/${this.id}/origins`, submitItems) :
          () => this.$https.put(`/services/${this.id}/origins/${submitItems.serviceTypeId}`, submitItems);

        if (this.validate(submitItems)) {
          submitAction()
            .then(() => {
              this.$router.go(this.$router.currentRoute);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      },

      getHistoryLink (rowId){
        return `#/service/service/${this.id}/origin?histories=${rowId}`
      },

      showHistory () {
        this.isModalHistory = !this.isModalHistory;
        this.$https.get(`/services/${this.id}/origins/histories`)
          .then((res) => {
            this.history.items = res.data.items;
          });
      }
    }
  }
</script>
