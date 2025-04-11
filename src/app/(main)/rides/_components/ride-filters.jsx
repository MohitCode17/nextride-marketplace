"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter, Sliders, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import RideFilterControls from "./filter-controls";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RideFilters = ({ filters }) => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // GET CURRENT FILTER VALUE FROM SEARCH PARAMS
  const currentMake = searchParams.get("make") || "";
  const currentBikeType = searchParams.get("bikeType") || "";
  const currentFuelType = searchParams.get("fuelType") || "";
  const currentTransmission = searchParams.get("transmission") || "";

  const currentMinPrice = searchParams.get("minPrice")
    ? parseInt(searchParams.get("minPrice"))
    : filters.priceRange.min;

  const currentMaxPrice = searchParams.get("maxPrice")
    ? parseInt(searchParams.get("maxPrice"))
    : filters.priceRange.max;

  const currentSortBy = searchParams.get("sortBy") || "newest";

  // LOCAL STATE SETUP FOR CURRENT FILTER VALUES
  const [make, setMake] = useState(currentMake);
  const [bikeType, setBikeType] = useState(currentBikeType);
  const [fuelType, setFuelType] = useState(currentFuelType);
  const [transmission, setTransmission] = useState(currentTransmission);
  const [priceRange, setPriceRange] = useState([
    currentMinPrice,
    currentMaxPrice,
  ]);
  const [sortBy, setSortBy] = useState(currentSortBy);

  // SYNC LOCAL STATE ON URL CHANGE
  useEffect(() => {
    setMake(currentMake);
    setBikeType(currentBikeType);
    setFuelType(currentFuelType);
    setTransmission(currentTransmission);
    setPriceRange([currentMinPrice, currentMaxPrice]);
    setSortBy(currentSortBy);
  }, [
    currentMake,
    currentBikeType,
    currentFuelType,
    currentTransmission,
    currentMinPrice,
    currentMaxPrice,
    currentSortBy,
  ]);

  // ACTIVE FILTER COUNT
  const activeFilterCount = [
    make,
    bikeType,
    fuelType,
    transmission,
    currentMinPrice > filters.priceRange.min ||
      currentMaxPrice < filters.priceRange.max,
  ].filter(Boolean).length;

  // UPDATE URL WHEN FILTERS CHANGE
  const applyFilters = (overrideSortBy = null) => {
    const params = new URLSearchParams();

    if (make) params.set("make", make);
    if (bikeType) params.set("bikeType", bikeType);
    if (fuelType) params.set("fuelType", fuelType);
    if (transmission) params.set("transmission", transmission);
    // CONDITIONALLY ADDING MIN PRICE IF PRICE CHANGES AND MORE THAN DEFAULT
    if (priceRange[0] > filters.priceRange.min)
      params.set("minPrice", priceRange[0].toString());

    // CONDITIONALLY ADDING MAX PRICE IF PRICE CHANGES AND LESS THAN DEFAULT
    if (priceRange[1] < filters.priceRange.max)
      params.set("maxPrice", priceRange[1].toString());

    // CONDITIONALLY ADDING SORTBY SINCE DEFAULT ONE IS ALREADY A NEWEST
    const finalSortBy = overrideSortBy ?? sortBy;
    if (finalSortBy !== "newest") params.set("sortBy", sortBy);

    // PRESERVE SEARCH AND PAGE PARAMS IF THEY EXIST
    const search = searchParams.get("search");
    const page = searchParams.get("page");

    if (search) params.set("search", search);
    if (page && page !== "1") params.set("page", page);

    const query = params.toString();
    const url = query ? `${pathName}?${query}` : pathName;

    router.push(url);
    setIsSheetOpen(false);
  };

  // HANDLE FILTER CHANGES
  const handleFilterChange = (filterName, value) => {
    switch (filterName) {
      case "make":
        setMake(value);
        break;
      case "bikeType":
        setBikeType(value);
        break;
      case "fuelType":
        setFuelType(value);
        break;
      case "transmission":
        setTransmission(value);
        break;
      case "priceRange":
        setPriceRange(value);
        break;
    }
  };

  // HANDLE CLEARING SPECIFIC FILTERS
  const handleClearFilter = (filterName) => {
    handleFilterChange(filterName, "");
  };

  // HANDLE CLEAR FILTERS
  const clearFilters = () => {
    setMake("");
    setBikeType("");
    setFuelType("");
    setTransmission("");
    setPriceRange([filters.priceRange.min, filters.priceRange.max]);
    setSortBy("newest");

    // KEEP SEARCH TERM IF EXISTS
    const params = new URLSearchParams();
    const search = searchParams.get("search");
    if (search) params.set("search", search);

    const query = params.toString();
    const url = query ? `${pathName}?${query}` : pathName;

    router.push(url);
    setIsSheetOpen(false);
  };

  // CURRENT FILTERS OBJECT(WHEN USER SELECTS ANY VALUE)
  const currentFilters = {
    make, // e.g. "Hero"
    bikeType, // e.g. "Cruiser"
    fuelType, // e.g. "Petrol"
    transmission, // e.g. "Manual"
    priceRange, // e.g. [30000, 100000] -> User-selected price range
    priceRangeMin: filters.priceRange.min, // Default min price, e.g. 10000
    priceRangeMax: filters.priceRange.max, // Default max price, e.g. 150000
  };

  return (
    <div className="flex lg:flex-col justify-between gap-4">
      {/* MOBILE FILTERS VIEW */}
      <div className="lg:hidden mb-4">
        <div className="flex items-center">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 hover:bg-teal-500"
              >
                <Filter className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-full sm:max-w-md overflow-y-auto px-2"
            >
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>

              <div className="py-6">
                <RideFilterControls
                  filters={filters}
                  currentFilters={currentFilters}
                  onFilterChange={handleFilterChange}
                  onClearFilter={handleClearFilter}
                />
              </div>

              <SheetFooter className="sm:justify-between flex-row pt-2 border-t space-x-4 mt-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearFilters}
                  className="flex-1 hover:bg-teal-500"
                >
                  Reset
                </Button>
                <Button type="button" onClick={applyFilters} className="flex-1">
                  Show Results
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* SORT OPTIONS */}
      <Select
        value={sortBy}
        onValueChange={(value) => {
          setSortBy(value);
          applyFilters(value);
        }}
      >
        <SelectTrigger className="w-[180px] lg:w-full">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {[
            { value: "newest", label: "Newest First" },
            { value: "priceAsc", label: "Price: Low to High" },
            { value: "priceDesc", label: "Price: High to Low" },
          ].map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* DESKTOP FILTERS VIEW */}
      <div className="hidden lg:block sticky top-24">
        <div className="border rounded-lg overflow-hidden bg-white">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <h3 className="font-medium flex items-center">
              <Sliders className="mr-2 h-4 w-4" />
              Filters
            </h3>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-sm text-gray-600 hover:bg-teal-500"
                onClick={clearFilters}
              >
                <X className="mr-1 h-3 w-3" />
                Clear All
              </Button>
            )}
          </div>

          <div className="p-4">
            <RideFilterControls
              filters={filters}
              currentFilters={currentFilters}
              onFilterChange={handleFilterChange}
              onClearFilter={handleClearFilter}
            />
          </div>

          <div className="px-4 py-4 border-t">
            <Button onClick={applyFilters} className="w-full">
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideFilters;
