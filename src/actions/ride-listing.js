"use server";

import { serialzeRideData } from "@/lib/helpers";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getRideFilters() {
  try {
    // GET UNIQUE MAKES
    const makes = await db.ride.findMany({
      where: { status: "AVAILABLE" },
      select: { make: true },
      distinct: ["make"],
      orderBy: { make: "asc" },
    });

    // GET UNIQUE BIKE TYPES
    const bikeTypes = await db.ride.findMany({
      where: { status: "AVAILABLE" },
      select: { bikeType: true },
      distinct: ["bikeType"],
      orderBy: { bikeType: "asc" },
    });

    // GET UNIQUE FUEL TYPES
    const fuelTypes = await db.ride.findMany({
      where: { status: "AVAILABLE" },
      select: { fuelType: true },
      distinct: ["fuelType"],
      orderBy: { fuelType: "asc" },
    });

    // GET UNIQUE TRANSMISSIONS
    const transmissions = await db.ride.findMany({
      where: { status: "AVAILABLE" },
      select: { transmission: true },
      distinct: ["transmission"],
      orderBy: { transmission: "asc" },
    });

    // GET MIN AND MAX PRICES USING PRISMA AGGREGATIONS
    const priceAggregations = await db.ride.aggregate({
      where: { status: "AVAILABLE" },
      _min: { price: true },
      _max: { price: true },
    });

    return {
      success: true,
      data: {
        makes: makes.map((item) => item.make),
        bikeTypes: bikeTypes.map((item) => item.bikeType),
        fuelTypes: fuelTypes.map((item) => item.fuelType),
        transmissions: transmissions.map((item) => item.transmission),
        priceRange: {
          min: priceAggregations._min.price
            ? parseFloat(priceAggregations._min.price.toString())
            : 0,
          max: priceAggregations._max.price
            ? parseFloat(priceAggregations._max.price.toString())
            : 100000,
        },
      },
    };
  } catch (error) {
    throw new Error("Error fetching ride filters:" + error.message);
  }
}

