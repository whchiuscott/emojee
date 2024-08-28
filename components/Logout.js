"use client";
import React from "react";
import Button from "./Button";
import { useAuth } from "@/app/context/AuthContext";

export default function Logout() {
  const { logout, currentUser, loading } = useAuth();

  if (!currentUser) {
    return null;
  }

  if (loading) {
    return null;
  }

  return <Button text="Logout" clickHandler={logout} />;
}
