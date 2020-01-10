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

var storageRef = firebase.storage().ref().child('review');
const teamNames = ["Hidrogênio","Hélio","Lítio","Berílio","Boro","Carbono","Nitrogênio","Oxigênio","Flúor"];
const teamColors = ["#005c8d","#00b661","#c43030","#d1ad1e","#94007e","#4d4d4d","#e7660b","#00b87e","#e91e63"]
const points = [20,700,700,,200,400,100,300,200,300,100,100,100,100,100,300,500,500,200,200,300,500,400,,400,300,200];

// Getting posts from activity 1

var db1Ref = firebase.database().ref('review/Activity 1');
db1Ref.on('child_added', function(data) {
  var postKey = data.key;
  var postURL = data.val().url;
  var postUser = data.val().sentBy;
  var postDate = data.val().sentOn;
  var team = data.val().team;

  const span = document.getElementById('review1');
  const div = document.createElement('div');
  const text = document.createElement('p');
  const link = document.createElement('a');

  link.href = postURL;
  link.innerHTML = postURL;
  text.innerHTML = "URL: "
  text.appendChild(link);
  text.innerHTML += "<br/>Equipe: "+teamNames[team]+" | Usuário: "+postUser+" | Data: "+Date(postDate)+"<br/>";
  text.innerHTML += "<a id='a/"+team+"/"+postKey+"' onclick='validate1(true, this.id)' href='#'>Aceitar</a> | ";
  text.innerHTML += "<a id='a/"+team+"/"+postKey+"' onclick='validate1(false, this.id)' href='#'>Recusar</a>";
  div.appendChild(text);
  div.id = "d/"+team+"/"+postKey;

  span.appendChild(div);
});

function validate1(status, id) {
  var data = id.split("/");
  var oldRef = firebase.database().ref('review/Activity 1/'+data[2]);
  var newRef = firebase.database().ref('approved/Activity 1/'+data[2]);
  var teamRef = firebase.database().ref('teams/'+data[1]);
  if (status == true) {
    moveFbRecord(oldRef, newRef); // Move activity location
    teamRef.transaction(function(tra) { // Update team punctuation
      if (tra) {
        if (tra.points) {
          tra.points += points[0];
        } else {
          tra.points += points[0];
          if (!tra.points) {
            tra.points += points[0];
          }
        }
      }
      return tra;
    })
  } else {
    oldRef.remove();
  }
  document.getElementById('d/'+data[1]+'/'+data[2]).style.display = "none";
}

function moveFbRecord(oldRef, newRef) {
     oldRef.once('value', function(snap)  {
          newRef.set( snap.val(), function(error) {
               if( !error ) {  oldRef.remove(); }
               else if( typeof(console) !== 'undefined' && console.error ) {  console.error(error); }
          });
     });
}

// Posts from activities with more pictures;

const listRef = firebase.storage().ref('review'); // Review path

for (var i = 0; i < 10; i++) { // To select the team folder
  listRefNow = listRef.child(i.toString());
  listRefNow.listAll().then(function(res) { // List all contents on team folder
    res.prefixes.forEach(function(folderRef) { // List folders on team folder
      console.log(folderRef);
      folderRef.listAll().then(function(res1) { // Open folder on team folder
        res1.items.forEach(function(itemRef) { // Do something to each item
          itemRef.getDownloadURL().then(function(url) {

            teamName = Number(url.charAt(82))-1;
            activity = getActivity(url);
            imageName = getImageName(itemRef);

            const activityHolder = document.getElementById('review'+activity);

            const listItem = document.createElement('div');
            const listItemDescription = document.createElement('p');
            const validate = document.createElement('div');
            const acceptButton = document.createElement('div');
            const rejectButton = document.createElement('div');

            listItem.style.backgroundColor = teamColors[teamName];
            listItem.style.backgroundImage = "url('"+url+"')";
            listItem.className = "imageToReview";
            listItem.id = teamName+"/"+activity+"/"+imageName;

            listItemDescription.innerHTML = "Equipe: " + teamNames[teamName];
            listItemDescription.className = "listItemDescription"

            validate.className = "validate";

            acceptButton.className = "acceptButton";
            acceptButton.id = teamName+"/"+activity+"/"+imageName;
            acceptButton.onclick = function() {accept(this.id)};

            rejectButton.className = "rejectButton";
            rejectButton.id = teamName+"/"+activity+"/"+imageName;
            rejectButton.onclick = function() {reject(this.id)};


            validate.appendChild(acceptButton);
            validate.appendChild(rejectButton);
            listItem.appendChild(listItemDescription);
            listItem.appendChild(validate);
            activityHolder.appendChild(listItem);
          }).catch(function(error) {
            console.log(error);
          });
        })
      })
    });
    // res.items.forEach(function(itemRef) {
    //   itemRef.getDownloadURL().then(function(url) {
    //     teamName = Number(url.charAt(82))-1;
    //     activity = Number(url.charAt(86));
    //
    //     const listItem = document.createElement('div');
    //     const listItemDescription = document.createElement('p');
    //     const validate = document.createElement('div');
    //     const acceptButton = document.createElement('div');
    //     const rejectButton = document.createElement('div');
    //
    //     listItem.style.backgroundColor = teamColors[teamName];
    //     listItem.style.backgroundImage = "url('"+url+"')";
    //     listItem.className = "imageToReview";
    //     listItem.id = teamName+"/"+activity;
    //
    //     listItemDescription.innerHTML = "Equipe: " + teamNames[teamName] + "<br/>Atividade: "+activity;
    //     listItemDescription.className = "listItemDescription"
    //
    //     validate.className = "validate";
    //
    //     acceptButton.className = "acceptButton";
    //     acceptButton.id = teamName+"/"+activity;
    //     acceptButton.onclick = function() {accept(this.id)};
    //
    //     rejectButton.className = "rejectButton";
    //     rejectButton.id = teamName+"/"+activity;
    //     rejectButton.onclick = function() {reject(this.id)};
    //
    //
    //     validate.appendChild(acceptButton);
    //     validate.appendChild(rejectButton);
    //     listItem.appendChild(listItemDescription);
    //     listItem.appendChild(validate);
    //     body.appendChild(listItem);
    //   }).catch(function(error) {
    //     console.log(error);
    //   });
    //   });
  }).catch(function(error) {
    console.log(error);
  });
}

