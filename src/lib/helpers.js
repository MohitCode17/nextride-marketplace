export const serialzeRideData = (ride, wishlisted = false) => {
  return {
    ...ride,
    price: ride.price ? parseFloat(ride.price.toString()) : 0,
    createdAt: ride.createdAt?.toISOString(),
    updatedAt: ride.updatedAt?.toISOString(),
    wishlisted: wishlisted,
  };
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};
