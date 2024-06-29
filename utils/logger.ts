import { logger, consoleTransport } from 'react-native-logs';

const config = {
  transport: consoleTransport, // Assuming consoleTransport is imported correctly
  severity: 'debug' as const, // Set the default severity level
  levels: {
    info: 1,
    warn: 2,
    error: 3,
    title: 4,
  },
  transportOptions: {
    colors: {
      info: 'blueBright' as const,
      warn: 'yellowBright' as const,
      error: 'redBright' as const,
      title: 'greenBright' as const,
    },
  },
};

const log = logger.createLogger(config);

export default log;
