/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
const { PrismaClient } = require("@prisma/client");

const TABLES = [
  { name: "User", pk: "id", updatedAt: "updatedAt" },
  { name: "Dashboard", pk: "id" },
  { name: "DashboardEvent", pk: "id" },
  { name: "Product", pk: "id", updatedAt: "updatedAt" },
  { name: "CardDesign", pk: "id", updatedAt: "createdAt" },
  { name: "Company", pk: "id", updatedAt: "createdAt" },
  { name: "Subscription", pk: "id" },
  { name: "Invoice", pk: "id", updatedAt: "createdAt" },
  { name: "Subscribed", pk: "id", updatedAt: "createdAt" },
  { name: "CRMDeal", pk: "id", updatedAt: "updatedAt" },
  { name: "CRMNote", pk: "id", updatedAt: "updatedAt" },
  { name: "CRMTask", pk: "id", updatedAt: "updatedAt" },
  { name: "WebhookEvent", pk: "id", updatedAt: "updatedAt" },
  { name: "Contact", pk: "id", updatedAt: "sendedOn" },
];

const DEFAULT_BATCH_SIZE = 500;
const REPORT_DIR = path.join(process.cwd(), "sync-reports");

function parseArgs(argv) {
  const flags = new Set(argv.slice(2));
  const backupOnly = flags.has("--backup-only");

  return {
    execute: flags.has("--execute") && !backupOnly,
    dryRun: (flags.has("--dry-run") || !flags.has("--execute")) && !backupOnly,
    backupOnly,
    strict: flags.has("--strict"),
    batchSize:
      Number.parseInt(
        argv.find((arg) => arg.startsWith("--batch-size="))?.split("=")[1] || "",
        10,
      ) || DEFAULT_BATCH_SIZE,
  };
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function ensureReportDir() {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

function quoteIdentifier(identifier) {
  return `"${String(identifier).replace(/"/g, '""')}"`;
}

function buildInsertQuery(tableName, columns, pkColumn, columnTypes = {}) {
  const identifiers = columns.map(quoteIdentifier).join(", ");
  const placeholders = columns
    .map((column, index) => {
      const typeInfo = columnTypes[column];
      if (typeInfo?.dataType === "USER-DEFINED" || typeInfo?.dataType === "user-defined") {
        return `$${index + 1}::${quoteIdentifier(typeInfo.udtName)}`;
      }
      return `$${index + 1}`;
    })
    .join(", ");
  const updateColumns = columns
    .filter((column) => column !== pkColumn)
    .map((column) => `${quoteIdentifier(column)} = EXCLUDED.${quoteIdentifier(column)}`)
    .join(", ");

  const conflict = quoteIdentifier(pkColumn);
  return `
    INSERT INTO ${quoteIdentifier(tableName)} (${identifiers})
    VALUES (${placeholders})
    ON CONFLICT (${conflict})
    DO UPDATE SET ${updateColumns}
  `;
}

function normalizeValue(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Buffer.isBuffer(value)) {
    return value.toString("utf8");
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  if (Array.isArray(value)) {
    return value.map(normalizeValue);
  }

  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = normalizeValue(value[key]);
        return acc;
      }, {});
  }

  return value;
}

function valuesDiffer(sourceRow, targetRow, columns) {
  return columns.some((column) => {
    const sourceValue = normalizeValue(sourceRow[column]);
    const targetValue = normalizeValue(targetRow[column]);
    return JSON.stringify(sourceValue) !== JSON.stringify(targetValue);
  });
}

function sourceIsPreferred(sourceRow, targetRow, updatedAtColumn) {
  if (!updatedAtColumn || !(updatedAtColumn in sourceRow) || !(updatedAtColumn in targetRow)) {
    return true;
  }

  const sourceValue = sourceRow[updatedAtColumn];
  const targetValue = targetRow[updatedAtColumn];

  if (!sourceValue || !targetValue) {
    return true;
  }

  const sourceTime = new Date(sourceValue).getTime();
  const targetTime = new Date(targetValue).getTime();

  if (Number.isNaN(sourceTime) || Number.isNaN(targetTime)) {
    return true;
  }

  return sourceTime >= targetTime;
}

