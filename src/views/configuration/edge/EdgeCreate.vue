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

      <!-- PoP 선택
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
      -->

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
          Service Type / Protocol<i class="require">*</i>
        </template>

        <multiselect
          v-model="serviceTypeCode"
          class="multiple"
          :class="{'invalid': !valid.serviceTypeCode }"
          track-by="serviceTypeAndProtocolCode"
          label="serviceTypeName"
          :multiple="true"
          :showLabels="false"
          :options="code.serviceTypeCode"
          :loading="isLoad.serviceTypeCode"
          :disabled="items.edgeRelayName === 'Relay'"
          @close="onSelectAfter"
          placeholder="Select service type"
        ></multiselect>
      </b-form-fieldset>

      <!-- 지역 -->
      <b-form-fieldset
        label="지역<i class='require'>*</i>"
        :invalid-feedback="$valid.msg.select"
        :horizontal="true">
        <multiselect
          v-model="geoCode"
          :showLabels="false"
          :searchable="false"
          :options="code.geoCode"
          :loading="isLoad.geoCode"
          :class="{'invalid': !valid.geoCode }"
          track-by="code"
          label="codeName"
          style="width:156px"
          placeholder="선택"
        ></multiselect>
      </b-form-fieldset>

      <!-- 주소 -->
      <b-form-fieldset
        label="주소<i class='require'>*</i>"
        :invalid-feedback="$valid.msg.select"
        :horizontal="true">
        <multiselect
          v-model="popCtprvnCode"
          :showLabels="false"
          :searchable="false"
          :options="code.popCtprvnCode"
          :loading="isLoad.popCtprvnCode"
          :class="{'invalid': !valid.popCtprvnCode }"
          @select="onFirstAddress"
          track-by="addressCode"
          label="addressCodeName"
          class="inline"
          style="width:156px"
          placeholder="선택"
        ></multiselect>

        <multiselect
          v-if="popCtprvnCode"
          v-model="popSigCode"
          :showLabels="false"
          :searchable="false"
          :options="code.popSigCode"
          :loading="isLoad.popSigCode"
          :class="{'invalid': !valid.popSigCode }"
          track-by="addressCode"
          label="addressCodeName"
          placeholder="선택"
          class="inline"
          style="width: 160px"
        ></multiselect>
      </b-form-fieldset>

      <!-- Bandwidth -->
      <b-form-fieldset
        label="Bandwidth<i class='require'>*</i>"
        :invalid-feedback="$valid.msg.require"
        :horizontal="true">
        <cleave
          v-model="items.bandwidth"
          :value.sync="items.bandwidth"
          style="width: 156px;"
          class="form-control"
          :options="{ numeral: true, numeralPositiveOnly: true, numeralDecimalScale: 0 }"
          required
        ></cleave>
        &nbsp Gbps
      </b-form-fieldset>

      <!-- Domain
      <b-form-fieldset
        label="Domain"
        :invalid-feedback="feedback.domain"
        :horizontal="true">

        <b-button variant="in-table" @click="fetchDomain">생성</b-button>
        <small
          class="form-text-alone text-primary ml-2"
          :class="{'invalid': items.edgeDomainName === null }"
        ><strong>{{ items.edgeDomainName }}</strong></small>

        domain View list
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
      </b-form-fieldset>-->

      <!-- 사용여부
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
      </b-form-fieldset>-->
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
    name: 'edgeCreate',
    components: {
      cSwitch
    },

    data (){
      return {
        items: {
          edgeId : null,
          popId : null,
          //edgeDomainName : null,
          edgeRelayYn : false,
          edgeUseYn : true,
          serviceTypeCode: [],
          geoCode: null,
          popCtprvnCode : null,
          popSigCode : null,
          bandwidth : 0
        },
        code: {
          popCtprvnCode: [],
          popSigCode: [],
          popId: [],
          serviceTypeCode: [],
          geoCode: []
        },
        isLoad: {
          popCtprvnCode: true,
          popSigCode: true,
          popId: true,
          serviceTypeCode: true,
          geoCode: true
        },

        inValidForm: false
      }
    },

    computed: {
      popCtprvnCode: {
        get () {
          return this.code.popCtprvnCode.find(obj => obj.addressCode === this.items.popCtprvnCode) || null;
        },
        set (newValue) {
          this.items.popCtprvnCode = newValue !== null ? newValue.addressCode : null;
        }
      },
      popSigCode: {
        get () {
          return this.code.popSigCode.find(obj => obj.addressCode === this.items.popSigCode) || null;
        },
        set (newValue) {
          this.items.popSigCode = newValue !== null ? newValue.addressCode : null;
        }
      },
      popId: {
        get () {
          return this.code.popId.find(obj => obj.popId === this.items.popId) || null;
        },
        set (newValue) {
          this.items.popId = newValue !== null ? newValue.popId : null;
        }
      },
      geoCode: {
        get () {
          return this.code.geoCode.find(obj => obj.code === this.items.geoCode) || null;
        },
        set (newValue) {
          this.items.geoCode = newValue !== null ? newValue.code : null;
        }
      },
      serviceTypeCode: {
        get () {
          return this.items.serviceTypeCode.length > 0
            ? this.items.serviceTypeCode.map(val => this.code.serviceTypeCode.find(obj => obj.serviceTypeAndProtocolCode === val))
            : [];
        },
        set (newValue) {
          this.items.serviceTypeCode = newValue.length > 0
            ? newValue.map(obj => obj.serviceTypeAndProtocolCode)
            : [];
        }
      },
      /*
      serviceDomainList () {
        const serviceDomainList = this.serviceTypeCode.map(({ codeValChar1 }) => codeValChar1);
        return [...new Set(serviceDomainList)];
      },*/

      // validation
      valid (){
        return {
          popId: this.items.popId !== null,
          geoCode: this.items.geoCode !== null,
          serviceTypeCode: this.items.serviceTypeCode.length,
          popCtprvnCode: this.items.popCtprvnCode !== null,
          popSigCode: this.items.popSigCode !== null
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

      // 주소 Code
      this.fetchAddress();

      const edgeId = JSON.parse(this.$route.query.q).id;

      this.$https.get(`/edges/${edgeId}`)
        .then((res) => {
          const serviceTypeCode = res.data.items.serviceTypeCode !== null ? res.data.items.serviceTypeCode : [];
          res.data.items.bandwidth = 0
          res.data.items.popCtprvnCode = null
          res.data.items.popSigCode = null
          res.data.items.geoCode = null
          this.items = {...res.data.items, serviceTypeCode}
        });

      // Service Type Code
      this.$https.get('/edges/serviceTypeAndProtocol')
        .then((res) => {
          this.isLoad.serviceTypeCode = false
          this.code.serviceTypeCode = res.data.items
        })

      // PoP List
      this.$https.get('/pops')
        .then((res) => {
          this.isLoad.popId = false;
          this.code.popId = res.data.items;
        });

      // GEO List
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'GEO' }
        })
        .then((res) => {
          this.isLoad.geoCode = false;
          this.code.geoCode = res.data.items;
        });
    },

    methods: {
      onSubmit (){
        this.items.edgeRelayYn = (this.items.edgeRelayName === 'Relay');
        this.items.edgeUseYn = true;
        const { edgeId, popCtprvnCode, popSigCode, bandwidth, edgeRelayYn, edgeUseYn, serviceTypeCode, geoCode } = this.items;
        const validate = this.$valid.all({ serviceTypeCode, popCtprvnCode, popSigCode, bandwidth, geoCode });
        this.inValidForm = !validate;

        // POST
        if (validate){
          this.$https.post('/edges', {
              edgeId, popCtprvnCode, popSigCode, bandwidth, edgeRelayYn, edgeUseYn, serviceTypeCode, geoCode
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
        }
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
      /*
      fetchDomain (){
        this.$https.get('/edges/domain')
          .then((res) => {
            this.items.edgeDomainName = res.data.items.domain;
          });
      },
      */
      fetchAddress (param =''){
        this.$https.get('/pops/address', {
          firstDepth: param
        })
          .then((res) => {
            if (param === ''){
              this.isLoad.popCtprvnCode = false;
              this.code.popCtprvnCode = res.data.items;
            } else {
              this.isLoad.popSigCode = false;
              this.code.popSigCode = res.data.items;
            }
          });
      },

      onFirstAddress (obj){
        this.fetchAddress(obj.addressCode)
      }
    }
  }
</script>
