"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { serialzeRideData } from "@/lib/helpers";

async function fileToBase24(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return buffer.toString("base64");
}

export async function processRideImageWithAI(file) {
  try {
    // CHECK IF API KEY IS AVAILABLE
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API key is not configured");
    }

    // INITIALIZE GEMINI API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // CONVERT IMAGE FILE TO BASE64
    const base64Image = await fileToBase24(file);

    // CREATE IMAGE FOR THE MODEL
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: file.type,
      },
    };

    // DEFINE THE PROMPT FOR CAR DETAIL EXTRACTION
    const prompt = `
      Analyze this two-wheeler image (bike, scooter, or EV) and extract the following information:
      1. Make (manufacturer)
      2. Model
      3. Year (approximately)
      4. Color
      5. Type (Commuter, Cruiser, Sports, Scooter, Adventure, Tourer, Electric Scooter, Off-Road, etc.)
      6. Mileage
      7. Fuel type (Petrol, Electric, Hybrid — your best guess)
      8. Transmission type (Manual, Automatic — your best guess)
      9. Price (your best guess in Indian Rupees)
      9. Short Description as to be added to a car listing

      Format your response as a clean JSON object with these fields:
      {
        "make": "",
        "model": "",
        "year": 0000,
        "color": "",
        "price": "",
        "mileage": "",
        "bikeType": "",
        "fuelType": "",
        "transmission": "",
        "description": "",
        "confidence": 0.0
      }

      For confidence, provide a value between 0 and 1 representing how confident you are in your overall identification.
      Only respond with the JSON object, nothing else.
    `;

    // GET RESPONSE FROM GEMINI
    const result = await model.generateContent([imagePart, prompt]);
    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    // PARSE THE JSON RESPONSE
    try {
      const carDetails = JSON.parse(cleanedText);

      // VALIDATE THE REPONSE FORMAT
      const requiredFields = [
        "make",
        "model",
        "year",
        "color",
        "bikeType",
        "price",
        "mileage",
        "fuelType",
        "transmission",
        "description",
        "confidence",
      ];

      const missingFields = requiredFields.filter(
        (field) => !(field in carDetails)
      );

      if (missingFields.length > 0) {
        throw new Error(
          `AI response missing required fields: ${missingFields.join(", ")}`
        );
      }

      return {
        success: true,
        data: carDetails,
      };
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.log("Raw response:", text);
      return {
        success: false,
        error: "Failed to parse AI response",
      };
    }
  } catch (error) {
    console.error();
    throw new Error("Gemini API error:" + error.message);
  }
}

export async function addRide({ rideData, images }) {
  try {
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // CREATE A UNIQUE FOLDER NAME FOR THE RIDE'S IMAGES
    const rideId = uuidv4();
    const folderPath = `rides/${rideId}`;

    // INIT SUPABASE CLIENT FOR SERVER SIDE OPERATIONS
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // UPLOAD ALL IMAGES TO SUPABASE STORAGE
    const imageUrls = [];

    for (let i = 0; i < images.length; i++) {
      const base64Data = images[i];

      // SKIP IF IMAGE DATA IS NOT VALID
      if (!base64Data || !base64Data.startsWith("data:image/")) {
        console.warn("Skipping innvalid image data");
        continue;
      }

      // EXTRACT THE BASE64 PART (remove the data:image/xyz;base64, prefix)
      const base64 = base64Data.split(",")[1];
      const imageBuffer = Buffer.from(base64, "base64");

      // DETERMINE FILE EXTENTION FROM THE DATA URL
      const mimeMatch = base64Data.match(/data:image\/([a-zA-Z0-9]+);/);

      const fileExtension = mimeMatch ? mimeMatch[1] : "jpeg";

      // CREATE FILENAME
      const fileName = `image-${Date.now()}-${i}.${fileExtension}`;

      const filePath = `${folderPath}/${fileName}`;

      // UPLOAD THE FILE BUFFER DIRECTLY
      const { data, error } = await supabase.storage
        .from("nextride-images")
        .upload(filePath, imageBuffer, {
          contentType: `image/${fileExtension}`,
        });

      if (error) {
        console.error("Error uploading image:", error);
        throw new Error(`Failed to upload image: ${error.message}`);
      }

      // GET THE PUBLIC URL FOR UPLOADED FILE
      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/nextride-images/${filePath}`; // disable cache in config

      imageUrls.push(publicUrl);
    }

    if (imageUrls.length === 0) {
      throw new Error("No valid images were uploaded");
    }

    // ADD THE CAR TO THE DATABASE
    await db.ride.create({
      data: {
        id: rideId,
        make: rideData.make,
        model: rideData.model,
        year: rideData.year,
        price: rideData.price,
        mileage: rideData.mileage,
        color: rideData.color,
        fuelType: rideData.fuelType,
        transmission: rideData.transmission,
        bikeType: rideData.bikeType,
        seats: rideData.seats,
        description: rideData.description,
        status: rideData.status,
        featured: rideData.featured,
        images: imageUrls, // Store the array of image URLs
      },
    });

    revalidatePath("/admin/rides");

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    throw new Error("Error adding rides: ", error);
  }
}

export async function getRides(search = "") {
  try {
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    let where = {};

    if (search) {
      where.OR = [
        { make: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
        { color: { contains: search, mode: "insensitive" } },
      ];
    }

    const rides = await db.ride.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const serializedRides = rides.map(serialzeRideData);

    return {
      success: true,
      data: serializedRides,
    };
  } catch (error) {
    console.error("Error fetching rides:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function deleteRide(id) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // FETCH THE RIDES AND GET IMAGES
    const ride = await db.ride.findUnique({
      where: { id },
      select: { images: true },
    });

    if (!ride) {
      return {
        success: false,
        error: "Ride not found",
      };
    }

    // DELETE THE RIDE FROM DB
    await db.ride.delete({
      where: { id },
    });

    // DELETE IMAGES FROM SUPABASE STORAGE
    try {
      const cookieStore = await cookies();
      const supabase = createClient(cookieStore); // Create Supabase client with authz

      // EXTRACT FILE PATH FROM IMAGE URL
      const filePaths = ride.images
        .map((imageUrl) =>
          imageUrl.replace(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/nextride-images/`,
            ""
          )
        )
        .filter(Boolean);

      console.log("Extracted file paths:", filePaths);

      // DELETE FILES FROM STORAGE IF PATHS WERE EXTRACTED
      if (filePaths.length > 0) {
        const { data, error } = await supabase.storage
          .from("nextride-images")
          .remove(filePaths);

        if (error) {
          console.error("Error deleting images from storage:", error.message);
        } else {
          console.log("Successfully deleted images:", data);
        }
      }
    } catch (storageError) {
      console.error("Error with storage operations:", storageError);
    }

    // REVALIDATE THE CARS LIST PAGE
    revalidatePath("/admin/rides");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting ride:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function updateRideStatus(id, { status, featured }) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const updateData = {};

    if (status !== undefined) {
      updateData.status = status;
    }

    if (featured !== undefined) {
      updateData.featured = featured;
    }

    // UPDATE THE CAR
    await db.ride.update({
      where: { id },
      data: updateData,
    });

    // REVALIDATE THE RIDES LIST PAGE
    revalidatePath("/admin/rides");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating ride status:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
