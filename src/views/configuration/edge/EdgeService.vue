<template>
  <div class="animated fadeIn">
    <content-header
      :title="hostName"
      :small="ip"
      :name="name">
    </content-header>

    <div class="collapse-title">
      <b-button
        variant="secondary"
        v-b-toggle.formDefault
        :block="true">
        Service
        <i class="fa fa-angle-down"></i>
      </b-button>
    </div>
    <b-collapse id="formDefault" visible>
      <b-card>
        <!-- Service Type -->
        <b-form-fieldset
          label="Service Type"
          :label-cols="3"
          :horizontal="true">

          <multiselect
            v-if="isEdit"
            v-model="items.serviceIdList"
            :multiple="true"
            :showLabels="false"
            :options="code.serviceIdList"
            label="serviceName"
            :loading="isLoad.serviceIdList"
            track-by="serviceId"
            placeholder="Select service"
          ></multiselect>

          <span
            class="badge badge-success badge-pill"
            v-else
            v-for="obj in items.serviceIdList"
          >{{ obj.serviceName }}</span>
        </b-form-fieldset>

        <!-- 변경이력 -->
        <b-form-fieldset
          v-if="isEdit"
          label="변경이력"
          :label-cols="3"
          :horizontal="true">
          <b-form-textarea
            v-model="items.modifyHistReason"
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
      <b-button type="button" size="sm" variant="primary" @click="onSubmit"><i class="fa fa-dot-circle-o"></i> 저장</b-button>
      <b-button type="button" size="sm" variant="secondary" @click="onView"><i class="fa fa-ban"></i> 취소</b-button>
    </div>
    <div class="page-btn" v-else>
      <b-button type="button" size="sm" variant="outline-primary" @click="showHistory">이력관리</b-button>
      <b-button type="button" size="sm" variant="primary" @click="onEdit"><i class="fa fa-pencil"></i> 수정</b-button>
    </div>

    <!-- History Modal -->
    <b-modal size="lg" title="이력관리" v-model="isModalHistory">
      <section class="board">
        <b-table
          striped
          bordered
          hover
          show-empty
          :items="history.items"
          :fields="history.fields"
        >
          <template slot="histMgmtId" scope="row">
            <a :href="getHistoryLink(row.value)" target="_blank">보기</a>
          </template>
        </b-table>
      </section>

      <div slot="modal-footer">
        <b-button type="button" size="sm" variant="primary" @click="isModalHistory = false"><i class="fa fa-dot-circle-o"></i> 확인</b-button>
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
          items: []
        },
        isLoad: {
          serviceIdList: true
        },
        isEdit: false,
        isModalHistory: false
      }
    },

    computed: {
    },

    created (){
      // History
      const historyId = this.$route.query.histories;
      const detailUrl = historyId !== undefined ? `/edges/${this.id}/services/histories/${historyId}` : `/edges/${this.id}/services`;

      if (historyId){
        document.querySelector('body.app').classList.add('history-mode')
      }

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
        .then((res) => {
          this.items = { ...this.items, ...res.data.items };
          this.originItems = JSON.parse(JSON.stringify(this.items));
        })
        .catch(() => {
          this.isEdit = true;
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

        this.$https.put(`/edges/${this.id}/services`, { serviceId, modifyHistReason })
          .then(() => {
            this.$router.go(this.$router.currentRoute);
          })
          .catch((error) => {
            console.log(error);
          });
      },

      getHistoryLink (rowId){
        return `#/configuration/edge/${this.id}/service?histories=${rowId}`
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
