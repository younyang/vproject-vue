<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col">
        <b-card>
          <multiselect
            :value = "service"
            label="serviceName"
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
              <span v-if="row.item.isEdit">
                <div tabindex="0" class="multiselect inline pops">
                  <div class="multiselect__select"></div>
                  <div class="multiselect__tags">
                    <div class="multiselect__tags-wrap">
                      <span class="multiselect__tag">
                        <span>성수</span>
                        <i aria-hidden="true" tabindex="1" class="multiselect__tag-icon"></i>
                      </span>
                    </div>
                    <div class="multiselect__content-wrapper">
                      <ul class="multiselect__content">
                        <li class="">
                          <span class="multiselect__option multiselect__option--highlight"><span>성수</span></span>
                        </li>
                        <li class="multiselect__element">
                          <span class="multiselect__option multiselect__option--selected"><span>송파</span></span>
                        </li>
                        <li class="multiselect__element"><span data-select="" data-selected="" data-deselect="" class="multiselect__option"><span>상암</span></span> <!----></li><li class="multiselect__element"><span data-select="" data-selected="" data-deselect="" class="multiselect__option"><span>수원</span></span> <!----></li><li class="multiselect__element"><span data-select="" data-selected="" data-deselect="" class="multiselect__option"><span>상암</span></span> <!----></li><li class="multiselect__element"><span data-select="" data-selected="" data-deselect="" class="multiselect__option"><span>상암</span></span> <!----></li><li class="multiselect__element"><span data-select="" data-selected="" data-deselect="" class="multiselect__option"><span>history</span></span> <!----></li> <li style="display: none;"><span class="multiselect__option">No elements found. Consider changing the search query.</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </span>
              <span v-else>{{ row.value[0] ? row.value[0].popName : '' }}</span>
            </template>
            <template slot="targetPopId2" scope="row">
              <span v-if="row.item.isEdit">
                <multiselect
                  v-model="row.item.targetPopId2"
                  label="popName"
                  track-by="popId"
                  class="inline pops"
                  :multiple="true"
                  :showLabels="false"
                  :searchable="false"
                  :options="code.popList"
                >
                </multiselect>
              </span>
              <span v-else>{{ row.value[0] ? row.value[0].popName : '' }}</span>
            </template>
            <template slot="targetPopId3" scope="row">
              <span v-if="row.item.isEdit">
                <multiselect
                  v-model="row.item.targetPopId3"
                  label="popName"
                  track-by="popId"
                  class="inline pops"
                  :class="{'disSelect': row.value[0] !== undefined}"
                  :multiple="true"
                  :showLabels="false"
                  :searchable="false"
                  :options="code.popList"
                >
                </multiselect>
              </span>
              <span v-else>{{ row.value[0] ? row.value[0].popName : '' }}</span>
            </template>
            <template slot="targetPopId4" scope="row">
              <span v-if="row.item.isEdit">
                <multiselect
                  v-model="row.item.targetPopId4"
                  label="popName"
                  track-by="popId"
                  class="inline pops"
                  :class="{'disSelect': row.value[0] !== undefined}"
                  :multiple="true"
                  :showLabels="false"
                  :searchable="false"
                  :options="code.popList"
                >
                </multiselect>
              </span>
              <span v-else>{{ row.value[0] ? row.value[0].popName : '' }}</span>
            </template>
            <template slot="targetPopId5" scope="row">
              <span v-if="row.item.isEdit">
                <multiselect
                  v-model="row.item.targetPopId5"
                  label="popName"
                  track-by="popId"
                  class="inline pops"
                  :class="{'disSelect': row.value[0] !== undefined}"
                  :multiple="true"
                  :showLabels="false"
                  :searchable="false"
                  :options="code.popList"
                >
                </multiselect>
              </span>
              <span v-else>{{ row.value[0] ? row.value[0].popName : '' }}</span>
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
                <b-button type="button" size="sm" variant="danger" @click="onView(row)">취소</b-button>
                <b-button type="button" size="sm" variant="primary" @click="onSubmit(row)">저장</b-button>
              </span>
              <span v-else>
                <b-button type="button" size="sm" variant="outline-primary" @click="showHistory(row)">이력</b-button>
                <b-button type="button" size="sm" variant="primary" @click="onEdit(row)">수정</b-button>
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
  import cSwitch from '@/components/Switch'
  export default {
    name: 'onetime',
    components: {
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
              const popListObj = {};
              Object.keys(obj).forEach(key => {
                if(/^targetPopId\d/.test(key)){
                  let pop = this.code.popList.find(({ popId }) => popId === obj[key]);
                  popListObj[key] = pop ? [pop] : [];
                }
              });
              return {
                ...obj,
                ...popListObj,
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
        console.log(row.item)
        Object.keys(row.item).forEach(key => {
          if(/^targetPopIdName/.test(key)){
            const number = key.split('targetPopIdName')[1];
            console.log(key)
            popIdObj[`targetPopId${number}`] = row.item[key][0] ? row.item[key][0].popId : null
          }
        });
        const item = {
          popId: row.item.popId,
          serviceId: this.service.serviceId,
          popPreferenceUseYn: row.item.popPreferenceUseYn,
          modifyHistReason : row.item.modifyHistReason,
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

