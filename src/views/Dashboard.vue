<template>
  <div class="animated fadeIn">
    <div class="dashHeader d-flex justify-content-between">
      <div class="form-inline">
        <multiselect
          class="inline"
          v-model="templateType"
          :allowEmpty="false"
          :showLabels="false"
          :searchable="false"
          :options="code.templateType"
        ></multiselect>
        <b-button type="button" variant="primary" class="ml-1" @click=""><i class="icon-pencil"></i></b-button>
        <b-button type="button" variant="primary" class="ml-1" @click=""><i class="fa fa-plus"></i></b-button>
        <b-button type="button" variant="primary" class="ml-1" @click=""><i class="icon-grid"></i></b-button>
      </div>
      <div>
        <c-switch
          type="text"
          variant="secondary-outline"
          on="Light"
          off="Dark"
          v-model="theme"
          :pill="true"
        ></c-switch>
      </div>
    </div>

    <dnd-grid-container
      :layout.sync="layout"
      :gridSize="gridSize"
      :margin="margin"
      :bubbleUp="bubbleUp"
    >
      <!-- Edge data -->
      <dnd-grid-box boxId="edge-box" dragSelector=".card-header" @resizeUpdate="onResizeBox('edgeChart')">
        <div class="card dash-box">
          <div class="card-header">
            Edge Data Transfer
            <div class="card-actions">
              <b-button size="sm" class="btn-minimize" @click="onEditWidget('edge')">
                <i class="fa fa-pencil"></i>
                <span class="sr-only">Edit</span>
              </b-button>
              <b-button size="sm" class="btn-minimize">
                <i class="fa fa-close"></i>
                <span class="sr-only">Delete</span>
              </b-button>
            </div>
          </div>
          <div class="card-body">
            <highcharts :options="widget.edge.items" ref="edgeChart" style="height: 245px"></highcharts>
          </div>
        </div>
      </dnd-grid-box>

      <!-- 지역별 data -->
      <dnd-grid-box boxId="map-box" ref="mapContainer" dragSelector=".card-header">
        <div class="card dash-box">
          <div class="card-header">
            지역별 Data Transfer 현황
            <div class="card-actions">
              <b-button size="sm" class="btn-minimize">
                <i class="fa fa-pencil"></i>
                <span class="sr-only">Edit</span>
              </b-button>
              <b-button size="sm" class="btn-minimize">
                <i class="fa fa-close"></i>
                <span class="sr-only">Delete</span>
              </b-button>
            </div>
          </div>
          <div class="card-body" style="padding: 0">
            <div id="mapBox" class="map-box"></div>
          </div>
        </div>
      </dnd-grid-box>

      <!-- Cache Status -->
      <dnd-grid-box boxId="cache-box" dragSelector=".card-header" @resizeUpdate="onResizeBox('cacheChart')">
        <div class="card dash-box">
          <div class="card-header">
            Cache Status
            <div class="card-actions">
              <b-button size="sm" class="btn-minimize" @click="onEditWidget('cache')">
                <i class="fa fa-pencil"></i>
                <span class="sr-only">Edit</span>
              </b-button>
              <b-button size="sm" class="btn-minimize">
                <i class="fa fa-close"></i>
                <span class="sr-only">Delete</span>
              </b-button>
            </div>
          </div>
          <div class="card-body">
            <highcharts :options="widget.cache.items" ref="cacheChart" style="height: 245px"></highcharts>
          </div>
        </div>
      </dnd-grid-box>

      <!-- Service Type별 Request -->
      <dnd-grid-box boxId="service-box" dragSelector=".card-header" @resizeUpdate="onResizeBox('serviceChart')">
        <div class="card dash-box">
          <div class="card-header">
            Service Type 별 Request
            <div class="card-actions">
              <b-button size="sm" class="btn-minimize" @click="onEditWidget('service')">
                <i class="fa fa-pencil"></i>
                <span class="sr-only">Edit</span>
              </b-button>
              <b-button size="sm" class="btn-minimize">
                <i class="fa fa-close"></i>
                <span class="sr-only">Delete</span>
              </b-button>
            </div>
          </div>
          <div class="card-body">
            <highcharts :options="chart.service" ref="serviceChart" style="height: 245px"></highcharts>
          </div>
        </div>
      </dnd-grid-box>

      <!-- Request Count -->
      <dnd-grid-box boxId="request-box" dragSelector=".card-header" @resizeUpdate="onResizeBox('requestChart')">
        <div class="card dash-box">
          <div class="card-header">
            Request Count
            <div class="card-actions">
              <b-button size="sm" class="btn-minimize" @click="onEditWidget('request')">
                <i class="fa fa-pencil"></i>
                <span class="sr-only">Edit</span>
              </b-button>
              <b-button size="sm" class="btn-minimize">
                <i class="fa fa-close"></i>
                <span class="sr-only">Delete</span>
              </b-button>
            </div>
          </div>
          <div class="card-body">
            <highcharts :options="chart.request" ref="requestChart" style="height: 245px"></highcharts>
          </div>
        </div>
      </dnd-grid-box>
    </dnd-grid-container>

    <!-- Widget 수정 Modal -->
    <b-modal id="widgetModal" size="lg" v-model="isModalWidget">
      <template slot="modal-title">
        Widget
      </template>

      <div class="form-in-group">
        <b-form-fieldset
          label="Widget"
          :label-cols="2"
          :horizontal="true">
          <multiselect
            :allowEmpty="false"
            :showLabels="false"
            :searchable="false"
            :options="code.widgetType"
          ></multiselect>
        </b-form-fieldset>
        <b-form-fieldset
          label="Title"
          :label-cols="2"
          :horizontal="true">
          <b-form-input
            type="text"
          ></b-form-input>
        </b-form-fieldset>
        <b-form-fieldset
          label="Service"
          :label-cols="2"
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
          :label-cols="2"
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
          :label-cols="2"
          :horizontal="true">
          <b-form-radio-group
            v-model="searchItems.q.metricType"
            :options="[{ text: 'Sum', value: 'sum'},{ text: 'Avg', value: 'avg'},{ text: 'Peak', value: 'peak'}]"
            value="sum"
          ></b-form-radio-group>
        </b-form-fieldset>
        <b-form-fieldset
          label="Unit"
          :label-cols="2"
          :horizontal="true">

          <b-form-input
            v-model="searchItems.q.intervalValue"
            class="inline"
            style="width:50px; vertical-align: middle"
            type="number">
          </b-form-input>
          <multiselect
            v-model="searchItems.q.intervalType"
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
          :label-cols="2"
          :horizontal="true">
          <b-form-checkbox-group id="displayType" name="displayType" v-model="searchItems.q.chartType">
            <b-form-checkbox value="LINE">Line</b-form-checkbox>
            <b-form-checkbox value="BAR">Bar</b-form-checkbox>
            <b-form-checkbox value="PIE">Pie</b-form-checkbox>
            <b-form-checkbox value="AREA">Area</b-form-checkbox>
            <b-form-checkbox value="MAP">Map</b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-fieldset>
      </div>

      <div slot="modal-footer">
        <b-button type="button" size="sm" variant="primary" @click="onSubmitWidget"><i class="fa fa-dot-circle-o"></i> 저장</b-button>
        <b-button type="button" size="sm" variant="danger" @click="isModalWidget = false"><i class="fa fa-ban"></i> 취소</b-button>
      </div>
    </b-modal>
  </div>
