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
            :value="items.processId"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- CID -->
        <b-form-fieldset
          label="CID"
          :label-cols="3"
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
          :label-cols="3"
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
          :label-cols="3"
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
          :label-cols="3"
          :horizontal="true">

          <b-table
            striped
            bordered
            show-empty
            :items="items.fileList"
            :fields="fields"
          >
          </b-table>

        </b-form-fieldset>

        <!-- Total_file_size -->
        <b-form-fieldset
          label="Total_file_size"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.contentTotalFileSize"
            type="text"
            class="inline"
            style="width:60px"
            plaintext
          ></b-form-input> MB
        </b-form-fieldset>

        <!-- 요청일시 -->
        <b-form-fieldset
          label="요청일시"
          :label-cols="3"
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
          :label-cols="3"
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
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.processStateCodeName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>
      </b-card>
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
