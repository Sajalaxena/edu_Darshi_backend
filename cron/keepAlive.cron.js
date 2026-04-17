import cron from "node-cron";
import https from "https";

const BACKEND_URL = process.env.BACKEND_URL;

// 🔄 Ping every 10 minutes to prevent Render cold starts
cron.schedule("*/10 * * * *", () => {
  console.log(`📡 [Keep-Alive] Pinging server at ${new Date().toISOString()}...`);
  
  https.get(BACKEND_URL, (res) => {
    console.log(`✅ [Keep-Alive] Ping successful | Status: ${res.statusCode}`);
  }).on("error", (err) => {
    console.error(`❌ [Keep-Alive] Ping failed | Error: ${err.message}`);
  });
});

console.log("🚀 Keep-Alive cron job initialized.");
