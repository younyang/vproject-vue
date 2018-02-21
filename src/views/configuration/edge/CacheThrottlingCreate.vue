<template>
  <div class="animated fadeIn">
    <b-form class="formView">
      <!-- Service 선택 -->
      <b-form-fieldset
        label="Service 선택<i class='require'>*</i>"
        :horizontal="true">
        <multiselect
          id="serviceId"
          v-model="serviceId"
          class="noEmpty inline"
          style="width: 50%"
          :allowEmpty="false"
          :showLabels="false"
          :searchable="false"
          :options="code.serviceId"
          :loading="isLoad.serviceId"
          label="serviceName"
          placeholder="선택"
          @select="onSearchPoP"
        ></multiselect>
      </b-form-fieldset>

      <!-- PoP 선택 -->
      <b-form-fieldset
        label="PoP 선택<i class='require'>*</i>"
        :horizontal="true">
        <multiselect
          id="popId"
          v-model="popId"
          class="noEmpty inline"
          style="width: 50%"
          :allowEmpty="false"
          :showLabels="false"
          :searchable="false"
          :options="code.popId"
          :loading="isLoad.popId"
          label="popName"
          placeholder="선택"
          @select="onSearchBandwidth"
        ></multiselect>
        <small class="form-text-alone text-muted">(Bandwidth : {{ items.bandwidth }} GB)</small>
      </b-form-fieldset>

      <!-- Set2 사용여부 -->
      <b-form-fieldset
        label="Set2사용여부<i class='require'>*</i>"
        :horizontal="true">
        <c-switch
          type="text"
          class="v-switch"
          on="사용"
          off="미사용"
          v-model="items.setApplyYn"
          @change="onChangeSet2"
        ></c-switch>
        <small class="form-text-alone text-muted">(적용 시간 : 02:00:00 ~ 04:59:00)</small>
      </b-form-fieldset>
    </b-form>

    <div
      class="cache-content"
      v-if="items.cacheThrottlingCases.length > 0"
      v-for="(cache, index) in items.cacheThrottlingCases"
      :key="index"
    >
      <h3 class="cache-title">
        <i class="fa fa-arrow-right"></i>
        <strong>CASE {{ cache.caseSeq }}/</strong>{{ cache.caseName }}
      </h3>

      <section class="board" v-if="cache.cacheThrottlingComps.length">
        <b-table
          show-empty
          foot-clone
          :items="cache.cacheThrottlingComps"
          :fields="caseFields"
        >
          <template slot="bandwidth1" slot-scope="row">
            <b-form-checkbox
              v-model="row.item.band1UseYn"
              @change="onChecked(row.item, '1')"
            ></b-form-checkbox>

            <cleave
              class="form-control"
              style="width: 80px;"
              v-model.number="row.item.bandwidth1"
              :options="{ numeral: true, numeralPositiveOnly: true, numeralDecimalScale: 0 }"
              :disabled="!row.item.band1UseYn"
              @input="setDefault(row.item, 'bandwidth1')"
            ></cleave> GB 제한
          </template>

          <template slot="bandwidth2" slot-scope="row">
            <b-form-checkbox
              v-model="row.item.band2UseYn"
              :disabled="!items.setApplyYn"
              @change="onChecked(row.item, '2')"
            ></b-form-checkbox>

            <cleave
              class="form-control"
              style="width: 80px;"
              v-model.number="row.item.bandwidth2"
              :options="{ numeral: true, numeralPositiveOnly: true, numeralDecimalScale: 0 }"
              :disabled="!row.item.band2UseYn"
              @input="setDefault(row.item, 'bandwidth2')"
            ></cleave> GB 제한
          </template>

          <template slot="FOOT_serviceTypeCodeName" slot-scope="data">
            <span class="total-title">Total</span>
          </template>
          <template slot="FOOT_bandwidth1" slot-scope="data">
            <small
              class="invalid"
              v-if="total[index].bandwidth1 > items.bandwidth"
            >설정 가능한 최대 Bandwidth {{ items.bandwidth }} GB를 초과하였습니다</small>
            <span class="total-text" :class="{'text-danger' : total[index].bandwidth1 > items.bandwidth }">{{ total[index].bandwidth1 }} GB 제한</span>
          </template>
          <template slot="FOOT_bandwidth2" slot-scope="data">
            <small
              class="invalid"
              v-if="total[index].bandwidth2 > items.bandwidth"
            >설정 가능한 최대 Bandwidth {{ items.bandwidth }} GB를 초과하였습니다</small>
            <span class="total-text" :class="{'text-danger' : total[index].bandwidth2 > items.bandwidth }">{{ total[index].bandwidth2 }} GB 제한</span>
          </template>
        </b-table>
      </section>
    </div>


    <div class="page-btn">
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Cache Throttling 관리' }">취소</b-button>
      <b-button type="button" variant="primary" @click="onSubmit" :disabled="!onCheckBandwidth()">저장 및 배포</b-button>
    </div>

  </div>
</template>

