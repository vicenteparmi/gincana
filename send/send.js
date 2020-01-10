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

var currentMode = null;
var itemSelected = -1;

function sti(id) {

  const onePicMode = [3,5,7,8,9,10,11,12,13,15,16,17,19,20,21,22,23,25];
  const somePicsMode = [2,14,26,27];
  const videoMode = [6,18];
  const urlMode = [1];

  const mode0Holder = document.getElementById('sendOnePhoto');
  const mode1Holder = document.getElementById('sendMorePhotos');
  const mode2Holder = document.getElementById('sendVideo');
  const mode3Holder = document.getElementById('sendLink');

  mode0Holder.className = "hidden";
  mode1Holder.className = "hidden";
  mode2Holder.className = "hidden";
  mode3Holder.className = "hidden";

  const nothingSelected = document.getElementById('nothingSelected');
  nothingSelected.className = "hide";
  const somethingSelected = document.getElementById('somethingSelected');
  somethingSelected.className = "bodyItem";

  const table = document.getElementById('table');
  table.className = "afterClick";

  try {
    document.getElementsByClassName('selected')[0].className = "";
  } finally {
    document.getElementById(id).className = "selected";
  }

  itemSelected = id.charAt(2) + id.charAt(3);
  itemSelected = Number(itemSelected)+1

  document.getElementById('activityName').innerHTML = 'Atividade '+itemSelected;

  for (var i = 0; i < 28; i++) {
    if (itemSelected == onePicMode[i]) {
      currentMode = 0;
      mode0Holder.className = "";
      break;
    } else if (itemSelected == somePicsMode[i]) {
      currentMode = 1;
      mode1Holder.className = "";
      break;
    } else if (itemSelected == videoMode[i]) {
      currentMode = 2;
      mode2Holder.className = "";
      break;
    } else if (itemSelected == urlMode[i]) {
      currentMode = 3;
      mode3Holder.className = "";
      break;
    }
  }

  console.log("Current Mode: "+currentMode);
}

function helpVideo() {
  alert("Faça o upload do vídeo para algum serviço como Google Photos, YouTube ou Google Drive. Em seguida compartilhe o arquivo para obter o link. Em caso de mais dúvidas entre em contato na página 'sobre'.")
}

// Code before update

var team;

