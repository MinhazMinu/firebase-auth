import React, { useState } from "react";

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
    email: "",
    isValid: false
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

  /**
   * signout handle
   */
  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(res => {
        const signOutUser = {
          isSignedIn: false,
          name: "",
          photo: "",
          email: "",
          password: ""
        };
        setUser(signOutUser);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      });
  };
  /**
   * 888888888888888888888888888888888888888888888888888
   */
  const is_valid_email = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  const hasNumber = myString => /\d/.test(myString);

  const handleChange = e => {
    const newUserInfo = { ...user, [e.target.name]: e.target.value };
    /**
     * email password validation
     */
    let isValid = true;
    if (e.target.name === "email") {
      isValid = is_valid_email(e.target.value);
    }
    if (e.target.name === "password") {
      isValid = e.target.value.length > 8 && hasNumber(e.target.value);
    }
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  };
  const createAccount = e => {
    if (user.isValid) {
      console.log("valid");
    } else {
      console.log("not valid");
    }
    e.preventDefault();
  };
  return (
    <div className="App">
      {user.isSignedIn ? (
        <button onClick={handleSignOut}>Sign Out</button>
      ) : (
        <button onClick={handleSignIn}>Sign In</button>
      )}
      {user.isSignedIn && (
        <div>
          {" "}
          <p>Welcome {user.name}!</p>
          <p>Email : {user.email}</p>
          <img src={user.photo} alt="pic" />
        </div>
      )}
      <hr />
      <hr />
      <hr />
      <form onSubmit={createAccount}>
        <h1> Auth Yourself</h1>
        <input
          type="text"
          name="email"
          placeholder="email"
          onBlur={handleChange}
          required
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="password"
          onBlur={handleChange}
          required
        />
        <br />
        {/* <button onClick={createAccount}>Create Account</button> */}
        <input type="submit" value="Create Account" />
      </form>
    </div>
  );
}

export default App;
