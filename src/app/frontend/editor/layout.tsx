"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/articlecontentEditor/sidebar";
import PrivateRoute from "../components/auth/privateroute";
import Loading from "../components/loading/loading";
import { useAuth } from "../components/auth/authcontext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const {auth} =  useAuth();

  useEffect(()=>{
    setIsMounted(true)
  },[auth])

  return (
    isMounted?
    (<PrivateRoute roles={[1]}>
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-1/6 bg-white border-r border-gray-200 shadow-md">
        <Sidebar/>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
    </PrivateRoute>):(<Loading/>)
  );
}