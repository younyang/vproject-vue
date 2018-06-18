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

        <!-- AlarmPolicyId -->
        <b-form-fieldset
          :horizontal="true">
          <template slot="label">
            ID
          </template>

          <b-form-input
            v-model="items.alarmPolicyId"
            type="text"
            plaintext
            required
          ></b-form-input>
        </b-form-fieldset>

        <!-- Server Type -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <template slot="label">
            Server Type<i class="require" v-if="isEdit">*</i>
          </template>

          <b-form-input
            v-model="items.serverType"
            type="text"
            placeholder="Enter Name"
            :plaintext="!isEdit"
            required
          ></b-form-input>
        </b-form-fieldset>

        <div class="form-row">
          <!-- Host Name -->
          <b-form-fieldset
            label="Host Name"
            :horizontal="true">
              {{items.hostName}}
          </b-form-fieldset>

          <!-- IP -->
          <b-form-fieldset
            label="IP"
            :horizontal="true">
            {{ items.ip }}
          </b-form-fieldset>
        </div>

        <div class="form-row">
          <!-- 알림 구분 -->
          <b-form-fieldset
            label="알림 구분"
            :horizontal="true">
              {{items.policyTypeName}}
          </b-form-fieldset>

          <!-- 임계치 -> 발생수치 -->
          <b-form-fieldset
            label="임계치 → 발생수치"
            :horizontal="true">
            <span>{{ items.policyThreshold }} → </span>
            <span style="color:red;">{{ items.policyOutbreak }}</span>
          </b-form-fieldset>
        </div>

        <!-- 수신 그룹 -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <template slot="label">
            수신 그룹<i class="require" v-if="isEdit">*</i>
          </template>

          <div class="badge-list" >
            <span class="badge sm" v-for="item in items.groupNames">
              {{ item }}
            </span>
          </div>
        </b-form-fieldset>

        <!-- 알림 방법 -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <template slot="label">
            알림 방법<i class="require" v-if="isEdit">*</i>
          </template>

          <b-form-input
            v-model="items.alarmTypeName"
            type="text"
            placeholder="Enter Name"
            :plaintext="!isEdit"
            required
          ></b-form-input>
        </b-form-fieldset>

        <!-- 전송일  -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <template slot="label">
            전송일<i class="require" v-if="isEdit">*</i>
          </template>

          <b-form-input
            v-model="items.createDatetime"
            type="text"
            placeholder="Enter Name"
            :plaintext="!isEdit"
            required
          ></b-form-input>
        </b-form-fieldset>

      </b-form>
    </b-collapse>

    <div class="page-btn">
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Operator 관리' }">목록</b-button>
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
      const detailUrl = `/monitoring/policies/send/${this.id}`;

      // Detail Data
      this.$https.get(detailUrl)
        .then((res) => {
          this.items = { ...this.items, ...res.data.items };
          this.items.groupNames = this.items.groupNames.split(',')
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
