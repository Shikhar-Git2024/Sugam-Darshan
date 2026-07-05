import React from "react";
import { Outlet } from "react-router-dom";
import DashboardNavbar from "../devotee/DashboardNavbar";

export default function DevoteeLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-orange-100 flex">
      {/* Permanent Left Navigation (30% Space) */}
      <DashboardNavbar />

      {/* Dynamic Right Workspace Canvas (70% Space) */}
      <div className="flex-1 min-w-0 pl-60 flex flex-col">
        <Outlet /> 
      </div>
    </div>
  );
}