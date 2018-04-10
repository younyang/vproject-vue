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
        <!-- Process -->
        <b-form-fieldset
          label="Process"
          :horizontal="true">
          <span class="form-text">Pool {{ method === 'create' ? '등록' : '수정' }}</span>
        </b-form-fieldset>

        <!-- Pool Name (Create)-->
        <b-form-fieldset
          v-if="method === 'create'"
          :invalid-feedback="$valid.msg.require"
          label="Pool Name<i class='require'>*</i>"
          :horizontal="true"
          description="※ 영문 및 숫자, 특수문자(-, _) 가능">
          <b-form-input
            v-model="items.poolName"
            type="text"
            required
          ></b-form-input>
        </b-form-fieldset>

        <!-- Pool Name (Edit)-->
        <b-form-fieldset
          v-if="method === 'edit'"
          :invalid-feedback="$valid.msg.select"
          label="Pool Name<i class='require'>*</i>"
          :horizontal="true">
          <multiselect
            class="noEmpty"
            :allowEmpty="false"
            :showLabels="false"
            :searchable="false"
            :options="['anyang_lowreferrer_pool_01','anyang_lowreferrer_pool_02','anyang_lowreferrer_pool_03']"
            placeholder="선택"
          ></multiselect>
        </b-form-fieldset>

        <!-- PoP -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.select"
          label="PoP<i class='require'>*</i>"
          :horizontal="true">
          <multiselect
            v-if="method === 'create'"
            class="noEmpty"
            :allowEmpty="false"
            :showLabels="false"
            :searchable="false"
            :options="['안양','서울','부산']"
            placeholder="선택"
          ></multiselect>

          <span
            v-if="method === 'edit'"
            class="form-text"
          >안양</span>
        </b-form-fieldset>

        <!-- Type -->
        <b-form-fieldset
          v-if="method === 'create'"
          label="Type<i class='require'>*</i>"
          :horizontal="true">
          <b-form-radio-group
            :options="[{ text: 'H/R', value: 'HR' },{ text: 'L/R', value: 'LR' }]"
            v-model="items.type"
          ></b-form-radio-group>
          <span
            v-if="method === 'edit'"
            class="form-text"
          >L/R</span>
        </b-form-fieldset>

        <!-- Health Monitor -->
        <b-form-fieldset
          label="Health Monitor"
          :horizontal="true">
          <span class="form-text">{{ items.health }}</span>
        </b-form-fieldset>

        <!-- ttl -->
        <b-form-fieldset
          label="TTL<i class='require'>*</i>"
          :invalid-feedback="$valid.msg.require"
          :horizontal="true">
          <cleave
            :value.sync="items.ttl"
            style="width: 100px;"
            class="form-control"
            :options="{ numeral: true, numeralPositiveOnly: true, numeralDecimalScale: 0 }"
            required
          ></cleave>
        </b-form-fieldset>

        <!-- Data Center -->
        <b-form-fieldset
          label="Data Center"
          :horizontal="true">
          <span class="form-text">ANYANG</span>
        </b-form-fieldset>

        <!-- Server Mapping -->
        <b-form-fieldset
          label="Server Mapping<i class='require'>*</i>"
          :horizontal="true">

          <div class="server-list">
            <h5>현재 GTM 설정 정보</h5>
            <div class="entry">
              <p v-if="items.entryServer.length === 0">등록된 정보가 없습니다.</p>
              <p v-for="({ ip, name }, index) in items.entryServer">
                {{ ip }} - {{ name }}</p>
            </div>
          </div>

          <div class="server-list">
            <h5>업데이트 정보</h5>
            <div class="update">
              <p v-for="({ ip, name, type }, index) in items.updateServer">
                <i class="text-primary" v-if="type">[+]</i>
                <i class="text-danger" v-else>[-]</i>
                {{ ip }} - {{ name }}
              </p>
            </div>
          </div>
        </b-form-fieldset>
      </b-form>
    </b-collapse>


    <div class="page-btn">
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Domain Processing 관리' }">취소</b-button>
      <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'domainProcessingPool',
    props: ['method'],

    data (){
      return {
        items: {
          poolName: null,
          type: 'HR',
          health: 'gateway_icmp',
          ttl: 20,
          entryServer: [],
          updateServer: [{
            ip: '111.111.111.1',
            name: 'Service Name1',
            type: true
          },{
            ip: '222.222.222.1',
            name: 'Service Name2',
            type: true
          },{
            ip: '333.333.333.1',
            name: 'Service Name3',
            type: true
          },{
            ip: '444.444.444.1',
            name: 'Service Name4',
            type: false
          },{
            ip: '555.555.555.1',
            name: 'Service Name5',
            type: false
          },{
            ip: '666.666.666.1',
            name: 'Service Name6',
            type: false
          }]
        },

        inValidForm: false
      }
    },

    created (){
    },

    methods: {
      onSubmit (){

      }
    }
  }
</script>
