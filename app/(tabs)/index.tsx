import DownloadManager from "@/components/DownloadManager";
import { Login } from "@/components/Login";
import { useGlobalStoreItem } from "@/hooks/useGlobalStore";
import React from "react";

export default function Home() {
  const [cookie] = useGlobalStoreItem("cookie");

  if (!cookie) {
    return <Login />;
  }

  return <DownloadManager />;
}
