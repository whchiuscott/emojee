"use client";

import React, { useState, useEffect } from "react";
import { Fugaz_One } from "next/font/google";
import Button from "@/components/Button";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ["400"] });

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authenticating, setAuthenticating] = useState(false);
  const { login, currentUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    //checking if current user exists
    if (currentUser) {
      router.push("/dashboard");
    }
  }, [currentUser, router]); //router rarely changes, but still counts as external variable (from Next.js useRouter)

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  async function handleSubmit() {
    if (!password && !email) {
      setErrorMessage("Email and password are required!");
      return;
    }
    if (!email) {
      setErrorMessage("Email is required!");
      return;
    }
    if (!validateEmail(email)) {
      setErrorMessage("Email format is not valid!");
      return;
    }
    if (!password) {
      setErrorMessage("Password is required!");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password should be at least 6 digits!");
      return;
    }

    setAuthenticating(true);
    setErrorMessage("");
    setIsLogin(true);

    try {
      if (isLogin) {
        console.log("Logging in existing user");
        await login(email, password); //logining in via firebase
        router.push("/dashboard"); //then go to dashboard
      }
    } catch (error) {
      console.log(error.message);
      setErrorMessage("Fail to login: " + error.message);
    } finally {
      setAuthenticating(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      handleSubmit();
    }
  }

  return (
    <div className="flex flex-col flex-1 justify-center items-center gap-4">
      <h3 className={"text-4xl sm:text-5xl md:text-6xl " + fugaz.className}>
        Log in
      </h3>
      <p>You&#39;re one step away!</p>
      {/* conditional redering error message */}
      {errorMessage && (
        <p className="text-red-500 max-w-[400px] w-full text-center">
          {errorMessage}
        </p>
      )}
      <input
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        className="max-w-[400px] w-full mx-auto px-3 duration-200 hover:border-blue-600 focus:border-blue-600 py-2 sm:py-3 border border-solid border-blue-400 rounded-full outline-none"
        placeholder="Email"
      />
      <input
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        className="max-w-[400px] w-full mx-auto px-3 duration-200 hover:border-blue-600 focus:border-blue-600 py-2 sm:py-3 border border-solid border-blue-400 rounded-full outline-none"
        placeholder="Password"
        type="password"
      />
      <div className="max-w-[400px] w-full mx-auto">
        <Button
          clickHandler={handleSubmit}
          text={authenticating ? "Submitting" : "Submit"}
          full
        />
      </div>
      <p className="text-center">
        Don&#39;t have an account?{" "}
        <Link
          href="./signup"
          onClick={() => {
            setIsLogin(!isLogin);
          }}
          className="text-blue-500 hover:text-blue-800"
        >
          Sign up
        </Link>
        .
      </p>
    </div>
  );
}
