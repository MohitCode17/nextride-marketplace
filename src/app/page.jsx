import { getFeaturedCars } from "@/actions/home";
import CarCard from "@/components/car-card";
import HomeSearch from "@/components/home-search";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { bodyTypes, carMakes, faqItems } from "@/lib/data";
import { SignedOut } from "@clerk/nextjs";
import { Calendar, Car, ChevronRight, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const featuredCars = await getFeaturedCars();

  return (
    <div className="flex flex-col pt-20">
      {/* HERO SECTION WITH GRADIENT TITLE */}
      <section className="relative py-16 md:py-28 diamond-background">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-8xl mb-4 gradient-title">
              Find Your Perfect Ride with NextRide
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Discover your dream car faster with AI-powered recommendations.
              Browse, compare, and test drive from a wide selection of vehicles
              — made just for you!
            </p>
          </div>

          {/* HOME SEARCH BAR */}
          <HomeSearch />
        </div>
      </section>

      {/* FEATURED CARS */}
      <section className="py-12">
        <div className="px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured cars</h2>
            <Button variant={"ghost"} className={"flex items-center"} asChild>
              <Link href={"/cars"}>
                View All <ChevronRight className="ml-1 h-4 w-4" />{" "}
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      {/* BROWSE BY MAKE */}
      <section className="py-12 bg-gray-50">
        <div className="px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Browse by company</h2>
            <Button variant={"ghost"} className={"flex items-center"} asChild>
              <Link href={"/cars"}>
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {carMakes.map((make) => (
              <Link
                key={make.name}
                href={`cars?make=${make.name}`}
                className="bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition cursor-pointer"
              >
                <div className="h-16 w-auto mx-auto mb-2 relative">
                  <Image
                    src={make.image || `/make/${make.name.toLowerCase()}.webp`}
                    alt={make.name}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>

                <h3 className="font-medium">{make.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16">
        <div className="px-4">
          <h2 className="text-2xl font-bold text-center mb-12">
            Why choose our platform
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 text-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8" />
              </div>

              <h3 className="text-xl font-bold mb-2">Massive Car Collection</h3>
              <p className="text-gray-600">
                Discover an extensive range of premium cars from verified
                dealers and private sellers—your perfect ride is waiting.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 text-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8" />
              </div>

              <h3 className="text-xl font-bold mb-2">Seamless Test Drives</h3>
              <p className="text-gray-600">
                Book a test drive with just a few clicks—schedule at your
                convenience and hit the road in style.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 text-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>

              <h3 className="text-xl font-bold mb-2">Trusted & Secure</h3>
              <p className="text-gray-600">
                Feel confident with our verified listings and secure booking
                process—your peace of mind is our priority.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BROWSE BY BODY TYPE */}
      <section className="py-12 bg-gray-50">
        <div className="px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Browse by body type</h2>
            <Button variant={"ghost"} className={"flex items-center"} asChild>
              <Link href={"/cars"}>
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bodyTypes.map((type) => (
              <Link
                key={type.name}
                href={`cars?bodyType=${type.name}`}
                className="relative group cursor-pointer"
              >
                <div className="overflow-hidden rounded-lg flex justify-end h-36 mb-4 relative">
                  <Image
                    src={type.image || `/body/${type.name.toLowerCase()}.webp`}
                    alt={type.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 to-transparent rounded-lg flex items-end">
                  <h3 className="text-white text-xl font-bold pl-4 pb-2">
                    {type.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-12 bg-gray-50">
        <div className="px-4">
          <h2 className="text-2xl font-bold text-center mb-12">
            Frequently asked questions
          </h2>

          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA SECTIONS */}
      <section className="py-16 diamond-background text-white">
        <div className="px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to find your dream car?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join the NextRide community and explore a wide range of premium
            cars, tailored to your lifestyle and budget.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size={"lg"} variant={"secondary"} asChild>
              <Link href={"/cars"}>Browse cars</Link>
            </Button>
            <SignedOut>
              <Button size={"lg"} asChild>
                <Link href={"/sign-up"}>Get started now</Link>
              </Button>
            </SignedOut>
          </div>
        </div>
      </section>
    </div>
  );
}
