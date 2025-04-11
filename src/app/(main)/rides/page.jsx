import { getRideFilters } from "@/actions/ride-listing";
import React from "react";
import RideFilters from "./_components/ride-filters";
import RideListings from "./_components/ride-listings";

export const metadata = {
  title: "Bikes & EVs | NextRide",
  description: "Browse and search for your dream bike or electric vehicle",
};

const RidesPage = async () => {
  const filterData = await getRideFilters();

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Browse Rides</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* FILTERS SECTION */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <RideFilters filters={filterData?.data} />
        </div>
        {/* Car Listings */}
        <div className="flex-1">
          <RideListings />
        </div>
      </div>
    </div>
  );
};

export default RidesPage;