<script>
  import cSwitch from '@/components/Switch'
  export default {
    name: 'cache',
    components: {
      cSwitch
    },

    data (){
      return {
        items: {
          popId: null,
          serviceId: null,
          bandwidth: null,
          setApplyYn: false,
          modifyHistReason: '등록',
          cacheThrottlingCases: []
        },

        caseFields: {
          serviceTypeCodeName: {label: 'Service Type', 'class': 'serviceType'},
          bandwidth1: {label: 'Set1 (Basic)', 'class': 'bandwidth'},
          bandwidth2: {label: 'Set2', 'class': 'bandwidth'}
        },

        code: {
          popId: [],
          serviceId: []
        },
        isLoad: {
          popId: false,
          serviceId: true
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
      serviceId: {
        get () {
          return this.code.serviceId.find(obj => obj.serviceId === this.items.serviceId) || null;
        },
        set (newValue) {
          this.items.serviceId = newValue !== null ? newValue.serviceId : null;
        }
      },

      total (){
        const items = this.items.cacheThrottlingCases.length > 0 ?
          this.items.cacheThrottlingCases.map(({ cacheThrottlingComps }) => {
            return {
              bandwidth1: cacheThrottlingComps
                .map(({bandwidth1}) => bandwidth1 !== '' ? bandwidth1 : 0)
                .reduce((p, n) => p + n),
              bandwidth2: cacheThrottlingComps
                .map(({bandwidth2}) => bandwidth2 !== '' ? bandwidth2 : 0)
                .reduce((p, n) => p + n)
            }
          }) : [{ bandwidth1: 0, bandwidth2: 0 }];

        return items;
      }
    },

    created (){
      // Service ID List
      this.$https.get('/policy/services')
        .then((res) => {
          this.isLoad.serviceId = false;
          this.code.serviceId = res.data.items;
        });
    },

    methods: {
      onSubmit (){
        const cacheCase = this.items.cacheThrottlingCases.map(obj => {
          const cacheThrottlingComps = obj.cacheThrottlingComps.length > 0 ?
            obj.cacheThrottlingComps.map(({ serviceTypeCode, bandwidth1, bandwidth2 }) => ({
              serviceTypeCode,
              bandwidth1: parseInt(bandwidth1),
              bandwidth2: parseInt(bandwidth2)
            }))
            : [];
          return {
            ...obj,
            cacheThrottlingComps
          }
        });

        const items = {
          ...this.items,
          cacheThrottlingCases: cacheCase
        };

        // POST
        this.$https.post('/policy/cacheThrottlings', items)
          .then((res) => {
            this.$router.push({
              name: 'Cache Throttling 상세',
              params: { id: res.data.items }
            })
          })
          .catch((error) => {
            console.log(error);
          });
      },

      onSearchPoP (obj){
        const serviceId = obj.serviceId;
        this.code.popId = [];
        this.items = {
          ...this.items,
          popId: null,
          bandwidth: null,
          setApplyYn: false,
          cacheThrottlingCases: []
        };

        // PoP ID List
        this.isLoad.popId = true;
        this.$https.get(`/policy/cacheThrottlings/services/${serviceId}/pops`)
          .then((res) => {
            this.isLoad.popId = false;
            this.code.popId = res.data.items;
          });
      },

      onSearchBandwidth (obj){
        const serviceId = this.items.serviceId;
        const popId = obj.popId;
        this.$https.get(`/policy/cacheThrottlings/bandwidth/service/${serviceId}/pop/${popId}`)
          .then((res) => {
            this.items.bandwidth = res.data.items.popBandwidth;
            this.items.cacheThrottlingCases = res.data.items.cacheThrottlingCases;

            if (this.items.cacheThrottlingCases.length > 0){
              this.setCacheCaseData();
            }
          });
      },

      onCheckBandwidth (){
        let isCheckBandwidth = true;
        this.total.forEach(({ bandwidth1, bandwidth2}) => {
          if (bandwidth1 > this.items.bandwidth || bandwidth2 > this.items.bandwidth){
            isCheckBandwidth = false;
          }
        });
        return isCheckBandwidth;
      },

      onChecked (item, type){
        const useYn = `band${type}UseYn`;
        const bandwidth = `bandwidth${type}`;
        if (!item[useYn]) {
          item[bandwidth] = 0;
        }
      },

      onChangeSet2 (applyYn){
        const cases = this.items.cacheThrottlingCases;

        if (!applyYn && cases.length > 0){
          cases.forEach(({ cacheThrottlingComps }) => {
            if (cacheThrottlingComps.length > 0 ){
              cacheThrottlingComps.forEach(ob => {
                ob.band2UseYn = false;
                ob.bandwidth2 = 0;
              })
            }
          });
        }
      },

      setCacheCaseData (){
        this.items.cacheThrottlingCases = this.items.cacheThrottlingCases.map(obj => {
          const cacheThrottlingComps = obj.cacheThrottlingComps.length > 0 ?
            obj.cacheThrottlingComps.map(ob => ({
              ...ob,
              band1UseYn: ob.bandwidth1 > 0,
              band2UseYn: ob.bandwidth2 > 0
            }))
            : [];
          return {
            ...obj,
            cacheThrottlingComps
          }
        });
      },

      setDefault (item, key) {
        item[key] = item[key] !== '' ? parseInt(item[key]) : 0;
      },
    }
  }
</script>
