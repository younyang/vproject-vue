<template>
  <div class="animated fadeIn">
    <content-header
      :title="hostName"
      :small="ip"
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
        <!-- Service Type -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.select"
          :horizontal="true">
          <template slot="label">
            Service 선택<i v-if="isEdit" class="require">*</i>
          </template>

          <multiselect
            v-if="isEdit"
            v-model="items.serviceIdList"
            track-by="serviceId"
            label="serviceName"
            :class="{'invalid': !valid.serviceIdList }"
            :multiple="true"
            :showLabels="false"
            :options="code.serviceIdList"
            :loading="isLoad.serviceIdList"
            placeholder="Select service"
          ></multiselect>

          <div class="badge-list" v-else>
            <span class="badge sm" v-for="item in items.serviceIdList">
              {{ item.serviceName }}
            </span>
          </div>
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
            v-if="items.modifyDateTime"
            label="수정일"
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
    name: 'edge',
    props: ['id'],
    components: {
      ContentHeader,
      cSwitch
    },

    data (){
      return {
        name: 'Edge 상세',
        hostName: '',
        ip: '',
        originItems: {},
        items: {
          serviceIdList: [],
          modifyHistReason: null
        },
        code: {
          serviceIdList: []
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
          serviceIdList: true
        },
        isEdit: false,
        isCreate: false,
        isModalHistory: false,

        inValidForm: false
      }
    },

    computed: {
      // validation
      valid (){
        return {
          serviceIdList: this.items.serviceIdList.length
        }
      }
    },

    created (){
      // History
      const historyId = this.$route.query.histories;
      const detailUrl = historyId !== undefined ? `/edges/${this.id}/services/histories/${historyId}` : `/edges/${this.id}/services`;

      if (historyId){
        document.querySelector('body.app').classList.add('history-mode')
      }
      console.log(this.$route)

      // Service List
      this.$https.get('/services', {
          q: { serviceUseYn: true }
        })
        .then((res) => {
          this.isLoad.serviceIdList = false;
          this.code.serviceIdList = res.data.items;
        });
      // Default Data
      this.$https.get(`/edges/${this.id}`)
        .then((res) => {
          const { hostName, ip } = res.data.items;
          this.hostName = hostName;
          this.ip = ip;
        });


      // Detail Data
      this.$https.get(detailUrl)
        .then(res => {
          if (res.data.items === null){
            this.isCreate = true;
            this.isEdit = true;
          }else{
            this.items = { ...this.items, ...res.data.items };
            this.originItems = JSON.parse(JSON.stringify(this.items));
          }
        })
        .catch(error => {
          console.log(error);
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

      onSubmit (){
        const serviceId = this.items.serviceIdList.map(({ serviceId }) => serviceId);
        const { modifyHistReason } = this.items;

        const submitItems = { serviceId, modifyHistReason };
        const validate = this.$valid.all(submitItems);
        const submitAction = (this.isCreate) ?
          () => this.$https.post(`/edges/${this.id}/services`, submitItems) :
          () => this.$https.put(`/edges/${this.id}/services`, submitItems);

        this.inValidForm = !validate;

        if (validate){
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
        return `#/configuration/edges/edge/${this.id}/service?histories=${rowId}`
      },

      showHistory () {
        this.isModalHistory = !this.isModalHistory;
        this.$https.get(`/edges/${this.id}/services/histories`)
          .then((res) => {
            this.history.items = res.data.items;
          });
      }
    }
  }
</script>
