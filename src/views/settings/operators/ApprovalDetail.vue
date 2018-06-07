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

        <!-- Operator Id -->
        <b-form-fieldset
          :horizontal="true">
          <template slot="label">
            ID<i class="require" v-if="isEdit">*</i>
          </template>

          <b-form-input
            v-model="items.loginId"
            type="text"
            plaintext
            required
          ></b-form-input>
        </b-form-fieldset>
        <!-- Operator Name -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <template slot="label">
            이름<i class="require" v-if="isEdit">*</i>
          </template>

          <b-form-input
            v-model="items.operatorName"
            type="text"
            placeholder="Enter Name"
            :plaintext="!isEdit"
            required
          ></b-form-input>
        </b-form-fieldset>

        <!-- Company Name -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.select"
          :horizontal="true">
          <template slot="label">
            회사명<i class="require" v-if="isEdit">*</i>
          </template>

          <multiselect
            v-model="companyCode"
            :showLabels="false"
            :searchable="false"
            :options="code.companyCode"
            :loading="isLoad.companyCode"
            v-if="isEdit"
            label="codeName"
            track-by="code"
            placeholder="전체"
          ></multiselect>

          <b-form-input
            v-model="items.companyName"
            v-if="!isEdit"
            type="text"
            plaintext
            required
          ></b-form-input>

        </b-form-fieldset>

        <!-- Dept Name -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <template slot="label">
            부서<i class="require" v-if="isEdit">*</i>
          </template>

          <b-form-input
            v-model="items.deptName"
            type="text"
            placeholder="Enter deptName"
            :plaintext="!isEdit"
            required
          ></b-form-input>
        </b-form-fieldset>

        <!-- Email -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <template slot="label">
            이메일<i class="require" v-if="isEdit">*</i>
          </template>

          <b-form-input
            v-model="items.email"
            type="text"
            placeholder="Enter email"
            :plaintext="!isEdit"
            required
          ></b-form-input>
        </b-form-fieldset>

        <!-- 전화번호 -->
        <b-form-fieldset
          label="전화번호"
          :horizontal="true">

          <b-form-input
            v-model="items.telephoneNumber"
            type="text"
            placeholder="Enter telephoneNumber"
            :plaintext="!isEdit"
          ></b-form-input>
        </b-form-fieldset>

        <!-- 휴대폰 -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <template slot="label">
            휴대폰<i class="require" v-if="isEdit">*</i>
          </template>

          <b-form-input
            v-model="items.cellphoneNumber"
            type="text"
            placeholder="Enter cellphoneNumber"
            :plaintext="!isEdit"
            required
          ></b-form-input>
        </b-form-fieldset>

        <!-- 그룹 -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.select"
          :horizontal="true">
          <template slot="label">
            그룹<i class="require" v-if="isEdit">*</i>
          </template>

          <multiselect
            v-model="groupList"
            :class="{'invalid' : (valid.groupList)}"
            v-if="isEdit"
            class="multiple"
            label="groupName"
            track-by="groupId"
            :multiple="true"
            :showLabels="false"
            :options="code.groupList"
            :loading="isLoad.groupCode"
            @select="groupSelect"
            @remove="groupRemove"
            placeholder="Select group"
          ></multiselect>

          <div class="badge-list" v-else>
            <span class="badge sm" v-for="item in items.operatorGroupList">
              {{ item.groupName }}
            </span>
          </div>
        </b-form-fieldset>

        <!-- 서비스 -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.select"
          :horizontal="true">
          <template slot="label">
            서비스<i class="require" v-if="isEdit">*</i>
          </template>

          <multiselect
            v-model="serviceList"
            :class="{'invalid' : (valid.serviceList)}"
            v-if="isEdit"
            class="multiple"
            label="serviceName"
            track-by="serviceId"
            :multiple="true"
            :showLabels="false"
            :options="code.serviceCode"
            :loading="isLoad.serviceCode"
            @select="serviceSelect"
            @remove="serviceRemove"
            placeholder="Select service"
            :disabled="groupSelectPlatform"
          ></multiselect>

          <div class="badge-list" v-else>
            <span class="badge sm" v-for="item in items.operatorServiceList">
              {{ item.serviceName }}
            </span>
          </div>
        </b-form-fieldset>
      </b-form>
    </b-collapse>

    <!-- 처리이력 -->
    <div class="collapse-title">
      <b-button class="btn-collapse" v-b-toggle.formHistory>
        <i class="fa"></i>
        승인 관리
      </b-button>
    </div>
    <b-collapse id="formHistory" visible>
      <b-form class="formView" :validated="inValidForm">
        <div class="form-row">
          <!-- 가입신청일시 -->
          <b-form-fieldset
            label="가입신청일시"
            :horizontal="true">

            <b-form-input
              v-model="items.joinApplyDatetime"
              type="text"
              plaintext
              required
            ></b-form-input>
          </b-form-fieldset>
          <!-- 상태 -->
          <b-form-fieldset
            label="상태"
            :horizontal="true">

            <b-form-input
              v-model="items.joinApprovalStateCodeName"
              type="text"
              plaintext
              required
            ></b-form-input>
          </b-form-fieldset>
        </div>

        <div class="form-row">
          <!-- 반려일시 -->
          <b-form-fieldset
            v-if="!isEdit"
            label="반려일시"
            :horizontal="true">

            <b-form-input
              v-model="items.joinApprovalDatetime"
              type="text"
              plaintext
              required
            ></b-form-input>
          </b-form-fieldset>

          <!-- 반려자 -->
          <b-form-fieldset
            v-if="!isEdit"
            label="반려자"
            :horizontal="true">

            <b-form-input
              v-model="items.joinApprovalId"
              type="text"
              plaintext
              required
            ></b-form-input>
          </b-form-fieldset>
        </div>

        <!-- 처리 -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.select"
          v-if="isEdit"
          :horizontal="true">
          <template slot="label">
            처리<i class="require">*</i>
          </template>

          <b-form-radio-group
            v-model="items.joinApprovalState"
            :options="code.joinApprovalStateCode"
            name="joinApprovalStateCode"
            :class="{'invalid' : !(valid.joinApprovalState)}"
            value-field="code"
            text-field="codeName"
            @change="onSelectCase"
          ></b-form-radio-group>
        </b-form-fieldset>
        <!-- 변경이력 -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.require"
          v-if="isReason || !isEdit"
          :horizontal="true">
          <template slot="label">
            반려사유<i class="require" v-if="isEdit">*</i>
          </template>
          <b-form-textarea
            v-model="items.joinApprovalStateReason"
            :rows="3"
            required
            :plaintext="!isEdit"
          ></b-form-textarea>
        </b-form-fieldset>
      </b-form>
    </b-collapse>

    <div class="page-btn" v-if="isEdit">
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Approval 관리' }">취소</b-button>
      <!-- <b-button type="button" variant="outline-secondary" @click="onView">취소</b-button> -->
      <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
    </div>
    <div class="page-btn" v-else>
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Approval 관리' }">목록</b-button>
    </div>
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
        name: 'Application 상세',
        originItems: {},
        items: {
          createId: null,
          modifyId: null,
          operatorId: null,
          operatorName: null,
          companyCode: null,
          companyName: null,
          deptName: null,
          email: null,
          joinApplyDatetime: null,
          joinApprovalStateCodeName: null,
          joinApprovalStateCode: null,
          joinApprovalStateReason: null,
          joinApprovalState: null,
          operatorGroupList: [],
          groupList:[],
          operatorServiceList: [],
          serviceList: [],
        },
        code: {
          companyCode: [],
          groupList: [],
          serviceList: [],
          joinApprovalStateCode : []
        },

        isLoad: {
          companyCode: true,
          groupCode: true,
          serviceCode: true
        },

        isEdit: false,
        isModalHistory: false,
        isReason: false,

        modal: {
          open: false,
          type: 'done',
          msg: '',
          action (){}
        },
        inValidForm: false,
        groupSelectPlatform: false,
        serviceSelectAll: false
      }
    },

    computed: {
      companyCode: {
        get () {
          return this.code.companyCode.find(obj => obj.code === this.items.companyCode) || null;
        },
        set (newValue) {
          this.items.companyCode = newValue !== null ? newValue.code : null;
        }
      },
      serviceList: {
        get () {
          return this.items.serviceList.length > 0
            ? this.items.serviceList.map(val => this.code.serviceCode.find(obj => obj.serviceId === val))
            : [];
        },
        set (newValue) {
          this.items.serviceList = newValue.length > 0
            ? newValue.map(obj => obj.serviceId)
            : [];
        }
      },
      groupList: {
        get () {
          return this.items.groupList.length > 0
            ? this.items.groupList.map(val => this.code.groupList.find(obj => obj.groupId === val))
            : [];
        },
        set (newValue) {
          this.items.groupList = newValue.length > 0
            ? newValue.map(obj => obj.groupId)
            : [];
        }
      },
      // validation
      valid (){
        return {
          operatorName: this.items.operatorName !== null,
          deptName: this.items.deptName !== null,
          email: this.items.email !== null,
          cellphoneNumber: this.items.cellphoneNumber !== null,
          groupList: !this.groupList.length,
          serviceList: !this.serviceList.length,
          joinApprovalState: this.items.joinApprovalState !== null,
          joinApprovalStateReason: this.items.joinApprovalStateReason !== null,
        }

      }

    },


    created (){
      const detailUrl = `/setting/approvals/${this.id}`;

      // Detail Data
      this.$https.get(detailUrl)
        .then((res) => {
          this.items = { ...this.items, ...res.data.items };
          const groupList = [];
          const serviceList = [];

          this.items.operatorGroupList.forEach( obj => {
            groupList.push(obj.groupId)
          });
          this.items.operatorServiceList.forEach( obj => {
            serviceList.push(obj.serviceId)
          });
          this.items.groupList = groupList;
          this.items.serviceList = serviceList;
          this.originItems = JSON.parse(JSON.stringify(this.items));
          if(this.items.joinApprovalStateCode === 'JOIN_APPROVAL_STATE_01'){
            this.isEdit = true;
          }else {
            this.isEdit = false;
          }

        });

        // Services
        this.$https.get('/setting/operators/services')
          .then((res) => {
            this.isLoad.serviceCode = false;
            this.code.serviceCode = res.data.items;
            this.code.serviceCode.push({
              serviceId : 0,
              serviceName : "전체"
            })

          });

        // groups
        this.$https.get('/setting/operators/groups')
          .then((res) => {
            this.isLoad.groupCode = false;
            this.code.groupList = res.data.items;
          });

        //joinApprovalStateCode
        this.$https.get('/system/commonCode', {
            q: { groupCode: 'JOIN_APPROVAL_STATE' }
          })
          .then((res) => {
            this.isLoad.joinApprovalStateCode = false;
            this.code.joinApprovalStateCode = res.data.items.filter(({code}) => {
              return code !== 'JOIN_APPROVAL_STATE_01';
            });
          });

        //CompanyCodes
        this.$https.get('/system/commonCode', {
            q: { groupCode: 'COMPANY' }
          })
          .then((res) => {
            this.isLoad.companyCode = false;
            this.code.companyCode = res.data.items;
          });
    },

    methods: {
      fetchDetail (res){
      },

      onSelectCase (event){
        const value = event;
        if(value=='JOIN_APPROVAL_STATE_03'){
          this.isReason = true;
        }else{
          this.isReason = false;
          this.items.joinApprovalStateReason = " ";
        }

      },

      onView (){
        this.isEdit = false;
        this.items = JSON.parse(JSON.stringify(this.originItems));
      },

      onSubmit (){
        const validationItems = {
          operatorName: this.items.operatorName,
          deptName: this.items.deptName,
          email: this.items.email,
          cellphoneNumber: this.items.cellphoneNumber,
          groupList: this.items.groupList,
          serviceList: this.items.serviceList,
          joinApprovalState: this.items.joinApprovalState,
          joinApprovalStateReason: this.items.joinApprovalStateReason
        }
        console.log(validationItems.joinApprovalStateReason)
        const validate = this.$valid.all(validationItems);
        this.inValidForm = !validate;
        if (validate){
          const operatorServiceAll = this.items.serviceList[0]==0?true:false;
          if(operatorServiceAll){
            //전체선택
            this.items.operatorServiceList = [];
            this.code.serviceCode.forEach(obj =>{
              const all = obj.serviceId == 0? true : false
              if(!all){
                this.items.operatorServiceList.push(obj.serviceId);
              }
            })
          }else{
            this.items.operatorServiceList = this.items.serviceList
          }
          this.items.operatorGroupList = this.items.groupList;
          this.items.joinApprovalStateCode = this.items.joinApprovalState;
          console.log(this.items.joinApprovalState)
          this.$https.put(`/setting/approvals/${this.id}`, this.items)
            .then(() => {
              this.$router.push({ name: 'Approval 관리' });
            })
            .catch((error) => {
              console.log(error);
            });
        }
      },

      validate (submitItems){
      },

      serviceSelect(item){
        const serviceId = item.serviceId==0;
        if(serviceId){
          // this.code.serviceCode[0].$isDisabled = true;
          this.code.serviceCode.forEach(obj =>{
            obj.$isDisabled = true;
          })
        }
      },

      serviceRemove(item){
        const serviceId = item.serviceId==0;
        if(serviceId){
          // this.code.serviceCode[0].$isDisabled = false;
          this.code.serviceCode.forEach(obj =>{
            obj.$isDisabled = false;
          })
        }
      },

      groupSelect(item){
        const groupId = item.groupId==1;
        if(groupId){
          //전체선택
          this.groupSelectPlatform = true;
          this.serviceList = [{serviceId: 0, serviceName: '전체'}]
        }
      },

      groupRemove(item){
        const groupId = item.groupId==1;
        if(groupId){
          this.groupSelectPlatform = false;

        }
      },
    }
  }
</script>
