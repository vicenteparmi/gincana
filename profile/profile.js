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

var popupShow = false;
var signedIn = false;

// Get user information
var name;
var email;
var photoUrl;
var uid;

var user = firebase.auth().currentUser;

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
      document.getElementById("profileImage").style.backgroundImage = photoURL;
    });

  } else {
    name = 'Anônimo';
    email = 'Usuário não conectado';
  }
});

// Sign out from profile

function signOut() {
  firebase.auth().signOut().then(function() {
    console.log('Signed Out');
    location.reload();
  }, function(error) {
    console.error('Sign Out Error', error);
  });
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

        const imageUrl = getFileBlob(content);

        console.log(imageUrl);
        user.updateProfile({
          photoURL: file
        }).then(function() {
          console.log("Sucesso");
        }).catch(function(error) {
          console.log("Fracasso");
        });
     }
   }
  input.click();
};

function imageIsLoaded() {
  alert(this.src);  // blob url
  // update width and height ...
}

var getFileBlob = function (url, cb) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.addEventListener('load', function() {
        cb(xhr.response);
      });
      xhr.send();
    };
