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
        Origin
        <i class="fa fa-angle-down"></i>
      </b-button>
    </div>
    <b-collapse id="formDefault" visible>
      <b-card v-for="(origin, index) in items.originList" :key="origin.serviceTypeCode">
        <div slot="header">
          <i class='fa fa-angle-right'></i> {{ origin.serviceTypeName }}
        </div>

        <!-- Origin 사용설정 -->
        <b-form-fieldset
          label="Origin 사용 설정 *"
          :label-cols="3"
          :horizontal="true">
          <b-form-radio-group
            v-if="isEdit"
            v-model="origin.originSectionCode"
            :options="code.originSectionCode"
            :name="origin.serviceTypeCode"
            value-field="code"
            text-field="codeName"
          ></b-form-radio-group>
          <b-form-input
            v-else
            :value="origin.originSectionCodeName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- Bucket 선택 -->
        <b-form-fieldset
          v-if="origin.originSectionCode === 'ORIGIN_SECTION_01'"
          label="Bucket 선택 *"
          :label-cols="3"
          :horizontal="true">
          <multiselect
            v-if="isEdit"
            v-model="origin.originBucketId"
            label="originBucketName"
            class="inline"
            style="min-width: 120px;"
            :id="index"
            :allowEmpty="true"
            :showLabels="false"
            :searchable="false"
            :options="code.originBucketId"
            :loading="isLoad.originBucketId"
            @select="onBucket"
            placeholder="Select Bucket"
          ></multiselect>
          <b-form-input
            v-else
            :value="origin.originBucketName"
            type="text"
            plaintext
          ></b-form-input>
          {{ origin.operatorName }} /
          {{ origin.operatorTeamName }}
        </b-form-fieldset>

        <!-- Origin Domain -->
        <b-form-fieldset
          v-if="origin.originSectionCode === 'ORIGIN_SECTION_02'"
          label="Origin Domain *"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            v-model="origin.originDomainName"
            type="text"
            :plaintext="!isEdit"
          ></b-form-input>
        </b-form-fieldset>
        <b-form-fieldset
          v-if="origin.originSectionCode === 'ORIGIN_SECTION_02'"
          label="Port *"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            style="width: 120px"
            v-model="origin.originPort"
            type="text"
            :plaintext="!isEdit"
          ></b-form-input>
        </b-form-fieldset>
      </b-card>

      <b-card v-if="isEdit && !isCreate">
        <!-- 변경이력 -->
        <b-form-fieldset
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
        serviceName: '',
        items: {
          originList: [],
          createDateTime: "",
          createId: "",
          modifyDateTime: "",
          modifyId: "",
          modifyHistReason: "등록",
          histMgmtId: null,
        },
        code: {
          serviceTypeList: [],
          originSectionCode: [],
          originBucketId: []
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
          originSectionCode: true,
          originBucketId: true
        },
        isCreate: false,
        isEdit: false,
        isModalHistory: false,

        // 배포상태 - 임시
        deploy: {
          status: true,
          count: 11234
        }
      }
    },

    created (){
      // History
      const historyId = window.location.hash.split('?histories=')[1];
      const detailUrl = historyId !== undefined ? `/services/${this.id}/origins/histories/${historyId}` : `/services/${this.id}/origins`;

      // Service Name
      this.$https.get(`/services/${this.id}`)
        .then((res) => {
          this.serviceName = res.data.items.serviceName;
        });


      // Origin Service Type List
      this.$https.get(`${detailUrl}/types`)
        .then((res) => {
          this.code.serviceTypeList = res.data.items;
        });

      // Origin Section Code
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'ORIGIN_SECTION' }
        })
        .then((res) => {
          this.isLoad.originSectionCode = false;
          this.code.originSectionCode = res.data.items;
        });
      // Bucket List
      this.$https.get(`${detailUrl}/buckets`)
        .then((res) => {
          this.isLoad.originBucketId = false;
          this.code.originBucketId = res.data.items;
        });

      // Origin Data
      this.$https.get(detailUrl)
        .then((res) => {
          this.onLoadDetail(res.data);
        })
        .catch((error) => {
          this.onLoadCreate();
        })
    },

    methods: {
      onEdit (){
        this.isEdit = true;
      },

      onView (){
        this.isEdit = false;
        this.items = JSON.parse(JSON.stringify(this.originItems))
      },

      onLoadCreate (){
        this.isCreate = true;
        this.isEdit = true;
        this.items.originList = this.code.serviceTypeList.map(({ serviceTypeCode, serviceTypeName }) => ({
          serviceTypeCode,
          serviceTypeName,
          originSectionCodeName: '',
          originBucketId: null,
          originBucketName: '',
          operatorName: '',
          operatorTeamName: '',
          originSectionCode: null,
          originDomainName: null,
          originPort: null
        }))
      },

      onLoadDetail (data){
        this.items = {...data.items};
        this.items.originList = data.items.originList.map(obj => {
          const originSectionCode = this.code.originSectionCode.find(({code}) => {
            return code === obj.originSectionCode
          });
          const originSectionCodeName = originSectionCode ? originSectionCode.codeName : '';
          return {
            ...obj,
            originBucketId: obj.originBucketId
              ? this.code.originBucketId.find(({originBucketId}) => {
                  return originBucketId === obj.originBucketId
                })
              : null,
            originSectionCodeName: originSectionCode ? originSectionCode.codeName : ''
          }
        });
        this.originItems = JSON.parse(JSON.stringify(this.items))
      },

      onSubmit (){
        this.items.originList = this.items.originList.map(obj => {
          const {
            serviceTypeCode,
            originSectionCode,
            originBucketId,
            originDomainName,
            originPort
          } = obj;

          return {
            serviceTypeCode,
            originSectionCode,
            originBucketId: originBucketId ? originBucketId.originBucketId : null,
            originDomainName,
            originPort,
            modifyHistReason: this.items.modifyHistReason
          }
        });

        if (this.isCreate){
          this.$https.post(`/services/${this.id}/origins`, this.items.originList)
            .then(() => {
              this.$router.go(this.$router.currentRoute);
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          this.$https.put(`/services/${this.id}/origins`, this.items.originList)
            .then((res) => {
              this.$router.go(this.$router.currentRoute);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      },

      onBucket ({ operatorName, operatorTeamName }, index){
        this.items.originList[index].operatorName = operatorName;
        this.items.originList[index].operatorTeamName = operatorTeamName;
      },

      getHistoryLink (rowId){
        return `#/service/service/${this.id}/origin?histories=${rowId}`
      },

      showHistory () {
        this.isModalHistory = !this.isModalHistory;
        this.$https.get(`/services/${this.id}/origins/histories`)
          .then((res) => {
            this.history.items = res.data.items;
          });
      },

      getSelectLabel (option){
        let codeType = (option.code) ? option.code.split('_')[0] : '';
        let label = '';

        if (codeType === 'SERVICE'){
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
