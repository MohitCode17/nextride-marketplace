"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info } from "lucide-react";
import React, { useState } from "react";
import DashboardOverViewTab from "./dashboard-overview-tab";
import DashboardTestDriveTab from "./dashboard-test-drive-tab";

const Dashboard = ({ initialData }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { rides, testDrives } = initialData.data;

  // SHOW ERROR IF DATA FETCH FAILED
  if (!initialData || !initialData.success) {
    return (
      <Alert
        variant="destructive"
        className="rounded-2xl border-none shadow-lg animate-in fade-in duration-300"
      >
        <Info className="h-5 w-5" />
        <AlertTitle className="text-lg font-semibold">Error</AlertTitle>
        <AlertDescription className="mt-2">
          {initialData?.error || "Failed to load dashboard data"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className={"bg-teal-100"}>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="test-drives">Test Drives</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB*/}
        <DashboardOverViewTab rides={rides} testDrives={testDrives} />

        {/* TEST DRIVE TAB */}
        <DashboardTestDriveTab testDrives={testDrives} />
      </Tabs>
    </div>
  );
};

export default Dashboard;
