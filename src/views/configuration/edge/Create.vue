<template>
  <div class="animated fadeIn">
    <b-form class="formView" :validated="inValidForm" novalidate>
      <!-- IP -->
      <b-form-fieldset
        label="IP"
        :horizontal="true">
        <b-form-input
          v-model="items.ip"
          type="text"
          plaintext
        ></b-form-input>
      </b-form-fieldset>

      <!-- Host Name -->
      <b-form-fieldset
        label="Host Name"
        :horizontal="true">
        <b-form-input
          :value="items.hostName"
          type="text"
          plaintext
        ></b-form-input>
      </b-form-fieldset>

      <!-- PoP 선택 -->
      <b-form-fieldset
        label="PoP 선택<i class='require'>*</i>"
        :invalid-feedback="$valid.msg.select"
        :horizontal="true">
        <multiselect
          v-model="popId"
          :showLabels="false"
          :searchable="false"
          :options="code.popId"
          :loading="isLoad.popId"
          :class="{'invalid': !valid.popId }"
          track-by="popId"
          label="popName"
          placeholder="Select PoP"
        ></multiselect>
      </b-form-fieldset>

      <!-- 구분 -->
      <b-form-fieldset
        label="구분<i class='require'>*</i>"
        :horizontal="true">
        <b-form-radio-group
          :options="[{ text: 'Edge', value: 'Edge' },{ text: 'Relay', value: 'Relay' }]"
          @change="onChangeEdgeRelay"
          v-model="items.edgeRelayName"
        ></b-form-radio-group>
      </b-form-fieldset>


      <!-- Service Type -->
      <b-form-fieldset
        :invalid-feedback="$valid.msg.select"
        :horizontal="true">
        <template slot="label">
          Service Type<i class="require">*</i>
        </template>

        <multiselect
          v-model="serviceTypeCode"
          class="multiple"
          :class="{'invalid': !valid.serviceTypeCode }"
          track-by="code"
          label="codeName"
          :multiple="true"
          :showLabels="false"
          :options="code.serviceTypeCode"
          :loading="isLoad.serviceTypeCode"
          :disabled="items.edgeRelayName === 'Relay'"
          @close="onSelectAfter"
          placeholder="Select service type"
        ></multiselect>
      </b-form-fieldset>

      <!-- Domain -->
      <b-form-fieldset
        label="Domain"
        :invalid-feedback="feedback.domain"
        :horizontal="true">

        <b-button variant="in-table" @click="fetchDomain">생성</b-button>
        <small
          class="form-text-alone text-primary ml-2"
          :class="{'invalid': items.edgeDomainName === null }"
        ><strong>{{ items.edgeDomainName }}</strong></small>

        <!-- domain View list -->
        <div
          v-if="serviceDomainList.length"
          class="form-in-view mt-2">
          <b-form-fieldset
            v-for="(type, index) in serviceDomainList"
            :label="type"
            :key="index"
            :horizontal="true">
              <span class="font-text-alone">
                http(s)://<strong class="text-primary">{{ items.edgeDomainName }}</strong>.[city].[country].[service type].[service name].vessels.com
              </span>
          </b-form-fieldset>
        </div>
      </b-form-fieldset>

      <!-- 사용여부 -->
      <b-form-fieldset
        label="사용여부"
        description="※ 미사용 선택 시, DNS(GTM) 설정 정보가 삭제됩니다."
        :horizontal="true">
        <c-switch
          type="text"
          class="v-switch"
          on="사용"
          off="미사용"
          v-model="items.edgeUseYn"
        ></c-switch>
      </b-form-fieldset>
    </b-form>

    <div class="page-btn">
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Edge 관리' }">취소</b-button>
      <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
    </div>
  </div>
</template>

<script>
  import cSwitch from '@/components/Switch'
  export default {
    name: 'referrers',
    components: {
      cSwitch
    },

    data (){
      return {
        items: {
          edgeId : null,
          popId : null,
          edgeDomainName : null,
          edgeRelayYn : false,
          edgeUseYn : true,
          serviceTypeCode: []
        },
        code: {
          popId: [],
          serviceTypeCode: []
        },
        isLoad: {
          popId: true,
          serviceTypeCode: true
        },

        inValidForm: false
      }
    },

    computed: {
      popId: {
        get () {
          return this.code.popId.find(obj => obj.popId === this.items.popId) || null;
        },
        set (newValue) {
          this.items.popId = newValue !== null ? newValue.popId : null;
        }
      },
      serviceTypeCode: {
        get () {
          return this.items.serviceTypeCode.length > 0
            ? this.items.serviceTypeCode.map(val => this.code.serviceTypeCode.find(obj => obj.code === val))
            : [];
        },
        set (newValue) {
          this.items.serviceTypeCode = newValue.length > 0
            ? newValue.map(obj => obj.code)
            : [];
        }
      },

      serviceDomainList () {
        const serviceDomainList = this.serviceTypeCode.map(({ codeValChar1 }) => codeValChar1);
        return [...new Set(serviceDomainList)];
      },

      // validation
      valid (){
        return {
          popId: this.items.popId !== null,
          serviceTypeCode: this.items.serviceTypeCode.length
        }
      },

      feedback (){
        return {
          domain: this.items.edgeDomainName === null ?
            'Domain name 생성이 필요합니다.' : ''
        }
      }
    },

    created (){
      if (this.$route.query.q === undefined){
        alert('잘못된 접근입니다')
        this.$router.push({ name: 'Edge 관리' })
      }

      const edgeId = JSON.parse(this.$route.query.q).id;

      this.$https.get(`/edges/${edgeId}`)
        .then((res) => {
          const serviceTypeCode = res.data.items.serviceTypeCode !== null ? res.data.items.serviceTypeCode : [];
          this.items = {...res.data.items, serviceTypeCode }
        });

      // Service Type Code
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'SERVICE_TYPE' }
        })
        .then((res) => {
          this.isLoad.serviceTypeCode = false;
          this.code.serviceTypeCode = res.data.items.filter(({code}) => {
            const codeSplit = code.split('_')[2];
            return codeSplit.length === 4;
          });
        });

      // PoP List
      this.$https.get('/pops')
        .then((res) => {
          this.isLoad.popId = false;
          this.code.popId = res.data.items;
        });
    },

    methods: {
      onSubmit (){
        this.items.edgeRelayYn = (this.items.edgeRelayName === 'Relay');
        const { edgeId, popId, edgeDomainName, edgeRelayYn, edgeUseYn, serviceTypeCode } = this.items;
        const validate = this.$valid.all({ popId, edgeDomainName, serviceTypeCode });
        this.inValidForm = !validate;

        // POST
        this.$https.post('/edges', {
            edgeId, popId, edgeDomainName, edgeRelayYn, edgeUseYn, serviceTypeCode
          })
          .then(() => {
            this.$router.push({
              name: 'Edge 상세',
              params: { id: this.items.edgeId }
            })
          })
          .catch((error) => {
            console.log(error);
          });
      },

      onChangeEdgeRelay (value){
        this.items.serviceTypeCode = [];
        if (value === 'Relay'){
          this.serviceTypeCode = this.code.serviceTypeCode.map(obj => ({...obj}));
        }
      },

      onSelectAfter (array){
        const rtsp = array.find(({ code }) => code === 'SERVICE_TYPE_0103');
        if (rtsp){
          this.items.serviceTypeCode = [];
          this.serviceTypeCode = [rtsp];
        }
      },

      fetchDomain (){
        this.$https.get('/edges/domain')
          .then((res) => {
            this.items.edgeDomainName = res.data.items.domain;
          });
      }
    }
  }
</script>
