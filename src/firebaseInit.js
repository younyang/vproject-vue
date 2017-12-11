const firebaseConfig = {
  apiKey: "AIzaSyCL_mPYtC6MW3mwFPtALFZBWBibmMdcHys",
  authDomain: "vproject-a9e6b.firebaseapp.com",
  databaseURL: "https://vproject-a9e6b.firebaseio.com",
  projectId: "vproject-a9e6b",
  storageBucket: "vproject-a9e6b.appspot.com",
  messagingSenderId: "375457692548"
};

import firebase from 'firebase'
import 'firebase/firestore'

const firebaseApp = firebase.initializeApp(firebaseConfig)

export default firebaseApp.firestore()
