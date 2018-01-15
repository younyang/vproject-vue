<template>
  <div class="animated fadeIn">
    <content-header
      :title="serviceName"
      :name="name">
    </content-header>

    <div class="collapse-title">
      <b-button
        variant="secondary"
        v-b-toggle.formDefault
        :block="true">
        PoP
        <i class="fa fa-angle-down"></i>
      </b-button>
    </div>
    <b-collapse id="formDefault" visible>
      <b-card>
        <section class="board">
          <b-table
            striped
            bordered
            hover
            show-empty
            :fields="popFields"
            :items="popItems"
          >
          </b-table>
        </section>
      </b-card>
    </b-collapse>

    <!-- 배포이력 -->
    <div class="collapse-title" v-if="false">
      <b-button
        variant="secondary"
        v-b-toggle.history
        :block="true">
        배포이력
        <i class="fa fa-angle-down"></i>
      </b-button>
    </div>
    <b-collapse id="history" visible v-if="false">
      <b-card>
        <!-- 배포일시 -->
        <b-form-fieldset
          label="배포일시"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="deploy.modifyDateTime"
            plaintext
            type="text"
          ></b-form-input>
        </b-form-fieldset>
        <!-- 배포자 -->
        <b-form-fieldset
          label="배포자"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="deploy.modifyId"
            plaintext
            type="text"
          ></b-form-input>
        </b-form-fieldset>
        <!-- 배포상태 -->
        <b-form-fieldset
          label="배포상태"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="deploy.popDeployStateCodeName"
            plaintext
            class="inline"
            type="text"
          ></b-form-input>
          <b-button
            class="btn-in"
            v-if="deploy.popDeployStateCode === 'FAIL'"
            @click="isModalMessage = true"
          >재실행</b-button>
          <b-button class="btn-in" @click="showHistory">이력</b-button>
        </b-form-fieldset>
      </b-card>
    </b-collapse>



    <div class="page-btn">
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Service 관리' }">목록</b-button>
      <b-button type="button" variant="primary" @click="isModalMessage = true" v-if="false">배포</b-button>
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

    <!-- Message Modal -->
    <b-modal title="Message" size="sm" v-model="isModalMessage" class="modal-primary">
      <div class="d-block text-center">
        <h5>PoP 정보를 정말 배포하시겠습니까?</h5>
      </div>
      <div slot="modal-footer">
        <b-button type="button" variant="primary" @click="onSubmit">확인</b-button>
        <b-button type="button" variant="outline-secondary" @click="isModalMessage = false">취소</b-button>
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
        serviceName: '',
        servicePopList: [],
        deploy: {
          modifyDateTime: null,
          modifyId: null,
          popDeployStateCode: null,
          popDeployStateCodeName: null
        },
        isModalMessage: false,
        isModalHistory: false,
        history: {
          fields: {
            modifyId: {label: '배포자', 'class': 'text-left'},
            modifyDateTime: {label: '배포일시'},
            popDeployStateCodeName: {label: '상태'},
            popDeployReason: {label: '배포내용', 'class': 'text-left'}
          },
          items: []
        }
      }
    },

    computed: {
      popItems () {
        return this.servicePopList.length > 0 ?
          this.servicePopList.map(item => {
            item.servicePopTypeList.forEach(({ serviceTypeCodeName, serviceTypeQty }) => {
              item[serviceTypeCodeName] = serviceTypeQty;
            });
            return { ...item }
          }) : [];
      },

      popFields () {
        const fields = {
          popName: {label: 'PoP'},
          edgeQty: {label: 'Edge', 'class': 'text-right'}
        };
        if (this.servicePopList.length > 0){
          const item = this.servicePopList[0];
          item.servicePopTypeList.forEach(({ serviceTypeCodeName }) => {
            fields[serviceTypeCodeName] = {
              label: serviceTypeCodeName,
              'class': 'text-right'
            };
          });
        }
        return fields;
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

      // PoP data
      this.$https.get(`/services/${this.id}/pops`)
        .then((res) => {
          this.servicePopList = res.data.items.servicePopList;
        });

      // PoP deploy data
      this.$https.get(`/services/${this.id}/pops/deploy`)
        .then((res) => {
          this.deploy = res.data.items.servicePopDeployHistory;
        });
    },

    methods: {
      onSubmit () {
        this.$https.post(`/services/${this.id}/pops/deploy`)
          .then(() => {
            this.$router.go(this.$router.currentRoute);
          });
      },

      showHistory () {
        this.isModalHistory = !this.isModalHistory;
        this.$https.get(`/services/${this.id}/pops/deploy/histories`)
          .then((res) => {
            this.history.items = res.data.items;
          });
      }
    }
  }
</script>
