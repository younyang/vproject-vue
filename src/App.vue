<template>
  <router-view></router-view>
</template>

<script>
import Firebase from 'firebase'
let config = {
  apiKey: "AIzaSyCL_mPYtC6MW3mwFPtALFZBWBibmMdcHys",
  authDomain: "vproject-a9e6b.firebaseapp.com",
  databaseURL: "https://vproject-a9e6b.firebaseio.com",
  projectId: "vproject-a9e6b",
  storageBucket: "vproject-a9e6b.appspot.com",
  messagingSenderId: "375457692548"
}
Firebase.initializeApp(config);

export default {
  name: 'app'
}
</script>

<style>
  // Import Font Awesome Icons Set
  $fa-font-path: "~font-awesome/fonts/";
  @import "~font-awesome/css/font-awesome.min.css";
  // Import Simple Line Icons Set
  $simple-line-font-path: "~simple-line-icons/fonts/";
  @import "~simple-line-icons/css/simple-line-icons.css";
</style>
<style lang="scss">
  // Import leaflet
  @import "~leaflet/dist/leaflet.css";
  // Import Main styles for this application
  @import "./scss/style";
</style>
