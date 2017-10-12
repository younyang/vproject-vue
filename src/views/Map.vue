<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-6">
        <div id="map" class="map"></div>
      </div>
      <div class="col-6">
        <div id="seoul" class="map"></div>
      </div>
      <!--
      <v-map style="width: 400px; height: 550px" ref="map" :zoom="zoom" :options="options" :center="center">
        <v-tilelayer :url="url" :attribution="attribution"></v-tilelayer>
        <v-geojson-layer v-if="show" :geojson="geojson" :options="options"></v-geojson-layer>
        <v-circle :lat-lng="circle.center" :radius="circle.radius"></v-circle>
      </v-map>
      -->
    </div><!--/.row-->
  </div>
</template>

<script>
import L from 'leaflet'
// import Vue2Leaflet from 'vue2-leaflet'
import axios from 'axios'

export default {
  name: 'map',
  components: {
    //'v-map': Vue2Leaflet.Map,
    //'v-tilelayer' :Vue2Leaflet.TileLayer,
    //'v-geojson-layer' :Vue2Leaflet.GeoJSON,
    //'v-circle': Vue2Leaflet.LCircle
  },
  data () {
    return {
      show: true,
      geojson: {},
      options: {
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        tap: false,
        zoomSnap: 0.25,
        zoomDelta: 0.25,
        attributionControl: false
      },
      style: function () {
        return {
          weight: 2,
          color: '#ECEFF1',
          opacity: 1,
          dashArray: '3',
          fillColor: '#feb24c',
          fillOpacity: 0.6
        }
      },
      circle: {
        center: L.latLng(36, 127),
        radius: 4500
      },
      url:'http://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
      attribution:'&copy; <a href="http://www.openstreetmap.org/copyright" target=\"_blank\">OpenStreetMap</a>'
    }
  },

  created () {
    axios.get("/static/geo/ctprvn.json").then(response => {
      this.geojson.map = response.data;
      this.setMap()
    });
    axios.get("/static/geo/sig/11.json").then(response => {
      this.geojson.seoul = response.data;
      this.setMapSeoul()
    });
  },

  methods: {
    setMap (){
      const mymap = L.map('map', this.options)
      mymap.setView([36, 127.5], 6.75)

      /*
      L.tileLayer(this.url, {
        attribution: this.attribution
      }).addTo(mymap)
      */

      const geoLayer = L.geoJSON(null, {
        style: this.style,
        onEachFeature (feature,layer) {
          layer.on({
            mouseover (e){
              let layer = e.target;

              layer.setStyle({
                color: '#666',
                dashArray: '',
                fillOpacity: 1
              })

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
      geoLayer.addData(this.geojson.map);
      mymap.addLayer(geoLayer);
    },

    setMapSeoul (){
      const seoul = L.map('seoul', this.options)
      seoul.setView([37.55, 126.98], 10.75)

      const geoSeoul = L.geoJSON(null, {
        style: this.style,
        onEachFeature (feature,layer) {
          layer.on({
            mouseover (e){
              let layer = e.target;

              layer.setStyle({
                color: '#666',
                dashArray: '',
                fillOpacity: 1
              })

              if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
              }
            },

            mouseout (e){
              geoSeoul.resetStyle(e.target);
            }
          })
        }
      })
      geoSeoul.addData(this.geojson.seoul);
      seoul.addLayer(geoSeoul);

    }
  }
}
</script>

<style>
  .map {
    width: 100%;
    height: 530px;
  }
</style>
