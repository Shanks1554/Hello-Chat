import firebase from 'firebase/compat/app';
import 'firebase/compat/storage'; 
import 'firebase/compat/firestore'; 

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const firestore = firebase.firestore();
const storage = firebase.storage();

export { firebase, firestore, storage };
