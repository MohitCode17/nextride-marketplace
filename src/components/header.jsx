import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

const Header = () => {
  return (
    <div>
      {/* IF SIGOUT THEN DISPLAY SIGNIN AND SIGNUP BUTTON */}
      <SignedOut>
        <SignInButton />
        <SignUpButton />
      </SignedOut>
      {/* IF SIGNIN THEN DISPLAY USER BUTTON */}
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
};

export default Header;
