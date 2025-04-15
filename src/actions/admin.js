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

// DASHBOARD DATA
export async function getDashboardData() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user || user.role !== "ADMIN") {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const [rides, testDrives] = await Promise.all([
      // GET ALL RIDES WITH MINIMAL FIELDS
      db.ride.findMany({
        select: {
          id: true,
          status: true,
          featured: true,
        },
      }),

      // GET ALL TEST DRIVES WITH MINIMAL FIEDLS
      db.testDriveBooking.findMany({
        select: {
          id: true,
          status: true,
          rideId: true,
        },
      }),
    ]);

    // CALCULATE RIDE STATICS
    const totalRides = rides.length;

    const availableRides = rides.filter(
      (ride) => ride.status === "AVAILABLE"
    ).length;

    const soldRides = rides.filter((ride) => ride.status === "SOLD").length;

    const unavailableRides = rides.filter(
      (ride) => ride.status === "UNAVAILABLE"
    ).length;

    const featuredRides = rides.filter((ride) => ride.featured === true).length;

    // CALCULATE TEST DRIVE STATISTICS
    const totalTestDrives = testDrives.length;

    const pendingTestDrives = testDrives.filter(
      (td) => td.status === "PENDING"
    ).length;

    const confirmedTestDrives = testDrives.filter(
      (td) => td.status === "CONFIRMED"
    ).length;

    const completedTestDrives = testDrives.filter(
      (td) => td.status === "COMPLETED"
    ).length;

    const cancelledTestDrives = testDrives.filter(
      (td) => td.status === "CANCELLED"
    ).length;

    const noShowTestDrives = testDrives.filter(
      (td) => td.status === "NO_SHOW"
    ).length;

    // CALCULATE TEST DRIVE CONVERSION RATE
    const completedTestDriveRideIds = testDrives
      .filter((td) => td.status === "COMPLETED")
      .map((td) => td.rideId);

    const soldRidesAfterTestDrive = rides.filter(
      (ride) =>
        ride.status === "SOLD" && completedTestDriveRideIds.includes(ride.id)
    ).length;

    const conversionRate =
      completedTestDrives > 0
        ? (soldRidesAfterTestDrive / completedTestDrives) * 100
        : 0;

    return {
      success: true,
      data: {
        rides: {
          total: totalRides,
          available: availableRides,
          sold: soldRides,
          unavailable: unavailableRides,
          featured: featuredRides,
        },
        testDrives: {
          total: totalTestDrives,
          pending: pendingTestDrives,
          confirmed: confirmedTestDrives,
          completed: completedTestDrives,
          cancelled: cancelledTestDrives,
          noShow: noShowTestDrives,
          conversionRate: parseFloat(conversionRate.toFixed(2)),
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