export async function getRides({
  search = "",
  make = "",
  bikeType = "",
  fuelType = "",
  transmission = "",
  minPrice = 0,
  maxPrice = Number.MAX_SAFE_INTEGER,
  sortBy = "newest", // Options: newest, priceAsc, priceDesc
  page = 1,
  limit = 6,
}) {
  try {
    const { userId } = await auth();
    let dbUser = null;

    if (userId) {
      dbUser = await db.user.findUnique({
        where: { clerkUserId: userId },
      });
    }

    // BUILD WHERE CONDITIONS
    let where = {
      status: "AVAILABLE",
    };

    if (search) {
      where.OR = [
        { make: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (make) where.make = { equals: make, mode: "insensitive" };
    if (bikeType) where.bikeType = { equals: bikeType, mode: "insensitive" };
    if (fuelType) where.fuelType = { equals: fuelType, mode: "insensitive" };
    if (transmission)
      where.transmission = { equals: transmission, mode: "insensitive" };

    // ADD PRICE RANGE
    where.price = {
      gte: parseFloat(minPrice) || 0,
    };

    if (maxPrice && maxPrice < Number.MAX_SAFE_INTEGER) {
      where.price.lte = parseFloat(maxPrice);
    }

    // PAGINATION LOGIC
    const skip = (page - 1) * limit;

    // SORT ORDER
    let orderBy = {};
    switch (sortBy) {
      case "priceAsc":
        orderBy = { price: "asc" };
        break;
      case "priceDesc":
        orderBy = { price: "desc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    // GET TOTAL COUNT FOR PAGINATION
    const totalRides = await db.ride.count({ where });

    // MAIN QUERY
    const rides = await db.ride.findMany({
      where,
      take: limit,
      skip,
      orderBy,
    });

    // IF WE HAVE A USER, CHECK WHICH CARS ARE WISHLISTED
    let wishlisted = new Set();

    if (dbUser) {
      const savedRides = await db.userSavedRide.findMany({
        where: { userId: dbUser.id },
        select: { rideId: true },
      });

      wishlisted = new Set(savedRides.map((saved) => saved.rideId));
    }

    // SERIALIZE AND CHECK WISHLIST STATUS
    const serializedRides = rides.map((ride) =>
      serialzeRideData(ride, wishlisted.has(ride.id))
    );

    return {
      success: true,
      data: serializedRides,
      pagination: {
        total: totalRides,
        page,
        limit,
        pages: Math.ceil(totalRides / limit),
      },
    };
  } catch (error) {
    throw new Error("Error fetching rides:" + error.message);
  }
}

export async function toggleSavedRide(rideId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // CHECK IF RIDE EXISTS
    const ride = await db.ride.findUnique({
      where: { id: rideId },
    });

    if (!ride) {
      return {
        success: false,
        error: "Ride not found",
      };
    }

    // CHECK IF RIDE IS ALREADY SAVED
    const existingSave = await db.userSavedRide.findUnique({
      where: {
        userId_rideId: {
          userId: user.id,
          rideId,
        },
      },
    });

    // IF RIDE IS ALREADY SAVED, REMOVE IT
    if (existingSave) {
      await db.userSavedRide.delete({
        where: {
          userId_rideId: {
            userId: user.id,
            rideId,
          },
        },
      });

      revalidatePath(`/saved-rides`);
      return {
        success: true,
        saved: false,
        message: "Ride removed from favorites",
      };
    }

    // IF CAR IS NOT SAVED, ADD IT
    await db.userSavedRide.create({
      data: {
        userId: user.id,
        rideId,
      },
    });

    revalidatePath(`/saved-rides`);
    return {
      success: true,
      saved: true,
      message: "Ride added to favorites",
    };
  } catch (error) {
    throw new Error("Error toggling saved ride:" + error.message);
  }
}

export async function getRideById(rideId) {
  try {
    const { userId } = await auth();
    let dbUser = null;

    if (userId) {
      dbUser = await db.user.findUnique({
        where: { clerkUserId: userId },
      });
    }

    const ride = await db.ride.findUnique({
      where: { id: rideId },
    });

    if (!ride) {
      return {
        success: false,
        error: "Ride not found",
      };
    }

    // CHECK IF CAR IS WISHLISTED BY USER
    let isWishlisted = false;

    if (dbUser) {
      const savedRide = await db.userSavedRide.findUnique({
        where: {
          userId_rideId: {
            userId: dbUser.id,
            rideId,
          },
        },
      });

      isWishlisted = !!savedRide;
    }

    // CHECK IF USER HAS ALREADY BOOKED A TEST DRIVE FOR THIS RIDE
    const existingTestDrive = await db.testDriveBooking.findFirst({
      where: {
        rideId,
        userId: dbUser.id,
        status: { in: ["PENDING", "CONFIRMED", "COMPLETED"] },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    let userTestDrive = null;

    if (existingTestDrive) {
      userTestDrive = {
        id: existingTestDrive.id,
        status: existingTestDrive.status,
        bookingDate: existingTestDrive.bookingDate.toISOString(),
      };
    }

    // GET DEALERSHIP INFO FOR TEST DRIVE AVAILABILITY
    const dealership = await db.dealershipInfo.findFirst({
      include: {
        workingHours: true,
      },
    });

    return {
      success: true,
      data: {
        ...serialzeRideData(ride, isWishlisted),
        testDriveInfo: {
          userTestDrive,
          dealership: dealership
            ? {
                ...dealership,
                createdAt: dealership.createdAt.toISOString(),
                updatedAt: dealership.updatedAt.toISOString(),
                workingHours: dealership.workingHours.map((hour) => ({
                  ...hour,
                  createdAt: hour.createdAt.toISOString(),
                  updatedAt: hour.updatedAt.toISOString(),
                })),
              }
            : null,
        },
      },
    };
  } catch (error) {
    throw new Error("Error fetching ride details:" + error.message);
  }
}

export async function getSavedRides() {
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

    // GET SAVED CARS WITH THEIR DETAILS
    const savedRides = await db.userSavedRide.findMany({
      where: { userId: user.id },
      include: {
        ride: true,
      },
      orderBy: { savedAt: "desc" },
    });

    // EXTRACT AND FORMAT CAR DATA
    const rides = savedRides.map((saved) => serialzeRideData(saved.ride));

    return {
      success: true,
      data: rides,
    };
  } catch (error) {
    console.error("Error fetching saved rides:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
