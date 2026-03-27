import mongoose from "mongoose";
import dotenv from "dotenv";

// Import old models
import ResearchNews from "./models/ResearchNews.js";
import Webinar from "./models/webinar.model.js";

// Import new models
import Job from "./models/Job.js";
import Event from "./models/Event.js";

dotenv.config();

const migrateData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB for Migration");

    // 1. Migrate Webinars to Events
    const oldWebinars = await Webinar.find({});
    let eventCount = 0;
    for (const w of oldWebinars) {
      // check if it already exists to avoid duplicates
      const exists = await Event.findOne({ title: w.title, startDate: w.date });
      if (!exists) {
        await Event.create({
          title: w.title,
          eventType: "seminar", // Since webinar isn't in the new enum, seminar is closest
          subSubject: "Other",
          level: "All",
          venue: w.platform || "Online",
          startDate: w.date + (w.time ? ` ${w.time}` : ""),
          description: w.description || "",
          externalLink: w.registrationLink || "",
        });
        eventCount++;
      }
    }
    console.log(`Migrated ${eventCount} Webinars to Events`);

    // 2. Migrate ResearchNews to Jobs
    const oldNews = await ResearchNews.find({});
    let jobCount = 0;
    for (const n of oldNews) {
      const exists = await Job.findOne({ title: n.title });
      if (!exists) {
        await Job.create({
          title: n.title,
          institution: n.source || "",
          postedDate: n.publishedDate || "",
          deadline: "Not Specified", // old data didn't have strict deadline
          description: n.summary || "",
          externalLink: n.externalLink || "",
        });
        jobCount++;
      }
    }
    console.log(`Migrated ${jobCount} ResearchNews to Jobs`);

    console.log("Migration completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
};

migrateData();
