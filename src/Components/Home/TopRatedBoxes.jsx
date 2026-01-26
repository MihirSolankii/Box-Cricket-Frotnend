import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TopRatedBoxes() {
  const boxes = [1, 2, 3];

  return (
    <section className="px-8 py-12 bg-[#D9E2AB]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#607196]">Top Rated Box</h2>
        <a className="text-[#607196]">See all ➔</a>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {boxes.map((box) => (
          <Card key={box} className="p-4 border rounded-lg bg-white">
            <div className="h-32 bg-[#E4ECBE] rounded mb-4"></div>
            <h3 className="font-semibold text-[#607196] mb-1">Venue Name</h3>
            <p className="text-sm text-[#9F9AA7] mb-2">Address...</p>
            <p className="text-sm text-[#9F9AA7] mb-2">Discount %...</p>
            <p className="text-sm text-[#9F9AA7]">Per hour prices</p>
            <div className="flex justify-between items-center mt-4">
              <Button variant="custom-sm">Book Now</Button>
              <span className="text-sm bg-[#D9E2AB] px-2 rounded">4.5 ★</span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
