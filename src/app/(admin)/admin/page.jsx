import React from "react";
import Dashboard from "./_components/dashboard";
import { getDashboardData } from "@/actions/admin";

export const metadata = {
  title: "Dashboard | NextRide Admin",
  description: "Admin dashboard for NextRide bike marketplace",
};

export default async function AdminDashboardPage() {
  // FETCH DASHBOARD DATA
  const dashboardData = await getDashboardData();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <Dashboard initialData={dashboardData} />
    </div>
  );
}
