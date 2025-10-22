import winston from "winston";
import path from "path";
import { fileURLToPath } from "url";

const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, colorize, errors, json, simple } = format;

// Get current directory for file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom formatter for console output
const consoleFormat = printf(
  ({ level, message, timestamp, stack, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;

    // Add stack trace for errors
    if (stack) {
      log += `\n${stack}`;
    }

    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      log += `\n${JSON.stringify(meta, null, 2)}`;
    }

    return log;
  }
);

// Custom formatter for file output
const fileFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  const logEntry = {
    timestamp,
    level,
    message,
    ...(stack && { stack }),
    ...(Object.keys(meta).length > 0 && { meta }),
  };

  return JSON.stringify(logEntry);
});

// Custom formatter for development (colored and simplified)
const devFormat = combine(
  colorize(),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  consoleFormat
);

// Custom formatter for production (JSON format)
const prodFormat = combine(timestamp(), errors({ stack: true }), json());

// Custom formatter for file logging
const fileLogFormat = combine(timestamp(), errors({ stack: true }), fileFormat);

// Create the logger
const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: process.env.NODE_ENV === "production" ? prodFormat : devFormat,
  defaultMeta: { service: "node-express-backend" },
  transports: [
    // Console transport
    new transports.Console({
      format: process.env.NODE_ENV === "production" ? prodFormat : devFormat,
    }),

    // File transport for all logs
    new transports.File({
      filename: path.join(__dirname, "logs", "combined.log"),
      format: fileLogFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),

    // File transport for errors only
    new transports.File({
      filename: path.join(__dirname, "logs", "error.log"),
      level: "error",
      format: fileLogFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],

  // Handle uncaught exceptions
  exceptionHandlers: [
    new transports.File({
      filename: path.join(__dirname, "logs", "exceptions.log"),
      format: fileLogFormat,
    }),
  ],

  // Handle unhandled promise rejections
  rejectionHandlers: [
    new transports.File({
      filename: path.join(__dirname, "logs", "rejections.log"),
      format: fileLogFormat,
    }),
  ],
});

// Add custom methods for different log levels with metadata
logger.infoWithMeta = (message, meta = {}) => {
  logger.info(message, meta);
};

logger.errorWithStack = (message, error, meta = {}) => {
  logger.error(message, {
    error: error.message,
    stack: error.stack,
    ...meta,
  });
};

logger.http = (req, res, responseTime) => {
  logger.info("HTTP Request", {
    method: req.method,
    url: req.url,
    status: res.statusCode,
    responseTime: `${responseTime}ms`,
    userAgent: req.get("User-Agent"),
    ip: req.ip,
  });
};

// Create logs directory if it doesn't exist
import fs from "fs";
const logsDir = path.join(__dirname, "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

export default logger;