async function getMysqlColumns(connection, tableName) {
  const [rows] = await connection.query(`SHOW COLUMNS FROM \`${tableName}\``);
  return rows.map((row) => row.Field);
}

async function getPostgresColumns(prisma, tableName) {
  const rows = await prisma.$queryRawUnsafe(
    `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position
    `,
    tableName,
  );
  return rows.map((row) => row.column_name);
}

async function getPostgresColumnTypes(prisma, tableName) {
  const rows = await prisma.$queryRawUnsafe(
    `
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position
    `,
    tableName,
  );

  return rows.reduce((acc, row) => {
    acc[row.column_name] = {
      dataType: row.data_type,
      udtName: row.udt_name,
    };
    return acc;
  }, {});
}

async function getCountMysql(connection, tableName) {
  const [rows] = await connection.query(`SELECT COUNT(*) AS count FROM \`${tableName}\``);
  return Number(rows[0]?.count || 0);
}

async function getCountPostgres(prisma, tableName) {
  const rows = await prisma.$queryRawUnsafe(
    `SELECT COUNT(*)::int AS count FROM ${quoteIdentifier(tableName)}`,
  );
  return Number(rows[0]?.count || 0);
}

async function fetchMysqlBatch(connection, tableName, pkColumn, limit, offset) {
  const [rows] = await connection.query(
    `SELECT * FROM \`${tableName}\` ORDER BY \`${pkColumn}\` LIMIT ? OFFSET ?`,
    [limit, offset],
  );
  return rows;
}

async function fetchTargetRows(prisma, tableName, pkColumn, ids) {
  if (ids.length === 0) {
    return [];
  }

  const placeholders = ids.map((_, index) => `$${index + 1}`).join(", ");
  return prisma.$queryRawUnsafe(
    `SELECT * FROM ${quoteIdentifier(tableName)} WHERE ${quoteIdentifier(pkColumn)} IN (${placeholders})`,
    ...ids,
  );
}

async function upsertRows(prisma, tableName, columns, pkColumn, rows, columnTypes) {
  const query = buildInsertQuery(tableName, columns, pkColumn, columnTypes);
  for (const row of rows) {
    const values = columns.map((column) => row[column] ?? null);
    await prisma.$executeRawUnsafe(query, ...values);
  }
}

function coerceValueForTarget(value, typeInfo) {
  if (value === null || value === undefined || !typeInfo) {
    return value ?? null;
  }

  const lowerDataType = String(typeInfo.dataType || "").toLowerCase();
  const lowerUdtName = String(typeInfo.udtName || "").toLowerCase();

  if (lowerDataType === "boolean") {
    if (typeof value === "boolean") {
      return value;
    }
    if (typeof value === "number" || typeof value === "bigint") {
      return Number(value) !== 0;
    }
    if (typeof value === "string") {
      return !["0", "false", ""].includes(value.toLowerCase());
    }
  }

  if (
    lowerDataType === "integer" ||
    lowerDataType === "smallint" ||
    lowerDataType === "bigint"
  ) {
    if (typeof value === "bigint") {
      return Number(value);
    }
    if (typeof value === "string" && value.trim() !== "") {
      return Number(value);
    }
  }

  if (
    lowerDataType === "double precision" ||
    lowerDataType === "numeric" ||
    lowerDataType === "real"
  ) {
    if (typeof value === "string" && value.trim() !== "") {
      return Number(value);
    }
  }

  if (lowerDataType.includes("timestamp") || lowerDataType === "date") {
    return value instanceof Date ? value : new Date(value);
  }

  if (lowerDataType === "user-defined") {
    return String(value);
  }

  return value;
}

