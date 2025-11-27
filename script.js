// Your Firebase config here:
const firebaseConfig = {
  apiKey: "AIzaSyAvfc6C-myIPDsTk7dxQmMpWG-0D6QLzhQ",
  authDomain: "habitchain-6c319.firebaseapp.com",
  projectId: "habitchain-6c319",
  storageBucket: "habitchain-6c319.firebasestorage.app",
  messagingSenderId: "468472463318",
  appId: "1:468472463318:web:f137e75d2f02b1ef936e77"
};
};

// Initialize
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();


// Register
function register() {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    auth.createUserWithEmailAndPassword(email, pass)
    .then(() => alert("Registered"))
    .catch(e => alert(e.message));
}


// Login
function login() {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, pass)
    .then(() => {
        window.location.href = "dashboard.html";
    })
    .catch(e => alert(e.message));
}


// Dashboard logic
window.onload = function() {
    if (window.location.pathname.includes("dashboard.html")) {
        auth.onAuthStateChanged(user => {
            if (!user) return;

            document.getElementById("welcome").textContent = "Welcome " + user.email;
            loadHabits(user.uid);
        });
    }
};


// Add a habit
function addHabit() {
    const habit = document.getElementById("habitInput").value;
    const user = auth.currentUser;

    if (!habit || !user) return;

    db.collection("users").doc(user.uid).collection("habits")
      .add({ name: habit })
      .then(() => {
          document.getElementById("habitInput").value = "";
          loadHabits(user.uid);
      });
}


// Load habits
function loadHabits(uid) {
    const list = document.getElementById("habitList");
    list.innerHTML = "";

    db.collection("users").doc(uid).collection("habits")
      .get()
      .then(snapshot => {
          snapshot.forEach(doc => {
              const li = document.createElement("li");
              li.textContent = doc.data().name;
              list.appendChild(li);
          });
      });
}
