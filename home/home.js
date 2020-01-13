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

// Constants

const teamNames = ["Hidrogênio","Hélio","Lítio","Berílio","Boro","Carbono","Nitrogênio","Oxigênio","Flúor"];
const teamColors = ["#005c8d","#00b661","#c43030","#d1ad1e","#94007e","#4d4d4d","#e7660b","#00b87e","#e91e63"]

// Load Teams
var fbTeamData = [[],[],[],[],[],[],[],[],[]];

function loadLeaderborad() {

  var fbRef = firebase.database().ref('teams');
  fbRef.on('child_added', function(snapshot) {
    var tn = snapshot.key;
    fbTeamData[tn][1] = snapshot.val().name;
    fbTeamData[tn][0] = snapshot.val().points;
    fbTeamData[tn][0] = fbTeamData[tn][0].toString().padStart(6, "0");
  });
  fbRef.on('child_changed', function(snapshot) {
    var tn = snapshot.key;
    fbTeamData[tn][1] = snapshot.val().name;
    fbTeamData[tn][0] = snapshot.val().points;
    fbTeamData[tn][0] = fbTeamData[tn][0].toString().padStart(6, "0");
    updateLB();
  });

  firebase.database().ref('/teams/8').once('value').then(function(snapshot) {
    inflateLB();
  });

}

function inflateLB() {
  var lbOrder = fbTeamData.sort().reverse();
  const lbHolder = document.getElementById('podiumHolder');

  for (var i = 3; i < lbOrder.length; i++) {
    const lbDiv = document.createElement('div');
    const spanName = document.createElement('span');
    const spanPoints = document.createElement('span');
    const spanPosition = document.createElement('span');

    lbDiv.className = 'leaderBoard center pos'+i;
    spanName.innerHTML = lbOrder[i][1];
    spanPoints.innerHTML = lbOrder[i][0].replace(/^0+/, '')+" pontos";
    spanPosition.innerHTML = (i+1)+'º';

    if (lbOrder[i][0] == '000000') {
      spanPoints.innerHTML = "Sem pontos";
    }

    lbDiv.id = 'lbd'+i;

    spanName.className = 'teamNameList';
    spanPoints.className = 'teamPointsList';
    spanPosition.className = 'position';

    lbDiv.appendChild(spanPosition);
    lbDiv.appendChild(spanName);
    lbDiv.appendChild(spanPoints);

    lbHolder.appendChild(lbDiv);
  }
}

function updateLB() {

}

// Background color according to teams (maybe that will go away)

function defineBgColor(team) {
  document.getElementById('bluebody').style.backgroundColor = teamColors[team-1];
}

// Header shadow

headerShadow();
function headerShadow() {
	if (document.body.scrollTop == 0 || document.documentElement.scrollTop == 0){
		document.getElementById("header").className = "headerNoShadow";
	}
  if (document.body.scrollTop != 0 || document.documentElement.scrollTop != 0) {
		document.getElementById("header").className = "";
	}
}

// Default code

var popupShow = false;
var signedIn = false;

function popup() {
  var user = firebase.auth().currentUser;
  const popupLogged = document.getElementById("popupMenuLogged");
  const popupMenu = document.getElementById("popupMenu");
  const userPhoto = document.getElementById("userPhoto");

  if (popupShow == false) {
    if (user) {
      popupLogged.className = "popupMenu";
    } else {
      popupMenu.className = "popupMenu";
    }
    popupShow = true;

    window.onclick = function() {
      if (event.target != popupMenu && event.target != popupLogged && event.target != userPhoto) {
        popupMenu.className = "popupMenu hide";
        popupLogged.className = "popupMenu hide";
        popupShow = false;
      }
    }

  } else {
    popupMenu.className = "popupMenu hide";
    popupLogged.className = "popupMenu hide";
    popupShow = false;
  }

  loadPage();
}

var team;

function loadPage() {
  var user = firebase.auth().currentUser;
  var name, email, photoUrl, uid, emailVerified;

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      name = user.displayName;
      email = user.email;
      photoUrl = user.photoURL;
      emailVerified = user.emailVerified;
      uid = user.uid;

      document.getElementById('userName').innerHTML = name;
      document.getElementById('userEmail').innerHTML = email;
      document.getElementById("userPhoto").style.backgroundImage = "url('"+photoUrl+"')";

      // Define team
      const currentUser = firebase.auth().currentUser;
      var dbRef = firebase.database().ref('users/' + currentUser.uid + "/team");
      dbRef.on('value', function(snapshot) {
        team = snapshot.val();
        // defineBgColor(team); Still haven't decided if this will be kept
      });
    }
  });

  loadLeaderborad();
}

function signOut() {
  firebase.auth().signOut().then(function() {
    console.log('Signed Out');
    location.reload();
  }, function(error) {
    console.error('Sign Out Error', error);
  });
}

var menuOpen = false;
function openMenu() {
  const menu = document.getElementById("menu");
  const menuHolder = document.getElementById("menuHolder");
  const sandwich = document.getElementById("sandwich");

  if (menuOpen == false) {
    menu.className = "show";
    menuHolder.className = "shadow"
    window.onclick = function() {
      if (event.target != menu && event.target != sandwich) {
        menu.className = "";
        menuHolder.className = ""
        menuOpen = false;
      }
    }
    menuOpen = true;
  } else {
    menu.className = "";
    menuHolder.className = ""
    menuOpen = false;
  }
}
