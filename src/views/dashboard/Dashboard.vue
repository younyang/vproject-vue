<template>
  <div class="animated fadeIn">
    <div class="dashHeader d-flex justify-content-between">
      <div class="form-inline">
        <multiselect
          class="inline noEmpty select-temp"
          v-model="templateType"
          label="codeName"
          :allowEmpty="false"
          :showLabels="false"
          :searchable="false"
          :options="code.tempType"
          @select="setTempDisplay"
        ></multiselect>
        <b-button
          type="button"
          variant="only-icon"
          v-b-tooltip.hover
          :title="`Add Widget`"
        ><i class="fa fa-th-large"></i></b-button>
        <b-button
          type="button"
          variant="only-icon"
          v-b-tooltip.hover
          :title="`Add Template`"
        ><i class="fa fa-plus"></i></b-button>
        <b-button
          type="button"
          variant="only-icon"
          v-b-tooltip.hover
          :title="`Edit Template`"
        ><i class="fa fa-cog"></i></b-button>
      </div>
      <div>
        <c-switch
          type="text"
          class="v-switch dash"
          on="Dark"
          off="Light"
          v-model="isDarkTheme"
          @change="onThemeChange"
          :pill="true"
        ></c-switch>
      </div>
    </div>


    <dnd-grid-container
      :layout.sync="temp.layout"
      :gridSize="temp.gridSize"
      :margin="temp.margin"
      :bubbleUp="temp.bubbleUp"
    >

      <dnd-grid-box
        v-for="({ wid, title, types, items, searchItems}, index) in widget"
        :key="index"
        :boxId="`${wid}-box`"
        dragSelector=".card-header"
      >
        <div class="card dash-box">
          <div class="card-header">
            {{ title }}
            <div class="card-buttons">
              <!-- Chart Type -->
              <b-form-radio-group
                v-model="searchItems.q.chartType"
                buttons
                button-variant="only-icon"
                :options="getTypeOptions(types)"
                :name="`${wid}-radio`"
                @change="onChangeWidget(wid)"
              ></b-form-radio-group>

              <b-button variant="only-icon" v-b-tooltip.hover :title="`Edit`" @click="onEditWidget(wid)">
                <i class="fa fa-pencil"></i>
              </b-button>
              <b-button variant="only-icon" v-b-tooltip.hover :title="`Remove`" @click="onRemoveWidget(wid)">
                <i class="fa fa-times"></i>
              </b-button>
            </div>
          </div>
          <div class="card-body">
            <v-chart
              v-if="searchItems.q.chartType !== 'MAP'"
              :id="`${wid}Chart`"
              :options="chartOptions[wid]"
              :loading="true"
              :ref="`${wid}ChartBox`"
            ></v-chart>
            <v-map
              v-if="searchItems.q.chartType === 'MAP'"
              :items="items"
            ></v-map>
          </div>
        </div>
      </dnd-grid-box>
    </dnd-grid-container>


    <!-- Widget 수정 Modal -->
    <b-modal id="widgetModal" size="lg" v-model="isModalWidget">
      <template slot="modal-title">
        Widget
      </template>

      <div class="formView">
        <b-form-fieldset
          label="Widget"
          :horizontal="true">
          <multiselect
            v-model="widgetType"
            class="noEmpty"
            label="codeName"
            :allowEmpty="false"
            :showLabels="false"
            :searchable="false"
            :options="code.widgetType"
            :disabled="true"
          ></multiselect>
        </b-form-fieldset>

        <b-form-fieldset
          label="Title"
          :horizontal="true">
          <b-form-input
            v-model="modalItems.title"
            type="text"
          ></b-form-input>
        </b-form-fieldset>

        <b-form-fieldset
          label="Data Type"
          :horizontal="true">
          <multiselect
            v-model="modalItems.searchItems.q.dataType"
            class="noEmpty"
            :allowEmpty="false"
            :showLabels="false"
            :searchable="false"
            :options="['httpTraffic', 'requestCount', 'httpSendBytes', 'connection', 'hits', 'success']"
          ></multiselect>
        </b-form-fieldset>

        <b-form-fieldset
          label="Main mode"
          :horizontal="true">
          <multiselect
            v-model="modalItems.searchItems.q.mainMode"
            class="noEmpty"
            :allowEmpty="false"
            :showLabels="false"
            :searchable="false"
            :options="['TIME', 'TARGET', 'TYPE', 'TOTAL']"
          ></multiselect>
        </b-form-fieldset>

        <b-form-fieldset
          label="Sub mode"
          :horizontal="true">
          <multiselect
            v-model="modalItems.searchItems.q.subMode"
            :showLabels="false"
            :searchable="false"
            :options="['', 'TIME', 'TARGET', 'TYPE']"
          ></multiselect>
        </b-form-fieldset>

        <b-form-fieldset
          label="Service"
          :horizontal="true">
          <multiselect
            v-model="serviceIdList"
            :multiple="true"
            track-by="serviceId"
            label="serviceName"
            :showLabels="false"
            :options="code.serviceIdList"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>

        <b-form-fieldset
          label="Service Type"
          :horizontal="true">
          <multiselect
            v-model="serviceTypeList"
            label="codeName"
            track-by="code"
            :multiple="true"
            :showLabels="false"
            :options="code.serviceTypeList"
            placeholder="전체"
          ></multiselect>
        </b-form-fieldset>
        <b-form-fieldset
          label="Values"
          :horizontal="true">
          <b-form-radio-group
            v-model="modalItems.searchItems.q.metricType"
            :options="[{ text: 'Sum', value: 'sum'},{ text: 'Avg', value: 'avg'},{ text: 'Peak', value: 'peak'}]"
            value="sum"
          ></b-form-radio-group>
        </b-form-fieldset>
        <b-form-fieldset
          label="Unit"
          :label-cols="2"
          :horizontal="true">
          <b-form-input
            v-model="modalItems.searchItems.q.intervalValue"
            class="inline"
            style="width:50px; vertical-align: middle"
            type="number">
          </b-form-input>
          <multiselect
            v-model="modalItems.searchItems.q.intervalType"
            :allowEmpty="false"
            :showLabels="false"
            :searchable="false"
            :options="['MN', 'H', 'D', 'M', 'Y']"
            class="inline ml-2"
            style="width:80px; vertical-align: middle"
          ></multiselect>
        </b-form-fieldset>

        <b-form-fieldset
          label="Display Type"
          :horizontal="true">
          <b-form-checkbox-group id="displayType" name="displayType" v-model="modalItems.types">
            <b-form-checkbox value="LINE">Line</b-form-checkbox>
            <b-form-checkbox value="BAR">Bar</b-form-checkbox>
            <b-form-checkbox value="PIE">Pie</b-form-checkbox>
            <b-form-checkbox value="AREA">Area</b-form-checkbox>
            <b-form-checkbox value="MAP">Map</b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-fieldset>

        <b-form-fieldset
          label="Peak"
          :horizontal="true">
          <c-switch
            type="text"
            class="v-switch"
            on="Y"
            off="N"
            v-model="modalItems.searchItems.q.peakYn"
            :pill="true"
          ></c-switch>
        </b-form-fieldset>

        <b-form-fieldset
          label="Target Type"
          :horizontal="true">
          <multiselect
            v-model="modalItems.searchItems.q.targetType"
            class="noEmpty"
            :allowEmpty="false"
            :showLabels="false"
            :searchable="false"
            :options="['EDGE', 'RELAY', 'ORIGIN', 'POP_EDGE', 'POP_RELAY', 'REGION_EDGE', 'REGION_RELAY', 'TOTAL_EDGE', 'TOTAL_RELAY']"
          ></multiselect>
        </b-form-fieldset>
      </div>


      <div slot="modal-footer">
        <b-button type="button" variant="outline-secondary" @click="isModalWidget = false">취소</b-button>
        <b-button type="button" variant="primary" @click="onSubmitWidget">저장</b-button>
      </div>
    </b-modal>
  </div>
