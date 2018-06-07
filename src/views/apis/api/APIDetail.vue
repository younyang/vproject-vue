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
            :horizontal="true">
            <template slot="label">
              Version<i class="require" v-if="isEdit">*</i>
            </template>
            <span v-if="isEdit">
               <span class="form-text-alone">v</span>
              <b-form-input
                v-model="items.apiVersion"
                style="width: 80px;"
                type="text"
                disabled
              ></b-form-input>
            </span>
            <b-form-input
              v-else
              :value="`v${items.apiVersion}`"
              style="width: 80px;"
              type="text"
              plaintext
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
              track-by="code"
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
            plaintext
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
            :plaintext="!isEdit"
            required
          ></b-form-input>
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
            v-model="items.apiUseYn"
          ></c-switch>
          <b-badge
            v-else
            pill
            :variant="items.apiUseYn ? 'success' : 'secondary'">
            {{ items.apiUseYn ? '사용' : '미사용' }}
          </b-badge>
        </b-form-fieldset>
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
        <!-- Content-Type -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.select"
          :horizontal="true">
          <template slot="label">
            Content-Type<i class="require" v-if="isEdit">*</i>
          </template>

          <multiselect
            v-if="isEdit"
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
          <div v-if="!isEdit && contentTypeList.length" class="badge-list">
            <span class="badge sm" v-for="item in contentTypeList">
              {{ item.codeName }}
            </span>
          </div>
        </b-form-fieldset>

        <!-- Header -->
        <b-form-fieldset
          :horizontal="true">
          <template slot="label">
            Header<i class="require" v-if="isEdit">*</i>
          </template>

          <b-table
            class="sub"
            show-empty
            :items="items.apiRequestInfo.headers"
            :fields="fields"
          >
            <template slot="name" slot-scope="row">
              <b-form-input
                v-if="isEdit"
                v-model="row.item.name"
                type="text"
                required
              ></b-form-input>
              <span v-else class="form-text-alone"
              >{{ row.item.name }}</span>
              <div class="invalid-tooltip">{{ $valid.msg.require }}</div>
            </template>
            <template slot="dataTypeCode" slot-scope="row">
              <multiselect
                v-if="isEdit"
                v-model="row.item.dataTypeCode"
                label="codeName"
                class="noEmpty"
                :allowEmpty="false"
                :showLabels="false"
                :searchable="false"
                :options="code.dataTypeCode"
                :loading="isLoad.dataTypeCode"
              ></multiselect>
              <span class="form-text-alone"
                v-if="!isEdit && row.item.dataTypeCode && typeof row.item.dataTypeCode === 'object'"
              >{{ row.item.dataTypeCode.codeName }}</span>
            </template>

            <template slot="mandatoryYn" slot-scope="row">
              <c-switch
                v-if="isEdit"
                type="text"
                class="v-switch"
                on="Y"
                off="N"
                v-model="row.item.mandatoryYn"
              ></c-switch>
              <b-badge
                v-else
                pill
                :variant="row.item.mandatoryYn ? 'success' : 'secondary'">
                {{ row.item.mandatoryYn ? 'Y' : 'N' }}
              </b-badge>
            </template>

            <template slot="action" slot-scope="row" v-if="isEdit">
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
                v-if="isEdit"
                v-model="row.item.name"
                type="text"
                disabled
              ></b-form-input>
              <span v-else class="form-text-alone"
              >{{ row.item.name }}</span>
            </template>
            <template slot="dataTypeCode" slot-scope="row">
              <multiselect
                v-if="isEdit"
                v-model="row.item.dataTypeCode"
                label="codeName"
                class="noEmpty"
                :allowEmpty="false"
                :showLabels="false"
                :searchable="false"
                :options="code.dataTypeCode"
                :loading="isLoad.dataTypeCode"
              ></multiselect>
              <span class="form-text-alone"
                    v-if="!isEdit && row.item.dataTypeCode && typeof row.item.dataTypeCode === 'object'"
              >{{ row.item.dataTypeCode.codeName }}</span>
            </template>

            <template slot="mandatoryYn" slot-scope="row">
              <c-switch
                v-if="isEdit"
                type="text"
                class="v-switch"
                on="Y"
                off="N"
                v-model="row.item.mandatoryYn"
              ></c-switch>
              <b-badge
                v-else
                pill
                :variant="row.item.mandatoryYn ? 'success' : 'secondary'">
                {{ row.item.mandatoryYn ? 'Y' : 'N' }}
              </b-badge>
            </template>
          </b-table>
        </b-form-fieldset>

        <!-- Querystring Parameter -->
        <b-form-fieldset
          label="QueryString<br>Parameter"
          :horizontal="true">

          <b-table
            class="sub"
            show-empty
            :items="items.apiRequestInfo.queryStringParameters"
            :fields="fields"
          >
            <template slot="name" slot-scope="row">
              <b-form-input
                v-if="isEdit"
                v-model="row.item.name"
                type="text"
                required
              ></b-form-input>
              <span v-else class="form-text-alone"
              >{{ row.item.name }}</span>
              <div class="invalid-tooltip">{{ $valid.msg.require }}</div>
            </template>
            <template slot="dataTypeCode" slot-scope="row">
              <multiselect
                v-if="isEdit"
                v-model="row.item.dataTypeCode"
                label="codeName"
                class="noEmpty"
                :allowEmpty="false"
                :showLabels="false"
                :searchable="false"
                :options="code.dataTypeCode"
                :loading="isLoad.dataTypeCode"
              ></multiselect>
              <span class="form-text-alone"
                    v-if="!isEdit && row.item.dataTypeCode && typeof row.item.dataTypeCode === 'object'"
              >{{ row.item.dataTypeCode.codeName }}</span>
            </template>

            <template slot="mandatoryYn" slot-scope="row">
              <c-switch
                v-if="isEdit"
                type="text"
                class="v-switch"
                on="Y"
                off="N"
                v-model="row.item.mandatoryYn"
              ></c-switch>
              <b-badge
                v-else
                pill
                :variant="row.item.mandatoryYn ? 'success' : 'secondary'">
                {{ row.item.mandatoryYn ? 'Y' : 'N' }}
              </b-badge>
            </template>

            <template slot="action" slot-scope="row" v-if="isEdit">
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
        Response정보
      </b-button>
    </div>
    <b-collapse id="formResponse" visible>
      <b-form class="formView">
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
            v-model="items.apiResponseInfoUseYn"
          ></c-switch>
          <b-badge
            v-else
            pill
            :variant="items.apiResponseInfoUseYn ? 'success' : 'secondary'">
            {{ items.apiResponseInfoUseYn ? '사용' : '미사용' }}
          </b-badge>
        </b-form-fieldset>

        <div v-if="items.apiResponseInfoUseYn">
          <!-- Accept -->
          <b-form-fieldset
            label="Accept"
            :horizontal="true">
            <multiselect
              v-if="isEdit"
              v-model="acceptCode"
              class="multiple"
              :multiple="true"
              :showLabels="false"
              :options="code.acceptCode"
              :loading="isLoad.acceptCode"
              track-by="code"
              label="codeName"
            ></multiselect>
            <div
              v-if="!isEdit && acceptCode.length"
              class="badge-list"
            >
              <span class="badge sm" v-for="item in acceptCode">
                {{ item.codeName }}
              </span>
            </div>
          </b-form-fieldset>

          <!-- Headers -->
          <b-form-fieldset
            label="Header"
            :horizontal="true">
            <b-table
              class="sub"
              show-empty
              :items="items.apiResponseInfo.headers"
              :fields="fields"
            >
              <template slot="name" slot-scope="row">
                <b-form-input
                  v-if="isEdit"
                  v-model="row.item.name"
                  type="text"
                  required
                ></b-form-input>
                <span v-else class="form-text-alone"
                >{{ row.item.name }}</span>
                <div class="invalid-tooltip">{{ $valid.msg.require }}</div>
              </template>
              <template slot="dataTypeCode" slot-scope="row">
                <multiselect
                  v-if="isEdit"
                  v-model="row.item.dataTypeCode"
                  label="codeName"
                  class="noEmpty"
                  :allowEmpty="false"
                  :showLabels="false"
                  :searchable="false"
                  :options="code.dataTypeCode"
                  :loading="isLoad.dataTypeCode"
                ></multiselect>
                <span class="form-text-alone"
                      v-if="!isEdit && row.item.dataTypeCode && typeof row.item.dataTypeCode === 'object'"
                >{{ row.item.dataTypeCode.codeName }}</span>
              </template>

              <template slot="mandatoryYn" slot-scope="row">
                <c-switch
                  v-if="isEdit"
                  type="text"
                  class="v-switch"
                  on="Y"
                  off="N"
                  v-model="row.item.mandatoryYn"
                ></c-switch>
                <b-badge
                  v-else
                  pill
                  :variant="row.item.mandatoryYn ? 'success' : 'secondary'">
                  {{ row.item.mandatoryYn ? 'Y' : 'N' }}
                </b-badge>
              </template>

              <template slot="action" slot-scope="row" v-if="isEdit">
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
                :isEdit="isEdit"
                v-model="items.apiResponseInfo.sampleCodes"
              ></code-mirror>
            </div>
          </b-form-fieldset>
        </div>
      </b-form>
    </b-collapse>

    <b-form
      v-if="isEdit"
      class="formView mt-4"
      :validated="inValidForm"
      novalidate
    >
      <!-- 변경이력 -->
      <b-form-fieldset
        label="변경이력<i class='require'>*</i>"
        :invalid-feedback="$valid.msg.require"
        :horizontal="true">
        <b-form-textarea
          v-model="items.modifyHistReason"
          required
          :rows="6">
        </b-form-textarea>
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
      <b-button type="button" variant="outline-secondary"
                @click="onDeploy"
                v-if="deployStatusName !== ''"
      >{{ deployStatusName }}</b-button>
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
      <div slot="modal-footer" class="mx-auto" v-if="modal.alert">
        <b-button type="button" variant="primary" @click="modal.open = false">닫기</b-button>
      </div>
      <div slot="modal-footer" class="mx-auto" v-else>
        <b-button type="button" variant="primary" @click="modal.action">확인</b-button>
        <b-button type="button" variant="outline-secondary" @click="modal.open = false">취소</b-button>
      </div>
    </b-modal>

  </div>
