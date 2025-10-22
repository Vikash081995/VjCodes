# Node Express Backend

A Node.js Express backend application with comprehensive Winston logging capabilities.

## Features

- **Express.js** web framework
- **Winston Logger** with custom formatters
- **Morgan** HTTP request logger
- **Environment-based** configuration
- **File-based** logging with rotation
- **Error handling** and exception tracking

## Winston Logger Documentation

### Overview

The application includes a sophisticated Winston logger with custom formatters, multiple transports, and environment-aware configuration. The logger is designed to provide comprehensive logging capabilities for both development and production environments.

### Logger Features

#### 🎨 Custom Formatters

- **Console Format**: Human-readable, colored output for development
- **File Format**: JSON-structured logs for easy parsing and analysis
- **Development Format**: Colorized console output with detailed formatting
- **Production Format**: Clean JSON output optimized for production

#### 📁 Multiple Transports

- **Console Transport**: Colored output for development debugging
- **Combined Log File**: All logs in one file with automatic rotation
- **Error Log File**: Dedicated file for error-level logs only
- **Exception Handler**: Catches and logs uncaught exceptions
- **Rejection Handler**: Catches and logs unhandled promise rejections

#### 🔧 Custom Methods

- `logger.infoWithMeta()`: Log with additional metadata
- `logger.errorWithStack()`: Log errors with full stack traces
- `logger.http()`: Specialized HTTP request logging

### Installation

The logger is already configured and ready to use. No additional installation required.

```bash
npm install
```

### Basic Usage

```javascript
import logger from "./logger.js";

// Basic logging
logger.info("Application started");
logger.warn("This is a warning");
logger.error("An error occurred");
logger.debug("Debug information");
```

### Advanced Usage

#### Logging with Metadata

```javascript
// Log with additional context
logger.infoWithMeta("User action completed", {
  userId: "12345",
  action: "login",
  timestamp: new Date().toISOString(),
  ip: "192.168.1.1",
});
```

#### Error Logging with Stack Traces

```javascript
try {
  // Some operation that might fail
  throw new Error("Database connection failed");
} catch (error) {
  logger.errorWithStack("Database operation failed", error, {
    context: "user-authentication",
    query: "SELECT * FROM users WHERE id = ?",
    additionalInfo: "Connection timeout after 30 seconds",
  });
}
```

#### HTTP Request Logging

```javascript
// In your Express middleware
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const responseTime = Date.now() - start;
    logger.http(req, res, responseTime);
  });

  next();
});
```

### Configuration

#### Environment Variables

| Variable    | Description       | Default       | Example                                     |
| ----------- | ----------------- | ------------- | ------------------------------------------- |
| `NODE_ENV`  | Environment mode  | `development` | `production`                                |
| `LOG_LEVEL` | Minimum log level | `info`        | `debug`, `verbose`, `info`, `warn`, `error` |

#### Log Levels

Winston supports the following log levels (in order of priority):

1. `error` - Error messages
2. `warn` - Warning messages
3. `info` - Informational messages
4. `verbose` - Verbose messages
5. `debug` - Debug messages
6. `silly` - Silly messages

### Log Files

The logger automatically creates the following log files in the `logs/` directory:

| File             | Description          | Content                   |
| ---------------- | -------------------- | ------------------------- |
| `combined.log`   | All log levels       | Complete application logs |
| `error.log`      | Error level only     | Error and exception logs  |
| `exceptions.log` | Uncaught exceptions  | System-level exceptions   |
| `rejections.log` | Unhandled rejections | Promise rejection logs    |

### Log Rotation

- **Maximum file size**: 5MB per file
- **Maximum files**: 5 files per log type
- **Rotation**: Automatic when size limit is reached
- **Cleanup**: Oldest files are automatically removed

### Development vs Production

#### Development Mode

- **Console output**: Colorized and formatted
- **Timestamp format**: `YYYY-MM-DD HH:mm:ss`
- **Log level**: `info` (configurable)
- **Format**: Human-readable with metadata

#### Production Mode

- **Console output**: JSON format
- **Timestamp format**: ISO 8601
- **Log level**: `info` (configurable)
- **Format**: Structured JSON for log aggregation

### Example Log Outputs

#### Development Console Output

```
2025-10-22 11:34:28 [info]: Application started
{
  "service": "node-express-backend"
}

2025-10-22 11:34:28 [error]: Database connection failed
Error: Connection timeout
    at Database.connect (/app/db.js:15:10)
    at async main (/app/index.js:8:5)
{
  "service": "node-express-backend",
  "context": "database-init",
  "timeout": 30000
}
```

#### Production JSON Output

```json
{
  "timestamp": "2025-10-22T11:34:28.123Z",
  "level": "info",
  "message": "Application started",
  "service": "node-express-backend"
}
```

#### File Log Output

```json
{
  "timestamp": "2025-10-22 11:34:28",
  "level": "info",
  "message": "User logged in",
  "meta": {
    "service": "node-express-backend",
    "userId": "12345",
    "email": "user@example.com"
  }
}
```

### Best Practices

#### 1. Use Appropriate Log Levels

```javascript
// Good
logger.error("Database connection failed", { error: error.message });
logger.warn("High memory usage detected", { usage: "85%" });
logger.info("User authentication successful", { userId: user.id });

// Avoid
logger.info("Database connection failed"); // Should be error level
logger.error("User clicked button"); // Should be info level
```

#### 2. Include Relevant Context

```javascript
// Good - includes context
logger.error("Payment processing failed", {
  userId: user.id,
  orderId: order.id,
  amount: order.total,
  paymentMethod: order.paymentMethod,
  error: error.message,
});

// Avoid - lacks context
logger.error("Payment failed");
```

#### 3. Use Custom Methods for Specific Cases

```javascript
// For HTTP requests
logger.http(req, res, responseTime);

// For errors with stack traces
logger.errorWithStack("Operation failed", error, { context: "user-service" });

// For structured data
logger.infoWithMeta("Data processed", {
  recordsProcessed: count,
  processingTime: duration,
});
```

#### 4. Avoid Logging Sensitive Information

```javascript
// Good
logger.info("User login", { userId: user.id, email: user.email });

// Avoid
logger.info("User login", {
  userId: user.id,
  password: user.password, // Never log passwords!
  creditCard: user.creditCard, // Never log sensitive data!
});
```

### Integration with Express

#### Basic Integration

```javascript
import express from "express";
import logger from "./logger.js";

const app = express();

// Log all requests
app.use((req, res, next) => {
  logger.info("Incoming request", {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });
  next();
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.errorWithStack("Express error", error, {
    method: req.method,
    url: req.url,
    ip: req.ip,
  });

  res.status(500).json({ error: "Internal server error" });
});
```

#### With Morgan Integration

```javascript
import morgan from "morgan";

// Custom morgan format
const morganFormat =
  ":method :url :status :response-time ms - :res[content-length]";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);
```

### Troubleshooting

#### Common Issues

1. **Logs not appearing in files**

   - Check if `logs/` directory exists and is writable
   - Verify file permissions

2. **Console output not colored**

   - Ensure you're running in development mode (`NODE_ENV=development`)
   - Check if your terminal supports color output

3. **Log level not working**
   - Verify `LOG_LEVEL` environment variable is set correctly
   - Check Winston log level priority (debug < info < warn < error)

#### Debug Mode

Enable debug logging by setting the environment variable:

```bash
LOG_LEVEL=debug node index.js
```

### License

ISC

### Author

Node Express Backend Project
