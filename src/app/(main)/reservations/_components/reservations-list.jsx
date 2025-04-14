"use client";

import { cancelTestDrive } from "@/actions/test-drive";
import TestDriveCard from "@/components/test-drive-card";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { Calendar } from "lucide-react";
import Link from "next/link";
import React from "react";

const ReservationsList = ({ initialData }) => {
  // HANDLE CANCEL BOOKING
  const {
    loading: cancelling,
    fn: cancelBookingFn,
    error: cancelError,
  } = useFetch(cancelTestDrive);

  // HANDLE CACENL BOOKING
  const handleCancelBooking = async (bookingId) => {
    await cancelBookingFn(bookingId);
  };

  // UPCOMING BOOKINGS
  const upcomingBookings = initialData?.filter((booking) =>
    ["PENDING", "CONFIRMED"].includes(booking.status)
  );

  // COMPLETE BOOKING
  const pastBookings = initialData?.filter((booking) =>
    ["COMPLETED", "CANCELLED", "NO_SHOW"].includes(booking.status)
  );

  // IF NO TEST RIDE BOOKING
  if (initialData?.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-gray-50">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <Calendar className="h-8 w-8 text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Reservations Yet</h3>
        <p className="text-gray-600 mb-6 max-w-md">
          You haven’t booked a test drive yet. Explore our collection of rides
          and schedule a drive at your convenience.
        </p>
        <Button
          variant="default"
          className="hover:bg-teal-500 transition"
          asChild
        >
          <Link href="/rides">Find Your Ride</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* UPCOMING BOOKINGS */}
      <div>
        <h2 className="text-xl font-medium mb-4">Upcoming Test Drives</h2>
        {upcomingBookings.length === 0 ? (
          <p className="text-gray-500 italic">No upcoming test drives.</p>
        ) : (
          <div className="space-y-3">
            {upcomingBookings.map((booking) => (
              <TestDriveCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancelBooking}
                isCancelling={cancelling}
                showActions
                cancelError={cancelError}
                viewMode="list"
              />
            ))}
          </div>
        )}
      </div>

      {/* COMPLETE BOOKING */}
      {pastBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-medium mb-4">Past Test Drives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastBookings.map((booking) => (
              <TestDriveCard
                key={booking.id}
                booking={booking}
                showActions={false}
                isPast
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationsList;