async function getRecentSamples(connection, tableName, candidateColumns, availableColumns, limit = 5) {
  const orderColumn = candidateColumns.find(
    (column) => Boolean(column) && availableColumns.includes(column),
  );
  if (!orderColumn) {
    const [rows] = await connection.query(`SELECT * FROM \`${tableName}\` LIMIT ?`, [limit]);
    return rows;
  }

  const [rows] = await connection.query(
    `SELECT * FROM \`${tableName}\` ORDER BY \`${orderColumn}\` DESC LIMIT ?`,
    [limit],
  );
  return rows;
}

async function backupTargetTable(prisma, tableName, pkColumn) {
  return prisma.$queryRawUnsafe(
    `SELECT * FROM ${quoteIdentifier(tableName)} ORDER BY ${quoteIdentifier(pkColumn)}`,
  );
}

async function createTargetBackup(prisma) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(REPORT_DIR, `supabase-backup-before-sync-${timestamp}.json`);
  const backup = {
    createdAt: new Date().toISOString(),
    tables: {},
  };

  for (const tableConfig of TABLES) {
    backup.tables[tableConfig.name] = normalizeValue(
      await backupTargetTable(prisma, tableConfig.name, tableConfig.pk),
    );
  }

  fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
  return backupPath;
}

async function syncTable({ source, target, tableConfig, options, report }) {
  const { name: tableName, pk: pkColumn, updatedAt } = tableConfig;
  const tableReport = {
    table: tableName,
    primaryKey: pkColumn,
    sourceCountBefore: 0,
    targetCountBefore: 0,
    targetCountAfter: 0,
    inserts: 0,
    updates: 0,
    skips: 0,
    incompatibleColumns: [],
    targetOnlyColumns: [],
    sourceOnlyColumns: [],
    recentSourceSamples: [],
    errors: [],
  };

  report.tables.push(tableReport);

  const [sourceColumns, targetColumns] = await Promise.all([
    getMysqlColumns(source, tableName),
    getPostgresColumns(target, tableName),
  ]);
  const targetColumnTypes = await getPostgresColumnTypes(target, tableName);

  tableReport.sourceOnlyColumns = sourceColumns.filter((column) => !targetColumns.includes(column));
  tableReport.targetOnlyColumns = targetColumns.filter((column) => !sourceColumns.includes(column));

  const sharedColumns = sourceColumns.filter((column) => targetColumns.includes(column));

  if (!sharedColumns.includes(pkColumn)) {
    const message = `Primary key ${pkColumn} not found in shared columns for ${tableName}`;
    tableReport.errors.push(message);
    if (options.strict) {
      throw new Error(message);
    }
    return;
  }

  tableReport.incompatibleColumns = [...tableReport.sourceOnlyColumns, ...tableReport.targetOnlyColumns];
  tableReport.recentSourceSamples = (await getRecentSamples(
    source,
    tableName,
    [updatedAt, "createdAt", pkColumn],
    sourceColumns,
  )).map((row) => normalizeValue(row));

  tableReport.sourceCountBefore = await getCountMysql(source, tableName);
  tableReport.targetCountBefore = await getCountPostgres(target, tableName);

  const totalBatches = Math.ceil(tableReport.sourceCountBefore / options.batchSize);

  for (let batchIndex = 0; batchIndex < totalBatches; batchIndex += 1) {
    const offset = batchIndex * options.batchSize;
    const sourceRows = await fetchMysqlBatch(source, tableName, pkColumn, options.batchSize, offset);
    const ids = sourceRows.map((row) => row[pkColumn]);
    const targetRows = await fetchTargetRows(target, tableName, pkColumn, ids);
    const targetById = new Map(targetRows.map((row) => [row[pkColumn], row]));

    const rowsToUpsert = [];

    for (const sourceRow of sourceRows) {
      const normalizedSourceRow = sharedColumns.reduce((acc, column) => {
        acc[column] = coerceValueForTarget(sourceRow[column], targetColumnTypes[column]);
        return acc;
      }, {});
      const targetRow = targetById.get(sourceRow[pkColumn]);

      if (!targetRow) {
        tableReport.inserts += 1;
        if (options.execute) {
          rowsToUpsert.push(normalizedSourceRow);
        }
        continue;
      }

      const different = valuesDiffer(normalizedSourceRow, targetRow, sharedColumns);
      if (!different) {
        tableReport.skips += 1;
        continue;
      }

      if (sourceIsPreferred(sourceRow, targetRow, updatedAt)) {
        tableReport.updates += 1;
        if (options.execute) {
          rowsToUpsert.push(normalizedSourceRow);
        }
      } else {
        tableReport.skips += 1;
      }
    }

    if (options.execute && rowsToUpsert.length > 0) {
      await upsertRows(target, tableName, sharedColumns, pkColumn, rowsToUpsert, targetColumnTypes);
    }
  }

  tableReport.targetCountAfter = options.execute
    ? await getCountPostgres(target, tableName)
    : tableReport.targetCountBefore + tableReport.inserts;
}

