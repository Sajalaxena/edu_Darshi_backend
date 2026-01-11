import cron from "node-cron";
import Question from "../models/Question.js";

cron.schedule(
  "0 0 * * *",
  async () => {
    await Question.updateMany({ isActive: true }, { isActive: false });

    const q = await Question.aggregate([
      { $match: { hasBeenShown: false } },
      { $sample: { size: 1 } },
    ]);

    if (!q.length) return;

    await Question.updateOne(
      { _id: q[0]._id },
      { isActive: true, hasBeenShown: true }
    );

    console.log("✅ Question rotated");
  },
  { timezone: "Asia/Kolkata" }
);
