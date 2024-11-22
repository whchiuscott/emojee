"use client";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import React, { useState, useContext, useEffect } from "react";

const AuthContext = React.createContext();

//define a custom hook, easier access to the context state throughout our app
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); //current user obj from firebase
  const [userDataObj, setUserDataObj] = useState(null); //storing user data from firestore in an obj
  const [loading, setLoading] = useState(true);

  //Auth Handlers
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  function logout() {
    setUserDataObj(null);
    setCurrentUser(null);

    return signOut(auth);
  }

  useEffect(() => {
    //This will listen for the auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        //Set the user to our local context state
        setLoading(true);
        setCurrentUser(user);
        if (!user) {
          console.log("No User Found");
          return;
        }

        //If user exists, fetch data from firebase database
        console.log("Fetching User Data");
        const docRef = doc(db, "users", user.uid); //creating a reference to specific doc in firestore
        const docSnap = await getDoc(docRef); //getting specific data (snapshot) from firestore
        let firebaseData = {}; //data from firestore to be stored here
        //checking if doc exists in firestore
        if (docSnap.exists()) {
          console.log("Found User Data");
          firebaseData = docSnap.data(); //getting data from doc
          console.log(firebaseData);
        }
        setUserDataObj(firebaseData);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    });

    //This cleans up our app when it's not necessary
    return unsubscribe;
  }, []);

  //value obj contains global states
  const value = {
    currentUser,
    userDataObj,
    setUserDataObj,
    signup,
    logout,
    login,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
