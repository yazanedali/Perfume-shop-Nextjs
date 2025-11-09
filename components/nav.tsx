import React from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./TogleMode";
import { SidebarTrigger } from "./ui/sidebar";

const Nav = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <SidebarTrigger />
      <ModeToggle />
      <SignedIn>
        <div className="flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-transparent hover:bg-brand hover:text-brand-foreground transition-colors">
          <UserButton />
        </div>
      </SignedIn>
      <SignedOut>
        <div className="flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-transparent hover:bg-brand hover:text-brand-foreground transition-colors">
          <SignInButton />
        </div>
      </SignedOut>
    </div>
  );
};

export default Nav;
