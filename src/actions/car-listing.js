export async function getCarFilters() {
  try {
    // GET UNIQUE MAKES
    const makes = await db.car.findMany({
      where: { status: "AVAILABLE" },
      select: { make: true },
      distinct: ["make"],
      orderBy: { make: "asc" },
    });

    // GET UNIQUE BODY TYPES
    const bodyTypes = await db.car.findMany({
      where: { status: "AVAILABLE" },
      select: { bodyType: true },
      distinct: ["bodyType"],
      orderBy: { bodyType: "asc" },
    });

    // GET UNIQUE FUEL TYPES
    const fuelTypes = await db.car.findMany({
      where: { status: "AVAILABLE" },
      select: { fuelType: true },
      distinct: ["fuelType"],
      orderBy: { fuelType: "asc" },
    });

    // GET UNIQUE TRANSMISSIONS
    const transmissions = await db.car.findMany({
      where: { status: "AVAILABLE" },
      select: { transmission: true },
      distinct: ["transmission"],
      orderBy: { transmission: "asc" },
    });

    // GET MIN AND MAX PRICES USING PRISMA AGGREGATIONS
    const priceAggregations = await db.car.aggregate({
      where: { status: "AVAILABLE" },
      _min: { price: true },
      _max: { price: true },
    });

    return {
      success: true,
      data: {
        makes: makes.map((item) => item.make),
        bodyTypes: bodyTypes.map((item) => item.bodyType),
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
    throw new Error("Error fetching car filters:" + error.message);
  }
}
