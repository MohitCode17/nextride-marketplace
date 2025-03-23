import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowLeft, CarFront } from "lucide-react";

const Header = async ({ isAdminPage = false }) => {
  const isAdmin = false;

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <nav className="mx-auto px-4 py-4 flex items-center justify-between">
        {/* COMPANY LOGO */}
        <Link href={isAdminPage ? "/admin" : "/"} className="flex">
          <Image
            src={"/logo-light.png"}
            alt="NextRide Logo"
            width={200}
            height={60}
            className="w-auto object-contain"
          />
          {isAdminPage && (
            <span className="text-xs font-extralight">Admin</span>
          )}
        </Link>

        {/* NAV BUTTONS */}
        <div className="flex items-center space-x-4">
          {isAdminPage ? (
            <Link
              href={"/"}
              className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
            >
              <Button variant={"outline"} className="flex items-center gap-2">
                <ArrowLeft size={18} />
                <span>Back to App</span>
              </Button>
            </Link>
          ) : (
            <SignedIn>
              {!isAdmin ? (
                <Link
                  href={"/reservations"}
                  className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
                >
                  <Button variant={"outline"}>
                    <CarFront size={18} />
                    <span className="hidden md:inline">My Reservations</span>
                  </Button>
                </Link>
              ) : (
                <Link
                  href={"/admin"}
                  className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
                >
                  <Button variant={"outline"}>
                    <CarFront size={18} />
                    <span className="hidden md:inline">Admin Panel</span>
                  </Button>
                </Link>
              )}

              <Link
                href={"/saved-cars"}
                className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
              >
                <Button>
                  <CarFront size={18} />
                  <span className="hidden md:inline">Saved Cars</span>
                </Button>
              </Link>
            </SignedIn>
          )}

          {/* LOAD NAVIGATION FOR LOGOUT SCREEN */}
          <SignedOut>
            {!isAdminPage && (
              <SignInButton forceRedirectUrl="/">
                <Button variant={"outline"}>Login</Button>
              </SignInButton>
            )}
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
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
