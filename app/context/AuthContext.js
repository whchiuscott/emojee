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

//定義一個custom hook，這會讓我們較容易access the context state throughout our app
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userDataObj, setUserDataObj] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegister, setIsRegister] = useState(true);
  const [isLogin, setIsLogin] = useState(true);

  //Auth Handlers
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  function logout() {
    //set the following to default
    setUserDataObj(null);
    setCurrentUser(null);

    return signOut(auth);
  }

  //useEffect tracks events (kinda like EventListener)
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
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        let firebaseData = {};
        if (docSnap.exists()) {
          console.log("Found User Data");
          firebaseData = docSnap.data();
          console.log(firebaseData);
        }
        setUserDataObj(firebaseData);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    });

    //This ensures we clean up our app when it's not necessary
    return unsubscribe;
  }, []);

  //Value Obj: whatever inside this value object
  //is gonna be a globally accessible context state
  const value = {
    currentUser,
    userDataObj,
    setUserDataObj,
    signup,
    logout,
    login,
    loading,
    isRegister,
    setIsRegister,
    isLogin,
    setIsLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
