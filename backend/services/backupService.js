const fs = require('fs');
const path = require('path');
const sequelize = require('../config/database');

const BACKUP_DIR = path.join(__dirname, '../backups');

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

/**
 * Generates an SQL backup file for excelmind_academic
 * @param {'daily' | 'weekly' | 'monthly'} type 
 */
async function createBackup(type = 'daily') {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `excelmind_academic_${type}_${timestamp}.sql`;
  const filePath = path.join(BACKUP_DIR, fileName);

  let sqlOutput = `-- ==========================================================\n`;
  sqlOutput += `-- ExcelMind Academic Companion Database Backup\n`;
  sqlOutput += `-- Type: ${type.toUpperCase()} BACKUP\n`;
  sqlOutput += `-- Created: ${new Date().toISOString()}\n`;
  sqlOutput += `-- Database: excelmind_academic\n`;
  sqlOutput += `-- ==========================================================\n\n`;
  sqlOutput += `SET FOREIGN_KEY_CHECKS=0;\n\n`;

  const [tables] = await sequelize.query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'excelmind_academic'");

  for (const tableObj of tables) {
    const tableName = tableObj.TABLE_NAME;
    sqlOutput += `-- --------------------------------------------------------\n`;
    sqlOutput += `-- Table structure for table \`${tableName}\`\n`;
    sqlOutput += `-- --------------------------------------------------------\n`;

    try {
      const [createResult] = await sequelize.query(`SHOW CREATE TABLE \`${tableName}\``);
      if (createResult && createResult[0]) {
        const createSql = createResult[0]['Create Table'];
        sqlOutput += `DROP TABLE IF EXISTS \`${tableName}\`;\n`;
        sqlOutput += `${createSql};\n\n`;
      }

      const [rows] = await sequelize.query(`SELECT * FROM \`${tableName}\``);
      if (rows.length > 0) {
        sqlOutput += `-- Dumping data for table \`${tableName}\`\n`;
        for (const row of rows) {
          const keys = Object.keys(row).map(k => `\`${k}\``).join(', ');
          const values = Object.values(row).map(v => {
            if (v === null || v === undefined) return 'NULL';
            if (typeof v === 'number') return v;
            if (v instanceof Date) return `'${v.toISOString().slice(0, 19).replace('T', ' ')}'`;
            return `'${String(v).replace(/'/g, "''").replace(/\\/g, '\\\\')}'`;
          }).join(', ');
          sqlOutput += `INSERT INTO \`${tableName}\` (${keys}) VALUES (${values});\n`;
        }
        sqlOutput += `\n`;
      }
    } catch (err) {
      console.warn(`[Backup Notice]: Skipping table ${tableName} (${err.message})`);
    }
  }

  sqlOutput += `SET FOREIGN_KEY_CHECKS=1;\n`;
  sqlOutput += `-- End of backup --\n`;

  fs.writeFileSync(filePath, sqlOutput, 'utf8');

  const stats = fs.statSync(filePath);
  return {
    success: true,
    fileName,
    filePath,
    type,
    sizeBytes: stats.size,
    sizeKB: Math.round(stats.size / 1024),
    tablesCount: tables.length,
    timestamp: new Date().toISOString()
  };
}

/**
 * List all generated backups
 */
function listBackups() {
  if (!fs.existsSync(BACKUP_DIR)) return [];
  const files = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.sql'));
  return files.map(f => {
    const fullPath = path.join(BACKUP_DIR, f);
    const stats = fs.statSync(fullPath);
    return {
      fileName: f,
      sizeBytes: stats.size,
      sizeKB: Math.round(stats.size / 1024),
      createdAt: stats.birthtime,
      type: f.includes('weekly') ? 'Weekly' : f.includes('monthly') ? 'Monthly' : 'Daily'
    };
  }).reverse();
}

module.exports = {
  createBackup,
  listBackups
};
