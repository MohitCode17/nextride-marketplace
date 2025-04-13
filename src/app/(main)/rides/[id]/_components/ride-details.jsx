"use client";

import { toggleSavedRide } from "@/actions/ride-listing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useFetch from "@/hooks/use-fetch";
import { formatCurrency } from "@/lib/helpers";
import { useAuth } from "@clerk/nextjs";
import {
  Bike,
  Calendar,
  Car,
  Currency,
  Fuel,
  Gauge,
  Heart,
  LocateFixed,
  MessageSquare,
  Share2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import EmiCalculator from "./emi-calculator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";

const RideDetails = ({ ride, testDriveInfo }) => {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(ride.wishlisted);

  const {
    loading: savingRide,
    fn: toggleSavedRideFn,
    data: toggleResult,
    error: toggleError,
  } = useFetch(toggleSavedRide);

  // HANDLE SUCCESS
  useEffect(() => {
    if (toggleResult?.success) {
      setIsWishlisted(toggleResult.saved);
      toast.success(toggleResult.message);
    }
  }, [toggleResult]);

  // HANDLE ERRORS
  useEffect(() => {
    if (toggleError) {
      toast.error("Failed to update favorites");
    }
  }, [toggleError]);

  // HANDLE SAVE RIDE
  const handleSaveRide = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to save rides");
      router.push("/sign-in");
      return;
    }

    if (savingRide) return;

    await toggleSavedRideFn(ride.id);
  };

  // HANDLE SHARE RIDE
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${ride.year} ${ride.make} ${ride.model}`,
          text: `Check out this ${ride.year} ${ride.make} ${ride.model} on NextRide!`,
          url: window.location.href,
        })
        .catch((error) => {
          console.log("Error sharing", error);
          copyToClipboard();
        });
    } else {
      copyToClipboard();
    }
  };

  // COPY TO CLIPBOARD FUNCTION
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  // HANDLE BOOK TEST DRIVE
  const handleBookTestDrive = () => {
    if (!isSignedIn) {
      toast.error("Please sign in to book a test drive");
      router.push("/sign-in");
      return;
    }

    router.push(`/test-drive/${ride.id}`);
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* RIDE IMAGE GALLERY */}
        <div className="w-full lg:w-6/12">
          <div className="aspect-video rounded-lg overflow-hidden relative mb-4">
            {ride.images && ride.images.length > 0 ? (
              <Image
                src={ride.images[currentImageIndex]}
                alt={`${ride.year} ${ride.make} ${ride.model}`}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Bike className="h-24 w-24 text-gray-400" />
              </div>
            )}
          </div>

          {/* THUMBNAIL */}
          {ride.images && ride.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {ride.images.map((image, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer rounded-md h-20 w-24 flex-shrink-0 transition ${
                    index === currentImageIndex
                      ? "border-2 border-teal-600"
                      : "opacity-70 hover:opacity-100"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image
                    src={image}
                    alt={`${ride.year} ${ride.make} ${ride.model} - view ${
                      index + 1
                    }`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* SHARE & SAVE BUTTONS */}
          <div className="flex mt-4 gap-4">
            <Button
              variant="outline"
              className={`flex items-center gap-2 flex-1 ${
                isWishlisted ? "text-teal-500" : ""
              } hover:bg-teal-500`}
              onClick={handleSaveRide}
              disabled={savingRide}
            >
              <Heart
                className={`h-5 w-5 ${isWishlisted ? "fill-teal-500" : ""}`}
              />
              {isWishlisted ? "Saved" : "Save"}
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 flex-1 hover:bg-teal-500"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
              Share
            </Button>
          </div>
        </div>

        {/* RIDE DETAILS */}
        <div className="w-full lg:w-5/12">
          <div className="flex items-center justify-between">
            <Badge className="mb-2">{ride.bikeType}</Badge>
          </div>

          <h1 className="text-4xl font-bold mb-1">
            {ride.year} {ride.make} {ride.model}
          </h1>

          <div className="text-2xl font-bold text-teal-600">
            {formatCurrency(ride.price)}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
            <div className="flex items-center gap-2">
              <Gauge className="text-gray-500 h-5 w-5" />
              <span>{ride.mileage.toLocaleString()} miles</span>
            </div>
            <div className="flex items-center gap-2">
              <Fuel className="text-gray-500 h-5 w-5" />
              <span>{ride.fuelType}</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="text-gray-500 h-5 w-5" />
              <span>{ride.transmission}</span>
            </div>
          </div>

          {/* EMI CALCULATOR  */}
          <Dialog>
            <DialogTrigger className="w-full text-start">
              <Card className="pt-5">
                <CardContent>
                  <div className="flex items-center gap-2 text-lg font-medium mb-2">
                    <Currency className="h-5 w-5 text-teal-600" />
                    <h3>EMI Calculator</h3>
                  </div>
                  <div className="text-sm text-gray-600">
                    Estimated Monthly Payment:{" "}
                    <span className="font-bold text-gray-900">
                      {formatCurrency(ride.price / 60)}
                    </span>{" "}
                    over 60 months
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    *Calculation based on ₹0 down payment and a 7.75% annual
                    interest rate
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle></DialogTitle>
                <div className="pt-4">
                  <EmiCalculator price={ride.price} />
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          {/* REQUEST ABOUT RIDE */}
          <Card className="my-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-lg font-medium mb-2">
                <MessageSquare className="h-5 w-5 text-teal-600" />
                <h3>Need Assistance?</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Our team is here to provide you with all the information you
                need regarding this vehicle. Feel free to reach out with any
                questions.
              </p>
              <a href="mailto:help@nextride.in">
                <Button variant="outline" className="w-full hover:bg-teal-500">
                  Contact Support
                </Button>
              </a>
            </CardContent>
          </Card>

          {/* RIDE STATUS - AVAILABLE, SOLD, UNAVAILABLE */}
          {(ride.status === "SOLD" || ride.status === "UNAVAILABLE") && (
            <Alert variant="destructive">
              <AlertTitle className="capitalize">
                This vehicle is currently {ride.status.toLowerCase()}
              </AlertTitle>
              <AlertDescription>
                We appreciate your interest. Please check back later for
                availability or explore similar options.
              </AlertDescription>
            </Alert>
          )}

          {/* BOOK TEST DRIVE BUTTON */}
          {ride.status !== "SOLD" && ride.status !== "UNAVAILABLE" && (
            <Button
              className="w-full py-6 text-lg"
              onClick={handleBookTestDrive}
            >
              <Calendar className="mr-2 h-5 w-5" />
              {testDriveInfo.userTestDrive
                ? `Test Drive Scheduled: ${format(
                    new Date(testDriveInfo.userTestDrive.bookingDate),
                    "EEEE, MMMM d, yyyy"
                  )}`
                : "Schedule a Test Drive"}
            </Button>
          )}
        </div>
      </div>

      {/* DETAILS AND FEATURES SECTION */}
      <div className="mt-12 p-6 bg-white rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Description Section */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Overview
            </h3>
            <p className="whitespace-pre-line text-gray-700 leading-relaxed">
              {ride.description}
            </p>
          </div>

          {/* Features Section */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Key Features
            </h3>
            <ul className="grid grid-cols-1 gap-3 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 bg-teal-600 rounded-full" />
                {ride.transmission} Transmission
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 bg-teal-600 rounded-full" />
                {ride.fuelType} Engine
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 bg-teal-600 rounded-full" />
                {ride.bikeType} Style
              </li>
              {ride.seats && (
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-teal-600 rounded-full" />
                  Seating Capacity: {ride.seats}
                </li>
              )}
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 bg-teal-600 rounded-full" />
                Exterior Color: {ride.color}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* SPECIFICATIONS SECTION */}
      <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Specifications
        </h2>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
            {/* Row - Make */}
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500">Make</span>
              <span className="font-medium text-gray-800">{ride.make}</span>
            </div>

            {/* Row - Model */}
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500">Model</span>
              <span className="font-medium text-gray-800">{ride.model}</span>
            </div>

            {/* Row - Year */}
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500">Year</span>
              <span className="font-medium text-gray-800">{ride.year}</span>
            </div>

            {/* Row - Type */}
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500">Type</span>
              <span className="font-medium text-gray-800">{ride.bikeType}</span>
            </div>

            {/* Row - Fuel Type */}
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500">Fuel Type</span>
              <span className="font-medium text-gray-800">{ride.fuelType}</span>
            </div>

            {/* Row - Transmission */}
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500">Transmission</span>
              <span className="font-medium text-gray-800">
                {ride.transmission}
              </span>
            </div>

            {/* Row - Mileage */}
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500">Mileage</span>
              <span className="font-medium text-gray-800">
                {ride.mileage.toLocaleString()} miles
              </span>
            </div>

            {/* Row - Color */}
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500">Color</span>
              <span className="font-medium text-gray-800">{ride.color}</span>
            </div>

            {/* Row - Seats */}
            {ride.seats && (
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-500">Seating Capacity</span>
                <span className="font-medium text-gray-800">{ride.seats}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DEALERSHIP LOCATION SECTION */}
      <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Dealership Location
        </h2>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex flex-col md:flex-row gap-8 justify-between">
            {/* Dealership Name and Address */}
            <div className="flex items-start gap-4 md:w-2/3">
              <LocateFixed className="h-5 w-5 text-teal-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-semibold text-gray-800">
                  NextRide Motors Pvt Limited
                </h4>
                <p className="text-gray-600 mt-1">
                  {testDriveInfo.dealership?.address || "Not Available"}
                </p>
                <p className="text-gray-600 mt-1">
                  <span className="font-medium text-gray-700">Phone:</span>{" "}
                  {testDriveInfo.dealership?.phone || "Not Available"}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium text-gray-700">Email:</span>{" "}
                  {testDriveInfo.dealership?.email || "Not Available"}
                </p>
              </div>
            </div>

            {/* Working Hours */}
            <div className="md:w-1/2 lg:w-1/3">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Working Hours
              </h4>
              <div className="space-y-2">
                {testDriveInfo.dealership?.workingHours
                  ? testDriveInfo.dealership.workingHours
                      .sort((a, b) => {
                        const days = [
                          "MONDAY",
                          "TUESDAY",
                          "WEDNESDAY",
                          "THURSDAY",
                          "FRIDAY",
                          "SATURDAY",
                          "SUNDAY",
                        ];
                        return (
                          days.indexOf(a.dayOfWeek) - days.indexOf(b.dayOfWeek)
                        );
                      })
                      .map((day) => (
                        <div
                          key={day.dayOfWeek}
                          className="flex justify-between text-sm text-gray-700"
                        >
                          <span className="text-gray-600">
                            {day.dayOfWeek.charAt(0) +
                              day.dayOfWeek.slice(1).toLowerCase()}
                          </span>
                          <span>
                            {day.isOpen
                              ? `${day.openTime} - ${day.closeTime}`
                              : "Closed"}
                          </span>
                        </div>
                      ))
                  : // Fallback hours
                    [
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((day, index) => (
                      <div
                        key={day}
                        className="flex justify-between text-sm text-gray-700"
                      >
                        <span className="text-gray-600">{day}</span>
                        <span>
                          {index < 5
                            ? "9:00 - 18:00"
                            : index === 5
                            ? "10:00 - 16:00"
                            : "Closed"}
                        </span>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideDetails;
