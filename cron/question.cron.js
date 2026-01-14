import cron from "node-cron";
import Question from "../models/Question.js";

cron.schedule("0 * * * *", async () => {
  const now = new Date();

  // 1️⃣ Archive expired active question
  await Question.updateMany(
    {
      isActive: true,
      createdAt: { $lte: new Date(now - 24 * 60 * 60 * 1000) },
    },
    {
      $set: { isActive: false, hasBeenShown: true },
    }
  );

  // 2️⃣ Activate today's question
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const q = await Question.findOne({
    scheduledDate: { $gte: today, $lt: tomorrow },
    hasBeenShown: false,
  });

  if (q) {
    await Question.updateMany(
      { isActive: true },
      { $set: { isActive: false } }
    );

    q.isActive = true;
    await q.save();

    console.log("✅ QOTD activated:", q._id);
  }
});
