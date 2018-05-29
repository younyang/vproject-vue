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
        <!-- Service 선택 -->
        <b-form-fieldset
          label="Service 선택<i class='require'>*</i>"
          :invalid-feedback="$valid.msg.select"
          :horizontal="true">
          <multiselect
            v-model="serviceCode"
            :showLabels="false"
            :options="code.serviceCode"
            :loading="isLoad.serviceCode"
            :class="{'invalid': !valid.serviceCode }"
            track-by="code"
            label="codeName"
            placeholder="선택"
          ></multiselect>
        </b-form-fieldset>

        <!-- API Name -->
        <b-form-fieldset
          label="API 명<i class='require'>*</i>"
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <b-form-input
            v-model="items.apiName"
            type="text"
            placeholder="Enter API name"
            required
          ></b-form-input>
        </b-form-fieldset>

        <div class="form-row">
          <!-- HTTP Method -->
          <b-form-fieldset
            label="HTTP Method<i class='require'>*</i>"
            :invalid-feedback="$valid.msg.select"
            :horizontal="true">
            <multiselect
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
              v-if="items.httpMethodCode === 'HTTP_METHOD_03'"
              v-model="items.multipartYn"
            >Multipart 사용</b-form-checkbox>
          </b-form-fieldset>
          <!-- Version -->
          <b-form-fieldset
            label="Version<i class='require'>*</i>"
            :invalid-feedback="$valid.msg.require"
            :horizontal="true">
            <span class="form-text-alone">v</span>
            <b-form-input
              v-model="items.apiVersion"
              style="width: 80px;"
              type="text"
              required
            ></b-form-input>
          </b-form-fieldset>
        </div>

        <div class="form-row">
          <!-- Adaptor -->
          <b-form-fieldset
            label="Adaptor<i class='require'>*</i>"
            :invalid-feedback="$valid.msg.select"
            :horizontal="true">
            <multiselect
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
          </b-form-fieldset>
          <!-- API 구분 -->
          <b-form-fieldset
            label="API 구분"
            :horizontal="true">
            <multiselect
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
          </b-form-fieldset>
        </div>

        <!-- Northbound URL -->
        <b-form-fieldset
          class="inline"
          label="Northbound URL<i class='require'>*</i>"
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
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
        </b-form-fieldset>

        <!-- Southbound URL -->
        <b-form-fieldset
          label="Southbound URL<i class='require'>*</i>"
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <b-form-input
            v-model="items.sbBaseUrl"
            type="text"
            required
          ></b-form-input>
        </b-form-fieldset>

        <!-- Southbound URL(Test) -->
        <b-form-fieldset
          label="Southbound URL(Test)"
          :horizontal="true">
          <b-form-input
            v-model="items.sbBaseUrl"
            type="text"
          ></b-form-input>
        </b-form-fieldset>

        <!-- 사용여부 -->
        <b-form-fieldset
          label="사용여부"
          :horizontal="true">
          <c-switch
            type="text"
            class="v-switch"
            on="사용"
            off="미사용"
            v-model="items.apiUseYn"
          ></c-switch>
        </b-form-fieldset>
      </b-form>
    </b-collapse>


    <div class="collapse-title">
      <b-button class="btn-collapse" v-b-toggle.formRequest>
        <i class="fa"></i>
        Request 정보
      </b-button>
    </div>
    <b-collapse id="formRequest" visible>
      <b-form class="formView" :validated="inValidForm" novalidate>
        <!-- Content-Type -->
        <b-form-fieldset
          label="Content-Type<i class='require'>*</i>"
          :invalid-feedback="$valid.msg.select"
          :horizontal="true">
          <multiselect
            v-model="contentTypeList"
            class="multiple"
            :class="{'invalid': !valid.contentTypeList }"
            :multiple="true"
            :showLabels="false"
            :options="code.contentTypeList"
            :loading="isLoad.contentTypeList"
            track-by="code"
            label="codeName"
          ></multiselect>
        </b-form-fieldset>

        <!-- Header -->
        <b-form-fieldset
          label="Header<i class='require'>*</i>"
          :horizontal="true">

          <b-table
            class="sub"
            show-empty
            :items="items.apiRequestInfo.headers"
            :fields="{
              name: {label: 'Name', 'class': 'text-left', thStyle: { width: '500px'}},
              dataTypeCode: {label: 'Type', thStyle: { width: '250px'}},
              mandatoryYn: {label: 'Mandatory'},
              action: {label: '#'}
            }"
          >
            <template slot="name" slot-scope="row">
              <b-form-input
                v-model="row.item.name"
                type="text"
                required
              ></b-form-input>
              <div class="invalid-tooltip">{{ $valid.msg.require }}</div>
            </template>
            <template slot="dataTypeCode" slot-scope="row">
              <multiselect
                v-model="row.item.dataTypeCode"
                label="codeName"
                class="noEmpty"
                :allowEmpty="false"
                :showLabels="false"
                :searchable="false"
                :options="code.dataTypeCode"
                :loading="isLoad.dataTypeCode"
              ></multiselect>
            </template>

            <template slot="mandatoryYn" slot-scope="row">
              <c-switch
                type="text"
                class="v-switch"
                on="Y"
                off="N"
                v-model="row.item.mandatoryYn"
              ></c-switch>
            </template>

            <template slot="action" slot-scope="row">
              <span class="ico">
                <button type="button" v-if="row.index === 0" @click="onAddRow('apiRequestInfo','headers')"><i class="fa fa-plus-circle"></i></button>
                <button type="button" v-if="row.index > 0" @click="onDelRow('apiRequestInfo','headers', row.index)"><i class="fa fa-times-circle"></i></button>
              </span>
            </template>
          </b-table>
        </b-form-fieldset>

        <!-- Path Parameter -->
        <b-form-fieldset
          label="Path Parameter"
          :horizontal="true">

          <b-table
            class="sub"
            show-empty
            :items="items.apiRequestInfo.pathParameters"
            :fields="{
              name: {label: 'Name', 'class': 'text-left', thStyle: { width: '500px'}},
              dataTypeCode: {label: 'Type', thStyle: { width: '250px'}},
              mandatoryYn: {label: 'Mandatory'}
            }"
          >
            <template slot="name" slot-scope="row">
              <b-form-input
                v-model="row.item.name"
                type="text"
                disabled
              ></b-form-input>
            </template>
            <template slot="dataTypeCode" slot-scope="row">
              <multiselect
                v-model="row.item.dataTypeCode"
                label="codeName"
                class="noEmpty"
                :allowEmpty="false"
                :showLabels="false"
                :searchable="false"
                :options="code.dataTypeCode"
                :loading="isLoad.dataTypeCode"
              ></multiselect>
            </template>

            <template slot="mandatoryYn" slot-scope="row">
              <c-switch
                type="text"
                class="v-switch"
                on="Y"
                off="N"
                v-model="row.item.mandatoryYn"
              ></c-switch>
            </template>
          </b-table>
        </b-form-fieldset>

        <!-- QueryString Parameters -->
        <b-form-fieldset
          label="QueryString<br>Parameter"
          :horizontal="true">

          <b-table
            class="sub"
            show-empty
            :items="items.apiRequestInfo.queryStringParameters"
            :fields="{
              name: {label: 'Name', 'class': 'text-left', thStyle: { width: '500px'}},
              dataTypeCode: {label: 'Type', thStyle: { width: '250px'}},
              mandatoryYn: {label: 'Mandatory'},
              action: {label: '#'}
            }"
          >
            <template slot="name" slot-scope="row">
              <b-form-input
                v-model="row.item.name"
                type="text"
              ></b-form-input>
            </template>
            <template slot="dataTypeCode" slot-scope="row">
              <multiselect
                v-model="row.item.dataTypeCode"
                label="codeName"
                class="noEmpty"
                :allowEmpty="false"
                :showLabels="false"
                :searchable="false"
                :options="code.dataTypeCode"
                :loading="isLoad.dataTypeCode"
              ></multiselect>
            </template>

            <template slot="mandatoryYn" slot-scope="row">
              <c-switch
                type="text"
                class="v-switch"
                on="Y"
                off="N"
                v-model="row.item.mandatoryYn"
              ></c-switch>
            </template>

            <template slot="action" slot-scope="row">
              <span class="ico">
                <button type="button" v-if="row.index === 0" @click="onAddRow('apiRequestInfo','queryStringParameters')"><i class="fa fa-plus-circle"></i></button>
                <button type="button" v-if="row.index > 0" @click="onDelRow('apiRequestInfo','queryStringParameters', row.index)"><i class="fa fa-times-circle"></i></button>
              </span>
            </template>
          </b-table>
        </b-form-fieldset>
      </b-form>
    </b-collapse>

    <div class="collapse-title">
      <b-button class="btn-collapse" v-b-toggle.formResponse>
        <i class="fa"></i>
        Response 정보
      </b-button>
    </div>
    <b-collapse id="formResponse" visible>
      <b-form class="formView">
        <!-- 사용여부 -->
        <b-form-fieldset
          label="사용여부"
          :horizontal="true">
          <c-switch
            type="text"
            class="v-switch"
            on="사용"
            off="미사용"
            v-model="items.apiResponseInfoUseYn"
          ></c-switch>
        </b-form-fieldset>

        <div v-if="items.apiResponseInfoUseYn">
          <!-- Accept -->
          <b-form-fieldset
            label="Accept"
            :horizontal="true">
            <multiselect
              v-model="acceptCode"
              class="multiple"
              :multiple="true"
              :showLabels="false"
              :options="code.acceptCode"
              :loading="isLoad.acceptCode"
              track-by="code"
              label="codeName"
            ></multiselect>
          </b-form-fieldset>

          <!-- Headers -->
          <b-form-fieldset
            label="Header"
            :horizontal="true">
            <b-table
              class="sub"
              show-empty
              :items="items.apiResponseInfo.headers"
              :fields="{
                name: {label: 'Name', 'class': 'text-left', thStyle: { width: '500px'}},
                dataTypeCode: {label: 'Type', thStyle: { width: '250px'}},
                mandatoryYn: {label: 'Mandatory'},
                action: {label: '#'}
              }"
            >
              <template slot="name" slot-scope="row">
                <b-form-input
                  v-model="row.item.name"
                  type="text"
                  required
                ></b-form-input>
                <div class="invalid-tooltip">{{ $valid.msg.require }}</div>
              </template>
              <template slot="dataTypeCode" slot-scope="row">
                <multiselect
                  v-model="row.item.dataTypeCode"
                  label="codeName"
                  class="noEmpty"
                  :allowEmpty="false"
                  :showLabels="false"
                  :searchable="false"
                  :options="code.dataTypeCode"
                  :loading="isLoad.dataTypeCode"
                ></multiselect>
              </template>

              <template slot="mandatoryYn" slot-scope="row">
                <c-switch
                  type="text"
                  class="v-switch"
                  on="Y"
                  off="N"
                  v-model="row.item.mandatoryYn"
                ></c-switch>
              </template>

              <template slot="action" slot-scope="row">
                <span class="ico">
                  <button type="button" v-if="row.index === 0" @click="onAddRow('apiResponseInfo','headers')"><i class="fa fa-plus-circle"></i></button>
                  <button type="button" v-if="row.index > 0" @click="onDelRow('apiResponseInfo','headers', row.index)"><i class="fa fa-times-circle"></i></button>
                </span>
              </template>
            </b-table>
          </b-form-fieldset>

          <!-- Sample Code -->
          <b-form-fieldset
            label="Sample Code"
            :invalid-feedback="$valid.msg.codes"
            :horizontal="true">
            <div :class="{'invalid-codes': !valid.sampleCodes }">
              <code-mirror
                v-model="items.apiResponseInfo.sampleCodes"
              ></code-mirror>
            </div>
          </b-form-fieldset>
        </div>

      </b-form>
    </b-collapse>

    <div class="page-btn">
      <b-button type="button" variant="outline-secondary" :to="{ name: 'API 관리' }">취소</b-button>
      <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
    </div>

  </div>
