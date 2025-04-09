import React from "react";

export const metadata = {
  title: "Rides | NextRide",
  description: "Browse and search for your dream bike, scooter, EV, or car",
};

const RidesPage = () => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl mb-4">Browse Rides</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Section */}
        <div className="w-full lg:w-80 flex-shrink-0"></div>
        {/* Car Listings */}
        <div className="flex-1"></div>
      </div>
    </div>
  );
};

export default RidesPage;
