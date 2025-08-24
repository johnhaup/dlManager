import DownloadManager from "@/components/DownloadManager";
import { Login } from "@/components/Login";
import { useGlobalStoreItem } from "@/hooks/useGlobalStore";
import React from "react";

export default function Home() {
  const [isLoggedIn] = useGlobalStoreItem("isLoggedIn");

  if (!isLoggedIn) {
    return <Login />;
  }

  return <DownloadManager />;
}
