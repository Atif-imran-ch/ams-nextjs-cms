import mongoose from "mongoose";
import * as dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../src/models/User";
import Article from "../src/models/Article";
import Category from "../src/models/Category";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please define the MONGODB_URI environment variable inside .env.local");
  process.exit(1);
}

const CATEGORIES = [
  { name: "Technology", slug: "technology" },
  { name: "Business", slug: "business" },
  { name: "Health & Wellness", slug: "health-wellness" },
  { name: "Lifestyle", slug: "lifestyle" },
  { name: "Travel", slug: "travel" },
];

const USERS = [
  { name: "Admin User", email: "admin@example.com", password: "password123", role: "Admin" },
  { name: "Alex Johnson", email: "alex@example.com", password: "password123", role: "User" },
  { name: "Sarah Smith", email: "sarah@example.com", password: "password123", role: "User" },
  { name: "Michael Chen", email: "michael@example.com", password: "password123", role: "User" },
  { name: "Emily Brown", email: "emily@example.com", password: "password123", role: "User" },
  { name: "David Wilson", email: "david@example.com", password: "password123", role: "User" },
];

const ARTICLES_DATA = [
  {
    title: "The Future of Artificial Intelligence in 2025",
    content: "<p>Artificial Intelligence is evolving at an unprecedented pace. From generative models to autonomous systems, the landscape of technology is shifting...</p>",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop",
    categoryIdx: 0,
  },
  {
    title: "10 Essential Tips for Sustainable Living",
    content: "<p>Living sustainably doesn't have to be difficult. Simple changes in your daily routine can make a massive impact on our planet's future...</p>",
    image: "https://images.unsplash.com/photo-1542601906-973be229a0c2?q=80&w=1000&auto=format&fit=crop",
    categoryIdx: 3,
  },
  {
    title: "Global Economic Trends to Watch This Quarter",
    content: "<p>Economists are focusing on several key indicators this year, including inflation rates and the rapid shift towards digital currencies...</p>",
    image: "https://images.unsplash.com/photo-1611974714024-4607a50d6c2a?q=80&w=1000&auto=format&fit=crop",
    categoryIdx: 1,
  },
  {
    title: "Mental Health: Why Mindfulness Matters",
    content: "<p>In our fast-paced world, taking a moment for mindfulness can significantly reduce stress and improve overall neurological well-being...</p>",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop",
    categoryIdx: 2,
  },
  {
    title: "Hidden Gems of Southeast Asia",
    content: "<p>Beyond the typical tourist trails lie breathtaking landscapes and rich cultural heritage sites that often go unnoticed by travelers...</p>",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1000&auto=format&fit=crop",
    categoryIdx: 4,
  },
  {
    title: "The Rise of Electric Vehicles: An In-Depth Look",
    content: "<p>Electric vehicles are no longer the future; they are the present. Major manufacturers are shifting their focus entirely to battery power...</p>",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1000&auto=format&fit=crop",
    categoryIdx: 0,
  },
  {
    title: "Modern Architecture and Urban Design",
    content: "<p>Buildings are becoming more than just shelters. They are now ecosystems that integrate greenery and energy-efficient materials...</p>",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop",
    categoryIdx: 3,
  },
  {
    title: "Scaling Your Startup: Lessons from Founders",
    content: "<p>Growth is the goal for every startup, but scaling too quickly can be a trap. Here is how successful founders managed their expansion...</p>",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1000&auto=format&fit=crop",
    categoryIdx: 1,
  },
  {
    title: "Superfoods to Boost Your Immune System",
    content: "<p>What you eat directly impacts your body's ability to fight off illness. These top superfoods are packed with essential nutrients...</p>",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop",
    categoryIdx: 2,
  },
  {
    title: "The Ultimate Guide to Digital Nomadism",
    content: "<p>Working from anywhere is a dream for many. This guide covers the best cities for remote work and the tools you'll need...</p>",
    image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=1000&auto=format&fit=crop",
    categoryIdx: 4,
  },
  {
    title: "5G Technology: Connecting the World",
    content: "<p>The rollout of 5G is transforming how we communicate, providing faster speeds and lower latency for a new generation of devices...</p>",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop",
    categoryIdx: 0,
  },
  {
    title: "Balanced Living in the Digital Age",
    content: "<p>Constant connectivity can be exhausting. Finding a balance between our online and offline lives is crucial for long-term health...</p>",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop",
    categoryIdx: 3,
  },
  {
    title: "Investing in the Stock Market for Beginners",
    content: "<p>Stock market investing might seem daunting, but starting small and staying consistent is the key to building wealth over time...</p>",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1000&auto=format&fit=crop",
    categoryIdx: 1,
  },
  {
    title: "Yoga for Productivity: Simple Routines",
    content: "<p>A short yoga session during your workday can clear your mind and boost your energy levels more effectively than caffeine...</p>",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop",
    categoryIdx: 2,
  },
  {
    title: "Backpacking Across Europe on a Budget",
    content: "<p>Europoe doesn't have to be expensive. By staying in hostels and using rail passes, you can experience the continent's history for less...</p>",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1000&auto=format&fit=crop",
    categoryIdx: 4,
  },
  {
    title: "Cybersecurity Basics for Remote Workers",
    content: "<p>As more people work from home, protecting sensitive data is more important than ever. Follow these basic security protocols...</p>",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
    categoryIdx: 0,
  },
  {
    title: "Interior Design: Transforming Small Spaces",
    content: "<p>You don't need a mansion to have a beautiful home. These design tips will make any small apartment feel spacious and stylish...</p>",
    image: "https://images.unsplash.com/photo-1581578731522-745d05cb9703?q=80&w=1000&auto=format&fit=crop",
    categoryIdx: 3,
  },
  {
    title: "Leadership in the Remote Work Era",
    content: "<p>Managing a team you can't see requires a different set of skills. Trust, communication, and clear objectives are the new foundations...</p>",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop",
    categoryIdx: 1,
  },
  {
    title: "Nutritional Myths Debunked by Science",
    content: "<p>There is a lot of misinformation about diet. We look at the latest scientific studies to separate fact from fiction in nutrition...</p>",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop",
    categoryIdx: 2,
  },
  {
    title: "Photography Tips for Stunning Portraits",
    content: "<p>Capturing the perfect portrait is about more than just the camera. It is about light, composition, and connection with your subject...</p>",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1000&auto=format&fit=crop",
    categoryIdx: 3,
  },
];

