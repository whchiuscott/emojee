"use client";
import React from "react";
import Button from "./Button";
import { useAuth } from "@/app/context/AuthContext";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Logout() {
  const { logout, currentUser, loading } = useAuth();
  const pathname = usePathname();

  if (!currentUser) {
    return null;
  }

  if (loading) {
    return null;
  }

  if (pathname === "/") {
    return (
      <Link href="/dashboard ">
        <Button text="Go To Dashboard" />
      </Link>
    );
  }

  return <Button text="Logout" clickHandler={logout} />;
}
