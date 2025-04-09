import React from "react";
import RideList from "./_components/ride-list";

export const metadata = {
  title: "Rides | NextRide Admin",
  description: "Manage bikes, scooters, and EVs in your marketplace",
};

const RidesPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Your Rides</h1>
      <RideList />
    </div>
  );
};

export default RidesPage;
