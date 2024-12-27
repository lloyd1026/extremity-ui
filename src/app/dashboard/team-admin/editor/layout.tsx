"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../../../components/articlecontentEditor/sidebar";
import Loading from "../../../frontend/components/loading/loading";
import { useAuth } from "../../../frontend/components/auth/authcontext";
import { SharedStateProvider } from "../../../../components/articlecontentEditor/sharedContext";
import PrivateRoute from "../../components/auth/privateroute";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const {auth} =  useAuth();

  useEffect(()=>{
    setIsMounted(true)
  },[auth])

  return (
    isMounted?
    (<PrivateRoute roles={[2]}>
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
    <SharedStateProvider>
      <aside className="w-1/6 bg-white border-r border-gray-200 shadow-md">
        <Sidebar/>
      </aside>
      {/* Main Content */}

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </SharedStateProvider>
    </div>
    </PrivateRoute>):(<Loading/>)
  );
}