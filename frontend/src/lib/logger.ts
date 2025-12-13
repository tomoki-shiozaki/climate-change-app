const isDevOrStaging =
  import.meta.env.MODE === "development" || import.meta.env.MODE === "staging";

const logWarn = (...args: unknown[]) => {
  if (isDevOrStaging) {
    console.warn(...args);
  }
};

const logInfo = (...args: unknown[]) => {
  if (isDevOrStaging) {
    console.info(...args);
  }
};

const logError = (...args: unknown[]) => {
  if (isDevOrStaging) {
    console.error(...args);
  }
};

export { logWarn, logInfo, logError };
