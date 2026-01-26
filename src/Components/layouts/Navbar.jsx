import React from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-5 px-8 bg-[#CDD897]">
      <div className="text-xl font-bold">Nest Cricket</div>
      <div className="space-x-6 text-[#607196] font-medium">
        <a href="#">Spot Venues</a>
        <a href="#">Team Up</a>
        <a href="#">Contact Us</a>
      </div>
      <Button variant="custom">Register Venue</Button>
    </nav>
  );
}