async function main() {
  const options = parseArgs(process.argv);
  const startedAt = new Date().toISOString();
  const targetUrl = requireEnv("SUPABASE_POSTGRES_URL");
  const sourceUrl = options.backupOnly ? null : requireEnv("RAILWAY_MYSQL_URL");

  ensureReportDir();

  const report = {
    mode: options.backupOnly ? "backup-only" : options.execute ? "execute" : "dry-run",
    startedAt,
    finishedAt: null,
    batchSize: options.batchSize,
    strict: options.strict,
    sourceHost: sourceUrl ? new URL(sourceUrl).hostname : null,
    targetHost: new URL(targetUrl).hostname,
    backupPath: null,
    tables: [],
    errors: [],
  };

  const mysqlConnection = sourceUrl ? await mysql.createConnection(sourceUrl) : null;
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: targetUrl,
      },
    },
  });

  try {
    if (mysqlConnection) {
      await mysqlConnection.query("SELECT 1");
    }
    await prisma.$queryRawUnsafe("SELECT 1");

    if (options.backupOnly) {
      report.backupPath = await createTargetBackup(prisma);
      report.finishedAt = new Date().toISOString();
      const reportPath = path.join(
        REPORT_DIR,
        `railway-to-supabase-${report.mode}-${report.finishedAt.replace(/[:.]/g, "-")}.json`,
      );
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`Target backup written to ${report.backupPath}`);
      console.log(`Backup report written to ${reportPath}`);
      return;
    }
    console.log(`Starting ${report.mode} sync from Railway MySQL to Supabase Postgres...`);
    console.log(`Batch size: ${options.batchSize}`);

    if (options.execute) {
      report.backupPath = await createTargetBackup(prisma);
      console.log(`Target backup written to ${report.backupPath}`);
    }

    for (const tableConfig of TABLES) {
      console.log(`Processing ${tableConfig.name}...`);
      await syncTable({
        source: mysqlConnection,
        target: prisma,
        tableConfig,
        options,
        report,
      });
    }

    report.finishedAt = new Date().toISOString();
    const fileName = `railway-to-supabase-${report.mode}-${report.finishedAt
      .replace(/[:.]/g, "-")}.json`;
    const reportPath = path.join(REPORT_DIR, fileName);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log(`Sync complete. Report written to ${reportPath}`);
    for (const table of report.tables) {
      console.log(
        `${table.table}: source=${table.sourceCountBefore} target(before)=${table.targetCountBefore} inserts=${table.inserts} updates=${table.updates} skips=${table.skips} target(after)=${table.targetCountAfter}`,
      );
    }

    if (!options.execute) {
      console.log("Dry-run only. No writes were made to Supabase.");
    }
  } catch (error) {
    report.finishedAt = new Date().toISOString();
    report.errors.push(error instanceof Error ? error.message : String(error));
    const failedReportPath = path.join(
      REPORT_DIR,
      `railway-to-supabase-failed-${Date.now()}.json`,
    );
    fs.writeFileSync(failedReportPath, JSON.stringify(report, null, 2));
    console.error(`Sync failed. Report written to ${failedReportPath}`);
    throw error;
  } finally {
    await prisma.$disconnect();
    if (mysqlConnection) {
      await mysqlConnection.end();
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
