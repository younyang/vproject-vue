<template>
  <div class="animated fadeIn">
    <b-form class="searchBox mb-3" inline>
      <label>Service</label>
      <multiselect
        label="serviceName"
        class="noEmpty"
        :value="service"
        :allowEmpty="false"
        :showLabels="false"
        :searchable="false"
        :options="code.serviceId"
        @select="fetchPoP"
      ></multiselect>
    </b-form>


    <section class="board">
      <b-table
        show-empty
        :items="items"
        :fields="fields"
      >
        <template slot="targetPopId1" scope="row">
          <span v-if="row.item.isEdit">
            <select-box
              label="popName"
              trackBy="popId"
              :id="`row_${row.index}_1`"
              :value="row.value"
              :options="getPopCodeList(row.item.popId)"
              :shareModel="row.item"
              :isSelected="isOptionSelected"
              @select="onOptionSelect"
              @remove="onOptionRemove"
            >
            </select-box>
          </span>
          <span v-else>{{ row.value ? row.value.popName : '' }}</span>
        </template>

        <template slot="targetPopId2" scope="row">
          <span v-if="row.item.isEdit">
            <select-box
              label="popName"
              trackBy="popId"
              :id="`row_${row.index}_2`"
              :value="row.value"
              :options="getPopCodeList(row.item.popId)"
              :shareModel="row.item"
              :isSelected="isOptionSelected"
              @select="onOptionSelect"
              @remove="onOptionRemove"
            >
            </select-box>
          </span>
          <span v-else>{{ row.value ? row.value.popName : '' }}</span>
        </template>

        <template slot="targetPopId3" scope="row">
          <span v-if="row.item.isEdit">
            <select-box
              label="popName"
              trackBy="popId"
              :id="`row_${row.index}_2`"
              :value="row.value"
              :options="getPopCodeList(row.item.popId)"
              :shareModel="row.item"
              :isSelected="isOptionSelected"
              @select="onOptionSelect"
              @remove="onOptionRemove"
            >
            </select-box>
          </span>
          <span v-else>{{ row.value ? row.value.popName : '' }}</span>
        </template>

        <template slot="targetPopId4" scope="row">
          <span v-if="row.item.isEdit">
            <select-box
              label="popName"
              trackBy="popId"
              :id="`row_${row.index}_2`"
              :value="row.value"
              :options="getPopCodeList(row.item.popId)"
              :shareModel="row.item"
              :isSelected="isOptionSelected"
              @select="onOptionSelect"
              @remove="onOptionRemove"
            >
            </select-box>
          </span>
          <span v-else>{{ row.value ? row.value.popName : '' }}</span>
        </template>

        <template slot="targetPopId5" scope="row">
          <span v-if="row.item.isEdit">
            <select-box
              label="popName"
              trackBy="popId"
              :id="`row_${row.index}_2`"
              :value="row.value"
              :options="getPopCodeList(row.item.popId)"
              :shareModel="row.item"
              :isSelected="isOptionSelected"
              @select="onOptionSelect"
              @remove="onOptionRemove"
            >
            </select-box>
          </span>
          <span v-else>{{ row.value ? row.value.popName : '' }}</span>
        </template>

        <template slot="popPreferenceUseYn" scope="row">
          <c-switch
            v-if="row.item.isEdit"
            type="text"
            class="v-switch"
            on="사용"
            off="미사용"
            v-model="row.item.popPreferenceUseYn"
          ></c-switch>
          <span
            v-else
            class="badge ins"
            :class="{'primary' : row.value }"
          >{{ row.value ? '사용' : '미사용' }}
          </span>
        </template>

        <template slot="action" scope="row">
          <span v-if="row.item.isEdit">
            <b-button type="button" variant="in-table" @click="onView(row)">취소</b-button>
            <b-button type="button" variant="in-table" @click="onSubmit(row)">저장</b-button>
          </span>
          <span v-else>
            <b-button type="button" variant="in-table" @click="showHistory(row)">이력</b-button>
            <b-button type="button" variant="in-table" @click="onEdit(row)">수정</b-button>
          </span>
        </template>
      </b-table>
    </section>


    <!-- History Modal -->
    <b-modal size="lg" title="이력관리" v-model="isModalHistory">
      <section class="board">
        <b-table
          show-empty
          :items="history.items"
          :fields="history.fields"
          :current-page="history.pageInfo.page"
          :per-page="history.pageInfo.size"
        >
          <template slot="preference" scope="row">
            <span class="badge" style="min-width: 30px"
            >{{ row.item.targetPopIdName1 || `&nbsp;` }}</span> -
            <span class="badge" style="min-width: 30px"
            >{{ row.item.targetPopIdName2 || `&nbsp;` }}</span> -
            <span class="badge" style="min-width: 30px"
            >{{ row.item.targetPopIdName3 || `&nbsp;` }}</span> -
            <span class="badge" style="min-width: 30px"
            >{{ row.item.targetPopIdName4 || `&nbsp;` }}</span> -
            <span class="badge" style="min-width: 30px"
            >{{ row.item.targetPopIdName5 || `&nbsp;` }}</span>
          </template>
          <template slot="popPreferenceUseYn" scope="row">
            {{ row.value ? '사용' : '미사용' }}
          </template>
        </b-table>
      </section>

      <b-pagination
        v-model="history.pageInfo.page"
        :total-rows="history.pageInfo.totalCount"
        :per-page="history.pageInfo.size"
        class="mt-2"
      ></b-pagination>

      <div slot="modal-footer">
        <b-button type="button" variant="primary" @click="isModalHistory = false">확인</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import SelectBox from '@/components/forms/SelectBox'
  import cSwitch from '@/components/Switch'
  export default {
    name: 'pop-preference',
    components: {
      SelectBox,
      cSwitch
    },
    data (){
      return {
        fields: {
          popName: {label: 'PoP'},
          targetPopId1: {label: '1<i class="require">*</i>'},
          targetPopId2: {label: '2<i class="require">*</i>'},
          targetPopId3: {label: '3<i class="require">*</i>'},
          targetPopId4: {label: '4<i class="require">*</i>'},
          targetPopId5: {label: '5<i class="require">*</i>'},
          popPreferenceUseYn: {label: '사용여부'},
          action: { label: '관리'}
        },
        items: [],
        originItems: [],
        code: {
          serviceId: [],
          popList: [],
          serviceTypeCode: []
        },
        isLoad: {
          serviceTypeCode: true
        },
        history: {
          fields: {
            createId: {label: '등록/수정자', 'class': 'text-left'},
            histBeginDateTime: {label: '등록/수정일시'},
            preference: {label: 'PoP Preference', 'class': 'text-left'},
            popPreferenceUseYn: { label: '사용여부'}
          },
          items: [],
          pageInfo: {
            page: 1,
            size: 10,
            totalCount: 1
          }
        },
        service: {},
        isModalHistory: false,
        isEdit: false,

        serviceTypeCodeVal: [],
      }
    },

    computed: {
    },

    created (){
      this.fetchService();
    },

    methods: {
      // Service List
      fetchService () {
        this.$https.get('/policy/services')
          .then((res) => {
            this.code.serviceId = res.data.items;
            this.fetchPoP(res.data.items[0]);
          });
      },
      // PoP List
      fetchPoP (obj = {}) {
        const { serviceId } = obj;
        this.service = obj;

        this.$https.get(`/policy/services/${serviceId}/pops`)
          .then((res) => {
            this.code.popList = res.data.items;
            this.fetchPreference(serviceId);
          });
      },
      // PoP Preference List fetch
      fetchPreference (serviceId){
        this.$https.get('/policy/popPreference', {
            q: { serviceId }
          })
          .then((res) => {
            this.items = res.data.items.map(obj => {
              const targetPoP = {};
              Object.keys(obj).forEach(key => {
                if(/^targetPopId\d/.test(key)){
                  let pop = this.code.popList.find(({ popId }) => popId === parseInt(obj[key]));
                  targetPoP[key] = pop ? {
                    popId: pop.popId,
                    popName: pop.popName
                  } : null;
                }
              });
              return {
                ...obj,
                ...targetPoP,
                isEdit: false
              }
            });
            this.originItems = JSON.parse(JSON.stringify(this.items))
          });
      },

      onEdit (row) {
        this.isEdit = true
        row.item.isEdit = true
      },

      onView (row) {
        const originRows = this.originItems[row.index];
        Object.keys(originRows).forEach(key => {
          row.item[key] = originRows[key]
        });
        row.item.isEdit = false;
      },

      onSubmit (row) {
        const popIdObj = {};
        Object.keys(row.item).forEach(key => {
          if(/^targetPopId\d/.test(key)){
            popIdObj[key] = row.item[key] ? row.item[key].popId : null
          }
        });
        const item = {
          popId: row.item.popId,
          serviceId: parseInt(this.service.serviceId),
          popPreferenceUseYn: row.item.popPreferenceUseYn,
          modifyHistReason : row.item.modifyHistReason || '',
          ...popIdObj
        };

        this.$https.put(`/policy/popPreference`, item)
          .then(() => {
            row.item.isEdit = false;
            this.items[row.index] = row.item;
            this.originItems[row.index] = {...row.item}
          })
          .catch((error) => {
            console.log(error);
            this.onView(row);
          })
      },

      onOptionSelect (obj, id, item){
        const targetId = `targetPopId${id.split('_')[2]}`;
        const { popId, popName } = this.code.popList.find(({ popId }) => popId === parseInt(obj.popId));
        item[targetId] = { popId, popName };
      },

      onOptionRemove (obj, id, item){
        const targetId = `targetPopId${id.split('_')[2]}`;
        item[targetId] = null;
      },

      isOptionSelected (opt, model) {
        const selectedItem = [];
        Object.keys(model).forEach(key => {
          if(/^targetPopId\d/.test(key)){
            const current = model[key] ? model[key]['popId'] : null;
            selectedItem.push(current);
          }
        });
        return selectedItem.length ? (selectedItem.find(value => value == opt.popId)) : false;
      },

      getPopCodeList (id) {
        return this.code.popList.filter(({ popId }) => popId !== id);
      },

      showHistory (row) {
        const popId = row.item.popId;
        const { serviceId } = this.service;

        this.isModalHistory = !this.isModalHistory;
        this.$https.get(`/policy/popPreference/hist`,{
            q: { serviceId, popId }
          })
          .then((res) => {
            this.history.items = res.data.items;
            this.history.pageInfo.totalCount = res.data.items.length;
          });
      }
    }
  }
</script>

