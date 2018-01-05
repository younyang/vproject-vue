<template>
  <div class="animated fadeIn">
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
        <!-- PID -->
        <b-form-fieldset
          label="PID"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            value="123"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- CID -->
        <b-form-fieldset
          label="TID"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            value="456"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- Content -->
        <b-form-fieldset
          label="Content"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            value="스파이더 맨"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- Genre -->
        <b-form-fieldset
          label="Genre"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            value="영화"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- File info -->
        <b-form-fieldset
          label="File Info"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            value=""
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- Total_file_size -->
        <b-form-fieldset
          label="Total_file_size"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            value="200 MB"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- 요청일시 -->
        <b-form-fieldset
          label="요청일시"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            value="2018-05-21 10:00:32"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- 처리일시 -->
        <b-form-fieldset
          label="처리일시"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            value="2018-05-21 10:00:32"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- 상태 -->
        <b-form-fieldset
          label="상태"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            value="성공"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>
      </b-card>
    </b-collapse>


    <div class="page-btn">
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Purge' }">목록</b-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'purge',
    props: ['id'],

    data (){
      return {
        items: {
        }
      }
    },

    computed: {
    },

    created (){
    },

    methods: {
    }
  }
</script>
