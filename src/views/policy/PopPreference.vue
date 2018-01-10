<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col">
        <b-card>
          <multiselect
            :value = "service"
            label="serviceName"
            class="noEmpty"
            :allowEmpty="false"
            :showLabels="false"
            :searchable="false"
            :options="code.serviceId"
            @select="fetchPreference"
          ></multiselect>
        </b-card>

        <section class="board">
          <b-table
            striped
            bordered
            show-empty
            :items="items"
            :fields="fields"
          >

            <template slot="targetPopId1" scope="row">
              <span>
                <select-box
                  label="popName"
                  trackBy="popId"
                  :id="`row_${row.index}_1`"
                  :value="row.value"
                  :options="code.popList"
                  :shareModel="row.item"
                  :isSelected="isOptionSelected"
                  @select="onOptionSelect"
                >
                </select-box>
              </span>
              <span>{{ row.item.targetPopIdName1 }}</span>
            </template>
            <template slot="targetPopId2" scope="row">
            </template>
            <template slot="targetPopId3" scope="row">
              <span v-if="row.item.isEdit">
              </span>
              <span v-else>{{ row.item.targetPopIdName3 }}</span>
            </template>
            <template slot="targetPopId4" scope="row">
              <span v-if="row.item.isEdit">
                <multiselect
                  v-model="row.item.popList"
                  label="popName"
                  track-by="popId"
                  class="multiple pops"
                  :multiple="true"
                  :showLabels="false"
                  :searchable="false"
                  :options="code.popList"
                >
                </multiselect>
              </span>
              <span v-else>{{ row.item.targetPopIdName4 }}</span>
            </template>
            <template slot="targetPopId5" scope="row">
              <span v-if="row.item.isEdit">

              </span>
              <span v-else>{{ row.item.targetPopIdName5 }}</span>
            </template>

            <template slot="popPreferenceUseYn" scope="row">
              <c-switch
                v-if="row.item.isEdit"
                type="icon"
                variant="success"
                v-bind="{on: '\uf00c', off: '\uf00d'}"
                :pill="true"
                v-model="row.item.popPreferenceUseYn"
              ></c-switch>
              <b-badge
                v-else
                pill
                :variant="row.item.popPreferenceUseYn ? 'success' : 'secondary'">
                {{ row.item.popPreferenceUseYn ? '사용' : '미사용' }}
              </b-badge>
            </template>

            <template slot="action" scope="row">
              <span v-if="row.item.isEdit">
                <b-button type="button" variant="danger" @click="onView(row)">취소</b-button>
                <b-button type="button" variant="primary" @click="onSubmit(row)">저장</b-button>
              </span>
              <span v-else>
                <b-button type="button" variant="outline-primary" @click="showHistory(row)">이력</b-button>
                <b-button type="button" variant="primary" @click="onEdit(row)">수정</b-button>
              </span>
            </template>
          </b-table>
        </section>

      </div>
    </div><!--/.row-->

    <!-- History Modal -->
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
          <template slot="bypassYn" scope="row">
            {{ row.value ? '사용' : '미사용' }}
          </template>
        </b-table>
      </section>

      <div slot="modal-footer">
        <b-button type="button" size="sm" variant="primary" @click="isModalHistory = false"><i class="fa fa-dot-circle-o"></i> 확인</b-button>
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
          targetPopId1: {label: '1 *'},
          targetPopId2: {label: '2 *'},
          targetPopId3: {label: '3 *'},
          targetPopId4: {label: '4 *'},
          targetPopId5: {label: '5 *'},
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
            expireTime: {label: 'ExpireTime', 'class': 'text-right'},
            bypassYn: { label: 'byPass'}
          },
          items: []
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
      this.fetchPoP();
    },

    methods: {
      // PoP List
      fetchPoP () {
        this.$https.get('/policy/pops')
          .then((res) => {
            this.code.popList = res.data.items;
            this.fetchService();
          });
      },
      // Service List
      fetchService () {
        this.$https.get('/policy/services')
          .then((res) => {
            this.code.serviceId = res.data.items;
            this.service = res.data.items[0];
            this.fetchPreference(res.data.items[0]);
          });
      },
      // PoP Preference List fetch
      fetchPreference (obj = {}){
        const { serviceId } = obj;
        this.$https.get('/policy/popPreference', {
            q: { serviceId }
          })
          .then((res) => {
            this.items = res.data.items.map(obj => {
              const popList = [];
              Object.keys(obj).forEach(key => {
                if(/^targetPopId\d/.test(key)){
                  let pop = this.code.popList.find(({ popId }) => popId === parseInt(obj[key]));
                  if (pop){
                    popList.push({
                      target: key.split('targetPopId')[1],
                      popId: pop.popId,
                      popName: pop.popName
                    });
                  }
                }
              });
              return {
                ...obj,
                popList,
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
          if(/^targetPopIdName/.test(key)){
            const number = key.split('targetPopIdName')[1];
            popIdObj[`targetPopId${number}`] = row.item[key][0] ? row.item[key][0].popId : null
          }
        });
        const item = {
          popId: row.item.popId,
          serviceId: this.service.serviceId,
          popPreferenceUseYn: row.item.popPreferenceUseYn,
          modifyHistReason : row.item.modifyHistReason || '',
          ...popIdObj
        };

        console.log(item)

        this.$https.put(`/policy/popPreference`,item)
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
        const targetName = `targetPopIdName${id.split('_')[2]}`;
        const currentItem = this.code.popList.find(({ popId }) => popId === parseInt(obj.popId));
        item[targetId] = currentItem.popId;
        item[targetName] = currentItem.popName;
      },

      isOptionSelected (opt, model) {
        const selectedItem = [];
        Object.keys(model).forEach(key => {
          if(/^targetPopId\d/.test(key)){
            selectedItem.push(model[key]);
          }
        });
        return selectedItem.length ? (selectedItem.find(value => value == opt.popId)) : false;
      },

      getPopValue (id){
        return this.code.popList.find(({ popId }) => popId === parseInt(id)) || null
      },

      onSelect (obj, id){
        const rowIndex = id.split('_')[1];
        const number = id.split('_')[2];
        const target = {
          [`targetPopId${number}`]: String(obj.popId),
          [`targetPopIdName${number}`]: String(obj.popName)
        };

        this.items[rowIndex] = {...this.items[rowIndex], ...target}
        //this.items[rowIndex][targetName] = obj.popName;
      },

      showHistory (row) {
        this.isModalHistory = !this.isModalHistory;
        this.$https.get(`/policy/oneTimeUrl/hist/${row.item.popId}`)
          .then((res) => {
            this.history.items = res.data.items;
          });
      }
    }
  }
</script>

<style>
  .select-share li > .selected {
    background: grey
  }
</style>

