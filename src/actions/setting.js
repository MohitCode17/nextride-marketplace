"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// GET DEALERSHIP INFO WITH WORKING HOURS
export async function getDealerShipInfo() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // GET THE DEALERSHIP RECORD
    let dealership = await db.dealershipInfo.findFirst({
      include: {
        workingHours: {
          orderBy: {
            dayOfWeek: "asc",
          },
        },
      },
    });

    // IF NO DEALERSHIP EXISTS, CREATE A DEFAULT ONE
    if (!dealership) {
      dealership = await db.dealershipInfo.create({
        data: {
          // DEFAULT VALUES WILL BE USED TO SCHEMA
          workingHours: {
            create: [
              {
                dayOfWeek: "MONDAY",
                openTime: "09:00",
                closeTime: "18:00",
                isOpen: true,
              },
              {
                dayOfWeek: "TUESDAY",
                openTime: "09:00",
                closeTime: "18:00",
                isOpen: true,
              },
              {
                dayOfWeek: "WEDNESDAY",
                openTime: "09:00",
                closeTime: "18:00",
                isOpen: true,
              },
              {
                dayOfWeek: "THURSDAY",
                openTime: "09:00",
                closeTime: "18:00",
                isOpen: true,
              },
              {
                dayOfWeek: "FRIDAY",
                openTime: "09:00",
                closeTime: "18:00",
                isOpen: true,
              },
              {
                dayOfWeek: "SATURDAY",
                openTime: "10:00",
                closeTime: "16:00",
                isOpen: true,
              },
              {
                dayOfWeek: "SUNDAY",
                openTime: "10:00",
                closeTime: "16:00",
                isOpen: false,
              },
            ],
          },
        },
        include: {
          workingHours: {
            orderBy: {
              dayOfWeek: "asc",
            },
          },
        },
      });
    }

    return {
      success: true,
      data: {
        ...dealership,
        createdAt: dealership.createdAt.toISOString(),
        updatedAt: dealership.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    throw new Error("Error fetching dealership info:" + error.message);
  }
}

// SAVE WORKING HOURS
export async function saveWorkingHours(workingHours) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user || user.role !== "ADMIN") {
      throw new Error("Unauthorized: Admin access required");
    }

    // GET CURRENT DEALERSHIP INFO
    const dealership = await db.dealershipInfo.findFirst();

    if (!dealership) {
      throw new Error("Dealership info not found");
    }

    // DELETE ANY EXISTING WORKING HOURS
    await db.workingHour.deleteMany({
      where: { dealershipId: dealership.id },
    });

    // CREATE NEW HOURS
    for (const hour of workingHours) {
      await db.workingHour.create({
        data: {
          dayOfWeek: hour.dayOfWeek,
          openTime: hour.openTime,
          closeTime: hour.closeTime,
          isOpen: hour.isOpen,
          dealershipId: dealership.id,
        },
      });
    }

    // REVALIDATING PATHS
    revalidatePath("/admin/settings");
    revalidatePath("/");

    return {
      success: true,
    };
  } catch (error) {
    throw new Error("Error saving working hours:" + error.message);
  }
}
