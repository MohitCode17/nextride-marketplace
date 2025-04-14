"use server";

import { serialzeRideData } from "@/lib/helpers";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// BOOK A TEST DRIVE FOR A RIDE
export async function bookTestDrive({
  rideId,
  bookingDate,
  startTime,
  endTime,
  notes,
}) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("You must be logged in to book a test drive");

    // FIND USER IN OUT DATABASE
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found in database");

    // CHECK IF RIDE EXISTS & AVAILABLE
    const ride = await db.ride.findUnique({
      where: { id: rideId, status: "AVAILABLE" },
    });

    if (!ride) throw new Error("Car not available for test drive");

    // CHECK IF SLOT IS ALREADY BOOKED
    const existingBooking = await db.testDriveBooking.findFirst({
      where: {
        rideId,
        bookingDate: new Date(bookingDate),
        startTime,
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    });

    if (existingBooking) {
      throw new Error(
        "This time slot is already booked. Please select another time."
      );
    }

    // CREATE THE BOOKING
    const booking = await db.testDriveBooking.create({
      data: {
        rideId,
        userId: user.id,
        bookingDate: new Date(bookingDate),
        startTime,
        endTime,
        notes: notes || null,
        status: "PENDING",
      },
    });

    revalidatePath(`/test-drive/${rideId}`);
    revalidatePath(`/rides/${rideId}`);

    return {
      success: true,
      data: booking,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to book test drive",
    };
  }
}

// GET USER'S TEST DRIVE BOOKING
export async function getUserTestDrives() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // GET USER'S BOOKING
    const bookings = await db.testDriveBooking.findMany({
      where: { userId: user.id },
      include: {
        ride: true,
      },
      orderBy: { bookingDate: "desc" },
    });

    // FORMAT THE BOOKINGS
    const formatBookings = bookings.map((booking) => ({
      id: booking.id,
      rideId: booking.rideId,
      ride: serialzeRideData(booking.ride),
      bookingDate: booking.bookingDate.toISOString(),
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
      notes: booking.notes,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    }));

    return {
      success: true,
      data: formatBookings,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// CANCEL A BOOKING
export async function cancelTestDrive(bookingId) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // GET USER'S BOOKING
    const booking = await db.testDriveBooking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return {
        success: false,
        error: "Booking not found",
      };
    }

    // CHECK IF USER OWNS THIS BOOKING
    if (booking.userId !== user.id && user.role !== "ADMIN") {
      return {
        success: false,
        error: "Unauthorized to cancel this booking",
      };
    }

    // CHECK IF BOOKING CAN BE CANCELLED
    if (booking.status === "CANCELLED") {
      return {
        success: false,
        error: "Booking is already cancelled",
      };
    }

    if (booking.status === "COMPLETED") {
      return {
        success: false,
        error: "Cannot cancel a completed booking",
      };
    }

    await db.testDriveBooking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });

    revalidatePath("/reservations");
    revalidatePath("/admin/test-drives");

    return {
      success: true,
      message: "Test drive cancelled successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
