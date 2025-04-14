"use server";

import { serialzeRideData } from "@/lib/helpers";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getAdmin() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user || user.role !== "ADMIN") {
    return { authorized: false, reasor: "not-admin" };
  }

  return { authorized: true, user };
}

// GET ALL TEST DRIVES WITH FILTERS
export async function getAdminTestDrives({ search = "", status = "" }) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user || user.role !== "ADMIN") {
      throw new Error("Unauthorized access");
    }

    let where = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        {
          ride: {
            OR: [
              { make: { contains: search, mode: "insensitive" } },
              { model: { contains: search, mode: "insensitive" } },
            ],
          },
        },
        {
          user: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          },
        },
      ];
    }

    const bookings = await db.testDriveBooking.findMany({
      where,
      include: {
        ride: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
            phone: true,
          },
        },
      },
      orderBy: [{ bookingDate: "desc" }, { startTime: "asc" }],
    });

    const formattedBookings = bookings.map((booking) => ({
      id: booking.id,
      rideId: booking.rideId,
      ride: serialzeRideData(booking.ride),
      userId: booking.userId,
      user: booking.user,
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
      data: formattedBookings,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// UPDATE TEST DRIVE STATUS
export async function updateTestDriveStatus(bookingId, newStatus) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user || user.role !== "ADMIN") {
      throw new Error("Unauthorized access");
    }

    const booking = await db.testDriveBooking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    const validStatuses = [
      "PENDING",
      "CONFIRMED",
      "COMPLETED",
      "CANCELLED",
      "NO_SHOW",
    ];

    if (!validStatuses.includes(newStatus)) {
      return {
        success: false,
        error: "Invalid status",
      };
    }

    await db.testDriveBooking.update({
      where: { id: bookingId },
      data: { status: newStatus },
    });

    return {
      success: true,
      message: "Test drive status updated successfully",
    };
  } catch (error) {
    throw new Error("Error updating test drive status:" + error.message);
  }
}
