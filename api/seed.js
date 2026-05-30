// Seeds the database with demo property listings so the site has content
// to interact with on first visit (home page sections + search results).
//
// Usage:  node api/seed.js     (reads MONGO_DB_URL from the environment / .env)
//
// It is idempotent: it owns the demo data via a dedicated "demo" user and
// removes that user's previous listings before re-inserting, so running it
// repeatedly will not create duplicates.
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Listing from "./models/listing.model.js";
import User from "./models/user.model.js";

dotenv.config();

const img = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

// A few stable Unsplash real-estate photo ids, reused across listings.
const HOUSE = "1600596542815-ffad4c1539a9";
const HOUSE2 = "1600585154340-be6161a56a0c";
const HOUSE3 = "1600607687939-ce8a6c25118c";
const HOUSE4 = "1600566753086-00f18fb6b3ea";
const APT = "1502672260266-1c1ef2d93688";
const APT2 = "1493809842364-78817add7ffb";
const VILLA = "1613490493576-7fde63acd811";
const INTERIOR = "1505691938895-1758d7feb511";

const demoListings = [
  {
    name: "Modern Family Villa with Garden",
    description:
      "A bright, fully furnished 4-bedroom villa in a quiet gated community. Spacious living areas, a landscaped garden, and a covered parking space for two cars. Walking distance to schools and parks.",
    address: "12 Canal View, DHA Phase 6, Lahore",
    regularPrice: 85000,
    discountPrice: 72000,
    bathrooms: 4,
    bedrooms: 4,
    furnished: true,
    parking: true,
    type: "rent",
    offer: true,
    imageUrls: [img(VILLA), img(INTERIOR), img(HOUSE)],
  },
  {
    name: "Cozy 2-Bedroom Apartment Downtown",
    description:
      "Centrally located apartment with modern fittings, an open kitchen, and a balcony overlooking the city. Ideal for young professionals and small families.",
    address: "Flat 7B, Gulberg III, Lahore",
    regularPrice: 45000,
    discountPrice: 39000,
    bathrooms: 2,
    bedrooms: 2,
    furnished: true,
    parking: false,
    type: "rent",
    offer: true,
    imageUrls: [img(APT), img(APT2)],
  },
  {
    name: "Luxury Penthouse with City Skyline Views",
    description:
      "Top-floor penthouse featuring floor-to-ceiling windows, a private terrace, and premium finishes throughout. Building amenities include a gym, pool, and 24/7 security.",
    address: "Penthouse, Emaar Crescent Bay, Karachi",
    regularPrice: 28500000,
    discountPrice: 26900000,
    bathrooms: 3,
    bedrooms: 3,
    furnished: true,
    parking: true,
    type: "sale",
    offer: true,
    imageUrls: [img(INTERIOR), img(APT2), img(HOUSE2)],
  },
  {
    name: "Spacious Suburban House for Sale",
    description:
      "A well-maintained 5-bedroom family home on a double plot. Large drawing and dining rooms, a separate servant quarter, and ample parking. Move-in ready.",
    address: "House 245, Bahria Town, Rawalpindi",
    regularPrice: 19500000,
    discountPrice: 0,
    bathrooms: 5,
    bedrooms: 5,
    furnished: false,
    parking: true,
    type: "sale",
    offer: false,
    imageUrls: [img(HOUSE), img(HOUSE3), img(HOUSE4)],
  },
  {
    name: "Charming Cottage Near the Hills",
    description:
      "A peaceful retreat with a wooden interior, fireplace, and a wraparound porch. Surrounded by greenery yet close to the main road. Perfect weekend getaway or permanent home.",
    address: "Plot 9, Bhurban Road, Murree",
    regularPrice: 65000,
    discountPrice: 0,
    bathrooms: 2,
    bedrooms: 3,
    furnished: true,
    parking: true,
    type: "rent",
    offer: false,
    imageUrls: [img(HOUSE2), img(HOUSE4)],
  },
  {
    name: "Contemporary Studio for Rent",
    description:
      "Compact and stylish studio with smart storage, high-speed internet ready, and a shared rooftop lounge. Great for students and singles in the heart of the city.",
    address: "Studio 3, Clifton Block 5, Karachi",
    regularPrice: 32000,
    discountPrice: 0,
    bathrooms: 1,
    bedrooms: 1,
    furnished: true,
    parking: false,
    type: "rent",
    offer: false,
    imageUrls: [img(APT2), img(INTERIOR)],
  },
  {
    name: "Elegant 3-Bedroom Home with Lawn",
    description:
      "Beautifully designed home featuring an open-plan kitchen, marble flooring, and a sunny front lawn. Located in a family-friendly neighborhood with easy access to markets.",
    address: "House 88, Wapda Town, Lahore",
    regularPrice: 16750000,
    discountPrice: 15900000,
    bathrooms: 3,
    bedrooms: 3,
    furnished: false,
    parking: true,
    type: "sale",
    offer: true,
    imageUrls: [img(HOUSE3), img(HOUSE), img(INTERIOR)],
  },
  {
    name: "Premium Corner Plot Bungalow",
    description:
      "A grand corner bungalow with double-height ceilings, a home office, and a large backyard ideal for entertaining. Solar-ready and equipped with a backup generator.",
    address: "Bungalow 1, F-7, Islamabad",
    regularPrice: 42000000,
    discountPrice: 0,
    bathrooms: 6,
    bedrooms: 6,
    furnished: true,
    parking: true,
    type: "sale",
    offer: false,
    imageUrls: [img(HOUSE4), img(HOUSE2), img(VILLA)],
  },
];

const run = async () => {
  if (!process.env.MONGO_DB_URL) {
    console.error("❌ MONGO_DB_URL is not set. Set it in .env or the environment.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_DB_URL);
  console.log("✅ Connected to MongoDB");

  // 1. Ensure a demo user exists to own the listings.
  const demoEmail = "demo@alrehmanestate.com";
  let demoUser = await User.findOne({ email: demoEmail });
  if (!demoUser) {
    demoUser = await User.create({
      username: "demo",
      email: demoEmail,
      password: bcrypt.hashSync("demo12345", 10),
    });
    console.log("👤 Created demo user (login: demo@alrehmanestate.com / demo12345)");
  } else {
    console.log("👤 Reusing existing demo user");
  }

  // 2. Remove this demo user's previous listings (idempotent re-seed).
  const removed = await Listing.deleteMany({ userRef: demoUser._id.toString() });
  if (removed.deletedCount) {
    console.log(`🧹 Removed ${removed.deletedCount} old demo listing(s)`);
  }

  // 3. Insert the demo listings owned by the demo user.
  const docs = demoListings.map((l) => ({ ...l, userRef: demoUser._id.toString() }));
  const inserted = await Listing.insertMany(docs);
  console.log(`🏠 Inserted ${inserted.length} demo listing(s)`);

  await mongoose.disconnect();
  console.log("✅ Done");
  process.exit(0);
};

run().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
