import firebase from 'firebase/compat/app';
import 'firebase/compat/storage'; 
import 'firebase/compat/firestore'; 

const firebaseConfig = {
  apiKey: "AIzaSyBoWGzid2rtcYtVjl7YR_pGPyPE-e1GVsE",
  authDomain: "fir-chatapp-6d6ec.firebaseapp.com",
  projectId: "fir-chatapp-6d6ec",
  storageBucket: "fir-chatapp-6d6ec.appspot.com",
  messagingSenderId: "911567679708",
  appId: "1:911567679708:web:f7f1dcd84ee577ad5a4419"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const firestore = firebase.firestore();
const storage = firebase.storage();

export { firebase, firestore, storage };
