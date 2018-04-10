<template>
  <div class="animated fadeIn">
    <div class="collapse-title">
      <b-button class="btn-collapse" v-b-toggle.formDefault>
        <i class="fa"></i>
        기본정보
      </b-button>
    </div>

    <b-collapse id="formDefault" visible>
      <b-form class="formView" :validated="inValidForm" novalidate>
        <!-- ID -->
        <b-form-fieldset
          v-if="!isEdit"
          label="ID"
          :horizontal="true">
          <b-form-input
            type="text"
            :value="id"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- Application Name -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <template slot="label">
            Application Name<i class="require" v-if="isEdit">*</i>
          </template>

          <b-form-input
            v-model="items.applicationName"
            type="text"
            placeholder="Enter application name"
            :plaintext="!isEdit"
            required
          ></b-form-input>
        </b-form-fieldset>

        <!-- Service 선택 -->
        <b-form-fieldset
          :horizontal="true">
          <template slot="label">
            Service 선택<i class="require" v-if="isEdit">*</i>
          </template>

          <multiselect
            v-if="isEdit"
            class="multiple"
            :class="{'invalid': !(items.service.length) }"
            track-by="code"
            label="codeName"
            :multiple="true"
            :showLabels="false"
            :options="[{ code: 1, codeName: 'Edge'}, { code: 2, codeName: 'Low Referrer'}]"
          ></multiselect>


          <div class="badge-list" v-else>
            <span class="badge sm" v-for="item in ['Edge','Low Referrer']">
              {{ item }}
            </span>
          </div>
        </b-form-fieldset>

        <!-- 설명 -->
        <b-form-fieldset
          label="설명"
          :horizontal="true">
          <b-form-textarea
            v-model="items.description"
            :rows="6"
            :plaintext="!isEdit"
          ></b-form-textarea>
        </b-form-fieldset>

        <!-- Key -->
        <b-form-fieldset
          v-if="!isEdit"
          label="Key"
          :horizontal="true">
          <span class="form-text-alone">{{ items.key }}</span>
          <b-button variant="in-table" @click="onReissue">재발급</b-button>
        </b-form-fieldset>

        <!-- 사용여부 -->
        <b-form-fieldset
          label="사용여부"
          :horizontal="true">
          <span
            class="badge"
            :class="{'primary' : items.applicationUseYn }"
          >{{ items.applicationUseYn ? '사용' : '미사용' }}
          </span>
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
      </b-form>
    </b-collapse>

    <div class="page-btn" v-if="isEdit">
      <b-button type="button" variant="outline-secondary" @click="onView">취소</b-button>
      <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
    </div>
    <div class="page-btn" v-else>
      <b-button type="button" variant="outline-secondary" class="float-left" @click="onDelete">삭제</b-button>
      <b-button type="button" variant="outline-secondary" @click="showHistory">이력관리</b-button>
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Application 관리' }">목록</b-button>
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

    <!-- Message Alert Modal -->
    <b-modal title="Message" size="sm" v-model="modal.open" :class="`modal-${modal.type}`">
      <div class="d-block text-center">
        <p>{{ modal.msg }}</p>
      </div>
      <div slot="modal-footer" class="mx-auto">
        <b-button type="button" variant="primary" @click="modal.action">확인</b-button>
        <b-button type="button" variant="outline-secondary" @click="modal.open = false">취소</b-button>
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
        originItems: {},
        items: {
          applicationName: 'test',
          service: [],
          description: 'test',
          key: '5476e51b-0be2-4d7b-ba45-6ece068364ts',
          applicationUseYn: true,
          modifyHistReason: '',
        },
        code: {
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

        isLoad: {
        },

        isEdit: false,
        isModalHistory: false,

        modal: {
          open: false,
          type: 'done',
          msg: '',
          action (){}
        },

        inValidForm: false
      }
    },

    computed: {
    },


    created (){
      // History
      const historyId = this.$route.query.histories;
      this.detailUrl = historyId !== undefined ? `/services/${this.id}/histories/${historyId}` : `/services/${this.id}`;

      if (historyId){
        document.querySelector('body.app').classList.add('history-mode');
      }
    },

    methods: {
      fetchDetail (res){
      },

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
        this.modal = {
          open: true,
          type: 'error',
          msg: '정말로 삭제하시겠습니까?',
          action: this.onDeleteData
        };
      },

      onDeleteData (){
      },

      onReissue (){
        this.modal = {
          open: true,
          type: 'error',
          msg: '키를 재발급하면 기존 키로는 서비스를 사용할 수 없습니다.\n재발급 하시겠습니까?',
          action: this.onReissueData
        };
      },

      onReissueData (){

      },

      validate (submitItems){
      },

      getHistoryLink (rowId){
        return `#/service/service/${this.id}?histories=${rowId}`
      },

      showHistory () {
        this.isModalHistory = !this.isModalHistory;
      }
    }
  }
</script>
