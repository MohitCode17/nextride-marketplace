import React from "react";
import { auth } from "@clerk/nextjs/server";
import { getSavedRides } from "@/actions/ride-listing";
import SavedCarsList from "./_components/saved-cars-list";

export const metadata = {
  title: "Saved Rides | NextRide",
  description: "View your saved rides and favorites",
};

const SavedRidesPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in?redirect=/saved-rides");
  }

  // FETCHED THE SAVE RIDES
  const savedRidesResult = await getSavedRides();

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Saved Rides</h1>
      <SavedCarsList initialData={savedRidesResult} />
    </div>
  );
};

export default SavedRidesPage;
