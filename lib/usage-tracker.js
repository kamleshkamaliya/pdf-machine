import fs from 'fs/promises';
import path from 'path';

const TRACKER_FILE = path.join(process.cwd(), 'tmp', 'usage_stats.json');

export async function getAdobeUsage() {
  try {
    const data = await fs.readFile(TRACKER_FILE, 'utf8');
    const stats = JSON.parse(data);
    
    // Naye mahine mein reset karne ka logic
    const currentMonth = new Date().getMonth();
    if (stats.month !== currentMonth) {
      return { count: 0, month: currentMonth };
    }
    return stats;
  } catch {
    return { count: 0, month: new Date().getMonth() };
  }
}

export async function incrementUsage() {
  const stats = await getAdobeUsage();
  stats.count += 1;
  await fs.writeFile(TRACKER_FILE, JSON.stringify(stats));
}