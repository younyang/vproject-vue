<template>
  <div class="animated fadeIn">
    <div class="collapse-title">
      <b-button class="btn-collapse" v-b-toggle.formDefault>
        <i class="fa"></i>
        기본정보
      </b-button>
    </div>

    <b-collapse id="formDefault" visible>
      <div class="formView">
        <!-- PID -->
        <b-form-fieldset
          label="PID"
          :horizontal="true">
          <b-form-input
            :value="items.processId"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- CID -->
        <b-form-fieldset
          label="CID"
          :horizontal="true">
          <b-form-input
            :value="items.contentId"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- Content -->
        <b-form-fieldset
          label="Content"
          :horizontal="true">
          <b-form-input
            :value="items.contentName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- Genre -->
        <b-form-fieldset
          label="Genre"
          :horizontal="true">
          <b-form-input
            :value="items.contentGenreName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- File info -->
        <b-form-fieldset
          label="File Info"
          :horizontal="true">

          <b-table
            class="sub"
            show-empty
            :items="items.fileList"
            :fields="fields"
          >
            <template slot="contentFileSize" scope="row">{{ row.value }} MB</template>
          </b-table>
        </b-form-fieldset>

        <!-- Total_file_size -->
        <b-form-fieldset
          label="Total_file_size"
          :horizontal="true">
          <span class="form-text">{{ items.contentTotalFileSize }} MB</span>
        </b-form-fieldset>

        <!-- 요청일시 -->
        <b-form-fieldset
          label="요청일시"
          :horizontal="true">
          <b-form-input
            :value="items.processBeginDatetime"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- 처리일시 -->
        <b-form-fieldset
          label="처리일시"
          :horizontal="true">
          <b-form-input
            :value="items.processEndDatetime"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- 상태 -->
        <b-form-fieldset
          label="상태"
          :horizontal="true">
          <b-form-input
            :value="items.processStateCodeName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>
      </div>
    </b-collapse>


    <div class="page-btn">
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Preload' }">목록</b-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'preload',
    props: ['id'],

    data (){
      return {
        items: {
          processId: null,
          contentId: null,
          contentName: null,
          contentGenreName: null,
          contentServiceTypeCode: null,
          fileList: [{
            contentFilePath: null,
            contentFileName: null,
            contentFileSize: null
          }],
          contentTotalFileSize: null,
          processBeginDatetime: null,
          processEndDatetime: null,
          processStateCodeName: null,
        },

        fields: {
          contentFilePath: {label: 'File path', 'class': 'text-left'},
          contentFileName: {label: 'File name', 'class': 'text-left'},
          contentFileSize: {label: 'File size', 'class': 'text-right'},
        }
      }
    },

    created (){
      // Detail Data
      this.$https.get(`/contentprocess/preloads/${this.id}`)
        .then((res) => {
          this.items = { ...res.data.items };
        });
    }
  }
</script>
