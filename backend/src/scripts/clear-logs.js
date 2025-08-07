const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../../logs');
const logFiles = ['combined.log', 'error.log'];

console.log('🧹 Clearing log files...');

logFiles.forEach(file => {
  const filePath = path.join(logsDir, file);

  try {
    if (fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '');
      console.log(`✅ Cleared ${file}`);
    } else {
      console.log(`⚠️  ${file} does not exist, skipping...`);
    }
  } catch (error) {
    console.error(`❌ Error clearing ${file}:`, error.message);
  }
});

console.log('🎉 Log files cleared successfully!');
