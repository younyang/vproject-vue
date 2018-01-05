<template>
  <div class="app login-page flex-row align-items-center justify-content-center">
    <b-card class="register" header="운영자 가입신청">
      <!-- ID -->
      <b-form-fieldset
        label="<i class='require'>*</i> ID"
        description="※ 8~15 자 이내 영문, 숫자 및 특수문자(_),(,) 포함가능"
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
      <b-form-fieldset :label-cols="2" :horizontal="true">
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
        :label-cols="2"
        :horizontal="true">
        <b-form-input
          v-model="items.cellphoneNumber"
          type="tel">
        </b-form-input>
      </b-form-fieldset>

      <!-- 그룹
      <b-form-fieldset
        label="<i class='require'>*</i> 그룹"
        :label-cols="2"
        :horizontal="true">
        <multiselect
          label="codeName"
          track-by="code"
          :multiple="true"
          :showLabels="false"
          :options="code.groupCode"
          placeholder="그룹 선택"
        ></multiselect>
      </b-form-fieldset>

      <!-- 서비스
      <b-form-fieldset
        label="<i class='require'>*</i> 서비스"
        :label-cols="2"
        :horizontal="true">
        <multiselect
          v-model="serviceCode"
          label="serviceName"
          track-by="serviceId"
          :multiple="true"
          :showLabels="false"
          :options="code.serviceCode"
          :loading="isLoad.serviceCode"
          placeholder="전체"
        ></multiselect>
      </b-form-fieldset>
      -->

      <div slot="footer">
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
          cellphoneNumber : null
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
        modalMessage: null
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
      serviceCode: {
        get () {
          return this.services.length > 0
            ? this.services.map(val => this.code.serviceCode.find(obj => obj.serviceId === val))
            : [];
        },
        set (newValue) {
          this.services = newValue.length > 0
            ? newValue.map(obj => obj.serviceId)
            : [];
        }
      },
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
      /*
      // Services
      this.$https.get('/services', {
          q: { serviceUseYn: true }
        })
        .then((res) => {
          this.isLoad.serviceCode = false;
          this.code.serviceCode = res.data.items;
        });*/
    },

    methods: {
      onSubmit () {
          /*
        const items = {
          ...this.items,
          password: sha256(this.items.password)
        };*/
        this.$https.post('/setting/operators', this.items)
          .then(() => {
            this.status = 'success';
            this.isMessage = true;
            this.modalMessage = '운영자 가입신청이 완료되었습니다.'
          })
          .catch(error => {
            this.status = 'danger';
            this.isMessage = true;
            this.modalMessage = error.response.data.error.message;
          })
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
          });
      }
    }
  }
</script>
