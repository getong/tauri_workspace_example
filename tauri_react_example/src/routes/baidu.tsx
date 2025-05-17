import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export const Route = createFileRoute("/baidu")({
  component: BaiduPage,
});

function BaiduPage() {
  const [data, setData] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("Initializing...");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDebugInfo("Starting to fetch data...");
        console.log("Invoking fetch_webpage command...");

        const result = await invoke<string>("fetch_webpage", {
          url: "https://www.baidu.com",
        });

        console.log("Received data, length:", result?.length);
        setDebugInfo(
          `Data fetched successfully, length: ${result?.length || 0}`,
        );
        setData(result || "");
      } catch (err) {
        console.error("Error fetching data:", err);
        setDebugInfo(`Error occurred: ${String(err)}`);
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center p-8 h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <span className="text-lg">Loading content from Baidu...</span>
        <span className="text-sm text-gray-500 mt-2">{debugInfo}</span>
      </div>
    );

  if (error)
    return (
      <div className="fixed inset-x-0 top-0 min-h-screen w-screen bg-red-50 border border-red-300">
        <div className="p-8">
          <h2 className="text-xl font-bold text-red-800">Error</h2>
          <p className="mt-2 text-red-700">{error}</p>
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold">Debug Info:</h3>
            <p className="font-mono text-sm">{debugInfo}</p>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden">
      <h1 className="text-2xl font-bold p-4 bg-white border-b">
        Baidu Content
      </h1>

      <iframe
        srcDoc={data}
        style={{
          position: "absolute",
          top: "70px", // Increased from 57px to give more space below header
          bottom: "40px", // Added bottom margin to avoid overlapping with controls
          left: "10px", // Added side margins
          right: "10px", // Added side margins
          width: "calc(100% - 20px)", // Adjusted width to account for side margins
          border: "1px solid #eaeaea",
          borderRadius: "4px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          transform: "scale(0.95)", // Slightly scale down for better viewing
          transformOrigin: "top center",
          margin: "auto",
        }}
        title="Baidu Content"
        sandbox="allow-same-origin allow-scripts"
      />

      <details className="absolute bottom-0 left-0 right-0 bg-white border-t p-2">
        <summary className="text-sm font-semibold cursor-pointer flex justify-between items-center">
          <span>View Source</span>
          <span className="text-xs text-gray-500">www.baidu.com</span>
        </summary>
        <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-60 mt-2 p-3 bg-gray-50 border rounded">
          {data
            ? data.length > 1000
              ? data.substring(0, 1000) + "..."
              : data
            : "No data"}
        </pre>
      </details>
    </div>
  );
}

export default BaiduPage;
