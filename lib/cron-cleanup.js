import cron from "node-cron";
import fs from "fs/promises";
import path from "path";

const tempDir = path.join(process.cwd(), "tmp");

// Global variable taaki cron baar-baar start na ho
let isCronStarted = false;

export const initCleanupCron = () => {
  if (isCronStarted) return; // Agar already chal raha hai toh wapas jao

  console.log("🕒 Global Cleanup Cron Job Initialized...");
  isCronStarted = true;

  // Har 1 minute mein ye task chalega (* * * * *)
  cron.schedule("* * * * *", async () => {
    try {
      // Folder check karein (kabhi kabhi delete ho jata hai)
      try {
        await fs.access(tempDir);
      } catch {
        return; // Folder nahi hai toh kuch mat karo
      }

      const files = await fs.readdir(tempDir);
      const now = Date.now();
      const THIRTY_SECONDS = 30 * 1000; // 30 Seconds ka time limit

      if (files.length > 0) {
        console.log(`🧹 Scanning ${files.length} files for cleanup...`);
      }

      for (const file of files) {
        // Zaroori files ko chhod kar sab delete karein
        if (file === "usage_stats.json" || file === ".gitignore" || file.startsWith(".")) continue;

        const filePath = path.join(tempDir, file);
        
        try {
            const stats = await fs.stat(filePath);

            // Agar file 30 seconds se purani hai toh delete karein
            if (now - stats.mtimeMs > THIRTY_SECONDS) {
            await fs.rm(filePath, { recursive: true, force: true });
            console.log(`✅ Auto-Deleted: ${file}`);
            }
        } catch (err) {
            // Kabhi kabhi file read karte waqt delete ho jati hai, ignore errors
        }
      }
    } catch (err) {
      console.error("❌ Cron Cleanup Error:", err.message);
    }
  });
};