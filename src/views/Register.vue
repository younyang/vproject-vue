<template>
  <div class="app login-page flex-row align-items-center justify-content-center">
    <b-card class="register" header="운영자 가입신청">
      <b-form :validated="inValidForm" novalidate>
        <!-- ID -->
        <b-form-fieldset
          label="<i class='require'>*</i> ID"
          description="※ 8~15 자 이내 영문, 숫자 및 특수문자(_),(,) 포함가능"
          :invalid-feedback="$valid.msg.require"
          :label-cols="2"
          :horizontal="true">
          <b-input-group>
            <b-form-input
              v-model="items.loginId"
              type="text"
              placeholder="">
            </b-form-input>
            <b-button variant="primary" class="btn-in ml-2" @click="fetchIdExists">중복확인</b-button>
            <span class="ico">
              <i v-if="idCheck === 'success'" class="fa fa-check-circle"></i>
              <i v-if="idCheck === 'fail'" class="fa fa-times-circle"></i>
            </span>
          </b-input-group>
        </b-form-fieldset>

        <!-- 비밀번호 -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.require"
          :label-cols="2"
          :horizontal="true">
          <template slot="label">
            <i class="require">*</i> 비밀번호
            <span class="ico" id="pwdTooltip"><i class="fa fa-question-circle"></i></span>
          </template>
          <b-form-input
            v-model="items.password"
            type="password">
          </b-form-input>
        </b-form-fieldset>

        <!-- 비밀번호 확인 -->
        <b-form-fieldset
          label="<i class='require'>*</i> 비밀번호 확인"
          :invalid-feedback="$valid.msg.passwordCheck"
          :label-cols="2"
          :horizontal="true">
          <b-form-input
            v-model="passwordCheck"
            type="password">
          </b-form-input>
        </b-form-fieldset>

        <!-- 이름 -->
        <b-form-fieldset
          label="<i class='require'>*</i> 이름"
          :invalid-feedback="$valid.msg.require"
          :label-cols="2"
          :horizontal="true">
          <b-form-input
            v-model="items.operatorName"
            type="text">
          </b-form-input>
        </b-form-fieldset>

        <!-- 회사명 -->
        <b-form-fieldset
          label="<i class='require'>*</i> 회사명"
          :invalid-feedback="$valid.msg.require"
          :label-cols="2"
          :horizontal="true">
          <multiselect
            v-model="companyCode"
            label="codeName"
            track-by="code"
            class="noEmpty"
            :options="code.companyCode"
            :allowEmpty="false"
            :showLabels="false"
            :loading="isLoad.companyCode"
            placeholder="회사 선택"
          ></multiselect>
        </b-form-fieldset>

        <!-- 부서 -->
        <b-form-fieldset
          label="<i class='require'>*</i> 부서"
          :invalid-feedback="$valid.msg.select"
          :label-cols="2"
          :horizontal="true">
          <b-form-input
            v-model="items.deptName"
            type="text">
          </b-form-input>
        </b-form-fieldset>

        <!-- 이메일 -->
        <b-form-fieldset
          label="<i class='require'>*</i> 이메일"
          :invalid-feedback="$valid.msg.require"
          :label-cols="2"
          :horizontal="true">
          <b-form-input
            v-model="items.email"
            type="email">
          </b-form-input>
        </b-form-fieldset>

        <!-- 전화번호 -->
        <b-form-fieldset
          label="전화번호"
          :invalid-feedback="$valid.msg.require"
          :label-cols="2"
          :horizontal="true">
          <b-form-input
            v-model="items.telephoneNumber"
            type="tel">
          </b-form-input>
        </b-form-fieldset>

        <!-- 휴대폰 -->
        <b-form-fieldset
          label="<i class='require'>*</i> 휴대폰"
          :invalid-feedback="$valid.msg.require"
          :label-cols="2"
          :horizontal="true">
          <b-form-input
            v-model="items.cellphoneNumber"
            type="tel">
          </b-form-input>
        </b-form-fieldset>

        <!--그룹-->
        <b-form-fieldset
         :invalid-feedback="$valid.msg.select"
          label="<i class='require'>*</i> 그룹"
          :label-cols="2"
          :horizontal="true">
          <multiselect
            v-model="operatorGroupList"
            :class="{'invalid' : (valid.operatorGroupList)}"
            class="multiple"
            label="groupName"
            track-by="groupId"
            :multiple="true"
            :showLabels="false"
            :options="code.groupCode"
            :loading="isLoad.groupCode"
            @select="groupSelect"
            @remove="groupRemove"
            placeholder="그룹 선택"
          ></multiselect>
        </b-form-fieldset>

        <!-- 서비스-->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.select"
          label="<i class='require'>*</i> 서비스"
          :label-cols="2"
          :horizontal="true">
          <multiselect
            v-model="serviceList"
            :class="{'invalid' : (valid.serviceList)}"
            class="multiple"
            label="serviceName"
            track-by="serviceId"
            :multiple="true"
            :showLabels="false"
            :options="code.serviceCode"
            :loading="isLoad.serviceCode"
            @select="serviceSelect"
            @remove="serviceRemove"
            placeholder="Select service type"
            :disabled="groupSelectPlatform"
          ></multiselect>
        </b-form-fieldset>
      </b-form>

        <div style="text-align:right">
          <b-button type="button" variant="secondary" :to="{ name: 'Login' }">취소</b-button>
          <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
        </div>
    </b-card>

    <b-tooltip target="pwdTooltip" placement="bottom">
      <p><strong>비밀번호 생성 규칙</strong><br>
        - 9~16자리 이내의 영문+숫자+특수문자 조합 필수</p>

      <p class="mt-2"><strong>사용가능한 특수문자</strong><br>
        - `~!@#$%^&*()_+-=?/',."</p>
    </b-tooltip>

    <!-- Message Modal -->
    <b-modal title="Message" size="sm" class="modal-secondary" v-model="isMessage">
      <div class="d-block text-center">
        <h5>{{ modalMessage }}</h5>
      </div>
      <div slot="modal-footer">
        <b-button type="button" variant="primary" @click="onMessage">확인</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import { sha256 } from 'js-sha256';

  export default {
    name: 'Register',

    data () {
      return {
        items: {
          loginId: null,
          password: null,
          operatorName: null,
          companyCode: null,
          deptName: null,
          email: null,
          telephoneNumber : null,
          cellphoneNumber : null,
          operatorGroupList: [],
          serviceList: [],
          operatorServiceList: []
        },

        services: [],

        code: {
          companyCode: [],
          groupCode: [],
          serviceCode: []
        },

        isLoad: {
          companyCode: true,
          groupCode: true,
          serviceCode: true
        },

        idCheck: null,
        passwordCheck: null,
        status: null,
        isMessage: false,
        modalMessage: null,
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
      operatorGroupList: {
        get () {
          return this.items.operatorGroupList.length > 0
            ? this.items.operatorGroupList.map(val => this.code.groupCode.find(obj => obj.groupId === val))
            : [];
        },
        set (newValue) {
          this.items.operatorGroupList = newValue.length > 0
            ? newValue.map(obj => obj.groupId)
            : [];
        }
      },
      // validation
      valid (){
        return {
          loginId: this.items.loginId !== null,
          password: this.code.password !== null,
          passwordCheck : this.items.passwordCheck !== this.items.password,
          operatorName: this.items.operatorName !== null,
          companyCode: this.items.companyCode !== null,
          deptName: this.items.deptName !== null,
          email: this.items.email != null,
          cellphoneNumber: this.items.cellphoneNumber != null,
          operatorGroupList: this.items.operatorGroupList.length && this.code.groupCode.length,
          serviceList: this.items.serviceList.length && this.code.serviceCode.length,
          idCheck : !this.idCheck
        }
      }
    },

    created () {
      // Company Code
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'COMPANY' }
        })
        .then((res) => {
          this.isLoad.companyCode = false;
          this.code.companyCode = res.data.items;
          this.companyCode = res.data.items[0];
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
          this.code.groupCode = res.data.items;
        });
    },

    methods: {
      onSubmit () {
        const validationItems = {
          loginId : this.items.loginId,
          password : this.items.password,
          operatorName : this.items.operatorName,
          companyCode : this.items.companyCode,
          daptName : this.items.deptName,
          email : this.items.email,
          cellphoneNumber : this.items.cellphoneNumber,
          operatorGroupList : this.items.operatorGroupList,
          serviceList : this.items.serviceList,
          idCheck : this.idCheck
        }
        const validate = this.$valid.all(validationItems);
        // this.inValidForm = !validate;
        if(validate){
          const operatorServiceAll = this.items.serviceList[0]==0?true:false
          if(operatorServiceAll){
            //전체선택
            this.items.operatorserviceList = [];
            this.code.serviceCode.forEach(obj =>{
              const all = obj.serviceId == 0? true : false
              if(!all){
                this.items.operatorServiceList.push(obj.serviceId);
              }
            })
          }
          this.$https.post('/setting/operators', this.items)
            .then(() => {
              this.status = 'success';
              this.isMessage = true;
              alert('운영자 가입신청이 완료되었습니다. \n플랫폼 관리자 검토 후, 승인 결과를 메일로 안내해드립니다')
              this.$router.push({ name: 'Login'});
            })
            .catch(error => {
              console.log('danger')
              this.status = 'danger';
              this.isMessage = true;
              this.modalMessage = error.response.data.error.message;
            })
        }else{
          if(!validationItems.idCheck){
            alert('아이디를 확해주세요. ');
          }else{
            alert('필수항목을 모두 입력해주세요.');
          }
        }
      },

      onMessage (){
        if (this.status === 'success'){
          this.$router.push({ name: 'Login'});
        } else {
          this.status = null;
          this.isMessage = false;
          this.modalMessage = null;
        }
      },

      fetchIdExists () {
        this.$https.get('/setting/operators/loginId/exists', {
            loginId: this.items.loginId
          })
          .then((res) => {
            const isSuccess = res.data.result === 'Success';
            this.idCheck = isSuccess ? 'success' : 'fail';
          })
          .catch(error => {
              this.idCheck = 'fail';
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
        }
      },

      groupRemove(item){
        const groupId = item.groupId==1;
        if(groupId){
          this.groupSelectPlatform = false;

        }
      }
    }
  }
</script>
