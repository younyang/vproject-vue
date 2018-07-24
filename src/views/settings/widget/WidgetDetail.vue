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

        <b-form-fieldset
          :horizontal="true">
          <template slot="label">
            Widget Name<i class="require" v-if="isEdit">*</i>
          </template>

          <b-form-input
            v-model="items.widgetName"
            type="text"
            placeholder="Enter Widget Name"
            :plaintext="!isEdit"
            required
          ></b-form-input>
        </b-form-fieldset>

        <!-- Data Source -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.select"
          :horizontal="true">
          <template slot="label">
            Data Source<i class="require" v-if="isEdit">*</i>
          </template>

          <b-form-input
            v-if="!isEdit"
            :value="items.widgetSourceName"
            type="text"
            plaintext
          ></b-form-input>

          <multiselect
            v-if="isEdit"
            v-model="widgetSourceCode"
            track-by="code"
            label="codeName"
            :class="{'invalid': !valid.widgetSourceCode }"
            :options="code.widgetSourceCode"
            :showLabels="false"
            :loading="isLoad.widgetSourceCode"
            placeholder="Select Data Source"
          ></multiselect>
        </b-form-fieldset>

        <!-- Main Mode -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.select"
          :horizontal="true">
          <template slot="label">
            Main Mode<i class="require" v-if="isEdit">*</i>
          </template>

          <span v-if="!isEdit && items.widgetModeCode === 'WIDGET_MODE_01'">
            {{items.widgetModeName}} / Unit {{items.widgetModeUnitQty}} {{items.widgetModeUnitName}}
          </span>
          <span v-if="!isEdit && items.widgetModeCode !== 'WIDGET_MODE_01'">
            {{items.widgetModeName}}
          </span>

          <multiselect
            v-if="isEdit"
            v-model="widgetModeCode"
            track-by="code"
            label="codeName"
            :class="{'invalid': !valid.widgetModeCode }"
            :options="code.widgetModeCode"
            :showLabels="false"
            :loading="isLoad.widgetModeCode"
            placeholder="Select Main Mode"
          ></multiselect>
          <span v-if="isEdit && items.widgetModeCode === 'WIDGET_MODE_01'"> &nbsp; / &nbsp; Unit &nbsp;
            <b-form-input
              v-model="items.widgetModeUnitQty"
              type="text"
              style="width:40px"
              maxlength="2"
            ></b-form-input>
            <multiselect
            v-model="widgetModeUnitCode"
            track-by="code"
            label="codeName"
            :options="code.widgetModeUnitCode"
            :showLabels="false"
            :loading="isLoad.widgetModeUnitCode"
            placeholder="Select Unit"
          ></multiselect>
          </span>
        </b-form-fieldset>

        <!-- Sub Mode -->
        <b-form-fieldset
          :horizontal="true">
          <template slot="label">
            Sub Mode
          </template>

          <span v-if="!isEdit && items.widgetSubModeCode === 'WIDGET_MODE_01'">
            {{items.widgetSubModeName}} / Unit {{items.widgetSubModeUnitQty}} {{items.widgetSubModeUnitName}}
          </span>
          <span v-if="!isEdit && items.widgetSubModeCode !== 'WIDGET_MODE_01'">
            {{items.widgetSubModeName}}
          </span>

          <multiselect
            v-if="isEdit"
            v-model="widgetSubModeCode"
            track-by="code"
            label="codeName"
            :options="code.widgetSubModeCode"
            :showLabels="false"
            :loading="isLoad.widgetSubModeCode"
            placeholder="Select Sub Mode"
          ></multiselect>
          <span v-if="isEdit && items.widgetSubModeCode === 'WIDGET_MODE_01'"> &nbsp; / &nbsp; Unit &nbsp;
            <b-form-input
              v-model="items.widgetSubModeUnitQty"
              type="text"
              style="width:40px"
              maxlength="2"
            ></b-form-input>
            <multiselect
            v-model="widgetSubModeUnitCode"
            track-by="code"
            label="codeName"
            :options="code.widgetSubModeUnitCode"
            :showLabels="false"
            :loading="isLoad.widgetSubModeUnitCode"
            placeholder="Select Unit"
          ></multiselect>
          </span>
        </b-form-fieldset>

        <b-form-fieldset
            label="Values"
            :horizontal="true">
            <b-form-checkbox v-if="isEdit"
              v-model="items.valueSumYn"
            >Sum</b-form-checkbox>
          <b-form-checkbox v-if="isEdit"
              v-model="items.valueAvgYn"
            >Avg</b-form-checkbox>
          <b-form-checkbox v-if="isEdit"
              v-model="items.valuePeakYn"
            >Peak</b-form-checkbox>
            <span class="badge"
              v-if="!isEdit && items.valueSumYn">
              Sum
            </span>
            <span class="badge"
              v-if="!isEdit && items.valueAvgYn">
              Avg
            </span>
            <span class="badge"
              v-if="!isEdit && items.valuePeakYn">
              Peak
            </span>
        </b-form-fieldset>

        <b-form-fieldset
          :horizontal="true">
          <template slot="label">
            Display Type<i class="require">*</i>
          </template>
            <b-form-checkbox-group v-if="isEdit" v-model="items.widgetDisplayCode" name="widgetDisplayCode" :options="code.widgetDisplayCode">
            </b-form-checkbox-group>

            <div class="badge-list" v-else>
            <span class="badge" v-for="item in items.widgetDisplayList">
              {{ item.widgetDisplayName }}
            </span>
          </div>

        </b-form-fieldset>

        <!-- Target Type -->
        <b-form-fieldset
          :invalid-feedback="$valid.msg.select"
          :horizontal="true">
          <template slot="label">
            Target Type<i class="require" v-if="isEdit">*</i>
          </template>

          <multiselect
            v-model="widgetTargetCode"
            v-if="isEdit"
            class="multiple"
            label="codeName"
            track-by="code"
            :multiple="true"
            :showLabels="false"
            :options="code.widgetTargetCode"
            :loading="false"
            placeholder="Select Target"
          ></multiselect>

          <div class="badge-list" v-else>
            <span class="badge" v-for="item in items.widgetTargetList">
              {{ item.widgetTargetName }}
            </span>
          </div>
        </b-form-fieldset>

        <!-- 계정 잠김 여부 -->
          <b-form-fieldset
            label="Time range"
            :horizontal="true">
            <c-switch
              v-if="isEdit"
              type="text"
              class="v-switch"
              on="사용"
              off="미사용"
              v-model="items.timeRangeUseYn"
            ></c-switch>
            <span
            v-else
              class="badge"
              :class="{'primary' : items.timeRangeUseYn }"
            >{{ items.timeRangeUseYn ? '사용' : '미사용' }}
            </span>
            <span v-if="items.timeRangeUseYn">
            (기본 : 
            <b-form-input
                v-model="items.timeRangeQty"
                type="text"
                style="width:40px"
                maxlength="2"
                v-if="isEdit"
              ></b-form-input>
              <span v-if="!isEdit">
              {{items.timeRangeQty}}
              </span>
            days)
          </span>
          </b-form-fieldset>
          

          <b-form-fieldset
          :horizontal="true">
          <template slot="label">
            Link
          </template>

          <b-form-input
            v-model="items.linkUrl"
            type="text"
            placeholder="Enter Link"
            :plaintext="!isEdit"
          ></b-form-input>
        </b-form-fieldset>

        <b-form-fieldset
            label="사용여부"
            :horizontal="true">
            <c-switch
              v-if="isEdit"
              type="text"
              class="v-switch"
              on="사용"
              off="미사용"
              v-model="items.widgetUseYn"
            ></c-switch>
            <span
            v-else
              class="badge"
              :class="{'primary' : items.widgetUseYn }"
            >{{ items.widgetUseYn ? '사용' : '미사용' }}
            </span>
          </b-form-fieldset>

      </b-form>
      </b-collapse>
        

    <div class="page-btn" v-if="isEdit">
      <b-button type="button" variant="outline-secondary" @click="onView">취소</b-button>
      <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
    </div>
    <div class="page-btn" v-else>
      <b-button type="button" variant="outline-secondary" class="float-left" @click="onDelete">삭제</b-button>
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Widget 관리' }">목록</b-button>
      <b-button type="button" variant="primary" @click="onEdit">수정</b-button>
    </div>

    <!-- Message Alert Modal -->
    <b-modal title="Message" size="sm" v-model="modal.open" :class="`modal-${modal.type}`">
      <div class="d-block text-center">
        <p>{{ modal.msg }}</p>
      </div>
      <div slot="modal-footer" class="mx-auto">
        <b-button type="button" variant="primary" @click="modal.action">확인</b-button>
        <b-button type="button" variant="outline-secondary" @click="modal.open = false">취소</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import ContentHeader from '@/components/ContentHeader'
  import cSwitch from '@/components/Switch'
  export default {
    name: 'service',
    props: ['id'],
    components: {
      ContentHeader,
      cSwitch
    },

    data (){
      return {
        originItems: {},
        items: {
          widgetName: '',
          widgetSourceCode: null,
          widgetModeCode: null,
          widgetSubModeCode: null,
          widgetTargetCode: [],
          timeRangeUseYn: false,
          timeRangeQty: '',
          widgetUseYn: true,
          widgetDisplayCode: [],
          widgetModeUnitCode: null,
          widgetModeUnitQty: '',
          widgetSubModeUnitCode: null,
          widgetSubModeUnitQty: '',
          valueSumYn: false,
          valueAvgYn: false,
          valuePeakYn: false
        },
        code: {
          widgetSourceCode: [],
          widgetModeCode: [],
          widgetSubModeCode: [],
          widgetTargetCode: [],
          widgetDisplayCode: [],
          widgetModeUnitCode: [],
          widgetSubModeUnitCode: []
        },

        isLoad: {
          widgetSourceCode: true,
          widgetModeCode: true,
          widgetSubModeCode: true,
          widgetTargetCode: true,
          widgetDisplayCode: false,
          widgetModeUnitCode: true,
          widgetSubModeUnitCode: true
        },

        isEdit: false,
        isModalHistory: false,

        modal: {
          open: false,
          type: 'done',
          msg: '',
          action (){}
        },

        inValidForm: false,
        groupSelectPlatform: false,
        serviceSelectAll: false
      }
    },

    computed: {
      widgetSourceCode: {
        get () {
          return this.code.widgetSourceCode.find(({ code }) => code === this.items.widgetSourceCode) || null;
        },
        set (newValue) {
          this.items.widgetSourceCode = newValue !== null ? newValue.code : '';
        }
      },
      widgetModeCode: {
        get () {
          return this.code.widgetModeCode.find(({ code }) => code === this.items.widgetModeCode) || null;
        },
        set (newValue) {
          this.items.widgetModeCode = newValue !== null ? newValue.code : '';
        }
      },
      widgetSubModeCode: {
        get () {
          return this.code.widgetSubModeCode.find(({ code }) => code === this.items.widgetSubModeCode) || null;
        },
        set (newValue) {
          this.items.widgetSubModeCode = newValue !== null ? newValue.code : '';
        }
      },
      widgetModeUnitCode: {
        get () {
          return this.code.widgetModeUnitCode.find(({ code }) => code === this.items.widgetModeUnitCode) || null;
        },
        set (newValue) {
          this.items.widgetModeUnitCode = newValue !== null ? newValue.code : '';
        }
      },
      widgetSubModeUnitCode: {
        get () {
          return this.code.widgetSubModeUnitCode.find(({ code }) => code === this.items.widgetSubModeUnitCode) || null;
        },
        set (newValue) {
          this.items.widgetSubModeUnitCode = newValue !== null ? newValue.code : '';
        }
      },
      widgetTargetCode: {
        get () {
          return this.items.widgetTargetCode.length > 0
            ? this.items.widgetTargetCode.map(val => this.code.widgetTargetCode.find(obj => obj.code === val))
            : [];
        },
        set (newValue) {
          this.items.widgetTargetCode = newValue.length > 0
            ? newValue.map(obj => obj.code)
            : [];
        }
      },
      // validation
      valid (){
        return {
          
        }
      }

    },


    created (){
      const detailUrl = `/setting/widget/${this.id}`;

      // Detail Data
      this.$https.get(detailUrl)
        .then((res) => {
          this.items = { ...this.items, ...res.data.items };
          const widgetDisplayCode = [];
          const widgetTargetCode = [];
          this.items.widgetDisplayList.forEach( obj => {
            widgetDisplayCode.push(obj.widgetDisplayCode)
          });
          this.items.widgetTargetList.forEach( obj => {
            widgetTargetCode.push(obj.widgetTargetCode)
          });
          this.items.widgetDisplayCode = widgetDisplayCode;
          this.items.widgetTargetCode = widgetTargetCode;
          this.originItems = JSON.parse(JSON.stringify(this.items));
        });

        // widgetSourceCode
        this.$https.get('/system/commonCode', {
            q: { groupCode: 'WIDGET_SOURCE' }
          })
          .then((res) => {
            this.isLoad.widgetSourceCode = false;
            this.code.widgetSourceCode = res.data.items;
        });
        // widgetModeCode
        this.$https.get('/system/commonCode', {
            q: { groupCode: 'WIDGET_MODE' }
          })
          .then((res) => {
            this.isLoad.widgetModeCode = false;
            this.code.widgetModeCode = res.data.items;
            this.isLoad.widgetSubModeCode = false;
            this.code.widgetSubModeCode = res.data.items;
        });
        // widgetSubModeCode
        this.$https.get('/system/commonCode', {
            q: { groupCode: 'WIDGET_MODE_UNIT' }
          })
          .then((res) => {
            this.isLoad.widgetModeUnitCode = false;
            this.code.widgetModeUnitCode = res.data.items;
            this.isLoad.widgetSubModeUnitCode = false;
            this.code.widgetSubModeUnitCode = res.data.items;
        });
        this.$https.get('/system/commonCode', {
          q: { groupCode: 'WIDGET_TARGET' }
        })
        .then((res) => {
          this.isLoad.widgetTargetCode = false;
          this.code.widgetTargetCode = res.data.items;
        });
        this.$https.get('/system/commonCode', {q: { groupCode: 'WIDGET_DISPLAY' }})
        .then((res) => {
          this.isLoad.widgetDisplayCode = false;
          const widgetDisplayCodeList = [];
          res.data.items.forEach(obj => {
            widgetDisplayCodeList.push({
              text: obj.codeName,
              value: obj.code
            })
          });
          this.code.widgetDisplayCode = widgetDisplayCodeList;
      });


    },

    methods: {
      onEdit (){
        this.isEdit = true;
      },

      onView (){
        this.isEdit = false;
        this.items = JSON.parse(JSON.stringify(this.originItems));
      },

      onSubmit (){
       this.$https.put(`/setting/widget/${this.id}`, this.items)
            .then(() => {
              this.$router.go(this.$router.currentRoute);
            })
            .catch((error) => {
              console.log(error);
              alert(error.response.data.error.message);
            });
      },

      onDelete (){
        this.modal = {
          open: true,
          type: 'error',
          msg: '정말로 삭제하시겠습니까?',
          action: this.onDeleteData
        };
      },

      onDeleteData (){
        this.$https.delete(`/setting/widget/${this.id}`)
          .then(() => {
            this.$router.push({ name: 'Widget 관리' });
          })
          .catch((error) => {
            console.log(error);
            alert(error.response.data.error.message);
          });
      },

    }
  }
</script>
