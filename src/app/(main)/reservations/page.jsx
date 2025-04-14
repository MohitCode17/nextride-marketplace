import { getUserTestDrives } from "@/actions/test-drive";
import { auth } from "@clerk/nextjs/server";
import React from "react";
import ReservationsList from "./_components/reservations-list";

export const metadata = {
  title: "My Reservations | NextRide",
  description: "View and manage your test drive bookings with ease.",
};

export default async function ReservationsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in?redirect=/reservations");
  }

  // Fetch reservations on the server
  const userReservations = await getUserTestDrives();

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Your Test Drive Reservations</h1>
      <ReservationsList initialData={userReservations?.data} />
    </div>
  );
}
