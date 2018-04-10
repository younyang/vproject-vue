<template>
  <div class="animated fadeIn">
    <b-form
      class="formView"
      :validated="inValidForm" novalidate>

      <!-- 삭제주기 -->
      <b-form-fieldset
        :invalid-feedback="$valid.msg.require"
        decription="※ Caching 된 content가 마지막 요청된 날로부터 설정된 기간동안 request가 한번도 발생하지 않을 경우 삭제됩니다."
        :horizontal="true">
        <template slot="label">
          삭제 주기<i v-if="isEdit" class="require">*</i>
        </template>
        <cleave
          v-if="isEdit"
          :value.sync="items.day"
          style="width: 100px;"
          class="form-control"
          :options="{ numeral: true, numeralPositiveOnly: true, numeralDecimalScale: 0 }"
          required
        ></cleave>
        <span
          v-else
        >7</span>
        day
      </b-form-fieldset>


      <!-- 변경이력 -->
      <b-form-fieldset
        v-if="isEdit"
        label="변경이력<i class='require'>*</i>"
        :invalid-feedback="$valid.msg.require"
        :horizontal="true">
        <b-form-textarea
          v-model="items.modifyHistReason"
          required
          :rows="6">
        </b-form-textarea>
      </b-form-fieldset>
    </b-form>

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
      </b-form>
    </b-collapse>

    <div class="page-btn" v-if="isEdit">
      <b-button type="button" variant="outline-secondary" @click="onView">취소</b-button>
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
          <template slot="histMgmtId" slot-scope="row">
            <a :href="getHistoryLink(row.value, row.item.caseSeq)" target="_blank">보기</a>
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
  import cSwitch from '@/components/Switch'
  export default {
    name: 'cacheDeletion',
    props: ['id'],
    components: {
      cSwitch
    },

    data (){
      return {
        originItems: {},
        items: {
          day: 7,
          modifyHistReason: null
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

        isEdit: false,
        isModalHistory: false,

        inValidForm: false
      }
    },

    computed: {
    },

    created (){
    },

    methods: {
      onEdit (){
        this.isEdit = true;
      },

      onView (){
        this.isEdit = false;
        this.items = JSON.parse(JSON.stringify(this.originItems));
      },

      onSubmit (){

      },

      onDelete (){
      },

      onDeleteData (){
      },


      getHistoryLink (rowId, caseSeq){
        return `#/configuration/edges/cache/${this.id}?histories=${rowId}&caseSeq=${caseSeq}`
      },

      showHistory (caseSeq) {
        this.isModalHistory = !this.isModalHistory;
        this.$https.get(`/policy/cacheThrottlings/${this.id}/case/${caseSeq}/histories`)
          .then((res) => {
            this.history.items = res.data.items;
          });
      }
    }
  }
</script>
