import React from "react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-8 py-16 bg-[#D3DDA1]">
      <div className="md:w-1/2">
        <h1 className="text-4xl font-bold text-[#607196] mb-4">
          Find. Play. Win.<br />Book your box now
        </h1>
        <Button variant="custom" className="mt-4">Explore Now ➔</Button>
      </div>
      <div className="md:w-1/2 h-64 bg-[#E4ECBE] rounded-lg"></div>
    </section>
  );
}
