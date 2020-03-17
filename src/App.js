import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase.config";
firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: "",
    photo: "",
    email: ""
  });
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(res => {
        const { displayName, photoURL, email } = res.user;
        const signInUser = {
          isSignedIn: true,
          name: displayName,
          photo: photoURL,
          email: email
        };
        setUser(signInUser);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      });
  };
  return (
    <div className="App">
      <button onClick={handleSignIn}>Sign In</button>
      {user.isSignedIn && (
        <div>
          {" "}
          <p>Welcome {user.name}!</p>
          <p>Email : {user.email}</p>
          <img src={user.photo} alt="pic" />
        </div>
      )}
    </div>
  );
}

export default App;
