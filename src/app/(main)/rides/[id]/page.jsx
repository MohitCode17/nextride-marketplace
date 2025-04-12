import { getRideById } from "@/actions/ride-listing";
import { notFound } from "next/navigation";
import React from "react";
import RideDetails from "./_components/ride-details";

export async function generateMetaData({ params }) {
  const { id } = await params;
  const result = await getRideById(id);

  if (!result.success) {
    return {
      title: "Ride Not Found | NextRide",
      description: "The requested ride could not be found",
    };
  }

  const ride = result.data;

  return {
    title: `${ride.year} ${ride.make} ${ride.model} | NextRide`,
    description: ride.description.substring(0, 160),
    openGraph: {
      images: ride.images?.[0] ? [ride.images[0]] : [],
    },
  };
}

const RideDetailsPage = async ({ params }) => {
  // FETCH RIDE DETAILS
  const { id } = await params;
  const result = await getRideById(id);

  // IF RIDE NOT FOUND, SHOW 404
  if (!result.success) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <RideDetails
        ride={result.data}
        testDriveInfo={result.data.testDriveInfo}
      />
    </div>
  );
};

export default RideDetailsPage;
