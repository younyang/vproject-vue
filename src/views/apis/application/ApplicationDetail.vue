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
            v-model="items.appName"
            type="text"
            placeholder="Enter application name"
            :plaintext="!isEdit"
            required
          ></b-form-input>
        </b-form-fieldset>

        <!-- Service 선택 -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.select"
          :horizontal="true">
          <template slot="label">
            Service 선택<i class="require" v-if="isEdit">*</i>
          </template>

          <multiselect
            v-model="items.serviceCode"
            v-if="isEdit"
            class="multiple"
            :class="{'invalid': !(valid.serviceCode) }"
            track-by="code"
            label="codeName"
            :multiple="true"
            :showLabels="false"
            :options="code.serviceCode"
            :loading="isLoad.serviceCode"
            @select="onSelectType"
            @remove="onRemoveType"
              placeholder="Select service type"
          ></multiselect>


          <div class="badge-list" v-else>
            <span class="badge sm" v-for="item in items.serviceNames">
              {{ item }}
            </span>
          </div>
        </b-form-fieldset>

        <!-- 설명 -->
        <b-form-fieldset
          label="설명"
          :horizontal="true">
          <b-form-textarea
            v-model="items.appDesc"
            :rows="6"
            :plaintext="!isEdit"
          ></b-form-textarea>
        </b-form-fieldset>

        <!-- Key -->
        <b-form-fieldset
          v-if="!isEdit"
          label="Key"
          :horizontal="true">
          <span class="form-text-alone">{{ items.appKey }}</span>
          <b-button variant="in-table" @click="onReissue">재발급</b-button>
        </b-form-fieldset>

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
            v-model="items.appUseYn"
          ></c-switch>
          <span
          v-else
            class="badge"
            :class="{'primary' : items.appUseYn }"
          >{{ items.appUseYn ? '사용' : '미사용' }}
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
        name: 'Application 상세',
        originItems: {},
        items: {
          createId: null,
          appName: null,
          appDesc: null,
          appUseYn: null,
          appKey: null,
          serviceNames: [],
          serviceCode:[],
          appServiceList: [],
          applicationUseYn: true,
          modifyHistReason: '',
        },
        code: {
          serviceCode:[]
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
          serviceCode:true
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
      // validation
      valid (){
        return {
          appName: this.items.appName !== null,
          serviceCode: this.code.serviceCode.length &&
          this.items.serviceCode.length,
          appServiceList: this.items.appServiceList !== null,
          appDesc: this.items.appDesc !== null,
          appUseYn: this.items.appUseYn !== null,
          modifyHistReason: this.items.modifyHistReason != null
        }
      }

    },


    created (){
      // History
      const historyId = this.$route.query.histories;
      const detailUrl = historyId !== undefined ? `/apiManagement/apps/${this.id}/histories/${historyId}` : `/apiManagement/apps/${this.id}`;

      if (historyId){
        document.querySelector('body.app').classList.add('history-mode');
      }

      // Detail Data
      this.$https.get(detailUrl)
        .then((res) => {
          this.items = { ...this.items, ...res.data.items };
          this.items.serviceNames = this.items.serviceNames.split(',');

          const serviceItems = [];
          this.items.appServiceList.forEach( obj => {
            serviceItems.push({
              code : obj.serviceCode,
              codeName : obj.serviceName
            })
          });
          this.items.serviceCode = serviceItems;
          this.originItems = JSON.parse(JSON.stringify(this.items));
        });

        // Service Type Code
        this.$https.get('/system/commonCode', {
            q: { groupCode: 'API_SERVICE' }
          })
          .then((res) => {
            this.isLoad.serviceCode = false;
            this.code.serviceCode = res.data.items;
          });

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
        const validationItems = {
          appName: this.items.appName,
          appServiceList: this.items.appServiceList,
          appUseYn: this.items.appUseYn,
          modifyHistReason: this.items.modifyHistReason
        }
        const validate = this.$valid.all(validationItems);
        this.inValidForm = !validate;
        if (validate){
          this.$https.put(`/apiManagement/apps/${this.id}`, this.items)
            .then(() => {
              this.$router.go(this.$router.currentRoute);
            })
            .catch((error) => {
              console.log(error);
            });

        }
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
        this.$https.delete(`/apiManagement/apps/${this.id}`)
          .then(() => {
            this.$router.push({ name: 'Application 관리' });
          })
          .catch((error) => {
            console.log(error);
          });
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
        this.$https.post(`/apiManagement/apps/${this.id}/key`)
        .then((res) => {
          this.items.appKey = res.data.items;
          this.originItems.appKey = res.data.items
          this.modal = {
            open:false
          }
        })
        .catch((error) => {
          console.log(error);
        })
      },

      validate (submitItems){
      },

      getHistoryLink (rowId){
        return `#/apis/application/${this.id}?histories=${rowId}`
      },

      showHistory () {
        this.isModalHistory = !this.isModalHistory;
        this.$https.get(`/apiManagement/apps/${this.id}/histories`)
          .then((res) => {
            this.history.items = res.data.items;
          });
      },

      onSelectType(item){
        const code = item.code;
        this.items.appServiceList.push({
          serviceCode: code
        });
      },

      onRemoveType(item){
        const code = item.code;
        this.items.appServiceList = this.items.appServiceList.filter(({serviceCode}) => {
          return serviceCode !== code;
        });
      },
    }
  }
</script>
