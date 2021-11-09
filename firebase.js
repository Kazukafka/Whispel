import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBr3G4lumVDqp4D3KfjV2fzHXiBbBFNGMI",
  authDomain: "signal-clone-75cc8.firebaseapp.com",
  projectId: "signal-clone-75cc8",
  storageBucket: "signal-clone-75cc8.appspot.com",
  messagingSenderId: "655180124213",
  appId: "1:655180124213:web:d0e0c3380c807de887617c"
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig)
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };

// Error ↓　solved
// `Firebase` package was successfully found. However, this package itself specifies a `main` module field that could not be resolved
// https://stackoverflow.com/questions/69814654/firebase-package-was-successfully-found-however-this-package-itself-specifie
