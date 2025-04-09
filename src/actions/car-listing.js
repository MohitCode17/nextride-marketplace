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
