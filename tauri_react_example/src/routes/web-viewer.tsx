import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export const Route = createFileRoute("/web-viewer")({
  component: WebViewerPage,
});

function WebViewerPage() {
  const [url, setUrl] = useState<string>("https://www.baidu.com");
  const [inputUrl, setInputUrl] = useState<string>("https://www.baidu.com");
  const [data, setData] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("Initializing...");

  const fetchWebpage = async (urlToFetch: string) => {
    try {
      setLoading(true);
      setError(null);
      setDebugInfo(`Fetching ${urlToFetch}...`);
      console.log(`Starting fetch for ${urlToFetch}`);

      const result = await invoke<string>("fetch_webpage", { url: urlToFetch });

      console.log(
        `Fetched data from ${urlToFetch}, length: ${result?.length || 0}`,
      );
      setData(result || "");
      setUrl(urlToFetch);
      setDebugInfo(`Successfully loaded ${urlToFetch}`);
    } catch (err) {
      console.error("Error fetching webpage:", err);
      setError(String(err));
      setDebugInfo(`Error: ${String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load default page (Baidu) on component mount
    fetchWebpage(url);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl) {
      // Add https:// prefix if missing
      let processedUrl = inputUrl;
      if (!/^https?:\/\//i.test(inputUrl)) {
        processedUrl = `https://${inputUrl}`;
      }
      fetchWebpage(processedUrl);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col">
      <div className="p-4 bg-white border-b flex items-center space-x-4">
        <h1 className="text-2xl font-bold">Web Viewer</h1>
        <form onSubmit={handleSubmit} className="flex-1 flex">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="flex-1 p-2 border rounded-l"
            placeholder="Enter URL (e.g., www.baidu.com)"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Loading..." : "Go"}
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4 mx-auto"></div>
            <p className="text-lg">Loading {url}...</p>
            <p className="text-sm text-gray-500 mt-2">{debugInfo}</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex-grow p-6">
          <div className="max-w-2xl mx-auto bg-red-50 border border-red-300 rounded-md p-4">
            <h2 className="text-xl font-bold text-red-800">
              Error Loading Page
            </h2>
            <p className="mt-2 text-red-700">{error}</p>
            <div className="mt-4 p-3 bg-white rounded border">
              <h3 className="font-semibold">Debug Info:</h3>
              <p className="font-mono text-sm mt-1">{debugInfo}</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-grow relative">
            <iframe
              srcDoc={data}
              className="absolute inset-0 w-full h-full border-0"
              title="Web Content"
              sandbox="allow-same-origin allow-scripts"
            />
          </div>

          <details className="bg-white border-t p-2">
            <summary className="text-sm font-semibold cursor-pointer flex justify-between items-center">
              <span>View Source</span>
              <span className="text-xs text-gray-500">{url}</span>
            </summary>
            <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-60 mt-2 p-3 bg-gray-50 border rounded">
              {data
                ? data.length > 1000
                  ? data.substring(0, 1000) + "..."
                  : data
                : "No data"}
            </pre>
          </details>
        </>
      )}
    </div>
  );
}

export default WebViewerPage;
