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

// teamSelector

function selectTeam(team) {

  user = firebase.auth().currentUser;
  const userId = user.uid

  if (team == 0) {
    openModal();
  } else {
    firebase.database().ref('users/' + userId).set({
    team: team,
    name: user.displayName,
    email: user.email
  });
    modal.style.display = "none";
    setTeam(team);
  }
}

// User stuff

var popupShow = false;
var signedIn = false;

// Get user information
var name;
var email;
var photoUrl;
var uid;

// TODO: Delete this if everything is ok
//var user = firebase.auth().currentUser;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    user.providerData.forEach(function (profile) {
      uid = profile.uid;
      name = profile.displayName;
      email = profile.email;
      photoURL = profile.photoURL;

      console.log(profile.photoURL);

      document.getElementById('userName').innerHTML = name;
      document.getElementById('userEmail').innerHTML = email;
      document.getElementById("profileImage").style.backgroundImage = "url('"+photoURL+"')";

      // Get team
      var team;
      const currentUser1 = firebase.auth().currentUser;
      var dbRef = firebase.database().ref('users/' + currentUser1.uid + "/team");
      dbRef.on('value', function(snapshot) {
        team = snapshot.val();
        setTeam(team);
      });
    });

  } else {
    name = 'Anônimo';
    email = 'Usuário não conectado';
  }
});

// Set team

function setTeam(teamNumber) {

  if (teamNumber != null) {
    const teamNames = ["Hidrogênio","Hélio","Lítio","Berílio","Boro","Carbono","Nitrogênio","Oxigênio","Flúor"];
    const teamColors = ["#005c8d","#00b661","#c43030","#d1ad1e","#94007e","#4d4d4d","#e7660b","#00b87e","#e91e63"]
    var teamName = teamNames[teamNumber-1];

    document.getElementById("hasTeam").className = "";
    document.getElementById("unknownTeam").className = "hide";

    document.getElementById('teamName').innerHTML = teamName;

    document.getElementById("teamImage").style.backgroundImage = "url('./files/teams/"+teamNumber+".png')"
    document.getElementById("body").style.backgroundColor = teamColors[teamNumber-1];
  }
}

// Sign out from profile

function signOut() {
  firebase.auth().signOut().then(function() {
    console.log('Signed Out');
    location.reload();
  }, function(error) {
    console.error('Sign Out Error', error);
  });
}

// Update userName

function updateUserName() {
  var user = firebase.auth().currentUser;
  var name = prompt("Qual o novo nome de usuário?", user.displayName);
  if ((name == null || name == "") && name.length <= 25) {
    name = user.displayName;
  }

  if (user) {
    user.updateProfile({
      displayName: name,
    }).then(function() {
      document.getElementById("userName").innerHTML = name;
    }).catch(function(error) {
      // An error happened.
    });
  } else {
    // No user is signed in.
  }
}

// Upload profile picture

function uploadPhoto() {
  var input = document.createElement('input');
  input.type = 'file';

  var user = firebase.auth().currentUser;

  input.onchange = e => {

     // getting a hold of the file reference
     var file = e.target.files[0];

     // setting up the reader
     var reader = new FileReader();
     reader.readAsDataURL(file); // this is reading as data url

     // here we tell the reader what to do when it's done reading...
     reader.onload = readerEvent => {
        content = readerEvent.target.result; // this is the content!
        document.querySelector('#profileImage').style.backgroundImage = "url('"+content+"')";

        var imageToUpload = dataURLtoFile(content, "profile.png");
        storeProfileImage("user_photos/"+user.uid+extension, imageToUpload);

     }
   }
  input.click();
};

function storeProfileImage(path, img) {
  const progressBar = document.getElementById('progressbar');
  const progressPercentage = document.getElementById('progressPercentage');
  const progressInd = document.getElementById('progressInd');
  progressBar.className = "";

  const promises = [];

  const uploadTask = firebase.storage().ref(path).put(img);
  promises.push(uploadTask);

  uploadTask.on('state_changed', snapshot => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(progress);
      progressPercentage.style.width = progress+"%";
      progressInd.innerHTML = "Enviando imagem ("+Math.round(progress,2)+"%)"
  }, error => { console.log(error) }, () => {
      uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
          console.log(downloadURL);
      });
  });

  Promise.all(promises).then(tasks => {
      console.log('Updating URL...');
      updateProfileURL();
      progressBar.className = "hide";
  });
}

function updateProfileURL() {
  var user = firebase.auth().currentUser;
  var storage = firebase.storage();
  var gsReference = storage.refFromURL('gs://havarena-f3d87.appspot.com/user_photos/'+user.uid+extension);
  gsReference.getDownloadURL().then(function(url) {
    console.log(url);
    user.updateProfile({
      photoURL: url
    }).then(function() {
      console.log("Sucesso");
    }).catch(function(error) {
      console.log("Fracasso");
    });
  }).catch(function(error) {
    console.log(error);
  });
}


var extension;

function dataURLtoFile(dataurl, filename) {

    console.log(dataurl.charAt(11));
    switch (dataurl.charAt(11)) {
      case 'p':
        extension = ".png";
        break;
      case 'j':
        extension = ".jpg";
        break;
      case 't':
        extension = ".tiff";
      default:
        alert("O arquivo é inválido");
        uhsasuaUSIUSIUAH(hue);
    }

    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}


// Modal popup
const modal = document.getElementById("myModal");
function openModal() {
  var span = document.getElementsByClassName("close")[0];

  modal.style.display = "block";

  span.onclick = function() {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}
