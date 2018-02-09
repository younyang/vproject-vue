<template>
    <div class="highcharts" :ref="id"></div>
</template>



<script>
  import Highcharts from 'highcharts/js/highcharts'

  export default{
    props: {
      options: {
        type: Object,
        default: {}
      },

      id: {
        type: String,
        default: 'Chart'
      },

      type: {
        type: String,
        default: 'line'
      },

      loading: {
        type: Boolean,
        default: false
      },

      reset: {
        type: Boolean,
        default: false
      }
    },

    data(){
      return {
        chart: null,

        defaultOptions: {
          title: false,
          xAxis: { category: []},
          yAxis:{ title :false },
          plotOptions:{
            areaspline: {
              fillOpacity: 0.5,
              marker: {
                enabled: false,
                symbol: 'circle',
                radius: 2,
                states: {
                  hover: {
                    enabled: true
                  }
                }
              }
            },
            pie: {
              allowPointSelect:true,
              cursor: 'pointer',
              dataLabels: {
                enabled:true,
                format: '<b>{point.name}</b><br>{point.percentage:.1f} %',
                distance:-10,
                filter: {
                  property: 'percentage',
                  operator: ">",
                  value: 5
                }
              }
            }
          },
          series: []
        }
      }
    },

    computed: {
      chartOptions (){
        return {
          ...this.defaultOptions,
          ...this.options
        };
      }
    },

    mounted(){
      if (!this.getChart() && this.options) {
        this.init();
      }
    },

    methods: {
      init (){
        this.chart = new Highcharts.Chart(this.$el, this.chartOptions);
      },

      getChart (){
        return this.chart;
      },

      setSeries (series){
        this.removeSeries();

        this.init();
        series.forEach(item => this.addSeries(item));
      },

      addSeries(options){
        this.getChart().addSeries(options);
      },

      removeSeries(){
        while(this.getChart().series.length !== 0) {
          this.getChart().series[0].remove();
        }
      }
    },

    watch: {
      options (options) {
        if (!this.chart && options) {
          this.init();
        } else {
          this.chart.update(this.chartOptions);
        }
      }
    },

    beforeDestroy (){
      if (this.getChart()) {
        this.getChart().destroy();
      }
    }
  }
</script>