function send() {

  var allOk = false;
  if (testforSend() == true) {
    allOk = true;
    errorMessage.className = "hide";
  } else {
    errorMessage.innerHTML = "Termine de preencher as informações antes de enviar.";
    errorMessage.className = "";
  }

  if (allOk == true) {
      const currentUser = firebase.auth().currentUser;
      switch (currentMode) {
        case 0: // One pic mode
          firebase.database().ref('teams/'+team+"/tasks/"+itemSelected).once('value').then(function(snapshot) {
            try {
              if (snapshot.val().done == "Ok") {
                alert("Esta atividade já foi aprovada. Faça o envio de uma atividade diferente.");
              }
            } catch (e) {
              var image = document.getElementById('insertPicture');
              var style = image.currentStyle || window.getComputedStyle(image, false);
              var bi = style.backgroundImage.slice(4, -1).replace(/"/g, "");
              var file = dataURLtoFile(bi, "filename");
              storeImage('review/'+team+'/'+itemSelected+'/'+itemSelected+file[1], file[0]);
            } finally {
              // Nothing to do, I guess;
            }
          });
          break;
        case 1: // Some pics mode0Holder
          for (var i = 0; i < imagesUploaded; i++) {
            var image = document.getElementById('dpic/'+i);
            if (image) {
              var style = image.currentStyle || window.getComputedStyle(image, false);
              var bi = style.backgroundImage.slice(4, -1).replace(/"/g, "");
              var file = dataURLtoFile(bi, "filename");
              const imageId = Math.random();
              storeImage('review/'+team+'/'+itemSelected+'/'+imageId+file[1], file[0]);
            }
          }
          break;
        case 2: // Video mode

          break;
        case 3: // URL mode0Holder
          const mode1input = document.getElementById('mode1input');
          if (itemSelected == 1) {
            var dbRef = firebase.database().ref('review/Activity 1').push();
            dbRef.set({
              team: team,
              sentBy: currentUser.displayName,
              sentOn: Date.now(),
              url: mode1input.value
            })
            openModal();
          }
          document.getElementById('progressbar').className = "";
          document.getElementById('progressPercentage').style.width = "100%";
          document.getElementById('progressInd').innerHTML = "100%";
          document.getElementById("sendingStatus").innerHTML = "Atividade enviada"
          const dbutton = document.getElementById('doneButton');
          dbutton.className = "button3"
          dbutton.onclick = function() {location.reload();}
          break;
        default:

      }
  }

  // // Test for error messages due to missing information
  // const errorMessage = document.getElementById('errorMessage');
  // var allOk = false;
  //
  // if (testforSend()[0] == true) {
  //   allOk = true;
  //   errorMessage.className = "hide";
  // } else {
  //   errorMessage.innerHTML = "Termine de preencher as informações antes de enviar.";
  //   errorMessage.className = "";
  // }
  //
  // if (allOk == true) {
  //   const currentUser = firebase.auth().currentUser;
  //   var taskValue = testforSend()[1];
  //
  //   firebase.database().ref('teams/'+team+"/tasks/"+taskValue).once('value').then(function(snapshot) {
  //     try {
  //       if (snapshot.val().done == "Ok") {
  //         alert("Esta atividade já foi aprovada. Faça o envio de uma atividade diferente.");
  //       }
  //     } catch (e) {
  //       storeImage("review/"+team+"/"+taskValue+extension, imageToUpload);
  //     } finally {
  //       // Nothing to do, I guess;
  //     }
  //   });
  // }
}

// Listeners

// document.getElementById("table").addEventListener("click", function() {
//   testforSend();
// });

function testforSend() {
  // const sendButton = document.getElementById('sendButton');
  // var radioValue = null;
  //
  // var isRadioChecked = false;
  // for (var i = 0, length = radioElement.length; i < length; i++) {
  //   if (radioElement[i].checked) {
  //     isRadioChecked = true;
  //     radioValue = radioElement[i].value;
  //     break;
  //   }
  // }
  //
  // if (imageToUpload != null && isRadioChecked == true) {
  //     sendButton.className = "button3";
  //     return [true, radioValue];
  // } else {
  //     console.log("Missing something");
  //     return false;
  // }

  return true;
}


// Send to cloud

var imageToUpload;

// Load Image
function uploadImage() {
  var input = document.createElement('input');
  input.type = 'file';
  input.onchange = e => {

     // getting a hold of the file reference
     var file = e.target.files[0];

     // setting up the reader
     var reader = new FileReader();
     reader.readAsDataURL(file); // this is reading as data url

     // here we tell the reader what to do when it's done reading...
     reader.onload = readerEvent => {
        content = readerEvent.target.result;
        document.querySelector('#insertPicture').style.backgroundImage = "url('"+content+"')";
        document.getElementById('cameraDiv').className = "afterUpload";
        document.getElementById('addText').innerHTML = "Alterar Imagem";

        imageToUpload = null;
        imageToUpload = dataURLtoFile(content, "profile.png");
     }
   }
  input.click();
};

var imagesUploaded = 0;  // This variable is only useful to set a id to the items;

function uploadOneMoreImage() {
  var input = document.createElement('input');
  input.type = 'file';
  input.onchange = e => {
     var file = e.target.files[0];
     var reader = new FileReader();
     reader.readAsDataURL(file);
     // here we tell the reader what to do when it's done reading...
     reader.onload = readerEvent => {
        content = readerEvent.target.result;

        const span = document.getElementById('toUpload');
        const imageDiv = document.createElement('div');
        const closeButton = document.createElement('span');

        imageDiv.className = "smallPicture";
        imageDiv.style.backgroundImage = "url('"+content+"')";
        imageDiv.id = "dpic/"+ imagesUploaded;

        closeButton.className = "closeSmallPic"
        closeButton.innerHTML = "&times";
        closeButton.id = "spic/"+ imagesUploaded;
        closeButton.onclick = function() {closeSmallPic(this.id)};

        imageDiv.appendChild(closeButton);
        span.appendChild(imageDiv);

        imagesUploaded++;
     }
   }
  input.click();
};

function closeSmallPic(id) {
  debugger;
  var data = id.split("/");
  var id = Number(data[1]);

  const span = document.getElementById('toUpload');
  const child = document.getElementById('dpic/'+id);
  span.removeChild(child);
}

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
    return [new File([u8arr], filename, {type:mime}), extension];
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
