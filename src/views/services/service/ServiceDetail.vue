<template>
  <div class="animated fadeIn">
    <content-header
      :title="item.serviceName"
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
          <!-- Edit -->
          <multiselect
            v-model="accountId"
            :options="code.account"
            :showLabels="false"
            :custom-label="getSelectLabel"
            :loading="isLoad.account"
            :disabled="!isEdit"
            :class="{'view-type': !isEdit}"
            placeholder="Select account"
          ></multiselect>
        </b-form-fieldset>

        <!-- Service Name :: Edit -->
        <b-form-fieldset
          v-if="isEdit"
          label="Service Name"
          description="Service Name은 도메인에 포함되기 때문에 영문, 숫자만 입력 가능합니다."
          :label-cols="3"
          :horizontal="true">
          <b-input-group>
            <b-form-input
              v-model="item.serviceName"
              type="text"
              placeholder="Enter service name">
            </b-form-input>
            <b-input-group-button slot="right" class="ml-2">
              <b-button variant="outline-secondary">중복확인</b-button>
            </b-input-group-button>
          </b-input-group>
        </b-form-fieldset>
        <!-- Service Name :: View -->
        <b-form-fieldset
          label="Service Name"
          v-else
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="item.serviceName"
            plaintext
            type="text"></b-form-input>
        </b-form-fieldset>

        <!-- Service Type -->
        <b-form-fieldset
          label="Service Type"
          :label-cols="3"
          :horizontal="true">

          <multiselect
            v-model="serviceTypeCode"
            :multiple="true"
            :showLabels="false"
            :options="code.serviceType"
            :custom-label="getSelectLabel"
            :loading="isLoad.serviceType"
            track-by="code"
            :disabled="true"
            :class="{'view-type': !isEdit}"
            placeholder="Select service type"
          ></multiselect>
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
          <ul class="icons-list" :class="{'list-view': !isEdit }">
            <li v-for="(domain, index) in serviceDomainList">
              <i class="bg-primary" v-b-tooltip.hover :title="domain.serviceCodeName">{{ domain.serviceCodeVal }}</i>
              <div class="desc">
                <small>Domain</small>
                <div class="title">
                  <multiselect
                    label="domainProtocolCode"
                    v-model="domain.domainProtocolCode"
                    class="inline sm protocol"
                    :showLabels="false"
                    :allow-empty="true"
                    :options="code.domainProtocol"
                    :custom-label="getSelectLabel"
                    :loading="isLoad.domainProtocol"
                    :disabled="!isEdit"
                    :class="{'view-type': !isEdit}"
                    placeholder="://"
                  ></multiselect>
                  {{ domain.serviceCodeVal | lowercase }}.{{ item.serviceName }}.vessels.com
                </div>
              </div>
              <div class="value" v-if="isEdit">
                <div class="small text-muted">Hashing Type</div>
                <multiselect
                  v-model="domain.domainHashingTypeCode"
                  class="inline sm"
                  style="width: 120px"
                  :showLabels="false"
                  :allow-empty="true"
                  :options="code.domainHashing"
                  :custom-label="getSelectLabel"
                  :loading="isLoad.domainHashing"
                  :disabled="!isEdit"
                  :class="{'view-type': !isEdit}"
                  placeholder="Select"
                ></multiselect>
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
            v-model="item.cnameUseYn"
            :pill="true" />
          <b-badge
            v-else
            pill
            :variant="item.cnameUseYn ? 'success' : 'secondary'">
            {{ item.cnameUseYn ? '사용' : '미사용' }}
          </b-badge>
        </b-form-fieldset>

        <!-- CNAME Domain -->
        <b-form-fieldset
          v-if="item.cnameUseYn"
          label="CNAME 도메인"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            v-if="isEdit"
            v-model="item.cnameDomainName"
            type="text"></b-form-input>
          <b-form-input
            v-else
            :value="item.cnameDomainName"
            plaintext
            type="text"></b-form-input>
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
            v-model="item.sslCertUseYn"
            :pill="true" />
          <b-badge
            v-else
            pill
            :variant="item.sslCertUseYn ? 'success' : 'secondary'">
            {{ item.sslCertUseYn ? '사용' : '미사용' }}
          </b-badge>
        </b-form-fieldset>

        <!-- SSL 인증서 정보 입력-->
        <b-form-fieldset
          v-if="item.sslCertUseYn"
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
                v-model="item.sslCert"
                :plaintext="!isEdit"
                :no-resize="!isEdit"
                :disabled="!isEdit"
                :rows="2"
                placeholder="Cert">
              </b-form-textarea>
            </b-form-fieldset>
            <b-form-fieldset
              label="Key"
              :label-cols="2"
              :horizontal="true">
              <b-form-textarea
                v-model="item.sslCertKey"
                :plaintext="!isEdit"
                :no-resize="!isEdit"
                :disabled="!isEdit"
                :rows="2"
                placeholder="Key">
              </b-form-textarea>
            </b-form-fieldset>
            <b-form-fieldset
              label="만료일"
              :label-cols="2"
              :horizontal="true">
              <b-form-input
                type="date"
                :plaintext="!isEdit"
                v-model="item.sslCertExpireDate">
              </b-form-input>
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
            :variant="item.serviceUseYn ? 'success' : 'secondary'">
            {{ item.serviceUseYn ? '사용' : '미사용' }}
          </b-badge>
          <b-button
            v-if="!isEdit"
            class="only-icon"
            variant="link">
            <i class="fa fa-pencil" ></i>
          </b-button>
        </b-form-fieldset>

        <!-- 배포상태 -->
        <b-form-fieldset
          v-if="!isEdit"
          label="배포상태"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="item.deploy.status ? '성공' : '실패'"
            style="width:30px"
            plaintext
            type="text"></b-form-input>
          (<a href="#">{{ item.deploy.count }}</a>)
        </b-form-fieldset>

        <!-- 변경이력 -->
        <b-form-fieldset
          v-if="isEdit"
          label="변경이력"
          :label-cols="3"
          :horizontal="true">
          <b-form-textarea
            v-model="item.modifyHistReason"
            :rows="6">
          </b-form-textarea>
        </b-form-fieldset>

        <div slot="footer" class="form-btn" v-if="isEdit">
          <b-button type="button" size="sm" variant="primary" @click="onSubmit"><i class="fa fa-dot-circle-o"></i> 저장</b-button>
          <b-button type="button" size="sm" variant="secondary" @click="onView"><i class="fa fa-ban"></i> 취소</b-button>
        </div>
        <div slot="footer" class="form-btn" v-else>
          <b-button type="button" size="sm" variant="danger" class="float-left" @click="onDelete"><i class="fa fa-times"></i> 삭제</b-button>
          <b-button type="button" size="sm" variant="outline-primary">이력관리</b-button>
          <b-button type="button" size="sm" variant="primary" @click="onEdit"><i class="fa fa-pencil"></i> 수정</b-button>
          <b-button type="button" size="sm" variant="secondary" :to="{ name: 'Service 관리' }"><i class="fa fa-list"></i> 목록</b-button>
        </div>
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
            :value="item.createDateTime"
            plaintext
            type="text"></b-form-input>
        </b-form-fieldset>
        <!-- 등록자 -->
        <b-form-fieldset
          label="등록자"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="item.createId"
            plaintext
            type="text"></b-form-input>
        </b-form-fieldset>
        <!-- 수정일 -->
        <b-form-fieldset
          v-if="item.modifyDateTime"
          label="수정일"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="item.modifyDateTime"
            plaintext
            type="text"></b-form-input>
        </b-form-fieldset>
        <!-- 수정자 -->
        <b-form-fieldset
          v-if="item.modifyDateTime"
          label="수정자"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="item.modifyId"
            plaintext
            type="text"></b-form-input>
        </b-form-fieldset>
      </b-card>
    </b-collapse>

    <!-- Service Type 수정 Modal -->
    <b-modal id="serviceModal" size="lg" v-model="isModalService">
      <template slot="modal-title">
        {{ item.serviceName }}
        <small> > Service Type</small>
      </template>

      <div class="form-in-group">
        <!-- Cert -->
        <b-form-fieldset
          label="Service Type"
          :label-cols="2"
          :horizontal="true">
          <multiselect
            v-model="modalService.serviceTypeCode"
            :value="serviceTypeCode"
            :multiple="true"
            :showLabels="false"
            :options="code.serviceType"
            :custom-label="getSelectLabel"
            :loading="isLoad.serviceType"
            track-by="code"
          ></multiselect>
        </b-form-fieldset>
        <b-form-fieldset
          label="이력관리"
          :label-cols="2"
          :horizontal="true">
          <b-form-textarea :rows="6" v-model="item.modifyHistReason"></b-form-textarea>
        </b-form-fieldset>
      </div>

      <div slot="modal-footer">
        <b-button type="button" size="sm" variant="primary" @click="onSubmitService"><i class="fa fa-dot-circle-o"></i> 저장</b-button>
        <b-button type="button" size="sm" variant="danger" @click="isModalService=false"><i class="fa fa-ban"></i> 취소</b-button>
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

    computed: {
      accountId: {
        get () {
          return this.item.accountId !== null
            ? this.code.account.find(obj => obj.accountId === this.item.accountId)
            : null;
        },
        set (newValue) {
          this.item.accountId = newValue !== null
            ? newValue.accountId
            : null;
        }
      },
      serviceTypeCode: {
        get () {
          return this.item.serviceTypeCode.length > 0
            ? this.item.serviceTypeCode.map(val => this.code.serviceType.find(obj => obj.code === val))
            : [];
        },
        set (newValue) {
          this.item.serviceTypeCode = newValue.length > 0
            ? newValue.map(obj => obj.code)
            : [];
        }
      },
      serviceDomainList (){
        return this.item.serviceDomainList.length > 0
          ? this.item.serviceDomainList.map(obj => {
            const serviceCode = this.getCodeObj(obj.serviceTypeCode);
            return Object.assign({}, obj, {
              domainProtocolCode: this.code.domainProtocol.find(({code}) => code === obj.domainProtocolCode),
              domainHashingTypeCode: this.code.domainHashing.find(({code}) => code === obj.domainHashingTypeCode),
              serviceCodeVal: serviceCode.codeValChar1,
              serviceCodeName: serviceCode.codeName
            })
          })
          : [];
      }
    },

    data (){
      return {
        name: 'Service 상세',
        item: {
          accountId: null,
          serviceName: '',
          serviceTypeCode: [],
          serviceDomainList: [],
          cnameUseYn: false,
          cnameDomainName: '',
          sslCertUseYn: false,
          sslCert: '',
          sslCertKey: '',
          sslCertExpireDate: '',
          serviceUseYn: false,
          modifyHistReason: '',
          deploy: {
            status: null,
            count: null
          }
        },
        code: {
          account: [],
          serviceType: [],
          domainProtocol: [],
          domainHashing: []
        },
        isLoad: {
          account: true,
          serviceType: true,
          domainProtocol: true,
          domainHashing: true
        },
        isEdit: false,
        isModalService: false,
        isModalUse: false,
        isModalHistory: false,
        modalService: {
          serviceTypeCode: [],
          history: ''
        },
        modalUseYn: {
          serviceUseYn: false,
          history: ''
        }
      }
    },

    created (){
      this.$https.get(`/services/${this.id}`)
        .then((res) => {
          this.item = res.data
        });
      this.$https.get('/account')
        .then((res) => {
          this.isLoad.account = false;
          this.code.account = res.data
        });
      this.$https.get('/system/commonCode/serviceType')
        .then((res) => {
          this.isLoad.serviceType = false;
          this.code.serviceType = res.data
        });
      this.$https.get('/system/commonCode/protocol')
        .then((res) => {
          this.isLoad.domainProtocol = false;
          this.code.domainProtocol = res.data
        });
      this.$https.get('/system/commonCode/hashing')
        .then((res) => {
          this.isLoad.domainHashing = false;
          this.code.domainHashing = res.data
        });
    },

    methods: {
      onEdit (){
        this.isEdit = true;
      },

      onView (){
        this.isEdit = false;
      },

      onSubmit (){
        this.item.serviceDomainList = this.serviceDomainList.map(obj => {
          return {
            serviceTypeCode: obj.serviceTypeCode,
            domainProtocolCode: obj.domainProtocolCode !== null ? obj.domainProtocolCode.code : null,
            domainHashingTypeCode: obj.domainHashingTypeCode !== null ? obj.domainHashingTypeCode.code : null
          }
        });

        delete this.item.deploy;


        this.$https.put(`/services/${this.id}`, this.item)
          .then((res) => {
            this.$router.go(this.$router.currentRoute);
          })
          .catch((error) => {
            console.log(error);
          });
      },

      // Service Type Popup Save
      onSubmitService (){
        console.log(this.modalService)
        /*
        const serviceType = this.serviceType
        const isContain = this.serviceDomainList.find(({serviceCodeVal}) => serviceCodeVal === item.codeValChar1);
        if (!isContain){
          this.item.serviceDomainList.push({
            serviceTypeCode: item.code,
            domainProtocolCode: null,
            domainHashingTypeCode: null
          });
        }*/

      },

      onDelete (){
        this.$https.delete(`/services/${this.id}`)
          .then((res) => {
            this.$router.push({ name: 'Service 관리' });
          })
          .catch((error) => {
            console.log(error);
          });
      },

      getCodeObj (code){
        return this.code.serviceType.find(obj => obj.code === code) || {};
      },

      getSelectLabel (option){
        let codeType = (option.accountName)
          ? 'ACCOUNT'
          : (option.code) ? option.code.split('_')[0] : '';
        let label = '';

        if (codeType === 'ACCOUNT'){
          label = `${option.accountName}/${option.companyName}`;
        } else if (codeType === 'SERVICE'){
          label = option.codeValChar1 !== option.codeName
            ? `${option.codeValChar1} > ${option.codeName}`
            : option.codeName
        } else {
          label = option.codeName
        }
        return label
      }
    }
  }
</script>
