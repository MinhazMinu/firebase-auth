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
          error: "",
          password: "",
          existingUser: false
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
  const switchForm = e => {
    const createdUser = { ...user };

    createdUser.error = "";
    createdUser.existingUser = e.target.checked;
    setUser(createdUser);
  };

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
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = "";
          setUser(createdUser);
          console.log(res);
        })

        .catch(function(err) {
          // Handle Errors here.
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser);
          console.log(err);
        });
    } else {
      console.log("not valid");
    }
    e.preventDefault();
    e.target.reset();
  };

  const signInUser = e => {
    e.preventDefault();
    e.target.reset();
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
      <label htmlFor="switch">
        <input
          type="checkbox"
          name="switchFrom"
          id="switch"
          onChange={switchForm}
        />{" "}
        New User?
      </label>
      <form
        style={{ display: user.existingUser ? "none" : "block" }}
        onSubmit={signInUser}
      >
        <br />
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
        <input type="submit" value="Sign In" />
      </form>
      {/* /** * ========================== */}
      <form
        style={{ display: user.existingUser ? "block" : "none" }}
        onSubmit={createAccount}
      >
        <h1> Auth Yourself</h1>
        <input
          type="text"
          name="name"
          placeholder="name"
          onBlur={handleChange}
          required
        />{" "}
        <br />
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
      {user.error && (
        <p style={{ color: "red", fontSize: "26px" }}>{user.error}</p>
      )}
    </div>
  );
}

export default App;
