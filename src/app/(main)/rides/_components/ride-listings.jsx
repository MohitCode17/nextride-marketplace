"use client";

import { getRides } from "@/actions/ride-listing";
import useFetch from "@/hooks/use-fetch";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import RideListingLoading from "./ride-listing-loading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RideCard from "@/components/ride-card";
import RidePagination from "./ride-pagination";

const RideListings = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const limit = 6;

  // EXTRACT FILTER VALUES FROM SEARCH PARAMS
  const search = searchParams.get("search") || "";
  const make = searchParams.get("make") || "";
  const bikeType = searchParams.get("bikeType") || "";
  const fuelType = searchParams.get("fuelType") || "";
  const transmission = searchParams.get("transmission") || "";
  const minPrice = searchParams.get("minPrice") || 0;
  const maxPrice = searchParams.get("maxPrice") || Number.MAX_SAFE_INTEGER;
  const sortBy = searchParams.get("sortBy") || "newest";
  const page = parseInt(searchParams.get("page") || "1");

  // FETCH RIDES FROM DB
  const { loading, fn: fetchRides, data: result, error } = useFetch(getRides);

  // FETCH RIDES WHEN FILTERS CHANGE
  useEffect(() => {
    fetchRides({
      search,
      make,
      bikeType,
      fuelType,
      transmission,
      minPrice,
      maxPrice,
      sortBy,
      page,
      limit,
    });
  }, [
    search,
    make,
    bikeType,
    fuelType,
    transmission,
    minPrice,
    maxPrice,
    sortBy,
    page,
  ]);

  // SHOW LOADING
  if (loading && !result) {
    return <RideListingLoading />;
  }

  // HANDLE ERRORS
  if (error || (result && !result.success)) {
    return (
      <Alert variant="destructive">
        <Info className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load rides. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  // IF NO RESULT, RETURN EMPTY PLACEHOLDER
  if (!result || !result.data) {
    return null;
  }

  const { data: rides, pagination } = result;

  // IF NO RESULT FOUND
  if (rides.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-gray-50">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <Info className="h-8 w-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium mb-2">No rides found</h3>
        <p className="text-gray-500 mb-6 max-w-md">
          We couldn't find any rides matching your search criteria. Try
          adjusting your filters or search term.
        </p>
        <Button className={"hover:bg-teal-500"} variant="outline" asChild>
          <Link href="/rides">Clear all filters</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2">
        <p>
          Showing
          <span>
            {(page - 1) * limit + 1}-{Math.min(page * limit, pagination.total)}{" "}
            of <span className="font-medium">{pagination.total}</span> rides
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rides.map((ride) => (
          <RideCard key={ride.id} ride={ride} />
        ))}
      </div>

      {/* PAGINATION */}
      <RidePagination pagination={pagination} page={page} />
    </div>
  );
};

export default RideListings;
