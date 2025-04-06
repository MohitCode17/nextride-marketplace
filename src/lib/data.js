export const featuredCars = [
  {
    id: 1,
    make: "Toyota",
    model: "Camry",
    year: 2024,
    price: 30999,
    images: ["/1.png"],
    transmission: "Automatic",
    fuelType: "Hybrid",
    bodyType: "Sedan",
    mileage: 9000,
    color: "Silver",
    wishlisted: true,
  },
  {
    id: 2,
    make: "Honda",
    model: "Civic",
    year: 2023,
    price: 25999,
    images: ["/2.webp"],
    transmission: "Automatic",
    fuelType: "Gasoline",
    bodyType: "Sedan",
    mileage: 10000,
    color: "Black",
    wishlisted: false,
  },
  {
    id: 3,
    make: "Tesla",
    model: "Model 3",
    year: 2022,
    price: 49999,
    images: ["/3.jpg"],
    transmission: "Manual",
    fuelType: "Gasoline",
    bodyType: "Convertible",
    mileage: 6000,
    color: "Blue",
    wishlisted: true,
  },
];

export const carMakes = [
  { id: 1, name: "Hyundai", image: "/make/hyundai.webp" },
  { id: 2, name: "Honda", image: "/make/honda.webp" },
  { id: 3, name: "BMW", image: "/make/bmw.webp" },
  { id: 4, name: "Tata", image: "/make/tata.webp" },
  { id: 5, name: "Mahindra", image: "/make/mahindra.webp" },
  { id: 6, name: "Ford", image: "/make/ford.webp" },
];

export const bodyTypes = [
  { id: 1, name: "SUV", image: "/body/suv.webp" },
  { id: 2, name: "Sedan", image: "/body/sedan.webp" },
  { id: 3, name: "Hatchback", image: "/body/hatchback.webp" },
  { id: 4, name: "Convertible", image: "/body/convertible.webp" },
];

export const faqItems = [
  {
    question: "How does AI-powered car search work?",
    answer:
      "Our advanced AI analyzes your preferences and shows you the best-matched cars instantly. Just tell us what you're looking for!",
  },
  {
    question: "Can I test drive a car before buying?",
    answer:
      "Absolutely! Schedule a test drive directly from the car's page, and our team will assist you with everything.",
  },
  {
    question: "Are there financing options available?",
    answer:
      "Yes, we offer flexible financing options to make your dream car affordable. Connect with our team to know more.",
  },
  {
    question: "How accurate are the vehicle details?",
    answer:
      "All listed vehicles are verified for accuracy and quality. We ensure transparent information and detailed reports.",
  },
];

// FORM CONFIGURATION - Constants moved to a separate file for reusability

export const fuelTypes = [
  "Petrol",
  "Diesel",
  "Electric",
  "Hybrid",
  "Plug-in Hybrid",
];

export const transmissions = ["Automatic", "Manual", "Semi-Automatic"];

export const bodyTypesVal = [
  "SUV",
  "Sedan",
  "Hatchback",
  "Convertible",
  "Coupe",
  "Wagon",
  "Pickup",
];

export const carStatuses = ["AVAILABLE", "UNAVAILABLE", "SOLD"];

export const DAYS = [
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
  { value: "SUNDAY", label: "Sunday" },
];