</template>



<script>
  import moment from 'moment'
  // import Container and Box components
  import { Container, Box } from '@dattn/dnd-grid'
  // minimal css for the components to work properly
  import '@dattn/dnd-grid/dist/index.css'
  // Switch components
  import cSwitch from '@/components/Switch'
  // Chart components
  import VChart from './VChart'
  // Map components
  import VMap from './VMap'
  // Grid display setting
  import gridSetting from './_grid'
  // Widget fake data
  import widgetFake from './_widget'

  export default {
    name: 'dashboard',
    components: {
      DndGridContainer: Container,
      DndGridBox: Box,
      cSwitch,
      VChart,
      VMap
    },

    data () {
      return {
        // Grid Layout data
        temp: {},
        // Grid Layout type select
        tempType: 1,
        // is DarkTheme on/off
        isDarkTheme: false,

        // Widget data default
        widget: [{
          wid: null,
          title: null,
          types: [],
          items: null,
          searchItems: {
            fromDate: null,
            toDate: null,
            q: {
              serviceIdList: ['ALL'],
              serviceTypeList: ['ALL'],
              metricType: null,
              dataType: null,
              intervalType: null,
              intervalValue: null,
              targetType: null,
              chartType: null,
              peakYn: false,
              mainMode: null,
              subMode: null,
              targetList: []
            }
          }
        }],

        modalItems: {},

        // Code List
        code: {
          tempType: [{
            code: 1,
            codeName: 'Template 1'
          },{
            code: 2,
            codeName: 'Template 2'
          }],
          widgetType: [{
            code: 'edge',
            codeName: 'Edge Data Transfer'
          },{
            code: 'map',
            codeName: '지역별 Data Transfer 현황'
          },{
            code: 'cache',
            codeName: 'Cache Status'
          },{
            code: 'service',
            codeName: 'Service Type 별 Request'
          },{
            code: 'request',
            codeName: 'Request Count'
          }],
          serviceIdList: [],
          serviceTypeList: []
        },

        // Widget Modal open/close
        isModalWidget: false
      }
    },
    computed: {
      templateType: {
        get () {
          return this.code.tempType.find(obj => obj.code === this.tempType) || null;
        },
        set (newValue) {
          this.tempType = newValue !== null ? newValue.code : null;
        }
      },

      widgetType: {
        get () {
          return this.code.widgetType.find(obj => obj.code === this.modalItems.wid) || null;
        },
        set (newValue) {
          this.modalItems.wid = newValue !== null ? newValue.code : null;
        }
      },

      serviceIdList: {
        get () {
          const { searchItems } = this.modalItems;
          return searchItems.q.serviceIdList[0] !== 'ALL'
            ? searchItems.q.serviceIdList.map(val => this.code.serviceIdList.find(obj => obj.serviceId === val))
            : [];
        },
        set (newValue) {
          const { searchItems } = this.modalItems;
          searchItems.q.serviceIdList = newValue.length > 0
            ? newValue.map(obj => obj.serviceId)
            : ['ALL'];
        }
      },
      serviceTypeList: {
        get () {
          const { searchItems } = this.modalItems;
          return searchItems.q.serviceTypeList[0] !== 'ALL'
            ? searchItems.q.serviceTypeList.map(val => this.code.serviceTypeList.find(obj => obj.code === val))
            : [];
        },
        set (newValue) {
          const { searchItems } = this.modalItems;
          searchItems.q.serviceTypeList = newValue.length > 0
            ? newValue.map(obj => obj.code)
            : ['ALL'];
        }
      },

      chartOptions () {
        const options = {};
        this.widget.forEach(({ wid, items, searchItems }) => {
          const chartType = this.getChartType(searchItems.q.chartType);

          const size = this.chartSize[wid];
          options[wid] = {
            chart: (chartType === 'pie') ?
              {type: chartType, margin: [0, 0, 0, 0], ...size} :
              {type: chartType, ...size},

            legend: (chartType !== 'pie' && chartType !== 'column') ?
              {
                layout: 'horizontal',
                align: 'left',
                verticalAlign: 'bottom',
                borderWidth: 0
              } : false,

            series: [],
            xAxis: {categories: items ? ( items.xaxis ? items.xaxis : []): []}
          };
        });

        return options;
      },

      chartSize (){
        const size = {};
        const gridSize = this.temp.gridSize;
        const margin = this.temp.margin;

        this.temp.layout.forEach(({ id, position }) => {
          const key = id.split('-box')[0];
          const width = (position.w * gridSize.w) + ((position.w - 1) * margin);
          const height = (position.h * gridSize.h) + ((position.h - 1) * margin);

          size[key] = {
            width: width-30,
            height: height-71
          }
        });
        return size;
      }
    },

    created () {
      this.modalItems = this.widget[0];
      this.widget = widgetFake.map(obj => {
        obj.searchItems.fromDate = moment().subtract(7, 'day').format('YYYY-MM-DD HH:MM');
        obj.searchItems.toDate = moment().format('YYYY-MM-DD HH:MM');
        return {
          ...this.widget[0],
          ...obj
        }
      });

      // Service Id
      this.$https.get('/services', {
          q: { serviceUseYn: true }
        })
        .then(res => {
          this.code.serviceIdList = res.data.items;
        });

      // Service Type
      this.$https.get('/system/commonCode', {
          q: { groupCode: 'SERVICE_TYPE' }
        })
        .then((res) => {
          this.code.serviceTypeList = res.data.items.filter(({code, codeName, codeValChar1}) => {
            const number = code.split('_')[2];
            return !(number.length === 4 && codeName === codeValChar1);
          });
        });

      this.onThemeChange(this.isDarkTheme);
      this.setTempDisplay();
    },

    mounted () {
      this.widget.forEach(this.fetchData);
    },

    beforeDestroy (){
      this.onThemeChange(false);
    },

    methods: {
      setTempDisplay (obj = {}){
        const type = obj.code || this.tempType;
        this.temp = gridSetting[`template${type}`];
      },

      getTypeOptions (types = []){
        return types.map(val => ({
          value: val,
          text: `<i class='fa ${this.getTypeIcon(val)}'></i>`
        }));
      },

      getTypeIcon (type){
        return type === 'LINE' ? 'fa-line-chart' :
          type === 'AREA' ? 'fa-area-chart' :
          type === 'BAR' ? 'fa-bar-chart' :
          type === 'PIE' ? 'fa-pie-chart' :
          type === 'MAP' ? 'fa-globe' : '';
      },

      getChartType (type){
        return type === 'BAR' ? 'column' :
          type === 'LINE' ? 'spline' :
          type === 'PIE' ? 'pie' :
          type === 'AREA' ? 'areaspline' :
          'map';
      },

      fetchData (obj = {}){
        this.$https.getChart('/monitoring/v1.0/statistics/chart', obj.searchItems)
          .then((res) => {
            obj.items =  res.data;
            this.drawChart(obj, res.data);
          })
          .catch((err) => { console.log(err) });
      },

      drawChart ({ wid, searchItems }, data){
        const chartType = this.getChartType(searchItems.q.chartType);
        if (chartType === 'map'){
          return
        }

        const $chart = this.$refs[`${wid}ChartBox`][0];
        let series = (chartType !== 'pie') ? data.series : [{
          data: data.series.map(obj => ({
            name: obj.name,
            y: obj.value
          }))
        }];

        if (chartType === 'column'){
          series = series.map(obj => ({...obj, colorByPoint: true }))
        }

        $chart.setSeries(series);
      },

      onEditWidget (key) {
        const widget = this.widget.find(({ wid }) => wid === key);
        this.modalItems = JSON.parse(JSON.stringify(widget));
        this.isModalWidget = true;
      },

      onChangeWidget (key) {
        const widget = this.widget.find(({ wid }) => wid === key);
        this.fetchData(widget);
      },

      onSubmitWidget () {
        this.isModalWidget = false;
        const widget = JSON.parse(JSON.stringify(this.modalItems));
        widget.searchItems.q.chartType = this.modalItems.types[0];

        const findIndex = this.widget.findIndex(({ wid }) => wid === this.modalItems.wid);
        this.widget.splice(findIndex, 1, widget);

        this.fetchData(widget);
      },

      onRemoveWidget () {

      },


      onThemeChange (value){
        const $body = document.querySelector('body.app');
        if (value){
          $body.classList.add('dark')
        }else{
          $body.classList.remove('dark')
        }
      }
    }
  }
</script>