</template>

<script>
  import moment from 'moment';
  import ContentHeader from '@/components/ContentHeader';
  import cSwitch from '@/components/Switch';
  import CodeMirror from '@/components/CodeMirror';
  export default {
    name: 'api',
    props: ['id', 'histories'],
    components: {
      ContentHeader,
      cSwitch,
      CodeMirror
    },

    data (){
      return {
        name: 'API 상세',
        originItems: {},
        items: {
          apiName: null,
          serviceCode: null,
          httpMethodCode: null,
          adaptorCode: null,
          multipartYn: false,
          apiVersion: null,
          apiSectionCode: null,
          nbBaseUrl: null,
          sbBaseUrl: null,
          apiUseYn: false,
          apiResponseInfoUseYn: false,
          nbHost: null,
          protocolCode: null,
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
          },
          modifyHistReason: null
        },
        code: {
          serviceCode: [],
          httpMethodCode: [],
          adaptorCode: [],
          apiSectionCode : [],
          protocolCode: [],
          contentTypeList: [],
          acceptCode: [],
          dataTypeCode: [],
          apiStatusCode: []
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

      fields (){
        const fields = {
          name: {label: 'Name', 'class': 'text-left', thStyle: { width: '500px'}},
          dataTypeCode: {label: 'Type', thStyle: { width: '250px'}},
          mandatoryYn: {label: 'Mandatory'},
        };
        return this.isEdit ? { ...fields, action: {label: '#'}} : fields;
      },

      deployStatusName (){
        return this.items.apiStateCodeName === 'Created' ? 'Deployed' :
          this.items.apiStateCodeName === 'Deployed' ? 'Published' :
          this.items.apiStateCodeName === 'Published' ? 'Deprecated' : ''
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
      // History
      const historyId = this.$route.query.histories;
      this.detailUrl = historyId !== undefined ? `/apiManagement/apis/${this.id}/histories/${historyId}` : `/apiManagement/apis/${this.id}`;

      if (historyId){
        document.querySelector('body.app').classList.add('history-mode');
      }

      // fetch Code
      this.$https.get('/system/commonCode', { q: { groupCode: 'API_SERVICE' } })
        .then((res) => {
          this.isLoad.serviceCode = false;
          this.code.serviceCode = res.data.items;
        });
      this.$https.get('/system/commonCode', { q: { groupCode: 'HTTP_METHOD' } })
        .then((res) => {
          this.isLoad.httpMethodCode = false;
          this.code.httpMethodCode = res.data.items;
        });
      this.$https.get('/system/commonCode', { q: { groupCode: 'API_ADAPTOR' } })
        .then((res) => {
          this.isLoad.adaptorCode = false;
          this.code.adaptorCode = res.data.items;
        });
      this.$https.get('/system/commonCode', { q: { groupCode: 'API_SECTION' } })
        .then((res) => {
          this.isLoad.apiSectionCode = false;
          this.code.apiSectionCode = res.data.items;
        });
      this.$https.get('/system/commonCode', { q: { groupCode: 'DOMAIN_PROTOCOL' } })
        .then((res) => {
          this.isLoad.protocolCode = false;
          this.code.protocolCode = res.data.items;
        });
      this.$https.get('/system/commonCode', { q: { groupCode: 'CONTENT_TYPE' } })
        .then((res) => {
          this.isLoad.contentTypeList = false;
          this.code.contentTypeList = res.data.items;
        });
      this.$https.get('/system/commonCode', { q: { groupCode: 'ACCEPT_TYPE' } })
        .then((res) => {
          this.isLoad.acceptCode = false;
          this.code.acceptCode = res.data.items;
        });
      this.$https.get('/system/commonCode', { q: { groupCode: 'DATA_TYPE' } })
        .then((res) => {
          this.isLoad.dataTypeCode = false;
          this.code.dataTypeCode = res.data.items;
        });
      this.$https.get('/system/commonCode', { q: { groupCode: 'API_STATE' } })
        .then((res) => {
          this.code.apiStatusCode = res.data.items;
        });
      this.$https.get(this.detailUrl).then(this.fetchDetail);
    },

    methods: {
      onEdit (){
        this.isEdit = true;
        const { apiRequestInfo, apiResponseInfo } = this.items;
        const pushItems = {
          name: null,
          dataTypeCode: this.code.dataTypeCode[0],
          mandatoryYn: true
        };
        if (!apiRequestInfo.queryStringParameters.length){
          apiRequestInfo.queryStringParameters.push(pushItems);
        }
        if (!apiResponseInfo.headers.length){
          apiResponseInfo.headers.push(pushItems);
        }
      },

      onView (){
        this.isEdit = false;
        this.items = JSON.parse(JSON.stringify(this.originItems));
        this.setUrlParams();
        this.setDataTypeCodes();
      },

      fetchDetail (res){
        this.items = res.data.items;
        this.originItems = JSON.parse(JSON.stringify(this.items));
        this.setUrlParams();
        this.setDataTypeCodes();
      },

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
            sampleCodes: parseSampleCodes(apiResponseInfo.sampleCodes)
          }
        };
        const validate = this.validate(submitItems);
        // PUT
        if (validate){
          this.$https.put(`/apiManagement/apis/${this.id}`, submitItems)
            .then(() => {
              this.onSuccess();
            })
            .catch((error) => {
              console.log(error);
            });
        }
      },

      onSuccess (){
        if (this.isEdit){
          this.onView();
        }
        if (this.modal.open){
          this.modal.open = false;
        }
        this.$https.get(this.detailUrl).then(this.fetchDetail);
      },

      onDelete (){
        const message = this.items.apiUseYn ?
          `사용 중인 경우, 삭제할 수 없습니다.
           사용여부 변경 후 다시 시도해주세요` : 'API를 삭제하시겠습니까?';
        this.modal = {
          open: true,
          type: 'error',
          msg: message,
          alert: this.items.apiUseYn,
          action: this.onDeleteData
        };
      },

      onDeleteData (){
        this.$https.delete(`/apiManagement/apis/${this.id}`)
          .then(() => {
            this.$router.push({ name: 'API 관리' });
          })
          .catch((error) => {
            console.log(error);
          });
      },

      onDeploy (){
        this.modal = {
          open: true,
          type: 'done',
          msg: `${this.deployStatusName} 상태로 변경하시겠습니까?`,
          action: this.onDeployData
        };
      },

      onDeployData (){
        const status = this.code.apiStatusCode.find(({ codeName }) => codeName === this.deployStatusName);
        if (status){
          const apiStateCode = status.code;
          this.$https.put(`/apiManagement/apis/${this.id}/status?apiStateCode=${apiStateCode}`)
            .then(this.onSuccess)
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
          apiResponseInfoUseYn,
          nbBaseUrl,
          sbBaseUrl,
          apiRequestInfo,
          modifyHistReason
        } = submitItems;
        const { contentTypeList, headers } = apiRequestInfo;
        const isValidSampleCodes = !apiResponseInfoUseYn ? true : this.valid.sampleCodes;

        let validateItems = {
          apiName,
          serviceCode,
          httpMethodCode,
          adaptorCode,
          apiSectionCode,
          nbBaseUrl,
          sbBaseUrl,
          contentTypeList,
          headers,
          modifyHistReason
        };
        const validate = (this.$valid.all(validateItems) && this.items.apiRequestInfo.headers.length > 0 && isValidSampleCodes);
        this.inValidForm = !validate;
        return validate;
      },

      getHistoryLink (rowId){
        return `#/apis/api/${this.id}?histories=${rowId}`
      },

      showHistory () {
        this.isModalHistory = !this.isModalHistory;
        this.$https.get(`/apiManagement/apis/${this.id}/histories`)
          .then((res) => {
            this.history.items = res.data.items;
          });
      },

      setUrlParams (){
        const { nbBaseUrl, apiVersion } = this.items;
        this.nbParams = nbBaseUrl.split(`${apiVersion}/`)[1];
      },

      setDataTypeCodes (){
        const { apiRequestInfo, apiResponseInfo } = this.items;
        const setCode = (arr) => (!arr.length ||
        (arr.length && (arr[0].name === null || arr[0].name === ''))) ? [] :
          arr.map(({ name, dataTypeCode, mandatoryYn }) => ({
            name,
            dataTypeCode: this.code.dataTypeCode.find(obj => obj.code === dataTypeCode),
            mandatoryYn
          }));
        apiRequestInfo.headers = setCode(apiRequestInfo.headers);
        apiRequestInfo.pathParameters = setCode(apiRequestInfo.pathParameters);
        apiRequestInfo.queryStringParameters = setCode(apiRequestInfo.queryStringParameters);
        apiResponseInfo.headers = setCode(apiResponseInfo.headers);

        apiResponseInfo.sampleCodes = JSON.stringify(apiResponseInfo.sampleCodes, null, 4);
      }
    }
  }
</script>
