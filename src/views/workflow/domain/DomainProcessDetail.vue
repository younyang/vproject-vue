<template>
  <div class="animated fadeIn">
    <div class="collapse-title">
      <b-button class="btn-collapse" v-b-toggle.formDefault>
        <i class="fa"></i>
        기본정보
      </b-button>
    </div>

    <b-collapse id="formDefault" visible>
      <b-form class="formView">
        <!-- PID -->
        <b-form-fieldset
          label="PID"
          :horizontal="true">
          <span class="form-text">{{ items.pid }}</span>
        </b-form-fieldset>

        <!-- Process – Type -->
        <b-form-fieldset
          label="Process – Type"
          :horizontal="true">
          <span class="form-text">{{ items.process }}</span>
        </b-form-fieldset>

        <!-- 상태-->
        <b-form-fieldset
          label="상태"
          :horizontal="true">
          <span class="form-text">{{ items.status }}</span>
        </b-form-fieldset>

        <div class="form-row">
          <!-- 시작 -->
          <b-form-fieldset
            label="시작"
            :horizontal="true">
            <span class="form-text">{{ items.startDate }}</span>
          </b-form-fieldset>

          <!-- 종료 -->
          <b-form-fieldset
            label="종료"
            :horizontal="true">
            <span class="form-text">{{ items.endDate }}</span>
          </b-form-fieldset>
        </div>
      </b-form>
    </b-collapse>

    <div class="collapse-title">
      <b-button class="btn-collapse" v-b-toggle.formDetail>
        <i class="fa"></i>
        상세
      </b-button>
    </div>

    <b-collapse id="formDetail" visible>
      <b-form class="formView">
        <!-- IP -->
        <b-form-fieldset
          label="IP"
          :horizontal="true">
          <span class="form-text">1.255.255.1</span>
        </b-form-fieldset>

        <!-- Host Name -->
        <b-form-fieldset
          label="Host Name"
          :horizontal="true">
          <span class="form-text">pop1-hr-01</span>
        </b-form-fieldset>

        <!-- Pool Name -->
        <b-form-fieldset
          label="Pool Name"
          :horizontal="true">
          <span class="form-text">anyang_lowreferrer_pool_01</span>
        </b-form-fieldset>

        <!-- PoP -->
        <b-form-fieldset
          label="PoP"
          :horizontal="true">
          <span class="form-text">안양</span>
        </b-form-fieldset>

        <!-- Data Center -->
        <b-form-fieldset
          label="Data Center"
          :horizontal="true">
          <span class="form-text">ANYANG</span>
        </b-form-fieldset>

        <!-- Health Monitor -->
        <b-form-fieldset
          label="Health Monitor"
          :horizontal="true">
          <span class="form-text">gateway_icmp</span>
        </b-form-fieldset>

        <!-- ttl -->
        <b-form-fieldset
          label="TTL"
          :horizontal="true">
          <span class="form-text">30</span>
        </b-form-fieldset>

        <!-- Server Mapping -->
        <b-form-fieldset
          label="Server Mapping"
          :horizontal="true">

          <div class="server-list result">
            <div class="entry">
              <p v-if="items.entryServer.length === 0">등록된 정보가 없습니다.</p>
              <p v-for="({ ip, name }, index) in items.entryServer">
                {{ ip }} - {{ name }}</p>
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
    name: 'domainProcessing',
    props: ['method'],

    data (){
      return {
        items: {
          pid: 'C001',
          process: 'Pool 등록 – L/R',
          status: '진행중',
          startDate: '2017-09-24 17:20:20',
          endDate: '2017-09-24 17:20:20',
          entryServer: [{
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
