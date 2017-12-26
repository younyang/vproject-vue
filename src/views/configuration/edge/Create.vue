<template>
  <div class="animated fadeIn">
    <b-form>
      <b-card>
        <!-- IP -->
        <b-form-fieldset
          label="IP"
          :label-cols="3"
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
          :label-cols="3"
          :horizontal="true">
          <b-form-input
            :value="items.hostName"
            type="text"
            plaintext
          ></b-form-input>
        </b-form-fieldset>

        <!-- PoP 선택 -->
        <b-form-fieldset
          label="PoP 선택 *"
          :label-cols="3"
          :horizontal="true">
          <multiselect
            v-model="popId"
            :allowEmpty="false"
            :showLabels="false"
            :searchable="false"
            :options="code.popId"
            :loading="isLoad.popId"
            label="popName"
            placeholder="선택"
          ></multiselect>
        </b-form-fieldset>

        <!-- 구분 -->
        <b-form-fieldset
          label="구분 *"
          :label-cols="3"
          :horizontal="true">
          <b-form-radio-group
            :options="[{ text: 'Edge', value: 'Edge' },{ text: 'Relay', value: 'Relay' }]"
            v-model="items.edgeRelayName"
          ></b-form-radio-group>
        </b-form-fieldset>


        <!-- Service Type -->
        <b-form-fieldset
          label="Service Type *"
          :label-cols="3"
          :horizontal="true">

          <multiselect
            v-model="serviceTypeCode"
            :multiple="true"
            :showLabels="false"
            :options="code.serviceTypeCode"
            label="codeName"
            :loading="isLoad.serviceTypeCode"
            track-by="code"
            placeholder="Select service type"
          ></multiselect>
        </b-form-fieldset>

        <!-- Domain -->
        <b-form-fieldset
          label="Domain"
          :label-cols="3"
          :horizontal="true">

          <b-button variant="outline-secondary" size="sm" @click="fetchDomain">생성</b-button>
          <strong class="text-danger ml-1">{{ items.edgeDomainName }}</strong>

          <ul class="icons-list edge mt-2">
            <li v-for="(type, index) in serviceDomainList">
              <i class="bg-primary">{{ type }}</i>
              <div class="desc">
                <div class="title">
                  http(s)://<strong class="text-danger">{{ items.edgeDomainName }}</strong>.[city].[country].[service type].[service name].vessels.com
                </div>
              </div>
            </li>
          </ul>
        </b-form-fieldset>

        <!-- 사용여부 -->
        <b-form-fieldset
          label="사용여부"
          :label-cols="3"
          description="※ 미사용 선택 시, DNS(GTM) 설정 정보가 삭제됩니다."
          :horizontal="true">
          <c-switch
            type="icon"
            variant="success"
            v-bind="{on: '\uf00c', off: '\uf00d'}"
            :pill="true"
            v-model="items.edgeUseYn"
          ></c-switch>
        </b-form-fieldset>

        <div slot="footer" class="form-btn">
          <b-button type="button" size="sm" variant="primary" @click="onSubmit"><i class="fa fa-dot-circle-o"></i> 저장</b-button>
          <b-button type="button" size="sm" variant="secondary" :to="{ name: 'Edge 관리' }"><i class="fa fa-ban"></i> 취소</b-button>
        </div>
      </b-card>
    </b-form>
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
        }
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
          this.code.serviceTypeCode = res.data.items.filter(({code, codeName, codeValChar1}) => {
            const number = code.split('_')[2];
            return !(number.length === 4 && codeName === codeValChar1);
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

      fetchDomain (){
        this.$https.get('/edges/domain')
          .then((res) => {
            this.items.edgeDomainName = res.data.items.domain;
          });
      }
    }
  }
</script>
