import { createStore, combineReducers, compose } from "redux";
import firebase, { firestore } from "firebase";
import "firebase/firestore";
import { reactReduxFirebase, firebaseReducer } from "react-redux-firebase";
import { reduxFirestore, firestoreReducer } from "redux-firestore";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import notifyReducer from "./reducers/notifyReducer";
import settingsReducer from "./reducers/settingsReducer";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "reactclientpanel-71702.firebaseapp.com",
  databaseURL: "https://reactclientpanel-71702.firebaseio.com",
  projectId: "reactclientpanel-71702",
  storageBucket: "reactclientpanel-71702.appspot.com",
  messagingSenderId: "652466296349"
};

// react-redux-firebase config
const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
};

// Init firebase instance
firebase.initializeApp(firebaseConfig);
// Init firestore

const firestoreR = firebase.firestore();
const settings = { /* your settings... */ timestampsInSnapshots: true };
firestoreR.settings(settings);

//Add reactReduxFirebase enhancer when making store creator
const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig), // firebase instance as first argument
  reduxFirestore(firebase)
)(createStore);

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  notify: notifyReducer,
  settings: settingsReducer
});

// Check for settings in localStorage
if (localStorage.getItem("settings") == null) {
  //Default settings
  const defaultSettings = {
    disableBalanceOnAdd: true,
    disableBalanceOnEdit: false,
    allowRegistration: false
  };

  // Set to localStorage
  localStorage.setItem("settings", JSON.stringify(defaultSettings));
}

// Create initial state
const initialState = { settings: JSON.parse(localStorage.getItem("settings")) };

// Create store
const store = createStoreWithFirebase(
  rootReducer,
  initialState,
  composeWithDevTools(reactReduxFirebase(firebase))
);

export default store;
