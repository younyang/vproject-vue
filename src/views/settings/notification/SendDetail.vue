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
          :horizontal="true">
          <template slot="label">
            회사명<i class="require" v-if="isEdit">*</i>
          </template>

          <b-form-input
            v-model="items.companyName"
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

        <div class="form-row">
          <!-- 상태 -->
          <b-form-fieldset
            label="상태"
            :horizontal="true">
            <c-switch
              v-if="isEdit"
              type="text"
              class="v-switch"
              on="정상"
              off="탈퇴"
              v-model="items.operatorState"
            ></c-switch>
            <span
            v-else
              class="badge"
              :class="{'primary' : items.operatorState }"
            >{{ items.operatorState ? '정상' : '탈퇴' }}
            </span>
          </b-form-fieldset>

          <!-- 계정 잠김 여부 -->
          <b-form-fieldset
            label="계정 잠김 여부"
            :horizontal="true">
            <c-switch
              v-if="isEdit"
              type="text"
              class="v-switch"
              on="잠김"
              off="정상"
              v-model="items.accountLockYn"
            ></c-switch>
            <span
            v-else
              class="badge"
              :class="{'primary' : items.accountLockYn }"
            >{{ items.accountLockYn ? '잠김' : '정상' }}
            </span>
          </b-form-fieldset>
        </div>
      </b-form>
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
          <!-- 가입신청일시 -->
          <b-form-fieldset
            label="가입신청일시"
            :horizontal="true">
            <b-form-input
              :value="items.createDateTime"
              plaintext
              type="text"
            ></b-form-input>
          </b-form-fieldset>
          <!-- 탈퇴일시 -->
          <b-form-fieldset
            label="탈퇴일시"
            :horizontal="true">
            <b-form-input
              :value="items.deleteDateTime"
              plaintext
              type="text"
            ></b-form-input>
          </b-form-fieldset>
        </div>

        <div class="form-row">
          <!-- 승인일시 -->
          <b-form-fieldset
            label="승인일시"
            :horizontal="true">
            <b-form-input
              :value="items.createDateTime"
              plaintext
              type="text"
            ></b-form-input>
          </b-form-fieldset>
          <!-- 승인자 -->
          <b-form-fieldset
            label="승인자"
            :horizontal="true">
            <b-form-input
              :value="items.joinApprovalId"
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
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Operator 관리' }">목록</b-button>
      <b-button type="button" variant="primary" @click="onEdit" v-if="this.items.operatorStateCode !== 'OPERATOR_STATE_03'">수정</b-button>
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
          companyName: null,
          deptName: null,
          email: null,
          operatorStateCode: null,
          operatorStateName: null,
          operatorState: null,
          deleteDateTime: null,
          accountLockYn:null,
          operatorGroupList: [],
          groupList:[],
          operatorServiceList: [],
          serviceList: [],
        },
        code: {
          groupList: [],
          serviceList: []
        },

        isLoad: {
          groupCode: true,
          serviceCode: true
        },

        isEdit: false,
        isModalHistory: false,

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
          serviceList: !this.serviceList.length
        }
      }

    },


    created (){
      const detailUrl = `/setting/management/operators/${this.id}`;

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
          if(this.items.operatorStateCode === 'OPERATOR_STATE_02'){
            this.items.operatorState = true;
            this.items.deleteDateTime = '-';
          }else{
            this.items.operatorState = false;
            this.items.deleteDateTime = this.items.modifyDateTime;
          }
          this.originItems = JSON.parse(JSON.stringify(this.items));
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

    },

    methods: {
      fetchDetail (res){
      },

      onEdit (){
        this.isEdit = true;
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
          serviceList: this.items.serviceList
        }
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
          if(this.items.operatorState){
            this.items.operatorStateCode = 'OPERATOR_STATE_02';
          }else{
            this.items.operatorStateCode = 'OPERATOR_STATE_03';
          }
          this.$https.put(`/setting/management/operators/${this.id}`, this.items)
            .then(() => {
              this.$router.go(this.$router.currentRoute);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      },

      validate (submitItems){
      },

      getHistoryLink (rowId){
        return `#/apis/application/${this.id}?histories=${rowId}`
      },

      showHistory () {
        this.isModalHistory = !this.isModalHistory;
        this.$https.get(`/apiManagement/apps/${this.id}/histories`)
          .then((res) => {
            this.history.items = res.data.items;
          });
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
          // this.code.serviceCode.forEach(obj =>{
          //   obj.$isDisabled = true;
          // })
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
