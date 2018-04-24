<template>
  <div class="animated fadeIn">
    <b-form class="formView" :validated="inValidForm" novalidate>
      <!-- ID -->
      <b-form-fieldset
        label="ID"
        :horizontal="true">
        <b-form-input
          :value="items.loginId"
          plaintext
          type="text"
        ></b-form-input>
      </b-form-fieldset>

      <!-- 비밀번호 -->
      <b-form-fieldset
        label="비밀번호"
        :horizontal="true">
        <b-button type="button" variant="in-table" @click="isChangePassword = !isChangePassword">{{ isChangePassword ? '변경 취소' : '변경' }}</b-button>
      </b-form-fieldset>

      <div v-if="isChangePassword">
        <!-- 변경 비밀번호 -->
        <b-form-fieldset
          description="※ 9~16자 이내  영문자+숫자+특수문자 조합 필수"
          :invalid-feedback="feedback.password"
          :horizontal="true">
          <template slot="label">
            변경 비밀번호<i class="require">*</i>
          </template>

          <b-form-input
            v-model="password"
            type="password"
            :state="valid.password"
            required
          ></b-form-input>
        </b-form-fieldset>

        <!-- 변경 비밀번호 확인 -->
        <b-form-fieldset
          :invalid-feedback="feedback.passwordCheck"
          :horizontal="true">
          <template slot="label">
            변경 비밀번호 확인<i class="require">*</i>
          </template>

          <b-form-input
            v-model="passwordCheck"
            type="password"
            :state="valid.passwordCheck"
            required
          ></b-form-input>
        </b-form-fieldset>
      </div>

      <!-- 회사명 -->
      <b-form-fieldset
        label="회사명"
        :horizontal="true">
        <b-form-input
          :value="items.companyName"
          plaintext
          type="text"
        ></b-form-input>
      </b-form-fieldset>

      <!-- 부서 -->
      <b-form-fieldset
        label="부서<i class='require'>*</i>"
        :invalid-feedback="$valid.msg.require"
        :horizontal="true">
        <b-form-input
          v-model="items.deptName"
          type="text"
          required
        ></b-form-input>
      </b-form-fieldset>

      <!-- 이메일 -->
      <b-form-fieldset
        label="이메일<i class='require'>*</i>"
        :invalid-feedback="$valid.msg.require"
        :horizontal="true">
        <b-form-input
          v-model="items.email"
          type="text"
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
        ></b-form-input>
      </b-form-fieldset>

      <!-- 휴대폰 -->
      <b-form-fieldset
        label="휴대폰<i class='require'>*</i>"
        :invalid-feedback="$valid.msg.require"
        :horizontal="true">
        <b-form-input
          v-model="items.cellphoneNumber"
          type="text"
          required
        ></b-form-input>
      </b-form-fieldset>

      <!-- 그룹 -->
      <b-form-fieldset
        label="그룹"
        :horizontal="true">
        <div class="badge-list" v-if="items.operatorGroupList.length">
          <span class="badge sm" v-for="item in items.operatorGroupList">
            {{ item.groupName }}
          </span>
        </div>
        <span class="form-text-alone" v-else>--</span>
      </b-form-fieldset>

      <!-- 서비스 -->
      <b-form-fieldset
        label="서비스"
        :horizontal="true">
        <div class="badge-list" v-if="items.operatorServiceList.length">
          <span class="badge sm" v-for="item in items.operatorServiceList">
            {{ item.serviceName }}
          </span>
        </div>
        <span class="form-text-alone" v-else>--</span>
      </b-form-fieldset>
    </b-form>

    <div class="page-btn">
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Dashboard' }">취소</b-button>
      <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
    </div>

    <!-- Message Alert Modal -->
    <b-modal title="Message" size="sm" v-model="isModalAlert" class="modal-done">
      <div class="d-block text-center">
        <p>회원 정보 수정이 완료되었습니다.</p>
      </div>
      <div slot="modal-footer" class="mx-auto">
        <b-button type="button" variant="primary" :to="{ name: 'Dashboard' }">확인</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  export default {
    name: 'userInfo',
    data (){
      return {
        items: {
          loginId: null,
          operatorName: null,
          companyName: null,
          deptName: null,
          email: null,
          cellphoneNumber: '',
          telephoneNumber: '',
          operatorGroupList: [],
          operatorServiceList: []
        },

        password: '',
        passwordCheck: '',
        isChangePassword: false,
        inValidForm: false,
        isModalAlert: false
      }
    },

    computed: {
      // validation
      valid (){
        const check = /^(?=.*[a-zA-Z])(?=.*[!@#$%^~*+=-])(?=.*[0-9]).{9,16}$/;
        return {
          password: (this.password.length > 0 && check.test(this.password)),
          passwordCheck: (this.passwordCheck.length > 0 && this.password === this.passwordCheck)
        }
      },

      // validation feedback
      feedback (){
        const check = /^(?=.*[a-zA-Z])(?=.*[!@#$%^~*+=-])(?=.*[0-9]).{9,16}$/;
        return {
          password: (this.password.length && !check.test(this.password)) ?
            '비밀번호는 9~16자로 영문+숫자+특수문자가 포함되어야 합니다.'
            : this.password.length === 0 ?
            this.$valid.msg.require : '',
          passwordCheck: (this.passwordCheck.length && this.password !== this.passwordCheck) ?
            this.$valid.msg.passwordCheck
            : this.passwordCheck.length === 0 ?
              this.$valid.msg.require : ''
        }
      }
    },

    created (){
      // User 정보
      this.$https.get('/setting/operators/main')
        .then((res) => {
          console.log(res.data.items)
          this.items = res.data.items;
        });
    },

    methods: {
      onSubmit (){
        const { operatorName, deptName, email, telephoneNumber, cellphoneNumber } = this.items;
        let submitItems = {
          operatorName,
          deptName,
          email,
          cellphoneNumber
        };

        if (this.isChangePassword){
          submitItems = { ...submitItems, password: this.password }
        }


        const validate = this.$valid.all(submitItems);
        this.inValidForm = !validate;

        if (validate){
          this.$https.put('/setting/operators/main', { ...submitItems, telephoneNumber})
            .then(() => {
              this.isModalAlert = !this.isModalAlert;
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    }
  }
</script>
