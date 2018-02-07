<template>
  <div class="animated fadeIn">
    <content-header
      :title="serviceName"
      :name="name">
    </content-header>

    <div class="collapse-title">
      <b-button class="btn-collapse" v-b-toggle.formDefault>
        <i class="fa"></i>
        기본정보
      </b-button>
    </div>

    <b-collapse id="formDefault" visible>
      <b-form class="formView" :validated="inValidForm" novalidate>
        <!-- 사용여부 -->
        <b-form-fieldset
          label="사용여부"
          :horizontal="true">
          <c-switch
            v-if="isEdit"
            type="text"
            class="v-switch"
            on="사용"
            off="미사용"
            v-model="items.ipRestrictUseYn"
          ></c-switch>
          <span
            v-else
            class="badge"
            :class="{'primary' : items.ipRestrictUseYn }"
          >{{ items.ipRestrictUseYn ? '사용' : '미사용' }}
          </span>
        </b-form-fieldset>

        <!-- 제한 IP(공통) -->
        <b-form-fieldset
          v-if="items.ipRestrictUseYn"
          label="제한 IP(공통)"
          :horizontal="true">

          <b-table
            class="sub"
            show-empty
            :items="code.ipRestriction"
            :fields="{
            index: {label: '번호', 'class': 'index'},
            ip: {label: '서버 IP 주소', 'class': 'text-left'}
          }">
            <template slot="index" scope="row">
              {{ row.index + 1 }}
            </template>
          </b-table>
        </b-form-fieldset>

        <!-- 제한 IP(serviceName) -->
        <b-form-fieldset
          v-if="items.ipRestrictUseYn"
          description="※ 공통으로 제한되는 IP 주소는 Policy 메뉴에서 수정할 수 있습니다.<br>
          ※ 사용여부를 ‘미사용’으로 설정하시더라도 공통으로 설정된 IP주소는 제한됩니다."
          :horizontal="true">
          <template slot="label">
            제한 IP<i class="require" v-if="isEdit">*</i><br>
            <small class="form-text">({{ serviceName }})</small>
          </template>

          <b-table
            class="sub"
            show-empty
            :items="items.ipRestrictServiceList"
            :fields="{
            index: {label: '번호', 'class': 'index'},
            ip: {label: '서버 IP 주소', 'class': 'text-left'}
          }"
          >
            <template slot="index" scope="row">
              {{ row.index + 1 }}
            </template>
            <template slot="ip" scope="row">
            <span v-if="isEdit">
              <b-form-input
                v-model="row.item.ip"
                type="text"
                required
              ></b-form-input>
              <span class="ico">
                <button type="button" v-if="row.index === 0" @click="onAddRow"><i class="fa fa-plus-circle"></i></button>
                <button type="button" v-if="row.index > 0" @click="onDelRow(row.index)"><i class="fa fa-times-circle"></i></button>
              </span>
              <div class="invalid-tooltip">{{ $valid.msg.require }}</div>
            </span>
              <span v-else>{{ row.value }}</span>
            </template>
          </b-table>
        </b-form-fieldset>

        <!-- 변경이력 -->
        <b-form-fieldset
          v-if="isEdit"
          label="변경이력<i class='require'>*</i>"
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <b-form-textarea
            v-model="items.modifyHistReason"
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
              :value="items.createDateTime"
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
          <!-- 수정일 -->
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

        <!-- 배포상태 -->
        <b-form-fieldset
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
      <b-button type="button" variant="outline-secondary" v-if="!isCreate" @click="onView">취소</b-button>
      <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
    </div>
    <div class="page-btn" v-else>
      <b-button type="button" variant="outline-secondary" @click="showHistory">이력관리</b-button>
      <b-button
        v-if="isProcessComplete"
        type="button"
        variant="primary"
        @click="onEdit"
      >수정</b-button>
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
          <template slot="histMgmtId" scope="row">
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

      <div slot="modal-footer">
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
        submitItems: {},
        serviceName: '',
        items: {
          ipRestrictUseYn : false,
          ipRestrictServiceList: [{ ip: '' }],
          modifyHistReason: "등록",
          processStateCodeName: null,
          processStateCode: null,
          processId: null
        },
        code: {
          ipRestriction: []
        },
        history: {
          fields: {
            createId: {label: '등록/수정자', 'class': 'text-left'},
            histBeginDateTime: {label: '등록/수정일시'},
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
        isCreate: false,
        isEdit: false,
        isModalHistory: false,

        inValidForm: false
      }
    },

    computed: {
      isProcessComplete (){
        return (this.items.processStateCode !== null &&
        this.items.processStateCode !== '' &&
        this.items.processStateCode === 'PROCESS_STATE_02')
      }
    },

    created (){
      // History
      const historyId = this.$route.query.histories;
      const detailUrl = historyId !== undefined ? `/services/${this.id}/restriction/histories/${historyId}` : `/services/${this.id}/restriction`;

      if (historyId){
        document.querySelector('body.app').classList.add('history-mode')
      }

      // Service Name
      this.$https.get(`/services/${this.id}`)
        .then((res) => {
          this.serviceName = res.data.items.serviceName;
        });


      // Policy > IP Restriction List
      this.$https.get('/policy/ipRestriction')
        .then((res) => {
          this.code.ipRestriction = res.data.items.ipRestrictGlobal;
        });

      // IP Restriction Data
      this.$https.get(detailUrl)
        .then((res) => {
          if (res.data.items === null){
            this.isCreate = true;
            this.isEdit = true;
          }else{
            this.items = res.data.items;
            this.originItems = JSON.parse(JSON.stringify(this.items))
          }
        })
        .catch((error) => {
          console.log(error);
        })
    },

    methods: {
      onEdit (){
        this.isEdit = true;
      },

      onView (){
        this.isEdit = false;
        this.items = JSON.parse(JSON.stringify(this.originItems))
      },

      onAddRow (){
        this.items.ipRestrictServiceList.push({
          ip: ''
        });
      },

      onDelRow (index){
        this.items.ipRestrictServiceList.splice(index, 1);
      },

      onSubmit (){
        const { ipRestrictUseYn, ipRestrictServiceList, modifyHistReason } = this.items;
        const submitItems = { ipRestrictUseYn, ipRestrictServiceList, modifyHistReason };
        const validate = this.$valid.all(submitItems);
        const submitAction = (this.isCreate) ?
          () => this.$https.post(`/services/${this.id}/restriction`, submitItems) :
          () => this.$https.put(`/services/${this.id}/restriction`, submitItems);


        this.inValidForm = !validate;

        if (validate) {
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
        return `#/service/service/${this.id}/ip?histories=${rowId}`
      },

      showHistory () {
        this.isModalHistory = !this.isModalHistory;
        this.$https.get(`/services/${this.id}/restriction/histories`)
          .then((res) => {
            this.history.items = res.data.items;
          });
      }
    }
  }
</script>
