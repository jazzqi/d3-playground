// <!-- The core Firebase JS SDK is always required and must be listed first -->
// <script src="/__/firebase/6.3.1/firebase-app.js"></script>

// <!-- TODO: Add SDKs for Firebase products that you want to use
//      https://firebase.google.com/docs/web/setup#reserved-urls -->

// <!-- Initialize Firebase -->
// <script src="/__/firebase/init.js"></script>

// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyBcI4Fpgs9QpKz6G6Q7KYn3L8TUg_odgMU",
  authDomain: "awesome-d3.firebaseapp.com",
  databaseURL: "https://awesome-d3.firebaseio.com",
  projectId: "awesome-d3",
  storageBucket: "awesome-d3.appspot.com",
  messagingSenderId: "556724667978",
  appId: "1:556724667978:web:17e527cad3277cc4"
});
const db = firebase.firestore();

export default db;
