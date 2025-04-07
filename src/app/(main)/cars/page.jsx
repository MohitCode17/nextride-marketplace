import React from "react";

export const metadata = {
  title: "Cars | NextRide",
  description: "Browse and search for your dream car",
};

const CarsPage = () => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-6xl mb-4 gradient-title">Browse Cars</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Section */}
        <div className="w-full lg:w-80 flex-shrink-0"></div>

        {/* Car Listings */}
        <div className="flex-1"></div>
      </div>
    </div>
  );
};

export default CarsPage;
