<template>
  <div class="animated fadeIn">
    <b-form class="formView" :validated="inValidForm" novalidate>

      <!-- Widget Name -->
      <b-form-fieldset
        label="Widget Name<i class='require'>*</i>"
        :invalid-feedback="$valid.msg.require"
        :horizontal="true">
        <b-form-input
          v-model="items.widgetName"
          type="text"
          placeholder="Enter widget name"
          required
        ></b-form-input>
      </b-form-fieldset>

      <!-- Data Source -->
      <b-form-fieldset
        :invalid-feedback="$valid.msg.select"
        :horizontal="true">
        <template slot="label">
          Data Source<i class="require">*</i>
        </template>

        <multiselect
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
          Main Mode<i class="require">*</i>
        </template>

        <multiselect
          v-model="widgetModeCode"
          track-by="code"
          label="codeName"
          :class="{'invalid': !valid.widgetModeCode }"
          :options="code.widgetModeCode"
          :showLabels="false"
          :loading="isLoad.widgetModeCode"
          placeholder="Select Mode"
        ></multiselect>
        <span v-if="items.widgetModeCode === 'WIDGET_MODE_01'"> &nbsp; / &nbsp; Unit &nbsp;
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
        :invalid-feedback="$valid.msg.select"
        :horizontal="true">
        <template slot="label">
          Sub Mode<i class="require">*</i>
        </template>

        <multiselect
          v-model="widgetSubModeCode"
          track-by="code"
          label="codeName"
          :options="code.widgetSubModeCode"
          :showLabels="false"
          :loading="isLoad.widgetSubModeCode"
          placeholder="Select Sub Mode"
        ></multiselect>
        <span v-if="items.widgetSubModeCode === 'WIDGET_MODE_01'"> &nbsp; / &nbsp; Unit &nbsp;
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
        :horizontal="true">
        <template slot="label">
          Values<i class="require">*</i>
        </template>
          <b-form-checkbox
              v-model="items.valueSumYn"
            >Sum</b-form-checkbox>
          <b-form-checkbox
              v-model="items.valueAvgYn"
            >Avg</b-form-checkbox>
          <b-form-checkbox
              v-model="items.valuePeakYn"
            >Peak</b-form-checkbox>
      </b-form-fieldset>

      <b-form-fieldset
        :horizontal="true">
        <template slot="label">
          Display Type<i class="require">*</i>
        </template>
          <b-form-checkbox-group v-model="items.widgetDisplayCode" name="widgetDisplayCode" :options="code.widgetDisplayCode">
          </b-form-checkbox-group>
      </b-form-fieldset>

      <!-- Target Type -->
      <b-form-fieldset
        :invalid-feedback="$valid.msg.select"
        :horizontal="true">
        <template slot="label">
          Target Type<i class="require">*</i>
        </template>

        <multiselect
          v-model="widgetTargetCode"
          class="multiple"
          :class="{'invalid': !valid.widgetTargetCode }"
          track-by="code"
          label="codeName"
          :multiple="true"
          :showLabels="false"
          :options="code.widgetTargetCode"
          :loading="isLoad.widgetTargetCode"
          placeholder="Select Target type"
        ></multiselect>
      </b-form-fieldset>

      <b-form-fieldset
        label="Time Range"
        :horizontal="true">
        <c-switch
          type="text"
          class="v-switch"
          on="사용"
          off="미사용"
          v-model="items.timeRangeUseYn"
        ></c-switch>&nbsp;&nbsp;
        <span v-if="items.timeRangeUseYn">
        (기본 : 
        <b-form-input
            v-model="items.timeRangeQty"
            type="text"
            style="width:40px"
            maxlength="2"
          ></b-form-input>
        days)
        </span>
      </b-form-fieldset>

      <!-- Widget Name -->
      <b-form-fieldset
        label="Link"
        :horizontal="true">
        <b-form-input
          v-model="items.linkUrl"
          type="text"
          placeholder="Enter linkUrl name"
        ></b-form-input>
      </b-form-fieldset>

      <b-form-fieldset
        label="사용여부"
        :horizontal="true">
        <c-switch
          type="text"
          class="v-switch"
          on="사용"
          off="미사용"
          v-model="items.widgetUseYn"
        ></c-switch>
      </b-form-fieldset>
    </b-form>

    <div class="page-btn">
      <b-button type="button" variant="outline-secondary" :to="{ name: 'Widget 관리' }">취소</b-button>
      <b-button type="button" variant="primary" @click="onSubmit">저장</b-button>
    </div>
  </div>
</template>

<script>
  import cSwitch from '@/components/Switch'

  export default {
    name: 'services',
    components: {
      cSwitch
    },

    data (){
      return {
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
          valuePeakYn: false,
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

        serviceNameExists: null,
        inValidForm: false
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
      // validation
      valid (){
        return {
          widgetSourceCode: this.items.widgetSourceCode === null ?
            this.items.widgetSourceCode :
            this.items.widgetSourceCode.length > 0
        }
      },

      // validation feedback
      feedback (){
        return {
          widgetName: (this.items.widgetName.length === 0) ?
            this.$valid.msg.require : ''
        }
      }
    },

    created (){
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

      // Service Type Code
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

      this.$https.get('/system/commonCode', {
          q: { groupCode: 'WIDGET_MODE_UNIT' }
        })
        .then((res) => {
          this.isLoad.widgetModeUnitCode = false;
          this.code.widgetModeUnitCode = res.data.items;
          this.isLoad.widgetSubModeUnitCode = false;
          this.code.widgetSubModeUnitCode = res.data.items;
      });
    },

    methods: {
      onSubmit (){
        
          this.$https.post('/setting/widget', this.items)
            .then((res) => {
              this.$router.push({ name: 'Widget 관리'})
            })
            .catch((error) => {
              console.log(error);
              alert(error.response.data.error.message);
            });
        
      }
    }
  }
</script>
