import React from "react";
import AddRideForm from "./_components/add-ride-form";

export const metadata = {
  title: "Add New Ride | NextRide Admin",
  description: "Add a new bike, scooter, or EV to your marketplace",
};

const AddRidePage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add Your New Rides</h1>
      <AddRideForm />
    </div>
  );
};

export default AddRidePage;
