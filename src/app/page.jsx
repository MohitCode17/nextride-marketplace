import { getFeaturedRides } from "@/actions/home";
import HomeSearch from "@/components/home-search";
import RideCard from "@/components/ride-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { bodyTypes, carMakes, faqItems } from "@/lib/data";
import { SignedOut } from "@clerk/nextjs";
import { Bike, Calendar, Car, ChevronRight, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const featuredRides = await getFeaturedRides();

  return (
    <div className="flex flex-col pt-[70px]">
      {/* HERO SECTION WITH GRADIENT TITLE */}
      <section className="relative py-20 md:py-36 dot-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl mb-6 font-extrabold gradient-title">
            Ready to Ride? Hop On with NextRide
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Be it a bike, scooty, or electric — discover rides built for you,
            faster than ever with smart AI-powered suggestions.
          </p>
          <HomeSearch />
        </div>
      </section>

      {/* FEATURED CARS */}
      <section className="py-12">
        <div className="px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Rides</h2>
            <Button variant={"ghost"} className={"flex items-center"} asChild>
              <Link href={"/rides"} className="hover:bg-teal-500">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredRides.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </div>
        </div>
      </section>

      {/* BROWSE BY MAKE */}
      <section className="py-12 bg-[#f5fefd]">
        <div className="px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              Browse by Company
            </h2>
            <Button variant={"ghost"} className="flex items-center" asChild>
              <Link href={"/rides"} className="hover:bg-teal-500">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {carMakes.map((make) => (
              <Link
                key={make.name}
                href={`rides?make=${make.name}`}
                className="bg-white border border-gray-300/50 rounded-xl p-4 text-center hover:shadow-md hover:-translate-y-1 transition duration-200 ease-in-out"
              >
                <div className="h-16 w-full mb-3 relative">
                  <Image
                    src={make.image || `/make/${make.name.toLowerCase()}.webp`}
                    alt={make.name}
                    fill
                    className="object-contain"
                  />
                </div>

                <h3 className="font-medium text-gray-700">{make.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 bg-[#f5fefd]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Why choose our platform
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Massive Bike Collection",
                icon: <Bike className="h-7 w-7 text-[#22c55e]" />,
                desc: "Explore a wide range of verified EV and petrol bikes from trusted dealers & owners.",
              },
              {
                title: "Seamless Test Rides",
                icon: <Calendar className="h-7 w-7 text-[#22c55e]" />,
                desc: "Book test rides instantly with just a few taps. Comfort meets convenience.",
              },
              {
                title: "Trusted & Secure",
                icon: <Shield className="h-7 w-7 text-[#22c55e]" />,
                desc: "Our platform ensures verified listings, secure communication, and safe transactions.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="text-center bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition duration-300 border border-gray-100"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-50 mx-auto mb-4 shadow-sm">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BROWSE BY BODY TYPE */}
      <section className="py-16 bg-[#f5fefd]">
        <div className="px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold text-gray-800">Browse by Type</h2>
            <Button variant={"ghost"} className="flex items-center" asChild>
              <Link href={"/rides"} className="hover:bg-teal-500">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bodyTypes.map((type) => (
              <Link
                key={type.name}
                href={`rides?bikeType=${type.name}`}
                className="relative group rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="h-40 relative">
                  <Image
                    src={type.image || `/body/${type.name.toLowerCase()}.webp`}
                    alt={type.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
                  <div className="absolute bottom-2 left-3">
                    <h3 className="text-lime-50 text-lg font-semibold drop-shadow">
                      {type.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 bg-[#f5fefd]">
        <div className="px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Frequently Asked Questions
          </h2>

          <Accordion
            type="single"
            collapsible
            className="w-full max-w-3xl mx-auto space-y-2"
          >
            {faqItems.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-gray-200 rounded-lg"
              >
                <AccordionTrigger className="px-4 py-3 text-left font-medium text-base text-gray-800 rounded-t-lg transition">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA SECTIONS */}
      <section className="py-16 dot-background text-white">
        <div className="px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to ride your dream vehicle?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join the NextRide community and explore a wide range of stylish
            bikes and scooters—perfectly suited to your vibe, needs, and budget.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size={"lg"} variant={"secondary"} asChild>
              <Link href={"/rides"}>Browse bikes & scooters</Link>
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
