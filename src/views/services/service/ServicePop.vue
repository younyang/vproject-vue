<template>
  <div class="animated fadeIn">
    <content-header
      :title="items.serviceName"
      :name="name">
    </content-header>

    <div class="collapse-title">
      <b-button
        variant="secondary"
        v-b-toggle.formDefault
        :block="true">
        PoP
        <i class="fa fa-angle-down"></i>
      </b-button>
    </div>
    <b-collapse id="formDefault" visible>
      <b-card>
        <section class="board">
          <b-table
            striped
            bordered
            hover
            show-empty
          >
          </b-table>
        </section>
      </b-card>
    </b-collapse>

    <!-- 배포이력 -->
    <div class="collapse-title" v-if="!isEdit">
      <b-button
        variant="secondary"
        v-b-toggle.history
        :block="true">
        배포이력
        <i class="fa fa-angle-down"></i>
      </b-button>
    </div>
    <b-collapse id="history" visible>
      <b-card>
        <!-- 배포일시 -->
        <b-form-fieldset
          label="배포일시"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            value="배포일시"
            plaintext
            type="text"></b-form-input>
        </b-form-fieldset>
        <!-- 배포자 -->
        <b-form-fieldset
          label="배포자"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            value="배포자"
            plaintext
            type="text"></b-form-input>
        </b-form-fieldset>
        <!-- 배포상태 -->
        <b-form-fieldset
          label="배포상태"
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            value="배포상태"
            plaintext
            type="text"></b-form-input>
        </b-form-fieldset>
      </b-card>
    </b-collapse>



    <div class="page-btn" v-if="isEdit">
      <b-button type="button" size="sm" variant="outline-primary" @click="showHistory">이력관리</b-button>
      <b-button type="button" size="sm" variant="primary" @click="onSubmit"><i class="fa fa-dot-circle-o"></i> 배포</b-button>
      <b-button type="button" size="sm" variant="secondary" @click="onView"><i class="fa fa-ban"></i> 취소</b-button>
    </div>


    <!-- History Modal
    <b-modal size="lg" title="이력관리" v-model="isModalHistory">
      <section class="board">
        <b-table
          striped
          bordered
          hover
          show-empty
          :items="history.items"
          :fields="history.fields"
        >
          <template slot="histMgmtId" scope="row">
            <a :href="getHistoryLink(row.value)" target="_blank">보기</a>
          </template>
        </b-table>
      </section>

      <div slot="modal-footer">
        <b-button type="button" size="sm" variant="primary" @click="isModalHistory = false"><i class="fa fa-dot-circle-o"></i> 확인</b-button>
      </div>
    </b-modal>
    -->
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
        name: 'Service 상세',
        originItems: {},
        items: [],
        isEdit: false,
        isModalHistory: false
      }
    },

    created (){

    },

    methods: {
      onEdit () {

      },
      onView () {

      },
      onSubmit () {

      },
      showHistory () {

      }

    }
  }
</script>
