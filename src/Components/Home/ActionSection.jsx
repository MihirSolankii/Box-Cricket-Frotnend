import React from "react";

export default function ActionsSection() {
  const actions = [
    { title: "List Your Venue", icon: "🎟️" },
    { title: "Host Cricket", icon: "⭐" },
    { title: "Your Bookings", icon: "📅" },
  ];

  return (
    <section className="px-8 py-12 flex justify-around bg-[#D3DDA1]">
      {actions.map((action, i) => (
        <div key={i} className="flex flex-col items-center text-[#607196]">
          <div className="text-4xl mb-2">{action.icon}</div>
          <p>{action.title}</p>
        </div>
      ))}
    </section>
  );
}
