import React from "react";
import TestDrivesList from "./_components/test-drives-list";

export const metadata = {
  title: "Test Drives | NextRide Admin",
  description: "Manage test drive bookings",
};

const TestDrivesPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Test Drive Management</h1>
      <TestDrivesList />
    </div>
  );
};

export default TestDrivesPage;
