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

// My code

var team;

function send() {

  // Test for error messages due to missing information
  const errorMessage = document.getElementById('errorMessage');
  var allOk = false;

  if (testforSend()[0] == true) {
    allOk = true;
    errorMessage.className = "hide";
  } else {
    errorMessage.innerHTML = "Termine de preencher as informações antes de enviar.";
    errorMessage.className = "";
  }

  if (allOk == true) {
    const currentUser = firebase.auth().currentUser;
    var taskValue = testforSend()[1];

    firebase.database().ref('teams/'+team+"/tasks/"+taskValue).once('value').then(function(snapshot) {
      if (snapshot.value == "Ok") {
        alert("Esta atividade já foi aprovada. Faça o envio de uma atividade diferente.");
      } else {
        storeImage("review/"+team+"/"+taskValue+extension, imageToUpload);
      }
    });
  }
}

// Listeners

document.getElementById("table").addEventListener("click", function() {
  testforSend();
});

function testforSend() {
  var radioElement = document.getElementsByName('0');
  const sendButton = document.getElementById('sendButton');
  var radioValue = null;

  var isRadioChecked = false;
  for (var i = 0, length = radioElement.length; i < length; i++) {
    if (radioElement[i].checked) {
      isRadioChecked = true;
      radioValue = radioElement[i].value;
      break;
    }
  }

  if (imageToUpload != null && isRadioChecked == true) {
      sendButton.className = "button3";
      return [true, radioValue];
  } else {
      console.log("Missing something");
      return false;
  }
}


// Send to cloud

var imageToUpload = null;
function uploadImage() {
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
        document.querySelector('#insertPicture').style.backgroundImage = "url('"+content+"')";
        document.getElementById('cameraDiv').className = "afterUpload";
        document.getElementById('addText').innerHTML = "Alterar Imagem";

        imageToUpload = dataURLtoFile(content, "profile.png");
        testforSend();
     }
   }
  input.click();
};

function storeImage(path, img) {
  const progressBar = document.getElementById('progressbar');
  const progressPercentage = document.getElementById('progressPercentage');
  const progressInd = document.getElementById('progressInd');
  progressBar.className = "";

  const promises = [];

  const uploadTask = firebase.storage().ref(path).put(img);
  promises.push(uploadTask);
  openModal();

  uploadTask.on('state_changed', snapshot => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(progress);
      progressPercentage.style.width = progress+"%";
      progressInd.innerHTML = Math.round(progress,2)+"%";
  }, error => { console.log(error) }, () => {
      uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
          console.log(downloadURL);
      });
  });

  Promise.all(promises).then(tasks => {
      console.log('File uploaded');
      document.getElementById("sendingStatus").innerHTML = "Atividade enviada"
      const dbutton = document.getElementById('doneButton');
      dbutton.className = "button3"
      dbutton.onclick = function() {location.reload();}
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

// Default code below

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
  const loadMessage = document.getElementById("loading");
  const errorUser = document.getElementById("noUser");
  const errorTeam = document.getElementById("noTeam");
  const errorNone = document.getElementById("body");

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

      errorNone.className = "";

      // Get the team
      const currentUser = firebase.auth().currentUser;
      var dbRef = firebase.database().ref('users/' + currentUser.uid + "/team");
      dbRef.on('value', function(snapshot) {
        team = snapshot.val();
        if (team == null) {
          errorTeam.className = "";
          errorNone.className = "hidden";
        }
      });
    } else {
      errorUser.className = "";
    }
    loadMessage.className = "hidden";
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

// Modal popup
const modal = document.getElementById("myModal");
function openModal() {
  modal.style.display = "block";
}
