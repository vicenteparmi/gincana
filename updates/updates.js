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

// List update listener

const table = document.getElementById("table");
const dbRefList = firebase.database().ref("latest_changes").orderByChild("latest_changes");

dbRefList.on('child_added', function(info){
  const tr = document.createElement("tr");

  const points = document.createElement("td");
  const date = document.createElement("td");
  const desc = document.createElement("td");
  const team = document.createElement("td");

  points.innerText = info.child("points").val();
  date.innerText = info.child("date").val();
  desc.innerText = info.child("description").val();
  team.innerText = info.child("team").val();

  tr.appendChild(points);
  tr.appendChild(date);
  tr.appendChild(desc);
  tr.appendChild(team);

  table.appendChild(tr);
});

// Default code below

var popupShow = false;
var signedIn = false;

function popup() {
  var user = firebase.auth().currentUser;

  if (popupShow == false) {
    if (user) {
      document.getElementById("popupMenuLogged").className = "popupMenu";
    } else {
      document.getElementById("popupMenu").className = "popupMenu";
    }
    popupShow = true;
  } else {
    document.getElementById("popupMenu").className = "popupMenu hide";
    document.getElementById("popupMenuLogged").className = "popupMenu hide";
    popupShow = false;
  }

  loadPage();
}

function loadPage() {
  var user = firebase.auth().currentUser;
  var name, email, photoUrl, uid, emailVerified;

  if (user != null) {
    name = user.displayName;
    email = user.email;
    photoUrl = user.photoURL;
    emailVerified = user.emailVerified;
    uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                     // this value to authenticate with your backend server, if
                     // you have one. Use User.getToken() instead.
  }

  document.getElementById('userName').innerHTML = name;
  document.getElementById('userEmail').innerHTML = email;
  document.getElementById("userPhoto").src = photoURL;
}

function signOut() {
  firebase.auth().signOut().then(function() {
    console.log('Signed Out');
    location.reload();
  }, function(error) {
    console.error('Sign Out Error', error);
  });
}