<template>
  <div class="animated fadeIn">
    <b-form>
      <b-card>
        <!-- Service 선택 -->
        <b-form-fieldset
          label="Service 선택 <i class='require'>*</i>"
          :label-cols="3"
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
          label="PoP 선택 <i class='require'>*</i>"
          :label-cols="3"
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
          <span v-if="items.bandwidth !== null" class="form-sub-text">(Bandwidth : {{ items.bandwidth }} GB)</span>
        </b-form-fieldset>

        <!-- Set2 사용여부 -->
        <b-form-fieldset
          label="Set2사용여부 <i class='require'>*</i>"
          :label-cols="3"
          :horizontal="true">
          <c-switch
            type="icon"
            variant="success"
            v-bind="{on: '\uf00c', off: '\uf00d'}"
            :pill="true"
            v-model="items.setApplyYn"
            @change="onChangeSet2"
          ></c-switch>
          <span class="form-sub-text">(적용 시간 : 02:00:00 ~ 04:59:00)</span>
        </b-form-fieldset>
      </b-card>

      <b-card
        v-if="items.cacheThrottlingCases.length > 0"
        v-for="(cache, index) in items.cacheThrottlingCases"
        :key="index"
      >
        <div slot="header">
          <i class='fa fa-angle-right'></i> <strong>CASE {{ cache.caseSeq }} :</strong> {{ cache.caseName }}
        </div>

        <section class="board" v-if="cache.cacheThrottlingComps.length > 0">
          <b-table
            striped
            bordered
            show-empty
            foot-clone
            :items="cache.cacheThrottlingComps"
            :fields="caseFields"
          >
            <template slot="bandwidth1" scope="row">
              <b-form-checkbox
                v-model="row.item.band1UseYn"
                @change="onChecked(row.item, '1')"
              ></b-form-checkbox>

              <b-form-input
                v-model="row.item.bandwidth1"
                type="number"
                min="0"
                size="sm"
                class="inline"
                style="width:80px"
                :disabled="!row.item.band1UseYn"
              ></b-form-input> GB 제한
            </template>

            <template slot="bandwidth2" scope="row">
              <b-form-checkbox
                v-model="row.item.band2UseYn"
                :disabled="!items.setApplyYn"
                @change="onChecked(row.item, '2')"
              ></b-form-checkbox>

              <b-form-input
                v-model="row.item.bandwidth2"
                type="number"
                min="0"
                size="sm"
                class="inline"
                style="width:80px"
                :disabled="!row.item.band2UseYn"
              ></b-form-input> GB 제한
            </template>

            <template slot="FOOT_serviceTypeCodeName" scope="data">
              Total
            </template>
            <template slot="FOOT_bandwidth1" scope="data">
              <span
                class="warning text-danger"
                v-if="total[index].bandwidth1 > items.bandwidth"
              >설정 가능한 최대 Bandwidth {{ items.bandwidth }} GB를 초과하였습니다</span>
              <span :class="{'text-danger' : total[index].bandwidth1 > items.bandwidth }">{{ total[index].bandwidth1 }}</span>
            </template>
            <template slot="FOOT_bandwidth2" scope="data">
              <span
                class="warning text-danger"
                v-if="total[index].bandwidth2 > items.bandwidth"
              >설정 가능한 최대 Bandwidth {{ items.bandwidth }} GB를 초과하였습니다</span>
              <span :class="{'text-danger' : total[index].bandwidth2 > items.bandwidth }">{{ total[index].bandwidth2 }}</span>
            </template>
          </b-table>
        </section>
      </b-card>
    </b-form>


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
          serviceTypeCodeName: {label: 'Service Type'},
          bandwidth1: {label: 'Set1 (Basic)', 'class': 'text-right'},
          bandwidth2: {label: 'Set2', 'class': 'text-right'}
        },

        code: {
          popId: [],
          serviceId: []
        },
        isLoad: {
          popId: false,
          serviceId: true
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
                .map(({bandwidth1}) => bandwidth1)
                .reduce((p, n) => parseInt(p) + parseInt(n)),
              bandwidth2: cacheThrottlingComps
                .map(({bandwidth2}) => bandwidth2)
                .reduce((p, n) => parseInt(p) + parseInt(n))
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
      }
    }
  }
</script>
