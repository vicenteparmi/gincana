// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyA07lUMH1HyCjBi_eKe-4gaz1b9FhdSZiE",
    authDomain: "havarena-f3d87.firebaseapp.com",
    databaseURL: "https://havarena-f3d87.firebaseio.com",
    projectId: "havarena-f3d87",
    storageBucket: "havarena-f3d87.appspot.com",
    messagingSenderId: "259369291947",
    appId: "1:259369291947:web:6233862e160cc6bfce67ee",
    measurementId: "G-STKZ9T8L1C"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

// Now my code ;D

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const auth = firebase.auth();

  const callback = auth.signInWithEmailAndPassword(email, password);
  callback.catch(e => console.log(e.message));
}

function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const auth = firebase.auth();

  const callback = auth.createUserWithEmailAndPassword(email, password);
  callback.catch(e => console.log(e.message));
}
