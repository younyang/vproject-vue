<template>
  <div class="animated fadeIn">
    <content-header
      :apiService="items.serviceCodeName"
      :apiName="items.apiName"
      :apiStatus="items.apiStateCodeName"
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
        <!-- Service 선택 -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.select"
          :horizontal="true">
          <template slot="label">
            Service<i v-if="isEdit" class="require">*</i>
          </template>
          <multiselect
            v-if="isEdit"
            v-model="serviceCode"
            :showLabels="false"
            :options="code.serviceCode"
            :loading="isLoad.serviceCode"
            :class="{'invalid': !valid.serviceCode }"
            track-by="code"
            label="codeName"
            placeholder="선택"
          ></multiselect>
          <b-form-input
            v-else
            :value="items.serviceCodeName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- API Name -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <template slot="label">
            API 명<i class="require" v-if="isEdit">*</i>
          </template>
          <b-form-input
            v-model="items.apiName"
            type="text"
            placeholder="Enter API name"
            :plaintext="!isEdit"
            required
          ></b-form-input>
        </b-form-fieldset>

        <div class="form-row">
          <!-- HTTP Method -->
          <b-form-fieldset
            :invalid-feedback="$valid.msg.select"
            :horizontal="true">
            <template slot="label">
              HTTP Method<i v-if="isEdit" class="require">*</i>
            </template>
            <multiselect
              v-if="isEdit"
              v-model="httpMethodCode"
              :showLabels="false"
              :options="code.httpMethodCode"
              :loading="isLoad.httpMethodCode"
              :class="{'invalid': !valid.httpMethodCode }"
              track-by="code"
              label="codeName"
              style="width:156px"
              @select="onSelectHttpMethod"
              placeholder="선택"
            ></multiselect>
            <b-form-checkbox
              class="ml-1"
              v-if="items.httpMethodCode === 'HTTP_METHOD_03' && isEdit"
              v-model="items.multipartYn"
            >Multipart 사용</b-form-checkbox>
            <b-form-input
              v-if="!isEdit"
              :value="items.httpMethodCodeName"
              type="text"
              plaintext
            ></b-form-input>
          </b-form-fieldset>
          <!-- Version -->
          <b-form-fieldset
            :invalid-feedback="$valid.msg.require"
            :horizontal="true">
            <template slot="label">
              Version<i class="require" v-if="isEdit">*</i>
            </template>
            <span class="form-text-alone">v</span>
            <b-form-input
              v-model="items.apiVersion"
              style="width: 80px;"
              type="text"
              :plaintext="!isEdit"
              required
            ></b-form-input>
          </b-form-fieldset>
        </div>

        <div class="form-row">
          <!-- Adaptor -->
          <b-form-fieldset
            :invalid-feedback="$valid.msg.select"
            :horizontal="true">
            <template slot="label">
              Adaptor<i v-if="isEdit" class="require">*</i>
            </template>
            <multiselect
              v-if="isEdit"
              v-model="adaptorCode"
              :showLabels="false"
              :options="code.adaptorCode"
              :loading="isLoad.adaptorCode"
              :class="{'invalid': !valid.adaptorCode }"
              track-by="code"
              label="codeName"
              style="width:156px"
              placeholder="선택"
            ></multiselect>
            <b-form-input
              v-else
              :value="items.adaptorCodeName"
              type="text"
              plaintext
            ></b-form-input>
          </b-form-fieldset>

          <!-- API Section -->
          <b-form-fieldset
            :invalid-feedback="$valid.msg.select"
            :horizontal="true">
            <template slot="label">
              API 구분
            </template>
            <multiselect
              v-if="isEdit"
              v-model="apiSectionCode"
              class="noEmpty"
              :allowEmpty="false"
              :showLabels="false"
              :searchable="false"
              :options="code.apiSectionCode"
              :loading="isLoad.apiSectionCode"
              track-by="code"
              label="codeName"
              style="width:156px"
            ></multiselect>
            <b-form-input
              v-else
              :value="items.apiSectionCodeName"
              type="text"
              plaintext
            ></b-form-input>
          </b-form-fieldset>
        </div>

        <!-- Northbound URL -->
        <b-form-fieldset
          class="inline"
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <template slot="label">
            Northbound URL<i class="require" v-if="isEdit">*</i>
          </template>

          <span v-if="isEdit">
            <multiselect
              v-model="protocolCode"
              label="codeName"
              class="protocol noEmpty"
              :allowEmpty="false"
              :showLabels="false"
              :searchable="false"
              :options="code.protocolCode"
              :loading="isLoad.protocolCode"
              placeholder="://"
            ></multiselect>
            <b-form-input
              v-model="nbHost"
              type="text"
              disabled
            ></b-form-input>
            /v
            <b-form-input
              v-model="items.apiVersion"
              type="text"
              style="width: 80px"
              disabled
            ></b-form-input>
            /
            <b-form-input
              v-model="nbParams"
              type="text"
              @input="onInputParams"
              required
            ></b-form-input>
          </span>

          <b-form-input
            v-else
            v-model="items.nbBaseUrl"
            type="text"
            placeholder=""
            plaintext
            required
          ></b-form-input>
        </b-form-fieldset>

        <!-- Southbound URL -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <template slot="label">
            Southbound URL<i class="require" v-if="isEdit">*</i>
          </template>

          <b-form-input
            v-model="items.sbBaseUrl"
            type="text"
            placeholder=""
            :plaintext="!isEdit"
            required
          ></b-form-input>
        </b-form-fieldset>
        <!-- API State -->
        <!-- API UseYn -->

      </b-form>
    </b-collapse>

    <div class="collapse-title">
      <b-button class="btn-collapse" v-b-toggle.formRequest>
        <i class="fa"></i>
        Request정보
      </b-button>
    </div>
    <b-collapse id="formRequest" visible>
      <b-form class="formView" :validated="inValidForm" novalidate>
        <!-- Content-type -->
        <!-- Header -->
        <!-- Path Parameter -->
        <!-- Querystring Parameter -->
      </b-form>
    </b-collapse>

    <div class="collapse-title">
      <b-button class="btn-collapse" v-b-toggle.formResponse>
        <i class="fa"></i>
        Response정보
      </b-button>
    </div>
    <b-collapse id="formResponse" visible>
      <b-form class="formView" :validated="inValidForm" novalidate>
        <!-- Accept -->
        <!-- Header -->
        <!-- Sample Code -->
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
      <b-button type="button" variant="outline-secondary" :to="{ name: 'API 관리' }">목록</b-button>
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
  import moment from 'moment'
  import ContentHeader from '@/components/ContentHeader'
  import cSwitch from '@/components/Switch'
  export default {
    name: 'api',
    props: ['id', 'histories'],
    components: {
      ContentHeader,
      cSwitch
    },

    data (){
      return {
        name: 'API 상세',
        originItems: {},
        items: {
          apiId: 10000034,
          apiName: '가상 서버 삭제',
          serviceCode: 'API_SERVICE_11',
          serviceCodeName: 'GTM',
          serviceId: 10011,
          adaptorCode: 'API_ADAPTOR_01',
          adaptorCodeName: 'gtmAdaptor',
          adaptorId: 11,
          nbBaseUrl: 'http://1.255.87.65/gtm/v1.0/mgmt/tm/gtm/server/common/virtual-servers/{virtualServerName}',
          apiVersion: '1.0',
          sbBaseUrl: 'https://#deployIp#/mgmt/tm/gtm/server/~Common~#gtmServerName#/virtual-servers/{virtualServerName}',
          httpMethodCode: 'HTTP_METHOD_04',
          httpMethodCodeName: 'DELETE',
          apiStateCode: 'API_STATE_03',
          apiStateCodeName: 'Published',
          apiSectionCode: 'API_SECTION_01',
          apiSectionCodeName: 'Public',
          apiUseYn: true,
          histBeginDateTime: null,
          apiRequestInfo: {
            contentTypeList: ['CONTENT_TYPE_01'],
            headers: [{
              name: 'x-vessel-appKey',
              dataTypeCode: 'DATA_TYPE_01',
              mandatoryYn: true,
              checked: false
            }],
            pathParameters: [{
              name: 'virtualServerName',
              dataTypeCode: 'DATA_TYPE_01',
              mandatoryYn: true,
              checked: false
            }],
            queryStringParameters: [{
              name: 'deployIp',
              dataTypeCode: 'DATA_TYPE_01',
              mandatoryYn: true,
              checked: false
            }, {
              name: 'gtmServerName',
              dataTypeCode: 'DATA_TYPE_01',
              mandatoryYn: true,
              checked: false
            }],
            payloads: null,
            contentType: null
          },
          apiResponseInfo: {
            contentTypeList: ['ACCEPT_TYPE_01'],
            headers: [],
            sampleCodes: [{
                contentTypeCode: 'ACCEPT_TYPE_01',
                sampleCode: ''
            }]
          }
        },
        code: {
          serviceCode: [],
          httpMethodCode: [],
          adaptorCode: [],
          apiSectionCode : [],
          protocolCode: [],
          contentTypeList: [],
          acceptCode: [],
          dataTypeCode: []
        },
        isLoad: {
          serviceCode: true,
          httpMethodCode: true,
          adaptorCode: true,
          apiSectionCode : true,
          protocolCode : true,
          contentTypeList : true,
          acceptCode: true,
          dataTypeCode: true
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
      serviceCode: {
        get () {
          return this.code.serviceCode.find(obj => obj.code === this.items.serviceCode) || null;
        },
        set (newValue) {
          this.items.serviceCode = newValue !== null ? newValue.code : null;
        }
      },
      httpMethodCode: {
        get () {
          return this.code.httpMethodCode.find(obj => obj.code === this.items.httpMethodCode) || null;
        },
        set (newValue) {
          this.items.httpMethodCode = newValue !== null ? newValue.code : null;
        }
      },
      adaptorCode: {
        get () {
          return this.code.adaptorCode.find(obj => obj.code === this.items.adaptorCode) || null;
        },
        set (newValue) {
          this.items.adaptorCode = newValue !== null ? newValue.code : null;
        }
      },
      apiSectionCode: {
        get () {
          return this.code.apiSectionCode.find(obj => obj.code === this.items.apiSectionCode) || null;
        },
        set (newValue) {
          this.items.apiSectionCode = newValue !== null ? newValue.code : null;
        }
      },
      protocolCode: {
        get () {
          return this.code.protocolCode.find(obj => obj.code === this.items.protocolCode) || null;
        },
        set (newValue) {
          this.items.protocolCode = newValue !== null ? newValue.code : null;
        }
      },
      contentTypeList: {
        get () {
          return this.items.apiRequestInfo.contentTypeList.length > 0
            ? this.items.apiRequestInfo.contentTypeList.map(val => this.code.contentTypeList.find(obj => obj.code === val))
            : [];
        },
        set (newValue) {
          this.items.apiRequestInfo.contentTypeList = newValue.length > 0
            ? newValue.map(obj => obj.code)
            : [];
        }
      },
      acceptCode: {
        get () {
          return this.items.apiResponseInfo.contentTypeList.length > 0
            ? this.items.apiResponseInfo.contentTypeList.map(val => this.code.acceptCode.find(obj => obj.code === val))
            : [];
        },
        set (newValue) {
          this.items.apiResponseInfo.contentTypeList = newValue.length > 0
            ? newValue.map(obj => obj.code)
            : [];
        }
      },

      nbHost: {
        get () {
          const serviceCode = this.code.serviceCode.find(({ code }) => code === this.items.serviceCode);
          const serviceName = (serviceCode) ? serviceCode.codeValChar1 : '';
          return `apis.vessel.com/${serviceName}`
        },
        set (newValue) {
          this.items.nbHost = newValue;
        }
      },

      // validation
      valid (){
        return {
          serviceCode: this.items.serviceCode !== null,
          httpMethodCode: this.items.httpMethodCode !== null,
          adaptorCode: this.items.adaptorCode !== null,
          //apiSectionCode: this.items.apiSectionCode !== null,
          contentTypeList: this.items.apiRequestInfo.contentTypeList.length
        }
      }
    },

    mounted (){
      // History
      const historyId = this.$route.query.histories;
      this.detailUrl = historyId !== undefined ? `/apiManagement/apis/${this.id}/histories/${historyId}` : `/apiManagement/apis/${this.id}`;

      if (historyId){
        document.querySelector('body.app').classList.add('history-mode');
      }

      // Service Code
      this.$https.get('/system/commonCode', {
        q: { groupCode: 'API_SERVICE' }
      })
      .then((res) => {
        this.isLoad.serviceCode = false;
        this.code.serviceCode = res.data.items;
      });

      // HTTP Method Code
      this.$https.get('/system/commonCode', {
        q: { groupCode: 'HTTP_METHOD' }
      })
      .then((res) => {
        this.isLoad.httpMethodCode = false;
        this.code.httpMethodCode = res.data.items;
      });

      // Adaptor Code
      this.$https.get('/system/commonCode', {
        q: { groupCode: 'API_ADAPTOR' }
      })
      .then((res) => {
        this.isLoad.adaptorCode = false;
        this.code.adaptorCode = res.data.items;
      });

      // API Section Code
      this.$https.get('/system/commonCode', {
        q: { groupCode: 'API_SECTION' }
      })
      .then((res) => {
        this.isLoad.apiSectionCode = false;
        this.code.apiSectionCode = res.data.items;
      });

      // Domain Protocol Code
      this.$https.get('/system/commonCode', {
        q: { groupCode: 'DOMAIN_PROTOCOL' }
      })
      .then((res) => {
        this.isLoad.protocolCode = false;
        this.code.protocolCode = res.data.items;
      });

      // Request Content-Type Code
      this.$https.get('/system/commonCode', {
        q: { groupCode: 'CONTENT_TYPE' }
      })
      .then((res) => {
        this.isLoad.contentTypeList = false;
        this.code.contentTypeList = res.data.items;
      });

      // Response Accept Code
      this.$https.get('/system/commonCode', {
        q: { groupCode: 'ACCEPT_TYPE' }
      })
      .then((res) => {
        this.isLoad.acceptCode = false;
        this.code.acceptCode = res.data.items;
      });

      // Request Data Type Code
      this.$https.get('/system/commonCode', {
        q: { groupCode: 'DATA_TYPE' }
      })
      .then((res) => {
        this.isLoad.dataTypeCode = false;
        this.code.dataTypeCode = res.data.items;
      });

      // Detail Data
      this.$https.get(this.detailUrl)
        .then(res => {
          this.items = res.data.items;
          this.setUrlParams();
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
        this.setUrlParams();
      },

      onSubmit (){
        const validate = this.$valid.all(this.items);
        this.inValidForm = !validate;
        if (validate){
          this.$https.put(`/apiManagement/apis/${this.id}`, this.items)
            .then(() => {
              this.$router.go(this.$router.currentRoute);
            })
            .catch((error) => {
              console.log(error);
            });

        }
      },

      onDelete (){

      },

      validate (submitItems){
      },

      getHistoryLink (rowId){
        return `#/apis/apis/${this.id}?histories=${rowId}`
      },

      showHistory () {
        this.isModalHistory = !this.isModalHistory;
        this.$https.get(`/apiManagement/apis/${this.id}/histories`)
          .then((res) => {
            this.history.items = res.data.items;
          });
      },

      setUrlParams (){
        const { nbBaseUrl, nbHost, apiVersion } = this.items;
        this.nbParams = nbBaseUrl
      }

    }
  }
</script>
