<template>
  <div class="animated fadeIn">
    <content-header
      :title="serviceName"
      :name="name">
    </content-header>

    <div class="collapse-title">
      <b-button class="btn-collapse" v-b-toggle.formDefault>
        <i class="fa"></i>
        Origin
      </b-button>
    </div>

    <b-collapse id="formDefault" visible>
      <b-form class="formView" :validated="inValidForm" novalidate>

        <div class="repeats" v-for="(origin, index) in items.originList" :key="origin.serviceTypeCode">
          <h3 class="content-title"><i class="fa fa-circle"></i> {{ origin.serviceTypeName }}</h3>
          <!-- Origin 사용설정 -->
          <b-form-fieldset
            :horizontal="true">
            <template slot="label">
              Origin 사용 설정<i v-if="isEdit" class="require">*</i>
            </template>
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
            :invalid-feedback="$valid.msg.select"
            :horizontal="true">
            <template slot="label">
              Bucket 선택<i v-if="isEdit" class="require">*</i>
            </template>
            <multiselect
              v-if="isEdit"
              v-model="origin.originBucketId"
              label="originBucketName"
              class="inline"
              style="min-width:160px"
              :class="{'invalid': origin.originBucketId === null }"
              :id="index"
              :showLabels="false"
              :searchable="false"
              :options="code.bucket[origin.serviceTypeName]"
              @select="onBucket"
              placeholder="Select Bucket"
            ></multiselect>

            <span v-else class="form-text-alone">
              {{ origin.originBucketName }}
            </span>

            <span class="form-text-alone">
              ( {{ origin.operatorName }} /
              {{ origin.operatorTeamName }} )
            </span>
          </b-form-fieldset>

          <!-- Origin Domain -->
          <b-form-fieldset
            v-if="origin.originSectionCode === 'ORIGIN_SECTION_02'"
            :invalid-feedback="$valid.msg.require"
            :horizontal="true">
            <template slot="label">
              Origin Domain<i v-if="isEdit" class="require">*</i>
            </template>
            <b-form-input
              v-model="origin.originDomainName"
              type="text"
              :plaintext="!isEdit"
              required
            ></b-form-input>
          </b-form-fieldset>
          <b-form-fieldset
            v-if="origin.originSectionCode === 'ORIGIN_SECTION_02'"
            :invalid-feedback="$valid.msg.require"
            :horizontal="true">
            <template slot="label">
              Port<i v-if="isEdit" class="require">*</i>
            </template>
            <cleave
              v-if="isEdit"
              v-model="origin.originPort"
              style="width: 120px;"
              class="form-control"
              :options="{ numeral: true, numeralPositiveOnly: true, numeralDecimalScale: 0 }"
              required
            ></cleave>

            <span v-else class="form-text-alone">{{ origin.originPort }}</span>
          </b-form-fieldset>
        </div>

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

        <!-- 배포상태 -->
        <b-form-fieldset
          v-if="items.processStateCode"
          label="배포상태"
          :horizontal="true">
          <input
            type="text"
            readonly="readonly"
            class="form-control-plaintext"
            style="width:50px"
            :value="items.processStateCodeName"
          >
          <a :href="`#/workflow/service/${ items.processId }`" class="btn btn-in-table" target="_blank">{{ items.processId }}</a>
        </b-form-fieldset>
      </b-form>
    </b-collapse>



    <div class="page-btn" v-if="isEdit">
      <b-button type="button" variant="outline-secondary" @click="onView">취소</b-button>
      <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
    </div>
    <div class="page-btn" v-else>
      <b-button type="button" variant="outline-secondary" @click="showHistory">이력관리</b-button>
      <b-button
        v-if="isProcessComplete"
        type="button"
        variant="primary"
        @click="onEdit"
      >수정</b-button>
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
          modifyHistReason: null
        },

        code: {
          serviceTypeList: [],
          originSectionCode: [],
          bucket: {}
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
          originSectionCode: true,
          originBucketId: true
        },
        isCreate: false,
        isEdit: false,
        isModalHistory: false,

        inValidForm: false
      }
    },

    computed: {
      isProcessComplete (){
        return (this.items.processStateCode !== null &&
        this.items.processStateCode !== '' &&
        this.items.processStateCode === 'PROCESS_STATE_02')
      }
    },

    created (){
      // History
      const historyId = this.$route.query.histories;
      const detailUrl = historyId !== undefined ? `/services/${this.id}/origins/histories/${historyId}` : `/services/${this.id}/origins`;

      if (historyId){
        document.querySelector('body.app').classList.add('history-mode')
      }

      // Service Name
      this.$https.get(`/services/${this.id}`)
        .then((res) => {
          this.serviceName = res.data.items.serviceName;
        });

      // fetch
      const fetch = () => this.$https.get('/system/commonCode', { q: { groupCode: 'ORIGIN_SECTION' } });

      // fetch Origin Service Type
      const fetchCodeSection = (res) => {
        this.isLoad.originSectionCode = false;
        this.code.originSectionCode = res.data.items;
        return this.$https.get(`${detailUrl}/types`);
      };

      const fetchServiceType = (res) => {
        this.code.serviceTypeList = res.data.items;
        return this.$https.get(detailUrl);
      };

      fetch()
        .then(fetchCodeSection)
        .then(fetchServiceType)
        .then(this.fetchDetail);
    },

    methods: {
      fetchDetail (res){
        if (res.data.items === null){
          this.isCreate = true;
          this.isEdit = true;
        }else{
          this.originList = res.data.items.originList;
          this.items = { ...res.data.items, originList: []};
        }

        this.code.serviceTypeList.forEach(this.fetchBucketList);
      },

      fetchBucketList (obj){
        const { serviceTypeCode, serviceTypeName } = obj;
        const bucketList = () => this.$https.get('/services/origins/buckets', { serviceType: serviceTypeCode });
        bucketList().then((res) => {
          this.code.bucket[serviceTypeName] = res.data.items;
          this.setOriginList(serviceTypeCode, serviceTypeName);
        });
      },

      setOriginList (serviceTypeCode, serviceTypeName){
        const originItems = this.isCreate ? {
          serviceTypeCode,
          serviceTypeName,
          originSectionCode: 'ORIGIN_SECTION_01',
          originSectionCodeName: '',
          originBucketId: null,
          originBucketName: '',
          operatorName: '',
          operatorTeamName: '',
          originDomainName: null,
          originPort: null
        } : this.originList.find(obj => obj.serviceTypeCode === serviceTypeCode);

        const buckets = this.code.bucket[serviceTypeName];
        const originSectionCodeName = this.code.originSectionCode.find(({code}) => {
          return code === originItems.originSectionCode
        }).codeName;
        const originBucketId = originItems.originBucketId
            ? buckets.find(({originBucketId}) => {
                return originBucketId === originItems.originBucketId
              })
            : null;

        this.items.originList.push({
          ...originItems,
          originSectionCodeName,
          originBucketId
        });
      },

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

        this.onLoadDetail();
        this.items.originList = this.code.serviceTypeList.map(({ serviceTypeCode, serviceTypeName }) => ({
          serviceTypeCode,
          serviceTypeName,
          originSectionCode: 'ORIGIN_SECTION_01',
          originSectionCodeName: '',
          originBucketId: null,
          originBucketName: '',
          operatorName: '',
          operatorTeamName: '',
          originDomainName: null,
          originPort: null
        }))
      },

      onLoadDetail (items){
        this.items = {...items};
        this.items.originList = items.originList.map(obj => {
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
            originSectionCodeName
          }
        });
        this.originItems = JSON.parse(JSON.stringify(this.items))
      },

      onSubmit (){
        const submitItems = this.items.originList.map(obj => {
          const {
            serviceTypeCode,
            originSectionCode,
            originBucketId,
            originDomainName,
            originPort
          } = obj;

          const defaultItems = {
            serviceTypeCode,
            originSectionCode,
            modifyHistReason: this.items.modifyHistReason
          };

          return (originSectionCode === 'ORIGIN_SECTION_01') ? {
            ...defaultItems,
            originBucketId: originBucketId ? originBucketId.originBucketId : null
          } : {
            ...defaultItems,
            originDomainName,
            originPort
          }
        });

        const validate = this.$valid.all(submitItems);
        const submitAction = (this.isCreate) ?
          () => this.$https.post(`/services/${this.id}/origins`, submitItems) :
          () => this.$https.put(`/services/${this.id}/origins`, submitItems);

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
      }
    }
  }
</script>
