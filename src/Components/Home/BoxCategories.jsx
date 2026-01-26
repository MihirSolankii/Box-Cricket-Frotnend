import React from "react";
import { Card } from "@/components/ui/card";

export default function BoxCategories() {
  const categories = [1, 2, 3, 4, 5];

  return (
    <section className="px-8 py-12 bg-[#CDD897]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#607196]">Cricket Box | Night Cricket | 360° Box</h2>
        <a className="text-[#607196]">See all ➔</a>
      </div>
      <div className="grid md:grid-cols-5 gap-6">
        {categories.map((cat) => (
          <Card key={cat} className="p-4 border rounded-lg bg-white relative">
            <div className="h-32 bg-[#E4ECBE] rounded mb-2"></div>
            <span className="absolute top-2 right-2 text-[#DDC2B8] cursor-pointer">❤</span>
            <p className="text-sm text-[#607196]">Name...</p>
            <p className="text-xs text-[#9F9AA7]">Address...</p>
            <p className="text-xs text-[#9F9AA7]">Per hour prices</p>
            <span className="text-xs bg-[#D9E2AB] px-1 rounded mt-1 inline-block">4.5 ★</span>
          </Card>
        ))}
      </div>
    </section>
  );
}
