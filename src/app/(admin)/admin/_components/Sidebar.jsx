"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { LayoutDashboard, Calendar, Cog, LogOut, Bike } from "lucide-react";

// NAVIGATION ITEMS
const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    label: "Rides",
    icon: Bike,
    href: "/admin/rides",
  },
  {
    label: "Test Drives",
    icon: Calendar,
    href: "/admin/test-drives",
  },
  {
    label: "Settings",
    icon: Cog,
    href: "/admin/settings",
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full flex-col overflow-y-auto bg-white shadow-sm border-r">
        <div className="p-6 border-b">
          <Link href="/admin">
            <h1 className="text-2xl font-bold text-teal-600 tracking-wide">
              RideAdmin
            </h1>
            <p className="text-xs text-gray-400">Manage Bikes & Scooters</p>
          </Link>
        </div>
        <div className="flex flex-col w-full mt-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-x-3 text-sm font-medium px-6 py-3 transition-all duration-200 rounded-r-full",
                pathname === route.href
                  ? "bg-teal-100 text-teal-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-teal-600"
              )}
            >
              <route.icon
                className={cn(
                  "h-5 w-5",
                  pathname === route.href ? "text-teal-600" : "text-gray-500"
                )}
              />
              {route.label}
            </Link>
          ))}
        </div>

        <div className="mt-auto p-6 border-t">
          <SignOutButton>
            <button className="flex items-center gap-x-2 text-sm font-medium text-red-500 hover:text-red-600 transition">
              <LogOut className="h-5 w-5" />
              Log out
            </button>
          </SignOutButton>
        </div>
      </div>

      {/* Mobile Bottom Tabs */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t flex justify-around items-center h-16 shadow-inner">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex flex-col items-center justify-center text-xs font-medium transition-all",
              pathname === route.href ? "text-teal-600" : "text-gray-500"
            )}
          >
            <route.icon
              className={cn(
                "h-6 w-6 mb-1",
                pathname === route.href ? "text-teal-600" : "text-gray-400"
              )}
            />
            {route.label}
          </Link>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