</template>



<script>
  import cSwitch from '@/components/Switch'
  // import Container and Box components
  import { Container, Box } from '@dattn/dnd-grid'
  // minimal css for the components to work properly
  import '@dattn/dnd-grid/dist/index.css'
  import L from 'leaflet'

  const geojson = require('../../static/geo/ctprvn.json');

  const getMapColor = (d) => {
    return d > 100 ? '#800026' :
      d > 80  ? '#BD0026' :
      d > 60  ? '#E31A1C' :
      d > 40  ? '#FC4E2A' :
      d > 20   ? '#FD8D3C' :
              '#FEB24C';
  };

  const chartOption = {
    title: false,
    xAxis: { category: []},
    yAxis:{ title :false },
    plotOptions:{
      areaspline: { fillOpacity: 0.5},
      pie: {
        allowPointSelect:true,
        cursor: "pointer",
        dataLabels: {
          enabled:true,
          format: "<b>{point.name}</b><br>{point.percentage:.1f} %",
          distance:-10,
          filter: {
            property: "percentage",
            operator: ">",
            value:9
          }
        }
      }
    },
    series: []
  };

  export default {
    name: 'dashboard',
    components: {
      DndGridContainer: Container,
      DndGridBox: Box,
      cSwitch
    },

    data () {
      return {
        theme: true,
        templateType: 'Template 1',
        isModalWidget: false,
        code: {
          templateType: ['Template 1','Template 2'],
          widgetType: ['데이터 전송량'],
          serviceIdList: [],
          serviceTypeList: []
        },
        searchItems: {
          fromDate: '2017-12-18 00:00',
          toDate: '2017-12-29 23:59',
          q: {
            serviceIdList:['ALL'],
            serviceTypeList: ['ALL'],
            typeField: '',
            metricType: 'sum',
            dataType: 'requestCount',
            intervalType: 'D',
            intervalValue: 1,
            targetType: 'TOTAL_EDGE',
            chartType: 'AREA',
            peakYn: false,
            mainMode: 'TARGET',
            subMode: 'TIME',
            targetList: []
          }
        },
        widget: {
          edge: {
            items: {},
            searchItems: {
              fromDate: '2017-12-20 12:00',
              toDate: '2017-12-20 21:00',
              q: {
                serviceIdList:['ALL'],
                serviceTypeList: ['ALL'],
                typeField: '',
                metricType: 'sum',
                dataType: 'httpTraffic',
                intervalType: 'H',
                intervalValue: '1',
                targetType: 'TOTAL_EDGE',
                chartType: 'AREA',
                peakYn: false,
                mainMode: 'TIME',
                subMode: '',
                targetList: []
              }
            }
          },
          cache: {
            items: {},
            searchItems: {
              fromDate: '2017-12-26 00:00',
              toDate: '2017-12-26 23:59',
              q: {
                serviceIdList: ["ALL"],
                serviceTypeList: ["ALL"],
                typeField : "cacheStatus",
                metricType : "sum",
                dataType : "hits",
                targetType : "TOTAL_EDGE",
                chartType : "PIE",
                peakYn : false,
                mainMode : "TYPE",
                targetList: []
              }
            }
          },
          service: {
            items: {},
            searchItems: {
              fromDate: '2017-12-18 00:00',
              toDate: '2017-12-29 23:59',
              q: {
                serviceIdList:['ALL'],
                serviceTypeList: ['ALL'],
                typeField: '',
                metricType: 'sum',
                dataType: 'requestCount',
                intervalType: 'D',
                intervalValue: 1,
                targetType: 'EDGE',
                chartType: 'BAR',
                peakYn: false,
                mainMode: 'TARGET',
                subMode: 'TIME',
                targetList: ["Edge-01", "Edge-02", "Edge-03"]
              }
            }
          },
          request: {
            items: {},
            searchItems: {
              fromDate: '2017-12-18 00:00',
              toDate: '2017-12-29 23:59',
              q: {
                serviceIdList:['ALL'],
                serviceTypeList: ['ALL'],
                typeField: '',
                metricType: 'sum',
                dataType: 'requestCount',
                intervalType: 'D',
                intervalValue: 1,
                targetType: 'TOTAL_EDGE',
                chartType: 'LINE',
                peakYn: false,
                mainMode: 'TARGET',
                subMode: 'TIME',
                targetList: []
              }
            }
          },
          map: {
            items: {},
            searchItems: {
              fromDate: '2017-12-18 00:00',
              toDate: '2017-12-29 23:59',
              q: {
                serviceIdList:['ALL'],
                serviceTypeList: ['ALL'],
                typeField: '',
                metricType: 'sum',
                dataType: 'requestCount',
                intervalType: 'D',
                intervalValue: 1,
                targetType: 'TOTAL_EDGE',
                chartType: 'MAP',
                peakYn: false,
                mainMode: 'TOTAL',
                subMode: '',
                targetList: []
              }
            }
          }
        },
        gridSize: {
          w: 100,
          h: 100
        },
        bubbleUp: false,
        margin: 7,
        boxCount: 4,
        layout: [
          {
            id: 'edge-box',
            hidden: false,
            pinned: false,
            position: {
              x: 0,
              y: 0,
              w: 7,
              h: 3
            }
          },
          {
            id: 'map-box',
            hidden: false,
            pinned: false,
            position: {
              x: 7,
              y: 0,
              w: 4,
              h: 6
            }
          },
          {
            id: 'cache-box',
            hidden: false,
            pinned: false,
            position: {
              x: 0,
              y: 3,
              w: 3,
              h: 3
            }
          },
          {
            id: 'service-box',
            hidden: false,
            pinned: false,
            position: {
              x: 3,
              y: 3,
              w: 4,
              h: 3
            }
          },
          {
            id: 'request-box',
            hidden: false,
            pinned: false,
            position: {
              x: 0,
              y: 6,
              w: 11,
              h: 3
            }
          }
        ],
        chart: {
          edge: {
            chart: {
              type: 'areaspline'
            },
            title: false,
            xAxis: {
              categories: ['16:05', '16:10', '16:15', '16:20', '16:25', '16:30',
                '16:35', '16:40'
              ]
            },
            yAxis: {
              title: false
            },
            legend: {
              layout: 'horizontal',
              align: 'left',
              verticalAlign: 'top',
              x: 50,
              y: 10,
              floating: true,
              borderWidth: 1
            },
            plotOptions: {
              areaspline: {
                fillOpacity: 0.5
              }
            },
            series: [{
              name: 'A',
              data: [3, 4, 3, 5, 4, 10, 12, 18]
            }, {
              name: 'B',
              data: [1, 3, 4, 3, 3, 5, 4, 2]
            }]
          },
          cache: {
            chart: {
              type: 'pie',
              margin: [0, 0, 0, 0]
            },
            title: false,
            tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
              pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b><br>{point.percentage:.1f} %',
                  distance: -10,
                  filter: {
                    property: 'percentage',
                    operator: '>',
                    value: 9
                  }
                }
              }
            },
            series: [{
              data: [{
                name: 'Hit',
                y: 70
              }, {
                name: 'Expire',
                y: 15
              }, {
                name: 'Miss',
                y: 10
              }, {
                name: 'Stale',
                y: 5
              }]
            }]
          },
          service: {
            chart: {
              type: 'column'
            },
            title: false,
            xAxis: {
              categories: ['DASH', 'ADV', 'IMG', 'FILE', 'PATCH']
            },
            yAxis: {
              title: false
            },
            legend: false,
            series: [{
              data: [120, 85, 60, 55, 40]
            }]
          },
          request: {
            title: false,
            chart: {
              type: 'line'
            },
            xAxis: {
              categories: ['16:05', '16:10', '16:15', '16:20', '16:25', '16:30',
                '16:35', '16:40'
              ]
            },
            yAxis: {
              title: false
            },
            legend: {
              layout: 'horizontal',
              align: 'left',
              verticalAlign: 'bottom',
              borderWidth: 0
            },
            series: [{
              name: '목동',
              data: [9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3]
            }, {
              name: '성수',
              data: [5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1]
            }, {
              name: '잠실',
              data: [3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0]
            }]
          }
        }
      }
    },
    computed: {
      serviceIdList: {
        get () {
          return this.searchItems.q.serviceIdList[0] !== 'ALL'
            ? this.searchItems.q.serviceIdList.map(val => this.code.serviceIdList.find(obj => obj.serviceId === val))
            : [];
        },
        set (newValue) {
          this.searchItems.q.serviceIdList = newValue.length > 0
            ? newValue.map(obj => obj.serviceId)
            : ['ALL'];
        }
      },
      serviceTypeList: {
        get () {
          return this.searchItems.q.serviceTypeList[0] !== 'ALL'
            ? this.searchItems.q.serviceTypeList.map(val => this.code.serviceTypeList.find(obj => obj.code === val))
            : [];
        },
        set (newValue) {
          this.searchItems.q.serviceTypeList = newValue.length > 0
            ? newValue.map(obj => obj.code)
            : ['ALL'];
        }
      }
    },

    created () {
      Object.keys(this.widget).forEach(key => {
        this.fetchData(key);
      })
    },

    methods: {
      fetchData (key){
        const widget = this.widget[key];
        this.$https.getChart('/monitoring/v1.0/statistics/chart', widget.searchItems)
          .then((res) => {
            this.drawChart(key, res.data);
          })
      },

      drawChart (key, data){
        const widget = this.widget[key];
        const chartType = widget.searchItems.q.chartType === 'BAR' ? 'column' :
          widget.searchItems.q.chartType === 'LINE' ? 'line' :
          widget.searchItems.q.chartType === 'PIE' ? 'pie' :
          widget.searchItems.q.chartType === 'AREA' ? 'areaspline' :
            'map';

        if (chartType !== 'map'){
          const $chart = this.$refs[`${key}Chart`].chart;
          widget.items = {
            ...chartOption,
            chart: (chartType === 'pie') ?
              { type: chartType, margin: [0, 0, 0, 0] } :
              { type: chartType },
            legend: (chartType !== 'pie') ?
              {
                layout: 'horizontal',
                align: 'left',
                verticalAlign: 'bottom',
                borderWidth: 0
              } : false,
            series: (chartType !== 'pie') ?
              data.series : [],
            xAxis:  { categories: data.xaxis }
          };

          if (chartType === 'pie'){
            widget.items.series.push({
              data: data.series.map(obj => ({
                name: obj.name,
                y: obj.value
              }))
            })
          }

          $chart.update(widget.items);
          $chart.redraw();

        }else{
          this.drawMap(data);
        }
      },

      onResizeBox (ref) {
        const chart = this.$refs[ref].chart;
        const placeholder = document.querySelector('.placeholder.dnd-grid-box');

        const width = Number(placeholder.style.width.split('px')[0]);
        const height = Number(placeholder.style.height.split('px')[0]);
        chart.setSize(width-30,height-71)
      },

      drawMap (mapData = {}){
        console.log(mapData)
        this.$refs.mapContainer.$resizeHandle.remove()
        geojson.features = geojson.features.map(obj => {
          return {
            ...obj,
            properties: {
              ...obj.properties,
              dataValue: mapData.series.find(({ regionCode }) => regionCode === obj.properties.CTPRVN_CD) ?
                mapData.series.find(({ regionCode }) => regionCode === obj.properties.CTPRVN_CD) :
                {
                  data: null,
                  instanceId: 'instanceId',
                  name : null,
                  value: Math.abs(Math.floor(Math.random() * (0 - 10000) + 0))
                }
            }
          }
        });

        const mymap = L.map('mapBox', {
          zoomControl: false,
          dragging: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          boxZoom: false,
          tap: false,
          zoomSnap: 0.25,
          zoomDelta: 0.25,
          attributionControl: false
        })
        mymap.setView([35.9, 128.3], 6.75);

        const info = L.control({position: 'bottomright'});
        info.onAdd = function(map) {
          this._div = L.DomUtil.create('div', 'info');
          this.update();
          return this._div;
        };

        info.update = function(props) {
          const propsDom = props
            ? `<b>${props.CTP_KOR_NM}</b><br />
               <span>Instance ID: ${props.dataValue.instanceId}</span><br />
               <span>Value: ${props.dataValue.value}</span>`
            : '';
          this._div.innerHTML = propsDom;
        };

        const geoLayer = L.geoJSON(geojson, {
          style (feature) {
            return {
              fillColor: getMapColor(feature.properties.dataValue.value),
              weight: 2,
              opacity: 1,
              color: '#fff',
              dashArray: '3',
              fillOpacity: 0.7
            }
          },
          onEachFeature (feature, layer) {
            layer.on({
              mouseover (e){
                let layer = e.target;

                layer.setStyle({
                  color: '#fff',
                  dashArray: '',
                  fillOpacity: 1
                })

                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                  layer.bringToFront();
                }
                info.update(layer.feature.properties);
              },

              mouseout (e){
                geoLayer.resetStyle(e.target);
                info.update();
              }
            })
          }
        });

        const legend = L.control();

        legend.onAdd = function (map) {

          let div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 20, 40, 60, 80, 100],
            labels = [],
            from, to;

          for (let i = 0; i < grades.length; i++) {
            from = grades[i];
            to = grades[i + 1];

            labels.push(
              '<i style="background:' + getMapColor(from + 1) + '"></i> ' +
              from + (to ? '&ndash;' + to : '+'));
          }

          div.innerHTML = labels.join('<br>');
          return div;
        };

        geoLayer.addTo(mymap);
        info.addTo(mymap);
        legend.addTo(mymap);


      },

      onEditWidget (key) {
        this.isModalWidget = true;
        this.$https.get('/services')
          .then(res => {
            this.code.serviceIdList = res.data.items;
          })
        this.$https.get('/system/commonCode', {
            q: { groupCode: 'SERVICE_TYPE' }
          })
          .then((res) => {
            this.code.serviceTypeList = res.data.items.filter(({code, codeName, codeValChar1}) => {
              const number = code.split('_')[2];
              return !(number.length === 4 && codeName === codeValChar1);
            });
          });
        this.searchItems = this.widget[key].searchItems;
      },

      onSubmitWidget (){

      }
    }
  }
</script>

<style>
  .dash-box {
    width: 100%;
    height: 100%;
  }
  .leaflet-container {
    background: #f0f0f0
  }
  .map-box {
    min-height: 587px;
  }

  .map-box .info {
    padding: 6px 8px;
    background: #fff;
    background: rgba(255,255,255,0.8);
    box-shadow: 0 0 15px rgba(0,0,0,0.2);
    border-radius: 5px;
  }
  .map-box .info h4 {
    margin: 0 0 5px;
    color: #777;
  }
  .map-box .legend {
    text-align: left;
    line-height: 18px;
    color: #555;
  }
  .map-box .legend i {
    width: 18px;
    height: 18px;
    float: left;
    margin-right: 8px;
    opacity: 0.7;
  }


  .dashHeader {
    position: relative;
    z-index: 100;
    margin-bottom: 15px;
  }
</style>
