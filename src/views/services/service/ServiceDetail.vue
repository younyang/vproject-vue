<template>
  <div class="animated fadeIn">
    <content-header
      :title="items.serviceName"
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
        <!-- Account -->
        <b-form-fieldset
          label="Account"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.accountName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- Service Name -->
        <b-form-fieldset
          label="Service Name"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.serviceName"
            plaintext
            type="text"
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
          <ul class="icons-list" :class="{'list-view': !isEdit}">
            <li v-for="(domain, index) in serviceDomainList">
              <i class="bg-primary" v-b-tooltip.hover :title="domain.serviceCodeName">{{ domain.serviceCodeVal }}</i>
              <div class="desc">
                <small>Domain</small>
                <div class="title">
                  <multiselect
                    v-if="isEdit"
                    label="codeName"
                    v-model="domain.domainProtocolCode"
                    class="inline sm protocol"
                    :allowEmpty="true"
                    :showLabels="false"
                    :searchable="false"
                    :options="code.domainProtocolCode"
                    :loading="isLoad.domainProtocolCode"
                    placeholder="://"
                  ></multiselect>
                  <span v-else>{{ domain.domainProtocolName }}</span>
                  {{ domain.serviceCodeVal | lowercase }}.{{ items.serviceName }}.vessels.com
                </div>
              </div>
              <div class="value">
                <div class="small text-muted">Hashing Type</div>
                <multiselect
                  v-if="isEdit"
                  v-model="domain.domainHashingTypeCode"
                  label="codeName"
                  class="inline sm"
                  :allowEmpty="true"
                  :showLabels="false"
                  :searchable="false"
                  :options="code.domainHashingTypeCode"
                  :loading="isLoad.domainHashingTypeCode"
                  placeholder="Select"
                ></multiselect>
                <span v-else>{{ domain.domainHashingTypeName }}</span>
              </div>
            </li>
          </ul>
        </b-form-fieldset>

        <!-- CNAME -->
        <b-form-fieldset
          label="CNAME 사용여부"
          :label-cols="3"
          :horizontal="true">
          <c-switch
            v-if="isEdit"
            type="icon"
            variant="success"
            v-bind="{on: '\uf00c', off: '\uf00d'}"
            v-model="items.cnameUseYn"
            :pill="true"
          ></c-switch>
          <b-badge
            v-else
            pill
            :variant="items.cnameUseYn ? 'success' : 'secondary'">
            {{ items.cnameUseYn ? '사용' : '미사용' }}
          </b-badge>
        </b-form-fieldset>

        <!-- CNAME Domain -->
        <b-form-fieldset
          v-if="items.cnameUseYn"
          label="CNAME 도메인"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            v-if="isEdit"
            v-model="items.cnameDomainName"
            type="text"
          ></b-form-input>
          <b-form-input
            v-else
            :value="items.cnameDomainName"
            plaintext
            type="text"
          ></b-form-input>
        </b-form-fieldset>

        <!-- SSL 인증서 -->
        <b-form-fieldset
          label="SSL 인증서"
          :label-cols="3"
          :horizontal="true">
          <c-switch
            v-if="isEdit"
            type="icon"
            variant="success"
            v-bind="{on: '\uf00c', off: '\uf00d'}"
            v-model="items.sslCertUseYn"
            :pill="true"
          ></c-switch>
          <b-badge
            v-else
            pill
            :variant="items.sslCertUseYn ? 'success' : 'secondary'">
            {{ items.sslCertUseYn ? '사용' : '미사용' }}
          </b-badge>
        </b-form-fieldset>

        <!-- SSL 인증서 정보 입력-->
        <b-form-fieldset
          v-if="items.sslCertUseYn"
          label="SSL 인증서"
          :label-cols="3"
          :horizontal="true">

          <div class="form-in-group">
            <!-- Cert -->
            <b-form-fieldset
              label="Cert"
              :label-cols="2"
              :horizontal="true">
              <b-form-textarea
                v-model="items.sslCert"
                :plaintext="!isEdit"
                :no-resize="!isEdit"
                :disabled="!isEdit"
                :rows="2"
                placeholder="Cert"
              ></b-form-textarea>
            </b-form-fieldset>
            <b-form-fieldset
              label="Key"
              :label-cols="2"
              :horizontal="true">
              <b-form-textarea
                v-model="items.sslCertKey"
                :plaintext="!isEdit"
                :no-resize="!isEdit"
                :disabled="!isEdit"
                :rows="2"
                placeholder="Key"
              ></b-form-textarea>
            </b-form-fieldset>
            <b-form-fieldset
              label="만료일"
              :label-cols="2"
              :horizontal="true">
              <b-form-input
                type="date"
                :plaintext="!isEdit"
                v-model="items.sslCertExpireDate"
              ></b-form-input>
            </b-form-fieldset>
          </div>
        </b-form-fieldset>

        <!-- 사용여부 -->
        <b-form-fieldset
          label="사용여부"
          :label-cols="3"
          :horizontal="true">
          <b-badge
            pill
            :variant="items.serviceUseYn ? 'success' : 'secondary'">
            {{ items.serviceUseYn ? '사용' : '미사용' }}
          </b-badge>
          <b-button
            v-if="!isEdit"
            class="only-icon"
            variant="link"
            @click="isModalUseYn = !isModalUseYn"
          >
            <i class="fa fa-pencil" ></i>
          </b-button>
        </b-form-fieldset>

        <!-- 변경이력 -->
        <b-form-fieldset
          v-if="isEdit"
          label="변경이력"
          :label-cols="3"
          :horizontal="true">
          <b-form-textarea
            v-model="items.modifyHistReason"
            :rows="6"
          ></b-form-textarea>
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
        <!-- 배포상태 -->
        <b-form-fieldset
          v-if="!isEdit"
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
      </b-card>
    </b-collapse>

    <div class="page-btn" v-if="isEdit">
      <b-button type="button" size="sm" variant="primary" @click="onSubmit"><i class="fa fa-dot-circle-o"></i> 저장</b-button>
      <b-button type="button" size="sm" variant="secondary" @click="onView"><i class="fa fa-ban"></i> 취소</b-button>
    </div>
    <div class="page-btn" v-else>
      <b-button type="button" size="sm" variant="danger" class="float-left" @click="onDelete"><i class="fa fa-times"></i> 삭제</b-button>
      <b-button type="button" size="sm" variant="outline-primary" @click="showHistory">이력관리</b-button>
      <b-button type="button" size="sm" variant="primary" @click="onEdit"><i class="fa fa-pencil"></i> 수정</b-button>
      <b-button type="button" size="sm" variant="secondary" :to="{ name: 'Service 관리' }"><i class="fa fa-list"></i> 목록</b-button>
    </div>

    <!-- Service Type 수정 Modal -->
    <b-modal id="serviceModal" size="lg" v-model="isModalService" @hide="onResetService">
      <template slot="modal-title">
        {{ items.serviceName }}
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
            @select="onSelectType"
            @remove="onRemoveType"
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


    <!-- 사용여부 수정 Modal -->
    <b-modal size="lg" v-model="isModalUseYn" @hide="onResetUseYn">
      <template slot="modal-title">
        {{ items.serviceName }}
        <small> > 사용 여부</small>
      </template>

      <div class="form-in-group">
        <b-form-fieldset
          label="사용 여부"
          :label-cols="2"
          :horizontal="true">
          <c-switch
            type="icon"
            variant="success"
            v-bind="{on: '\uf00c', off: '\uf00d'}"
            v-model="serviceUseYnItems.serviceUseYn"
            :pill="true"
          ></c-switch>
        </b-form-fieldset>
        <b-form-fieldset
          label="이력관리"
          :label-cols="2"
          :horizontal="true">
          <b-form-textarea :rows="6" v-model="serviceUseYnItems.modifyHistReason"></b-form-textarea>
        </b-form-fieldset>
      </div>

      <div slot="modal-footer">
        <b-button type="button" size="sm" variant="primary" @click="onSubmitUseYn"><i class="fa fa-dot-circle-o"></i> 저장</b-button>
        <b-button type="button" size="sm" variant="danger" @click="onResetUseYn"><i class="fa fa-ban"></i> 취소</b-button>
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
        items: {
          serviceName: "",
          accountId: null,
          accountName: "",
          companyName: "",
          serviceTypeCode: [],
          serviceDomainList: [],
          cnameUseYn: true,
          cnameDomainName: "",
          sslCertUseYn: true,
          sslCert: "",
          sslCertKey: "",
          sslCertExpireDate: "",
          serviceUseYn: true,
          createDateTime: "",
          createId: "",
          modifyDateTime: "",
          modifyId: ""
        },
        serviceItems: {
          command: "ADD",
          serviceTypeCode: [],
          modifyHistReason: "서비스 타입 추가"
        },
        serviceUseYnItems: {
          serviceUseYn: null,
          modifyHistReason: "서비스 사용 여부 변경"
        },
        code: {
          serviceTypeCode: [],
          domainProtocolCode: [],
          domainHashingTypeCode: []
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
          serviceTypeCode: true,
          domainProtocolCode: true,
          domainHashingTypeCode: true
        },
        isEdit: false,
        isModalService: false,
        isServiceAdd: true,
        isModalUseYn: false,
        isModalMessage: false,
        modalService: {
          serviceTypeCode: [],
          history: ''
        },
        modalUseYn: {
          serviceUseYn: false,
          history: ''
        },
        isModalHistory: false,
        modalMessage: '',

        // 배포상태 - 임시
        deploy: {
          status: true,
          count: 11234
        }
      }
    },

    computed: {
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
      serviceDomainList (){
        return this.items.serviceDomainList.length > 0
          ? this.items.serviceDomainList.map(obj => {
            const serviceCode = this.getCodeObj(obj.serviceTypeCode);
            return Object.assign({}, obj, {
              domainProtocolCode: this.code.domainProtocolCode.find(({code}) => code === obj.domainProtocolCode),
              domainHashingTypeCode: this.code.domainHashingTypeCode.find(({code}) => code === obj.domainHashingTypeCode),
              serviceCodeVal: serviceCode.codeValChar1,
              serviceCodeName: serviceCode.codeName
            })
          })
          : [];
      }
    },


    created (){
      // History
      const historyId = window.location.hash.split('?histories=')[1];
      const detailUrl = historyId !== undefined ? `/services/${this.id}/histories/${historyId}` : `/services/${this.id}`;

      // Service Type Code
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'SERVICE_TYPE' }
        })
        .then((res) => {
          this.isLoad.serviceTypeCode = false;
          this.code.serviceTypeCode = res.data.items;
        });
      // Domain Protocol Code
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'DOMAIN_PROTOCOL' }
        })
        .then((res) => {
          this.isLoad.domainProtocolCode = false;
          this.code.domainProtocolCode = res.data.items;
        });
      // Domain Hahing Type Code
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'HASHING_TYPE' }
        })
        .then((res) => {
          this.isLoad.domainHashingTypeCode = false;
          this.code.domainHashingTypeCode = res.data.items;
        });
      // Detail Data
      this.$https.get(detailUrl)
        .then((res) => {
          this.items = res.data.items;
          this.originItems = JSON.parse(JSON.stringify(this.items));
          this.serviceUseYnItems.serviceUseYn = this.items.serviceUseYn;
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
        this.items.serviceDomainList = this.serviceDomainList.map(obj => {
          return {
            serviceTypeCode: obj.serviceTypeCode,
            domainProtocolCode: obj.domainProtocolCode !== null ? obj.domainProtocolCode.code : null,
            domainHashingTypeCode: obj.domainHashingTypeCode !== null ? obj.domainHashingTypeCode.code : null
          }
        });

        this.$https.put(`/services/${this.id}`, this.items)
          .then(() => {
            this.$router.go(this.$router.currentRoute);
          })
          .catch((error) => {
            console.log(error);
          });
      },

      // Service Type Popup Save
      onSubmitService (){
        this.serviceItems.serviceTypeCode = [...this.items.serviceTypeCode];
        console.log(this.serviceItems)

        this.$https.put(`/services/${this.id}/types`, this.serviceItems)
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

      // Service UseYn Popup Save
      onSubmitUseYn (){
        this.$https.put(`/services/${this.id}/use`, this.serviceUseYnItems)
          .then(() => {
            this.$router.go(this.$router.currentRoute);
          })
          .catch((error) => {
            console.log(error);
          });
      },

      onResetUseYn (){
        this.isModalUseYn = false;
        this.items = JSON.parse(JSON.stringify(this.originItems));
        this.serviceUseYnItems = {
          serviceUseYn: this.items.serviceUseYn,
          modifyHistReason: "서비스 사용 여부 변경"
        }
      },

      onDelete (){
        this.modalMessage = '정말 삭제하시겠습니까?';
        this.isModalMessage = true;
      },

      onDeleteData (){
        this.$https.delete(`/services/${this.id}`)
          .then((res) => {
            this.$router.push({ name: 'Service 관리' });
          })
          .catch((error) => {
            console.log(error);
          });
      },

      getHistoryLink (rowId){
        return `#/service/service/${this.id}?histories=${rowId}`
      },

      showHistory () {
        this.isModalHistory = !this.isModalHistory;
        this.$https.get(`/services/${this.id}/histories`)
          .then((res) => {
            this.history.items = res.data.items;
          });
      },

      getCodeObj (code){
        return this.code.serviceTypeCode.find(obj => obj.code === code) || {};
      },

      onSelectType (item){
        const isContain = this.serviceDomainList.find(({serviceCodeVal}) => serviceCodeVal === item.codeValChar1);
        if (!isContain){
          this.items.serviceDomainList.push({
            serviceTypeCode: item.code,
            domainProtocolCode: this.code.domainProtocolCode[0].code,
            domainHashingTypeCode: this.code.domainHashingTypeCode[0].code
          });
        }
      },

      onRemoveType (item){
        console.log(item)
        this.$https.get(`services/${this.id}/types`, {
            serviceType: item.code
          })
          .then((res) => {
            const isSuccess = res.data.result === 'Success';
            if (!isSuccess){
              this.items.serviceName = '';
              this.modalMessage = `
              사용 설정된 PoP이 존재하여 삭제할 수 없습니다.
              삭제 후, 다시 시도해주세요.
              `;
              this.isModalMessage = true;
              this.items = JSON.parse(JSON.stringify(this.originItems));
            }
          });
      }
    }
  }
</script>
