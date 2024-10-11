const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const apiRoutes = require("./routes/api");
require("dotenv").config();
const DataModel = require("./models/Data");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB");

    // Check if the collection is empty
    const dataCount = await DataModel.countDocuments();

    if (dataCount === 0) {
      console.log("No data found, seeding database...");

      const countries = [
        "United States of America",
        "Mexico",
        "Nigeria",
        "Lebanon",
        "Russia",
        "Saudi Arabia",
      ];

      const sampleData = [];

      for (let i = 1; i <= 30; i++) {
        sampleData.push({
          end_year: `${2020 + Math.floor(Math.random() * 5)}`, // Random year between 2020 and 2024
          intensity: Math.floor(Math.random() * 100), // Random number between 0 and 99 for intensity
          sector: `Sector ${i}`, // Random sector name
          topic: `Topic ${i}`, // Random topic
          insight: `Insight ${i}`, // Random insight
          url: `http://example.com/insight-${i}`, // Random URL
          region: `Region ${i}`, // Random region
          start_year: `${2015 + Math.floor(Math.random() * 5)}`, // Random year between 2015 and 2019
          impact: Math.random().toFixed(2), // Random number between 0 and 1 for impact (normalized)
          added: `2023-10-${String(Math.floor(Math.random() * 30) + 1).padStart(
            2,
            "0"
          )}`, // Random added date in October 2023
          published: `2023-09-${String(
            Math.floor(Math.random() * 30) + 1
          ).padStart(2, "0")}`, // Random published date in September 2023
          country: countries[Math.floor(Math.random() * countries.length)], // Randomly select from predefined countries
          relevance: Math.floor(Math.random() * 10) + 1, // Random relevance between 1 and 10
          pestle: `Pestle ${i}`, // Random pestle
          source: `Source ${i}`, // Random source
          title: `Title ${i}`, // Random title
          likelihood: Math.floor(Math.random() * 100), // Random likelihood between 0 and 99
        });
      }

      // Seed the database with sample data
      await DataModel.insertMany(sampleData);
      console.log("Database seeded with sample data.");
    } else {
      console.log("Data already exists, skipping seeding.");
    }
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

// Routes
app.use("/api", apiRoutes);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