function getActivity(url) {
  var charAt87 = Number(url.charAt(87)).toString();
  if (charAt87 != "NaN") {
    var answer = url.charAt(86) + url.charAt(87);
    return Number(answer);
  } else {
    return Number(url.charAt(86));
  }
}

function getImageName(itemRef) {
  var imageName = itemRef.toString().slice(-22);
  var split = imageName.split('/');
  if (split.length > 1) {
    imageName = split[split.length - 1];
  }
  return imageName;
}

// for (var i = 0; i < 10; i++) {
//
//   listRefNow = listRef.child(i.toString());
//   listRefNow.listAll().then(function(res) {
//     res.prefixes.forEach(function(folderRef) {
//       console.log(folderRef);
//     });
//     res.items.forEach(function(itemRef) {
//       itemRef.getDownloadURL().then(function(url) {
//         teamName = Number(url.charAt(82))-1;
//         activity = Number(url.charAt(86));
//
//         const listItem = document.createElement('div');
//         const listItemDescription = document.createElement('p');
//         const validate = document.createElement('div');
//         const acceptButton = document.createElement('div');
//         const rejectButton = document.createElement('div');
//
//         listItem.style.backgroundColor = teamColors[teamName];
//         listItem.style.backgroundImage = "url('"+url+"')";
//         listItem.className = "imageToReview";
//         listItem.id = teamName+"/"+activity;
//
//         listItemDescription.innerHTML = "Equipe: " + teamNames[teamName] + "<br/>Atividade: "+activity;
//         listItemDescription.className = "listItemDescription"
//
//         validate.className = "validate";
//
//         acceptButton.className = "acceptButton";
//         acceptButton.id = teamName+"/"+activity;
//         acceptButton.onclick = function() {accept(this.id)};
//
//         rejectButton.className = "rejectButton";
//         rejectButton.id = teamName+"/"+activity;
//         rejectButton.onclick = function() {reject(this.id)};
//
//
//         validate.appendChild(acceptButton);
//         validate.appendChild(rejectButton);
//         listItem.appendChild(listItemDescription);
//         listItem.appendChild(validate);
//         body.appendChild(listItem);
//       }).catch(function(error) {
//         console.log(error);
//       });
//     });
//   }).catch(function(error) {
//     console.log(error);
//   });
// }
//
function accept(id) {
  var teamActivity = id.split('/');  // [team/activity/filename]
  teamActivity[0]++; // Be careful, this might not be useful;
console.log(('review/'+teamActivity[0]+"/"+teamActivity[1]+"/"+teamActivity[2]));
  var storageRef = firebase.storage().ref('review/'+teamActivity[0]+"/"+teamActivity[1]+"/"+teamActivity[2]);
  storageRef.getDownloadURL().then(function(url) {
    var a = document.createElement('a');
    a.href = url;
    a.target = "_blank";
    a.download = "file";
    a.click();

    // TODO: File delete and downloadnot working yet
    setTimeout(deleteFile(teamActivity, storageRef), 5000);
    document.getElementById(id).style.display = "none";

    debugger;
    var teamRef = firebase.database().ref('teams/'+(Number(teamActivity[0])-1));
    teamRef.transaction(function(tra) { // Update team punctuation
      if (tra) {
        if (tra.points) {
          tra.points += points[(Number(teamActivity[1])-1)];
        } else {
          tra.points += points[(Number(teamActivity[1])-1)];
          if (!tra.points) {
            tra.points += points[(Number(teamActivity[1])-1)];
          }
        }
      }
      return tra;
    })
  }).catch(function(error) {
    console.log(error);
  });

  // The following code must be used only when one photo is submitted
  const onePicMode = [3,5,7,8,9,10,11,12,13,15,16,17,19,20,21,22,23,25];
  for (var i = 0; i < onePicMode.length; i++) {
    if (teamActivity[1] == onePicMode[i]) {
      firebase.database().ref('teams/'+(Number(teamActivity[0])-1)+"/tasks/"+teamActivity[1]).set({
        done: "Ok",
        time: Date.now()
      });
    }
  }
}

function reject(id) {
  var teamActivity = id.split('/');
  teamActivity[0]++;
  deleteFile(teamActivity);
  document.getElementById(id).style.display = "none";
}

function deleteFile(teamActivity, ref) {
  ref.delete().then(function() {
  console.log("File deleted successfully!");
  }).catch(function(error) {
    console.log("Uh-oh, an error occurred! Error:"+error);
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
