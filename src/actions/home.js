"use server";

import aj from "@/lib/arcjet";
import { db } from "@/lib/prisma";
import { request } from "@arcjet/next";
import { GoogleGenerativeAI } from "@google/generative-ai";

function serializeRideData(ride) {
  return {
    ...ride,
    price: ride.price ? parseFloat(ride.price.toString()) : 0,
    createdAt: ride.createdAt?.toISOString(),
    updatedAt: ride.updatedAt?.toISOString(),
  };
}

async function fileToBase24(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return buffer.toString("base64");
}

export async function getFeaturedRides(limit = 4) {
  try {
    const rides = await db.ride.findMany({
      where: {
        featured: true,
        status: "AVAILABLE",
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return rides.map(serializeRideData);
  } catch (error) {
    throw new Error("Error fetching featured rides:" + error.message);
  }
}

export async function processImageSearch(file) {
  try {
    // GET REQUEST DATA FOR ARCJET
    const req = await request();

    // CHECK RATE LIMIT
    const decision = await aj.protect(req, {
      requested: 1, // SPECIFY HOW MANY TOKEN TO CONSUME
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;
        console.error({
          code: "RATE_LIMIT_EXCEEDED",
          details: {
            remaining,
            resetInSeconds: reset,
          },
        });
        throw new Error("Too many requests. Please try again later.");
      }
      throw new Error("Request blocked");
    }

    // CHECK IF API KEY IS AVAILABLE
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API key is not configured.");
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

    // DEFINE THE PROMPT FOR SEARCH EXTRACTION
    const prompt = `
          Analyze this bike, scooter, and EV image and extract the following information for a search query:
          1. Make (manufacturer)
          2. Type (Cruiser, Sport, Commuter, etc.)
          3. Color
    
          Format your response as a clean JSON object with these fields:
          {
            "make": "",
            "bikeType": "",
            "color": "",
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
      const rideDetails = JSON.parse(cleanedText);

      // RETURN SUCCESS RESPONSE WITH DATA
      return {
        success: true,
        data: rideDetails,
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
    throw new Error("AI Search error:" + error.message);
  }
}
