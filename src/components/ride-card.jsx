"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { CarIcon, Heart, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { formatCurrency } from "@/lib/helpers";
import { useAuth } from "@clerk/nextjs";
import useFetch from "@/hooks/use-fetch";
import { toggleSavedRide } from "@/actions/ride-listing";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const RideCard = ({ ride }) => {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [isSaved, setIsSaved] = useState(ride.wishlisted);

  const {
    loading: isToggling,
    fn: toggleSavedRideFn,
    data: toggleResult,
    error: toggleError,
  } = useFetch(toggleSavedRide);

  // HANDLE TOGGLE RESULT
  useEffect(() => {
    if (toggleResult?.success && toggleResult.saved !== isSaved) {
      setIsSaved(toggleResult.saved);
      toast.success(toggleResult.message);
    }
  }, [toggleResult, isSaved]);

  // HANDLE ERROR WITH USEEFFECT
  useEffect(() => {
    if (toggleError) {
      toast.error("Failed to update favorites");
    }
  }, [toggleError]);

  // HANDLE SAVE/UNSAVE CAR
  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      toast.error("Please sign in to save your rides");
      router.push("/sign-in");
      return;
    }
    if (isToggling) return;
    await toggleSavedRideFn(ride.id);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition group">
      <div className="relative h-48">
        {ride.images && ride.images.length > 0 ? (
          <div className="relative w-full h-full">
            <Image
              src={ride.images[0]}
              alt={`${ride.make} ${ride.model}`}
              fill
              className="object-cover group-hover:scale-105 transition duration-300"
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <CarIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}

        <Button
          variant={"ghost"}
          className={`absolute top-2 right-2 bg-white/90 rounded-full p-1.5 hover:bg-accent-foreground ${
            isSaved
              ? "text-lime-500 hover:text-lime-700"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={handleToggleSave}
          disabled={isToggling}
        >
          {isToggling ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Heart className={isSaved ? "fill-current" : ""} size={20} />
          )}
        </Button>
      </div>

      <CardContent className={"p-4"}>
        <div className="flex flex-col mb-2">
          <h3 className="text-lg font-bold line-clamp-1">
            {ride.make} {ride.model}
          </h3>

          <span className="text-xl font-bold text-lime-600">
            {formatCurrency(ride.price)}
          </span>
        </div>

        <div className="text-gray-600 text-sm mb-2 flex items-center">
          <span>{ride.year}</span>
          <span className="mx-2">•</span>
          <span>{ride.transmission}</span>
          <span className="mx-2">•</span>
          <span>{ride.fuelType}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          <Badge variant={"outline"} className={"bg-lime-50 text-lime-900"}>
            {ride.bikeType}
          </Badge>
          <Badge variant={"outline"} className={"bg-lime-50 text-lime-900"}>
            {ride.mileage.toLocaleString()}kmpl
          </Badge>
          <Badge variant={"outline"} className={"bg-lime-50 text-lime-900"}>
            {ride.color}
          </Badge>
        </div>

        <div className="flex justify-between">
          <Button
            className={"flex-1"}
            onClick={() => {
              router.push(`/rides/${ride.id}`);
            }}
          >
            View Ride
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RideCard;
