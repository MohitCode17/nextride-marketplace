import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowLeft, Bike, CarFront, LayoutPanelLeft } from "lucide-react";
import { checkUser } from "@/lib/checkUser";

const Header = async ({ isAdminPage = false }) => {
  // CHECK IS USER IS PRESENT IN DATABASE, ELSE CREATE IT.
  const user = await checkUser();
  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <nav className="mx-auto px-4 py-4 flex items-center justify-between">
        {/* COMPANY LOGO */}
        <Link href={isAdminPage ? "/admin" : "/"} className="flex">
          <Image
            src={"/nextride-logo.png"}
            alt="NextRide Logo"
            width={100}
            height={30}
            className="w-auto object-contain"
          />
          {isAdminPage && (
            <span className="text-xs font-extralight">Admin</span>
          )}
        </Link>

        {/* NAV BUTTONS */}
        <div className="flex items-center space-x-4">
          {isAdminPage ? (
            <Link href={"/"} className="text-gray-600 flex items-center gap-2">
              <Button
                variant={"outline"}
                className="flex items-center gap-2 hover:bg-teal-600"
              >
                <ArrowLeft size={18} />
                <span className="md:flex hidden">Back to App</span>
              </Button>
            </Link>
          ) : (
            <SignedIn>
              {!isAdmin ? (
                <Link
                  href={"/reservations"}
                  className="text-gray-600 hover:text-teal-600 flex items-center gap-2"
                >
                  <Button variant={"outline"} className={"hover:bg-teal-500"}>
                    <Bike size={18} />
                    <span className="hidden md:inline">My Reservations</span>
                  </Button>
                </Link>
              ) : (
                <Link
                  href={"/admin"}
                  className="text-gray-600 flex items-center gap-2"
                >
                  <Button variant={"outline"} className={"hover:bg-teal-600"}>
                    <LayoutPanelLeft size={18} />
                    <span className="hidden md:inline">Admin Panel</span>
                  </Button>
                </Link>
              )}

              <Link
                href={"/saved-rides"}
                className="text-gray-600 hover:text-teal-600 flex items-center gap-2"
              >
                <Button>
                  <CarFront size={18} />
                  <span className="hidden md:inline">Saved Rides</span>
                </Button>
              </Link>
            </SignedIn>
          )}

          {/* LOAD NAVIGATION FOR LOGOUT SCREEN */}
          <SignedOut>
            {!isAdminPage && (
              <SignInButton forceRedirectUrl="/">
                <Button variant={"outline"} className={"hover:bg-teal-500"}>
                  Login
                </Button>
              </SignInButton>
            )}
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "w-10 h-10 rounded-full ring-2 ring-teal-500 transition duration-300 hover:ring-teal-700",
                  userButtonPopoverCard: "shadow-lg border border-gray-200",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
