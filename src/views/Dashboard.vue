<template>
  <div class="animated fadeIn">
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
          <div class="card-body">
            <highcharts :options="chart.edge" ref="edgeChart" style="height: 190px"></highcharts>
          </div>
        </div>
      </dnd-grid-box>

      <!-- 지역별 data -->
      <dnd-grid-box boxId="map-box" dragSelector=".card-header">
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
          <div class="card-body">
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
          <div class="card-body">
            <highcharts :options="chart.cache" ref="cacheChart" style="height: 190px"></highcharts>
          </div>
        </div>
      </dnd-grid-box>

      <!-- Service Type별 Request -->
      <dnd-grid-box boxId="service-box" dragSelector=".card-header" @resizeUpdate="onResizeBox('serviceChart')">
        <div class="card dash-box">
          <div class="card-header">
            Service Type 별 Request
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
          <div class="card-body">
            <highcharts :options="chart.service" ref="serviceChart" style="height: 190px"></highcharts>
          </div>
        </div>
      </dnd-grid-box>

      <!-- Request Count -->
      <dnd-grid-box boxId="request-box" dragSelector=".card-header" @resizeUpdate="onResizeBox('requestChart')">
        <div class="card dash-box">
          <div class="card-header">
            Request Count
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
          <div class="card-body">
            <highcharts :options="chart.request" ref="requestChart" style="height: 190px"></highcharts>
          </div>
        </div>
      </dnd-grid-box>


    </dnd-grid-container>
  </div>
</template>

<style>
  .dash-box {
    width: 100%;
    height: 100%;
  }
  .map-box {
    min-height: 530px;
  }
</style>

<script>
  // import Container and Box components
  import { Container, Box } from '@dattn/dnd-grid'
  // minimal css for the components to work properly
  import '@dattn/dnd-grid/dist/index.css'
  import L from 'leaflet'

  const geojson = require('../../static/geo/ctprvn.json');

  export default {
    name: 'dashboard',
    components: {
      DndGridContainer: Container,
      DndGridBox: Box
    },

    data () {
      return {
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
            hidden: true,
            pinned: false,
            position: {
              x: 0,
              y: 0,
              w: 7.5,
              h: 2.5
            }
          },
          {
            id: 'map-box',
            hidden: false,
            pinned: false,
            position: {
              x: 0,
              y: 0,
              w: 3.5,
              h: 5
            }
          },
          {
            id: 'cache-box',
            hidden: true,
            pinned: false,
            position: {
              x: 0,
              y: 2.5,
              w: 3.75,
              h: 2.5
            }
          },
          {
            id: 'service-box',
            hidden: true,
            pinned: false,
            position: {
              x: 3.75,
              y: 2.5,
              w: 3.75,
              h: 2.5
            }
          },
          {
            id: 'request-box',
            hidden: false,
            pinned: false,
            position: {
              x: 0,
              y: 5,
              w: 11,
              h: 2.5
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
              name: 'Brands',
              colorByPoint: true,
              data: [{
                name: 'Hit',
                y: 70,
                sliced: true,
                selected: true
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
      layoutWithoutSettings () {
        return this.layout.filter((box) => {
          return box.id !== 'settings'
        })
      }
    },

    created () {
      this.$https.getChart('/monitoring/v1.0/statistics/chart', {
        fromDate: '2017-12-20T00:00',
        toDate: '2017-12-20T23:59',
        q: {
          serviceIdList: ['ALL'],
          serviceTypeList: ['ALL'],
          typeField: '',
          metricType: 'sum',
          dataType: 'httpTraffic',
          intervalType: 'H',
          intervalValue: '1',
          targetType: 'TOTAL_EDGE',
          chartType: 'BAR',
          peakYn: false,
          mainMode: 'TIME',
          subMode: '',
          targetList: ["",""]
        }
      }).then((res) => console.log(res))
    },

    mounted (){
      this.drawMap();
    },

    methods: {
      onResizeBox (ref) {
        const chart = this.$refs[ref].chart;
        const placeholder = document.querySelector('.placeholder.dnd-grid-box');

        const width = Number(placeholder.style.width.split('px')[0]);
        const height = Number(placeholder.style.height.split('px')[0]);
        chart.setSize(width-30,height-71)
      },

      drawMap (){
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
        mymap.setView([36, 127.5], 6.75);


        const geoLayer = L.geoJSON(null, {
          style: {
            weight: 2,
            color: '#ECEFF1',
            opacity: 1,
            dashArray: '3',
            fillColor: '#feb24c',
            fillOpacity: 0.6
          },
          onEachFeature (feature,layer) {
            layer.on({
              mouseover (e){
                let layer = e.target;

                layer.setStyle({
                  color: '#666',
                  dashArray: '',
                  fillOpacity: 1
                });

                //layer.bindLabel('Test')

                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                  layer.bringToFront();
                }
              },

              mouseout (e){
                geoLayer.resetStyle(e.target);
              }
            })
          }
        })
        geoLayer.addData(geojson);
        mymap.addLayer(geoLayer);

      }
    }
  }
</script>

