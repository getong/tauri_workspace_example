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

  // Function to format HTML with indentation and line breaks
  const formatHtml = (html: string) => {
    // Replace consecutive spaces with a single space
    let formatted = html.replace(/\s{2,}/g, " ");

    // Add line breaks after closing tags
    formatted = formatted.replace(/>/g, ">\n");

    // Add line breaks before opening tags except for inline elements
    const inlineElements = [
      "span",
      "a",
      "strong",
      "em",
      "b",
      "i",
      "u",
      "s",
      "sub",
      "sup",
      "img",
      "br",
    ];
    const inlinePattern = new RegExp(
      `<(?!\\/)((?!${inlineElements.join("|")})\\w+)`,
      "g",
    );
    formatted = formatted.replace(inlinePattern, "\n<$1");

    return formatted;
  };

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
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header Section */}
      <header className="flex-none bg-white border-b shadow-sm z-10">
        <h1 className="text-2xl font-bold p-4">Baidu Content</h1>
      </header>

      {/* Content Section */}
      <main
        className="flex-grow relative overflow-hidden p-3 bg-gray-50"
        style={{ height: "calc(100vh - 180px)" }}
      >
        <iframe
          srcDoc={data}
          style={{
            width: "100%",
            height: "100%",
            border: "1px solid #eaeaea",
            borderRadius: "4px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            display: "block",
          }}
          title="Baidu Content"
          sandbox="allow-same-origin allow-scripts"
        />
      </main>

      {/* Details panel with relative positioning */}
      <details
        className="flex-none bg-white border-t p-2 m-2 rounded border"
        style={{
          zIndex: 2,
          maxHeight: "100px",
          overflow: "hidden",
          transition: "max-height 0.5s ease-in-out",
          boxShadow:
            "0 -2px 5px rgba(0, 0, 0, 0.05), 0 2px 5px rgba(0, 0, 0, 0.05)",
          borderColor: "#e5e7eb",
          marginTop: "0",
        }}
        onClick={(e) => {
          const target = e.currentTarget;
          if (target.open) {
            target.style.maxHeight = "60vh"; // Much larger when open - 60% of viewport height
          } else {
            target.style.maxHeight = "100px"; // Height when closed
          }
        }}
      >
        <summary className="text-sm font-semibold cursor-pointer flex justify-between items-center">
          <span>View Source </span>
          <span className="text-xs text-gray-500">www.baidu.com</span>
        </summary>
        <pre
          className="overflow-auto mt-2 p-3 bg-gray-50 border rounded"
          style={{
            wordBreak: "break-all",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            lineHeight: "1.5",
            maxHeight: "50vh",
            height: "50vh", // Added explicit height
            fontSize: "0.75rem",
            overflowY: "scroll", // Changed from auto to scroll to ensure scrollbar visibility
            overflowX: "auto",
            display: "block", // Ensure it's treated as a block element
            cursor: "text", // Better cursor for text selection
            WebkitOverflowScrolling: "touch", // Better scrolling on iOS
            scrollbarWidth: "thin", // Thin scrollbar for Firefox
            scrollbarColor: "#cbd5e0 #f7fafc", // Custom scrollbar colors for Firefox
          }}
          // Prevent toggling the details element when interacting with the pre
          onClick={(e) => {
            e.stopPropagation();
          }}
          onScroll={(e) => {
            e.stopPropagation();
          }}
        >
          {data ? formatHtml(data) : "No data"}
        </pre>
      </details>
    </div>
  );
}

export default BaiduPage;
