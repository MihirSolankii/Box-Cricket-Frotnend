export const turfdata = [
  {
    id: 1,
    name: "Green Arena Box Cricket",
    location: "Andheri West, Mumbai",
    price: 1200,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop",
    isAvailable: true,
    facilities: ["Parking", "Washroom", "Floodlights", "Drinking Water"],
    description: "Premium box cricket facility with international-standard turf and professional lighting. Perfect for corporate matches and friendly games.",
    timeSlots: ["6:00 AM", "7:00 AM", "8:00 AM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"]
  },
  {
    id: 2,
    name: "Cricket Hub Sports",
    location: "Powai, Mumbai",
    price: 1500,
    rating: 4.9,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop",
    isAvailable: true,
    facilities: ["Parking", "Washroom", "Floodlights", "Cafeteria", "Equipment Rental"],
    description: "State-of-the-art indoor cricket facility with air conditioning and premium amenities. Ideal for serious players.",
    timeSlots: ["6:00 AM", "7:00 AM", "9:00 AM", "10:00 AM", "4:00 PM", "5:00 PM", "8:00 PM", "9:00 PM"]
  },
  {
    id: 3,
    name: "Strike Zone Turf",
    location: "Bandra East, Mumbai",
    price: 1000,
    rating: 4.5,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=800&auto=format&fit=crop",
    isAvailable: false,
    facilities: ["Parking", "Washroom", "Floodlights"],
    description: "Affordable yet quality box cricket experience. Great for weekend games with friends and family.",
    timeSlots: ["7:00 AM", "8:00 AM", "9:00 AM", "6:00 PM", "7:00 PM", "8:00 PM"]
  },
  {
    id: 4,
    name: "Champions Cricket Box",
    location: "Thane West, Mumbai",
    price: 900,
    rating: 4.6,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1593766788306-28561086694e?w=800&auto=format&fit=crop",
    isAvailable: true,
    facilities: ["Parking", "Washroom", "Floodlights", "First Aid"],
    description: "Popular community cricket box with excellent maintenance and friendly staff. Best value for money.",
    timeSlots: ["5:00 AM", "6:00 AM", "7:00 AM", "8:00 AM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"]
  },
  {
    id: 5,
    name: "Elite Sports Arena",
    location: "Malad West, Mumbai",
    price: 1800,
    rating: 4.9,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1589802829985-817e51171b92?w=800&auto=format&fit=crop",
    isAvailable: true,
    facilities: ["Parking", "Washroom", "Floodlights", "Cafeteria", "Equipment Rental", "Coaching"],
    description: "Premium sports complex with professional coaching available. Perfect for tournaments and team practices.",
    timeSlots: ["6:00 AM", "8:00 AM", "10:00 AM", "2:00 PM", "4:00 PM", "6:00 PM", "8:00 PM"]
  },
  {
    id: 6,
    name: "Urban Cricket Zone",
    location: "Goregaon East, Mumbai",
    price: 1100,
    rating: 4.4,
    reviews: 178,
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop",
    isAvailable: true,
    facilities: ["Parking", "Washroom", "Floodlights", "Seating Area"],
    description: "Modern urban cricket facility with comfortable seating for spectators. Great atmosphere for competitive games.",
    timeSlots: ["6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"]
  }
];

export const bookings = [
  {
    id: 1,
    turfId: 1,
    turfName: "Green Arena Box Cricket",
    date: "2024-01-15",
    time: "6:00 PM",
    duration: 1,
    price: 1200,
    status: "upcoming"
  },
  {
    id: 2,
    turfId: 2,
    turfName: "Cricket Hub Sports",
    date: "2024-01-10",
    time: "7:00 PM",
    duration: 2,
    price: 3000,
    status: "completed"
  },
  {
    id: 3,
    turfId: 4,
    turfName: "Champions Cricket Box",
    date: "2024-01-08",
    time: "8:00 PM",
    duration: 1,
    price: 900,
    status: "cancelled"
  }
];