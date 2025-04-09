export const carMakes = [
  { id: 1, name: "Royal Enfield", image: "/make/enfield.webp" },
  { id: 2, name: "Hero", image: "/make/hero.webp" },
  { id: 3, name: "Honda", image: "/make/honda.webp" },
  { id: 4, name: "Yamaha", image: "/make/yamaha.webp" },
  { id: 5, name: "TVS", image: "/make/tvs.webp" },
  { id: 6, name: "Ather", image: "/make/ather.webp" },
];

export const bodyTypes = [
  { id: 1, name: "Cruiser", image: "/body/cruiser.webp" }, // Royal Enfield Classic, Meteor
  { id: 2, name: "Sportbike", image: "/body/sports.webp" }, // TVS Apache RR, Yamaha R15
  { id: 3, name: "Commuter", image: "/body/commuter.webp" }, // Hero Splendor, TVS Star City
  { id: 4, name: "Scooter", image: "/body/scooter.webp" }, // Activa, Jupiter
  { id: 5, name: "Adventure", image: "/body/adventure.webp" }, // Himalayan, KTM Adventure
  // { id: 6, name: "Tourer", image: "/body/tourer.webp" }, // Bajaj Dominar, Interceptor 650
];

export const faqItems = [
  {
    question: "Can I test ride a bike or scooter before buying?",
    answer:
      "Absolutely! Just schedule a test ride from the vehicle’s page, and we’ll arrange it at your convenience—no hassle, no stress.",
  },
  {
    question: "Do you offer electric scooters or bikes?",
    answer:
      "Yes! We list a wide range of electric two-wheelers from top EV brands. Filter by 'Electric' and explore models that fit your style and budget.",
  },
  {
    question: "Are helmets or accessories included with the purchase?",
    answer:
      "Some dealers offer complimentary helmets or accessories. Details will be mentioned on the vehicle’s page. You can also add them while checking out.",
  },
  {
    question: "Is financing available for bikes and scooters?",
    answer:
      "Absolutely! We’ve partnered with top financial providers to offer easy EMI options for both scooters and bikes—apply directly from the platform.",
  },
  {
    question: "How are the vehicles verified?",
    answer:
      "All bikes and scooters go through a detailed inspection process. We verify documents, service history, and physical condition for complete peace of mind.",
  },
];

// FORM CONFIGURATION - Constants moved to a separate file for reusability

export const fuelTypes = ["Petrol", "Electric", "Hybrid"];

export const transmissions = ["Automatic", "Manual", "Semi-Automatic"];

export const bikeTypesVal = [
  "Commuter",
  "Cruiser",
  "Sports",
  "Scooter",
  "Adventure",
  "Tourer",
  "Electric Scooter",
  "Off-Road",
];

export const rideStatuses = ["AVAILABLE", "UNAVAILABLE", "SOLD"];

export const DAYS = [
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
  { value: "SUNDAY", label: "Sunday" },
];
