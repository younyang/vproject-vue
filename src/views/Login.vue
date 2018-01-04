<template>
  <div class="app login-page flex-row align-items-center justify-content-center">
    <div class="login-box">
      <h1 class="sr-only">SK broadband V Project Pilot 플랫폼 Login</h1>

      <div v-if="!isPwdMode">
        <div class="input-group">
          <input type="text" class="form-control" v-model="items.loginId" placeholder="아이디">
        </div>
        <div class="input-group">
          <input type="password" class="form-control" v-model="items.password" placeholder="Password">
        </div>
        <b-button type="button" :block="true" class="btn btn-login" @click="onLogin">로그인</b-button>

        <div class="row">
          <div class="col-6">
            <b-button type="button" :block="true" class="btn btn-login-link" @click="isPwdMode = true">비밀번호 찾기</b-button>
          </div>
          <div class="col-6">
            <b-button type="button" :block="true" :to="{ name: 'Register' }" class="btn btn-login-link">운영자 가입</b-button>
          </div>
        </div>
      </div>

      <div v-if="isPwdMode">
        <p class="text-muted">
          ・ 회원정보에 등록된 아이디/이메일 정보를 입력해주세요.<br>
          ・ 정보 일치 시, 등록된 이메일 정보로 임시비밀번호 메일이 발송됩니다.
        </p>
        <div class="input-group">
          <input type="text" class="form-control" v-model="findPwd.id" placeholder="아이디">
        </div>
        <div class="input-group">
          <input type="email" class="form-control" v-model="findPwd.email" placeholder="이메일">
        </div>
        <b-button type="button" :block="true" class="btn btn-login" @click="onFindPassword">확인</b-button>
        <b-button type="button" :block="true" class="btn btn-login-link" @click="isPwdMode = false">로그인 화면으로</b-button>
      </div>

      <p class="warning" v-if="errorMessage !== null">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
  import { sha256 } from 'js-sha256';

  export default {
    name: 'Login',

    data () {
      return {
        items: {
          loginId: '',
          password: ''
        },

        findPwd: {
          loginId: '',
          email: ''
        },

        isPwdMode: false,
        errorMessage: null
      }
    },

    methods: {
      onLogin () {
          /*
        const items = {
          ...this.items,
          password: sha256(this.items.password)
        };*/

        this.$https.post('/auth_check', this.items)
          .then(res => {

          })
          .catch(error => {
            this.errorMessage = error.response.data.error.message;
          })
      },

      onFindPassword () {

      }
    }
  }
</script>
