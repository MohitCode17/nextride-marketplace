import RideCard from "@/components/ride-card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Link from "next/link";
import React from "react";

const SavedCarsList = ({ initialData }) => {
  // NO SAVED CAR
  if (!initialData.data || initialData?.data.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-gray-50/20">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <Heart className="h-8 w-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium mb-2">No Saved Rides</h3>
        <p className="text-gray-500 mb-6 max-w-md">
          You haven't saved any rides yet. Browse our listings and click the
          heart icon to save rides for later.
        </p>
        <Button variant="default" className={"hover:bg-teal-500"} asChild>
          <Link href="/rides">Browse Rides</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {initialData?.data?.map((ride) => (
        <RideCard key={ride.id} ride={{ ...ride, wishlisted: true }} />
      ))}
    </div>
  );
};

export default SavedCarsList;
