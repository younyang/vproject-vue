<template>
  <div class="animated fadeIn">
    <content-header
      :title="items.hostName"
      :small="items.ip"
      :name="name">
    </content-header>

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
        <!-- ID -->
        <b-form-fieldset
          label="Edge ID"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            v-model="items.edgeId"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- IP -->
        <b-form-fieldset
          label="IP"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            v-model="items.ip"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- Host Name -->
        <b-form-fieldset
          label="Host Name"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.hostName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- PoP 선택 -->
        <b-form-fieldset
          label="PoP 선택 *"
          :label-cols="3"
          :horizontal="true">
          <multiselect
            v-if="isEdit"
            v-model="popId"
            :allowEmpty="false"
            :showLabels="false"
            :searchable="false"
            :options="code.popId"
            :loading="isLoad.popId"
            label="popName"
            placeholder="선택"
          ></multiselect>
          <b-form-input
            v-else
            :value="items.popName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- 구분 -->
        <b-form-fieldset
          label="구분"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.edgeRelayName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- Service Type -->
        <b-form-fieldset
          label="Service Type"
          :label-cols="3"
          :horizontal="true">

          <span class="badge badge-success badge-pill" v-for="obj in serviceTypeCode">
            {{ obj.codeName }}
          </span>
          <b-button
            v-if="!isEdit"
            class="only-icon"
            @click="isModalService = !isModalService"
            variant="link">
            <i class="fa fa-pencil" ></i>
          </b-button>
        </b-form-fieldset>

        <!-- Domain -->
        <b-form-fieldset
          label="Domain"
          :label-cols="3"
          :horizontal="true">

          <ul class="icons-list edge">
            <li v-for="(type, index) in serviceDomainList">
              <i class="bg-primary">{{ type }}</i>
              <div class="desc">
                <div class="title">
                  http(s)://<strong class="text-danger">{{ items.edgeDomainName }}</strong>.[city].[country].[service type].[service name].vessels.com
                </div>
              </div>
            </li>
          </ul>
        </b-form-fieldset>

        <!-- 사용여부 -->
        <b-form-fieldset
          label="사용여부"
          :label-cols="3"
          description="※ 미사용 선택 시, DNS(GTM) 설정 정보가 삭제됩니다."
          :horizontal="true">
          <c-switch
            v-if="isEdit"
            type="icon"
            variant="success"
            v-bind="{on: '\uf00c', off: '\uf00d'}"
            :pill="true"
            v-model="items.edgeUseYn"
          ></c-switch>
          <b-badge
            v-else
            pill
            :variant="items.edgeUseYn ? 'success' : 'secondary'">
            {{ items.edgeUseYn ? '사용' : '미사용' }}
          </b-badge>
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
        <!-- 배포상태
        <b-form-fieldset
          label="배포상태"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="deploy.status ? '성공' : '실패'"
            style="width:30px"
            plaintext
            type="text"></b-form-input>
          (<a href="#">{{ deploy.count }}</a>)
        </b-form-fieldset>
        -->

      </b-card>
    </b-collapse>

    <div class="page-btn" v-if="isEdit">
      <b-button type="button" variant="outline-secondary" @click="onView">취소</b-button>
      <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
    </div>

    <div class="page-btn" v-else>
      <b-button type="button" variant="outline-secondary" class="float-left" @click="onDelete">삭제</b-button>
      <b-button type="button" variant="outline-secondary" @click="showHistory">이력관리</b-button>
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Edge 관리' }">목록</b-button>
      <b-button type="button" variant="primary" @click="onEdit">수정</b-button>
    </div>


    <!-- Service Type 수정 Modal -->
    <b-modal id="serviceModal" size="lg" v-model="isModalService" @hide="onResetService">
      <template slot="modal-title">
        {{ items.hostName }}
        <small> > Service Type</small>
      </template>

      <div class="form-in-group">
        <b-form-fieldset
          label="구분"
          :label-cols="2"
          :horizontal="true">
          <b-form-radio-group
            :options="[{ text: '추가', value: 'ADD'},{ text: '삭제', value: 'DELETE'}]"
            :value="serviceItems.command"
            v-model="serviceItems.command"
          ></b-form-radio-group>
        </b-form-fieldset>
        <b-form-fieldset
          label="Service Type"
          :label-cols="2"
          :horizontal="true">
          <multiselect
            v-model="serviceTypeCode"
            trackBy="code"
            label="codeName"
            :showPointer="false"
            :multiple="true"
            :showLabels="false"
            :options="code.serviceTypeCode"
            :loading="isLoad.serviceTypeCode"
            :closeOnSelect="false"
            :allowEmpty="true"
            :class="{'addMode': serviceItems.command ==='ADD' }"
            placeholder="Select service type"
          >
          </multiselect>
        </b-form-fieldset>
        <b-form-fieldset
          label="이력관리"
          :label-cols="2"
          :horizontal="true">
          <b-form-textarea :rows="6" v-model="serviceItems.modifyHistReason"></b-form-textarea>
        </b-form-fieldset>
      </div>

      <div slot="modal-footer">
        <b-button type="button" size="sm" variant="primary" @click="onSubmitService"><i class="fa fa-dot-circle-o"></i> 저장</b-button>
        <b-button type="button" size="sm" variant="danger" @click="onResetService"><i class="fa fa-ban"></i> 취소</b-button>
      </div>
    </b-modal>

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
    <b-modal title="Message" size="sm" v-model="isModalMessage" class="modal-danger">
      <div class="d-block text-center">
        <h5>{{ modalMessage }}</h5>
      </div>
      <div slot="modal-footer">
        <b-button type="button" size="sm" variant="danger" @click="onDeleteData"><i class="fa fa-dot-circle-o"></i> 삭제</b-button>
        <b-button type="button" size="sm" variant="secondary" @click="isModalMessage = false"><i class="fa fa-ban"></i> 취소</b-button>
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
        originItems: {},
        items: {
          edgeId: null,
          ip : null,
          hostName: null,
          popId : null,
          edgeRelayYn : null,
          edgeRelayName : null,
          serviceTypeCode: [],
          edgeDomainCode: [],
          edgeDomainName: null,
          edgeUseYn: null,
          modifyHistReason : "Edge 수정"
        },
        serviceItems: {
          command: "ADD",
          serviceTypeCode: [],
          modifyHistReason: "서비스 타입 수정"
        },
        code: {
          popId: [],
          serviceTypeCode: []
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
          popId: true,
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
        },

        // 배포상태 - 임시
        deploy: {
          status: true,
          count: 11234
        }
      }
    },

    computed: {
      popId: {
        get () {
          return this.code.popId.find(obj => obj.popId === this.items.popId) || null;
        },
        set (newValue) {
          this.items.popId = newValue !== null ? newValue.popId : null;
        }
      },
      serviceTypeCode: {
        get () {
          return this.items.serviceTypeCode.length > 0
            ? this.items.serviceTypeCode.map(val => this.code.serviceTypeCode.find(obj => obj.code === val))
            : [];
        },
        set (newValue) {
          this.items.serviceTypeCode = newValue.length > 0
            ? newValue.map(obj => obj.code)
            : [];
        }
      },

      serviceDomainList () {
        const serviceDomainList = this.serviceTypeCode.map(({ codeValChar1 }) => codeValChar1);
        return [...new Set(serviceDomainList)];
      }
    },

    created (){
      // History
      const historyId = this.$route.query.histories;
      const detailUrl = historyId !== undefined ? `/edges/${this.id}/histories/${historyId}` : `/edges/${this.id}`;

      if (historyId){
        document.querySelector('body.app').classList.add('history-mode')
      }

      // PoP List
      this.$https.get('/pops')
        .then((res) => {
          this.isLoad.popId = false;
          this.code.popId = res.data.items;
        });

      // Service Type Code
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'SERVICE_TYPE' }
        })
        .then((res) => {
          this.isLoad.serviceTypeCode = false;
          this.code.serviceTypeCode = res.data.items;
        });

      // Detail Data
      this.$https.get(detailUrl)
        .then((res) => {
          this.items = { ...this.items, ...res.data.items };
          this.originItems = JSON.parse(JSON.stringify(this.items));
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
        const { popId, edgeUseYn, modifyHistReason } = this.items;

        this.$https.put(`/edges/${this.id}`, { popId, edgeUseYn, modifyHistReason })
          .then(() => {
            this.$router.go(this.$router.currentRoute);
          })
          .catch((error) => {
            console.log(error);
          });
      },

      onDelete (){
        this.modalMessage = '정말 삭제하시겠습니까?';
        this.isModalMessage = true;
      },

      onDeleteData (){
        this.$https.delete(`/edges/${this.id}`)
          .then(() => {
            this.$router.push({ name: 'Edge 관리' });
          })
          .catch((error) => {
            console.log(error);
          });
      },

      // Service Type Popup Save
      onSubmitService (){
        if (this.serviceItems.command === 'ADD'){
          this.serviceItems.serviceTypeCode = this.items.serviceTypeCode.filter(val => {
            return this.originItems.serviceTypeCode.indexOf(val) < 0
          });
        }

        this.$https.put(`/edges/${this.id}/types`, this.serviceItems)
          .then(() => {
            this.$router.go(this.$router.currentRoute);
          })
          .catch((error) => {
            console.log(error);
          });
      },

      onResetService (){
        this.isModalService = false;
        this.items = JSON.parse(JSON.stringify(this.originItems));
        this.serviceItems = {
          command: "ADD",
          serviceTypeCode: [],
          modifyHistReason: "서비스 타입 추가"
        }
      },

      getHistoryLink (rowId){
        return `#/configuration/edge/${this.id}?histories=${rowId}`
      },

      showHistory () {
        this.isModalHistory = !this.isModalHistory;
        this.$https.get(`/edges/${this.id}/histories`)
          .then((res) => {
            this.history.items = res.data.items;
          });
      }
    }
  }
</script>
