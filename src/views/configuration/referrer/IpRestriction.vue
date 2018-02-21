<template>
  <div class="animated fadeIn">
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
          :class="{'primary' : items.ipRestrictUseYn }">
          {{ items.ipRestrictUseYn ? '사용' : '미사용' }}
        </span>
      </b-form-fieldset>

      <!-- IP 주소 -->
      <b-form-fieldset
        v-if="items.ipRestrictUseYn"
        description="※ 192.168.0.* 또는 172.16.0.0/12<br>
        ※ 2001:db8::1 또는 2001:db8::/64"
        :horizontal="true">
        <template slot="label">
          IP 주소<i class="require" v-if="isEdit">*</i>
        </template>

        <b-table
          class="sub"
          show-empty
          :items="items.ipRestrictGlobal"
          :fields="{
            index: {label: '번호', 'class': 'index'},
            ip: {label: '서버 IP 주소', 'class': 'text-left'}
          }"
        >
          <template slot="index" slot-scope="row">
            {{ row.index + 1 }}
          </template>
          <template slot="ip" slot-scope="row">
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

      <!-- 변경 이력 -->
      <b-form-fieldset
        v-if="isEdit"
        :invalid-feedback="$valid.msg.require"
        :horizontal="true">
        <template slot="label">
          변경이력 <i class="require" v-if="isEdit">*</i>
        </template>

        <b-form-textarea
          v-model="items.modifyHistReason"
          :rows="6"
          required
        ></b-form-textarea>
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
          <!-- 수정일 -->
          <b-form-fieldset
            v-if="items.modifyDateTime"
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
      <b-button type="button" variant="outline-secondary" @click="onView">취소</b-button>
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
    <b-modal title="Message" size="sm" v-model="modal.open">
      <div class="d-block text-center">
        <p>{{ modal.msg }}</p>
      </div>
      <div slot="modal-footer" class="mx-auto">
        <b-button type="button" variant="primary" @click="modal.action">확인</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import cSwitch from '@/components/Switch'
  export default {
    name: 'policy',
    components: {
      cSwitch
    },

    data (){
      return {
        originItems: {},
        submitItems: {},
        items: {
          ipRestrictUseYn : false,
          ipRestrictGlobal: [{
            ipRestrictId: null,
            ipRestrictGlobalSeq: null,
            ip: null
          }],
          modifyHistReason: null,
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
        isEdit: false,
        isModalHistory: false,
        inValidForm: false,

        modal: {
          open: false,
          msg: '',
          action (){}
        }
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
      const detailUrl = historyId !== undefined ? `/policy/ipRestriction/hist/${historyId}` : `/policy/ipRestriction`;

      if (historyId){
        document.querySelector('body.app').classList.add('history-mode')
      }


      // IP Restriction
      this.$https.get(detailUrl)
        .then((res) => {
          this.items = res.data.items;
          this.originItems = JSON.parse(JSON.stringify(this.items));
        });
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
        this.items.ipRestrictGlobal.push({
          ip: ''
        });
      },

      onDelRow (index){
        this.items.ipRestrictGlobal.splice(index, 1);
      },

      onSubmit (){
        const ipRestrictGlobal = this.items.ipRestrictGlobal.map(({ ip }) => ({ ip }));
        const { ipRestrictUseYn, modifyHistReason } = this.items;
        const items = { ipRestrictUseYn, ipRestrictGlobal, modifyHistReason };
        const validate = this.$valid.all(items);
        this.inValidForm = !validate;

        if (validate){
          this.$https.put('/policy/ipRestriction', items)
            .then(this.onSubmitComplete)
            .catch((error) => {
              console.log(error);
            });
        }
      },

      onSubmitComplete (){
        const router = this.$router;
        this.modal = {
          open: true,
          msg: '수정이 완료되었습니다',
          action (){
            router.go(router.currentRoute);
          }
        };
      },

      getHistoryLink (rowId){
        return `#/configuration/referrers/ipRestriction?histories=${rowId}`
      },

      showHistory () {
        this.isModalHistory = !this.isModalHistory;
        this.$https.get(`/policy/ipRestriction/hist`)
          .then((res) => {
            this.history.items = res.data.items;
          });
      }
    }
  }
</script>
