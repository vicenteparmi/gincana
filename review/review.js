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

// Get all images


const body = document.getElementById('body');

var listRef = firebase.storage().ref().child('review');
const teamNames = ["Hidrogênio","Hélio","Lítio","Berílio","Boro","Carbono","Nitrogênio","Oxigênio","Flúor"];
const teamColors = ["#005c8d","#00b661","#c43030","#d1ad1e","#94007e","#4d4d4d","#e7660b","#00b87e","#e91e63"]

for (var i = 0; i < 10; i++) {

  listRefNow = listRef.child(i.toString());
  listRefNow.listAll().then(function(res) {
    res.prefixes.forEach(function(folderRef) {
      console.log(folderRef);
    });
    res.items.forEach(function(itemRef) {
      itemRef.getDownloadURL().then(function(url) {
        teamName = Number(url.charAt(82))-1;
        activity = Number(url.charAt(86));

        const listItem = document.createElement('div');
        const listItemDescription = document.createElement('p');
        const validate = document.createElement('div');
        const acceptButton = document.createElement('div');
        const rejectButton = document.createElement('div');

        listItem.style.backgroundColor = teamColors[teamName];
        listItem.style.backgroundImage = "url('"+url+"')";
        listItem.className = "imageToReview";
        listItem.id = teamName+"/"+activity;

        listItemDescription.innerHTML = "Equipe: " + teamNames[teamName] + "<br/>Atividade: "+activity;
        listItemDescription.className = "listItemDescription"

        validate.className = "validate";

        acceptButton.className = "acceptButton";
        acceptButton.id = teamName+"/"+activity;
        acceptButton.onclick = function() {accept(this.id)};

        rejectButton.className = "rejectButton";
        rejectButton.id = teamName+"/"+activity;
        rejectButton.onclick = function() {reject(this.id)};


        validate.appendChild(acceptButton);
        validate.appendChild(rejectButton);
        listItem.appendChild(listItemDescription);
        listItem.appendChild(validate);
        body.appendChild(listItem);
      }).catch(function(error) {
        console.log(error);
      });
    });
  }).catch(function(error) {
    console.log(error);
  });
}

function accept(id) {
  var teamActivity = id.split('/');
  var database = firebase.database();
  teamActivity[0]++;

  firebase.database().ref('teams/'+teamActivity[0]+"/tasks/"+teamActivity[1]).set({
    done: "Ok",
    time: Date.now()
  });

  deleteFile(teamActivity);

  document.getElementById(id).style.display = "none";
}

function reject(id) {
  var teamActivity = id.split('/');
  teamActivity[0]++;
  deleteFile(teamActivity);
  document.getElementById(id).style.display = "none";
}

function deleteFile(teamActivity) {
  var delRef1 = firebase.storage().ref("review/"+teamActivity[0]+"/"+teamActivity[1]+".jpg");
  var delRef2 = firebase.storage().ref("review/"+teamActivity[0]+"/"+teamActivity[1]+".png");
  var delRef3 = firebase.storage().ref("review/"+teamActivity[0]+"/"+teamActivity[1]+".tiff");

  delRef1.delete().then(function() {
  console.log("File deleted successfully! [jpg]");
  }).catch(function(error) {
    console.log("Uh-oh, an error occurred! [jpg] Error:"+error);
  });
  delRef2.delete().then(function() {
  console.log("File deleted successfully! [png]");
  }).catch(function(error) {
    console.log("Uh-oh, an error occurred! [png] Error:"+error);
  });
  delRef3.delete().then(function() {
  console.log("File deleted successfully! [tiff]");
  }).catch(function(error) {
    console.log("Uh-oh, an error occurred! [tiff] Error:"+error);
  });
}

// Default Code

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