async function seed() {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(MONGODB_URI!);

    console.log("Cleaning Database...");
    await Promise.all([
      User.deleteMany({}),
      Article.deleteMany({}),
      Category.deleteMany({}),
    ]);

    console.log("Seeding Categories...");
    const createdCategories = await Category.insertMany(CATEGORIES);

    console.log("Seeding Users...");
    const hashedUsers = await Promise.all(
      USERS.map(async (u) => ({
        ...u,
        password: await bcrypt.hash(u.password, 10),
      }))
    );
    const createdUsers = await User.insertMany(hashedUsers);
    
    // Separate admin and regular users
    const regularUsers = createdUsers.filter(u => u.role === "User");
    const adminUser = createdUsers.find(u => u.role === "Admin");

    console.log("Seeding Articles...");
    const articlesToInsert = ARTICLES_DATA.map((article, index) => {
      // Assign 4 articles to each of the 5 regular users
      const author = regularUsers[Math.floor(index / 4)];
      return {
        ...article,
        author: author._id,
        category: createdCategories[article.categoryIdx]._id,
        slug: article.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
      };
    });

    await Article.insertMany(articlesToInsert);

    console.log("-----------------------------------------");
    console.log("SEEDING COMPLETED SUCCESSFULLY!");
    console.log(`- Categories: ${createdCategories.length}`);
    console.log(`- Users: ${createdUsers.length} (incl. 1 Admin)`);
    console.log("- Articles: 20 (4 per regular user)");
    console.log("-----------------------------------------");

    process.exit(0);
  } catch (error) {
    console.error("SEEDING FAILED:", error);
    process.exit(1);
  }
}

seed();