</template>

<script>
  import cSwitch from '@/components/Switch';
  import CodeMirror from '@/components/CodeMirror';

  export default {
    name: 'apis',
    components: {
      cSwitch,
      CodeMirror
    },

    data (){
      return {
        items: {
          apiName: null,
          serviceCode: null,
          httpMethodCode: null,
          adaptorCode: null,
          multipartYn: false,
          apiVersion: null,
          apiSectionCode: 'API_SECTION_01',
          nbBaseUrl: null,
          sbBaseUrl: null,
          apiUseYn: false,
          apiResponseInfoUseYn: false,
          nbHost: null,
          protocolCode: 'DOMAIN_PROTOCOL_01',
          apiRequestInfo: {
            contentTypeList: [],
            headers: [{
              name: null,
              dataTypeCode: null,
              mandatoryYn: true
            }],
            pathParameters: [],
            queryStringParameters: [{
              name: null,
              dataTypeCode: null,
              mandatoryYn: true
            }]
          },
          apiResponseInfo: {
            contentTypeList: [],
            headers: [{
              name: null,
              dataTypeCode: null,
              mandatoryYn: true
            }],
            sampleCodes: []
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

        nbParams: null,
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
          contentTypeList: this.items.apiRequestInfo.contentTypeList.length,
          sampleCodes: true
        }
      }
    },

    mounted (){
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
        this.items.apiRequestInfo.headers[0].dataTypeCode = { ...this.code.dataTypeCode[0]};
        this.items.apiRequestInfo.queryStringParameters[0].dataTypeCode = { ...this.code.dataTypeCode[0]};
        this.items.apiResponseInfo.headers[0].dataTypeCode = { ...this.code.dataTypeCode[0]};
      });
    },

    methods: {
      onSubmit (){
        const { nbHost, apiVersion, apiRequestInfo, apiResponseInfo, apiResponseInfoUseYn } = this.items;
        const protocolName = this.protocolCode.codeName;
        const getCode = (arr) => (!arr.length ||
        (arr.length && (arr[0].name === null || arr[0].name === ''))) ? [] :
          arr.map(({ name, dataTypeCode, mandatoryYn }) => ({
            name,
            dataTypeCode: dataTypeCode.code,
            mandatoryYn
          }));
        const parseSampleCodes = (codes) => {
          let pardeCodes;
          try {
            pardeCodes = codes === '' ? [] : JSON.parse(codes);
            this.valid.sampleCodes = true;
          }
          catch(exception){
            pardeCodes = [];
            this.valid.sampleCodes = false;
          }
          if (pardeCodes.constructor !== Array){
            pardeCodes = [];
            this.valid.sampleCodes = false;
          }
          return pardeCodes;
        };




        const submitItems = {
          ...this.items,
          nbBaseUrl: `${protocolName}${nbHost}/v${apiVersion}/${this.nbParams}`,
          apiRequestInfo: {
            ...this.items.apiRequestInfo,
            headers: getCode(apiRequestInfo.headers),
            pathParameters: getCode(apiRequestInfo.pathParameters),
            queryStringParameters: getCode(apiRequestInfo.queryStringParameters)
          },
          apiResponseInfo: apiResponseInfoUseYn ? {
            ...this.items.apiResponseInfo,
            headers: getCode(apiResponseInfo.headers),
            sampleCodes: parseSampleCodes(apiResponseInfo.sampleCodes)
          }: {
            contentTypeList: [],
            headers: [],
            sampleCodes: []
          }
        };
        const validate = this.validate(submitItems);
        // POST
        if (validate){
          this.$https.post('/apiManagement/apis', submitItems)
            .then((res) => {
              this.$router.push({ name: 'API 상세', params: { id: res.data.items }})
            })
            .catch((error) => {
              console.log(error);
            });
        }
      },

      onSelectHttpMethod ({ code }){
        if (code !== 'HTTP_METHOD_03'){
          this.items.multipartYn = false;
        }
      },

      onAddRow (type, item, data = {}){
        this.items[type][item].push(Object.assign({}, {
          name: '',
          dataTypeCode: this.code.dataTypeCode[0],
          mandatoryYn: true
        }, data));
      },

      onDelRow (type, item, index){
        this.items[type][item].splice(index, 1);
      },


      onInputParams (text){
        const match = text.match(/\{([^{}]+)\}/g);
        if (!match) {
          this.items.apiRequestInfo.pathParameters = [];
          return;
        }
        const matchName = match.map(text => text.split('{').join('').split('}').join(''));
        const params = this.items.apiRequestInfo.pathParameters.map(obj => ({...obj}));

        this.items.apiRequestInfo.pathParameters = matchName.map(name => {
          const isContain = params.length ?
            params.find(obj => obj.name === name)
            : false;
          return (isContain) ? isContain : {
            name,
            dataTypeCode: this.code.dataTypeCode[0],
            mandatoryYn: true
          }
        });
      },

      validate (submitItems){
        const {
          apiName,
          serviceCode,
          httpMethodCode,
          adaptorCode,
          apiVersion,
          apiSectionCode,
          nbBaseUrl,
          sbBaseUrl,
          apiRequestInfo,
        } = submitItems;
        const { contentTypeList, headers } = apiRequestInfo;

        let validateItems = {
          apiName,
          serviceCode,
          httpMethodCode,
          adaptorCode,
          apiVersion,
          apiSectionCode,
          nbBaseUrl,
          sbBaseUrl,
          contentTypeList,
          headers
        };
        const validate = (this.$valid.all(validateItems) && this.items.apiRequestInfo.headers.length > 0 && this.valid.sampleCodes);
        this.inValidForm = !validate;
        return validate;
      }
    }
  }
</script>
