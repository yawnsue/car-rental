require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../../database/models/User");

const MONGO_URI = "mongodb://127.0.0.1:27017/turo_rental_db";

async function seedUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected for seeding");

    const users = [
      {
        username: "admin_demo",
        password: "admin123",
        role: "Administrator",
      },
      {
        username: "user_demo",
        password: "user123",
        role: "Standard",
      },
    ];

    for (const user of users) {
      const existingUser = await User.findOne({ username: user.username });

      if (existingUser) {
        await User.deleteOne({ username: user.username });
        console.log(`Removed existing user: ${user.username}`);
      }

      const newUser = new User({
        username: user.username,
        password: user.password,
        role: user.role,
      });

      await newUser.save();
      console.log(`Created user: ${user.username}`);
    }

    console.log("Seeding complete ✅");
    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seedUsers();