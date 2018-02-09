<template>
  <div :id="id" class="map-box" :style="`min-height: ${minHeight}px`">
  </div>
</template>



<script>
  // Leaflet Map
  import L from 'leaflet'
  // Korea GeoJSON
  const geojson = require('./geo/ctprvn.json');
  // Map Layer option
  const mapOptions = {
    zoomControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    tap: false,
    zoomSnap: 0.25,
    zoomDelta: 0.25,
    attributionControl: false
  };
  // Map SetView
  const mapSetView = [35.9, 128.3];
  // Map SetView Zoom
  const mapSetZoom = 6.75;

  // Map Color
  const getMapColor = (d) => {
    return d > 9000 ? '#2b16c6' :
      d > 8000  ? '#1663c6' :
      d > 6000  ? '#2697c4' :
      d > 4000  ? '#43c4de' :
      d > 2000   ? '#76e0ee' :
      '#b6f0f5';
  };


  export default{
    props: {
      items: {
        type: Object,
        default: null
      },

      options: {
        type: Object,
        default: null
      },

      code: {
        type: String,
        default: 'regionCode'
      },

      id: {
        type: String,
        default: 'Map'
      },

      minHeight: {
        type: Number,
        default: 587
      },

      isDark: {
        type: Boolean,
        default: false
      }
    },

    data(){
      return {
        mapLayer: null,
        geoLayer: null,
        geojson: {}
      }
    },

    computed: {
      lineColor (){
        return (this.isDark) ? '#282d36' : '#ffffff';
      }
    },

    mounted (){
      this.init();
    },

    methods: {
      init () {
        // Map Layer
        this.mapLayer = L.map(this.id, { ...mapOptions, ...this.options });
        this.mapLayer.setView(mapSetView, mapSetZoom);

      },

      initGeoLayer (){
        const self = this;
        this.geojson = this.addDataValue();

        // GeoJSON Layer
        const geoLayer = L.geoJSON(this.geojson, {
          style (feature) {
            return {
              fillColor: getMapColor(feature.properties.dataValue.value),
              weight: 2,
              opacity: 1,
              color: self.lineColor,
              fillOpacity: 0.7
            }
          },
          onEachFeature (feature, layer){
            layer.on({
              mouseover (e){
                const layer = e.target;
                layer.setStyle({ color: self.lineColor, fillOpacity: 1 });

                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                  layer.bringToFront();
                }
                infoLayer.update(layer.feature.properties);
              },

              mouseout (e){
                geoLayer.resetStyle(e.target);
                infoLayer.update();
              }
            })
          }
        });

        // Information Layer
        const infoLayer = L.control({ position: 'bottomright'});
        infoLayer.onAdd = function(map) {
          this._div = L.DomUtil.create('div', 'info');
          this.update();
          return this._div;
        };
        infoLayer.update = function(props) {
          const propsDom = props
            ? `<b>${props.CTP_KOR_NM}</b><br />
               <span>Instance ID: ${props.dataValue.instanceId}</span><br />
               <span>Value: ${props.dataValue.value}</span>`
            : '';
          this._div.innerHTML = propsDom;
        };

        // Legend Layer
        const legendLayer = L.control();
        legendLayer.onAdd = function (map) {
          let div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 2000, 4000, 6000, 8000, 9000];

          let labels = grades.map((val, i) => {
            let from = val,
              to = grades[i + 1] ? `&ndash;${grades[i + 1]}` : '+';

            return `<i style="background: ${getMapColor(from + 1)}"></i> ${from}${to}`
          });

          div.innerHTML = labels.join('<br>');
          return div;
        };

        this.geoLayer = geoLayer;
        this.geoLayer.addTo(this.mapLayer);
        infoLayer.addTo(this.mapLayer);
        legendLayer.addTo(this.mapLayer);
      },



      addDataValue (){
        const features = geojson.features.map(feature => {
          return {
            ...feature,
            properties: {
              ...feature.properties,
              dataValue: this.getSeries(feature)
            }
          }
        });

        return { ...geojson, features }
      },

      getSeries (feature){

        const dataValue = this.items ? this.items.series.find(obj => obj[this.code] === feature.properties.CTPRVN_CD) : null;
        return dataValue ? dataValue : {
          data: null,
          instanceId: 'instanceId',
          name : null,
          value: Math.abs(Math.floor(Math.random() * (0 - 10000) + 0))
        }
      }
    },


    watch: {
      items (items) {
        if (this.geoLayer){
          this.geojson = this.addDataValue();
          this.geoLayer.addData(this.geojson);
        }else{
          this.initGeoLayer();
        }
      },

      lineColor (color){
        this.geoLayer.setStyle(() => {
          return {
            color: color
          };
        });
      }
    }
  }
</script>

