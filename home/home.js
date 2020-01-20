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

const teamNames = ["Hidrogênio","Hélio","Lítio","Berílio","Boro","Carbono","Nitrogênio","Oxigênio","Flúor","Neônio","Sódio","Magnésio"];

// Load Teams
var fbTeamData = [[],[],[],[],[],[],[],[],[],[],[],[]];

function loadLeaderborad() {

  var fbRef = firebase.database().ref('teams');
  fbRef.on('child_added', function(snapshot) {
    var tn = snapshot.key;
    fbTeamData[tn][1] = snapshot.val().name;
    fbTeamData[tn][0] = snapshot.val().points;
    fbTeamData[tn][2] = tn;
    fbTeamData[tn][0] = fbTeamData[tn][0].toString().padStart(6, "0");
  });
  fbRef.on('child_changed', function(snapshot) {
    var tn = snapshot.key;
    fbTeamData[tn][1] = snapshot.val().name;
    fbTeamData[tn][0] = snapshot.val().points;
    fbTeamData[tn][2] = tn;
    fbTeamData[tn][0] = fbTeamData[tn][0].toString().padStart(6, "0");

    updateLB();
  });

  firebase.database().ref('/teams/11').once('value').then(function(snapshot) {
    inflateLB();
  });

}

function inflateLB() {
  var lbOrder = [...fbTeamData];
  lbOrder.sort().reverse();

  document.getElementById('splashHolder').className += 'hideSplash';

  // Leaderboard podium

  for (var i = 1; i < 4; i++) {
    document.getElementById('podiumImage'+i).style.backgroundImage = "url('files/teams/"+(Number(lbOrder[i-1][2])+1)+".webp')";
    document.getElementById('teamName'+i).innerHTML = lbOrder[i-1][1];
    document.getElementById('teamPoints'+i).innerHTML = lbOrder[i-1][0].replace(/^0+/, '')+" pontos";

    if (lbOrder[i-1][0] == '000000') {
      document.getElementById('teamPoints'+i).innerHTML = "0 pontos";
    }

    document.getElementById('p'+i).className = 'podium loaded p'+i;
  }

  // Leaderboard list
  for (var i = 3; i < lbOrder.length; i++) {
    inflateLBChild(lbOrder, i);
  }
}

function inflateLBChild(lbOrder2, child) { // Arguments: [OrderedArray, Position]
  const lbHolder = document.getElementById('podiumHolder');
  const lbDiv = document.createElement('div');
  const spanName = document.createElement('span');
  const spanPoints = document.createElement('span');
  const spanPosition = document.createElement('span');

  lbDiv.className = 'leaderBoard center pos'+child;
  spanName.innerHTML = lbOrder2[child][1];
  spanPoints.innerHTML = lbOrder2[child][0].replace(/^0+/, '')+" pontos";
  spanPosition.innerHTML = (child+1)+'º';

  if (lbOrder2[child][0] == '000000') {
    spanPoints.innerHTML = "0 pontos";
  }

  lbDiv.id = 'lbd' + lbOrder2[child][2];
  spanPoints.id = 'lbsp' + lbOrder2[child][2];
  spanPosition.id = 'lbspos' + lbOrder2[child][2];

  spanName.className = 'teamNameList';
  spanPoints.className = 'teamPointsList';
  spanPosition.className = 'position';

  lbDiv.appendChild(spanPosition);
  lbDiv.appendChild(spanName);
  lbDiv.appendChild(spanPoints);

  lbHolder.appendChild(lbDiv);
}

function updateLB() {
  var lbOrder = [...fbTeamData];
  lbOrder.sort().reverse();

  for (var i = 0; i < fbTeamData.length; i++) { // Changing the team
    for (var i2 = 0; i2 < fbTeamData.length; i2++) { // Change the position
      if (fbTeamData[i][2] == lbOrder[i2][2]) {
        if (i2 <= 2) {
          document.getElementById('podiumImage'+(i2+1)).style.backgroundImage = "url('files/teams/"+(Number(lbOrder[i2][2])+1)+".webp')";
          document.getElementById('teamName'+(i2+1)).innerHTML = lbOrder[i2][1];
          document.getElementById('teamPoints'+(i2+1)).innerHTML = lbOrder[i2][0].replace(/^0+/, '')+" pontos";

          if (lbOrder[i2][0] == '000000') {
            document.getElementById('teamPoints'+(i2+1)).innerHTML = "0 pontos";
          }

          try {
            document.getElementById('lbd'+i).remove();
          } catch (e) {
            continue;
          }
        } else {
          try {
            const div = document.getElementById('lbd'+i);
            div.className = 'leaderBoard center pos'+i2;
            const spoints = document.getElementById('lbsp'+i);
            spoints.innerHTML = lbOrder[i2][0].replace(/^0+/, '')+" pontos";

            if (lbOrder[i2][0] == '000000') {
              spoints.innerHTML = "0 pontos";
            }

            const spos = document.getElementById('lbspos'+i);
            spos.innerHTML = (i2+1)+'º';
          } catch (e) {
            inflateLBChild(lbOrder, i2);
          } finally {

          }
        }

      }
    }
  }
}

// Last updated message;

firebase.database().ref('last_updated/date').on('value', function(snaps) {
  document.getElementById('lastUpdatedHolder').className = "lastUpdatedClass center";

  var d = new Date(snaps.val());
  const spanDate = document.getElementById('lastUpdated');
  var day = ("0" + d.getDate()).slice(-2);
  var month = ("0" + (d.getMonth()+1)).slice(-2);
  var year = d.getFullYear();
  var hours = d.getHours();
  var minutes = ("0" + d.getMinutes()).slice(-2);

  spanDate.innerHTML = day+"/"+month+"/"+year+" às "+hours+"h"+minutes;

});

// Do we have a winner?

firebase.database().ref('settings').once('value').then(function(snapsw) {
  if (snapsw.val().we_have_a_winner == true) {
    confetti.start();
    document.getElementById('crown').className = 'loaded';
    setTimeout('stopConfetti()', 6000);
  }
})

function stopConfetti() {
  confetti.stop();
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
      });
    }
  });
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
