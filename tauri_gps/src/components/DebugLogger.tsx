import { useState, useEffect } from "react";

interface DebugLoggerProps {
  visible: boolean;
}

export default function DebugLogger({ visible }: DebugLoggerProps) {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!visible) return;

    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    const originalConsoleInfo = console.info;

    // Override console methods
    console.log = function (...args: any[]) {
      const message = args
        .map((arg) =>
          typeof arg === "object" ? JSON.stringify(arg) : String(arg),
        )
        .join(" ");
      setLogs((prev) => [...prev, `LOG: ${message}`]);
      originalConsoleLog.apply(console, args);
    };

    console.error = function (...args: any[]) {
      const message = args
        .map((arg) =>
          typeof arg === "object" ? JSON.stringify(arg) : String(arg),
        )
        .join(" ");
      setLogs((prev) => [...prev, `ERROR: ${message}`]);
      originalConsoleError.apply(console, args);
    };

    console.warn = function (...args: any[]) {
      const message = args
        .map((arg) =>
          typeof arg === "object" ? JSON.stringify(arg) : String(arg),
        )
        .join(" ");
      setLogs((prev) => [...prev, `WARN: ${message}`]);
      originalConsoleWarn.apply(console, args);
    };

    console.info = function (...args: any[]) {
      const message = args
        .map((arg) =>
          typeof arg === "object" ? JSON.stringify(arg) : String(arg),
        )
        .join(" ");
      setLogs((prev) => [...prev, `INFO: ${message}`]);
      originalConsoleInfo.apply(console, args);
    };

    // Restore console functions when component unmounts
    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      console.info = originalConsoleInfo;
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="debug-logger">
      <h3>Debug Logs</h3>
      <button onClick={() => setLogs([])}>Clear</button>
      <div className="logs">
        {logs.map((log, index) => (
          <div key={index} className="log-line">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}
