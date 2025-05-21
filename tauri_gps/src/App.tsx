import { useState, useEffect } from "react";
import {
  checkPermissions,
  requestPermissions,
  getCurrentPosition,
  Position,
  PositionOptions,
} from "@tauri-apps/plugin-geolocation";
import MockLocationButton from "./components/MockLocationButton";
import DebugLogger from "./components/DebugLogger";
import "./App.css";

function App() {
  const [phonePos, setPhonePos] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [mockLocationName, setMockLocationName] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState<boolean>(false);

  // Reset error when component mounts
  useEffect(() => {
    // Force a redraw after component mounts to ensure proper rendering
    const timeout = setTimeout(() => {
      setPhonePos((phonePos) => (phonePos ? { ...phonePos } : null));
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  // Function to handle mock location selection
  const handleMockLocation = (
    latitude: number,
    longitude: number,
    name: string,
  ) => {
    const mockPos: Position = {
      coords: {
        latitude,
        longitude,
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    };

    setPhonePos(mockPos);
    setMockLocationName(name);
    setError(null);
    console.log(`Using mock location: ${name} (${latitude}, ${longitude})`);
  };

  async function getPos() {
    setLoading(true);
    setError(null);

    console.log("Starting position request");

    try {
      console.log("Checking permissions");
      let permissions = await checkPermissions();
      console.log("Permission status:", permissions.location);

      if (
        permissions.location === "prompt" ||
        permissions.location === "prompt-with-rationale"
      ) {
        console.log("Requesting permissions");
        permissions = await requestPermissions(["location"]);
        console.log("Permission request result:", permissions.location);
      }

      if (permissions.location === "granted") {
        console.log("Permission granted, getting position");

        // Set position options with timeout
        const options: PositionOptions = {
          timeout: 10000, // Reduce timeout to 10 seconds
          enableHighAccuracy: false, // Try with false first for faster response on emulator
          maximumAge: 60000, // Accept positions up to 1 minute old (useful for emulators)
        };

        try {
          console.log("Starting getCurrentPosition with options:", options);

          // Use a separate timer to track progress
          const timer = setInterval(() => {
            console.log("Still waiting for position...");
          }, 2000);

          // Use Promise.race to implement timeout
          const positionPromise = getCurrentPosition(options);
          const pos = await Promise.race([
            positionPromise.then((pos) => {
              clearInterval(timer);
              return pos;
            }),
            new Promise<never>((_, reject) => {
              setTimeout(() => {
                clearInterval(timer);
                reject(
                  new Error("Position request timed out after 15 seconds"),
                );
              }, 15000);
            }),
          ]);

          console.log("Position received:", JSON.stringify(pos));
          setPhonePos(pos);
          setMockLocationName(null); // Clear any mock location name
        } catch (posError) {
          console.error("Position error:", posError);

          // Special handling for common emulator issues
          const errorMessage =
            posError instanceof Error ? posError.message : "Unknown error";

          if (errorMessage.includes("timed out")) {
            setError(
              "タイムアウトエラー: 位置情報の取得に時間がかかりすぎています。エミュレータの場合、位置情報の設定を確認してください。",
            );
            console.log(
              "Recommendation: For emulators, set a mock location in the emulator settings",
            );
          } else {
            setError(`位置情報取得エラー: ${errorMessage}`);
          }

          // Suggest using mock location for emulator
          console.log(
            "If you're using an emulator, try setting a mock location in the Extended Controls (... button) > Location tab",
          );
        }
      } else {
        console.log("Permission denied");
        setError("位置情報へのアクセスが許可されていません。");
      }
    } catch (err) {
      console.error("Error in geolocation process:", err);
      setError(
        `エラー: ${err instanceof Error ? err.message : "位置情報の取得に失敗しました"}`,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <button className="primary-button" onClick={getPos} disabled={loading}>
        {loading ? "取得中..." : "位置情報を取得"}
      </button>

      {error && <p className="error-message">{error}</p>}

      {phonePos && (
        <div className="location-display">
          {mockLocationName && (
            <p className="mock-indicator">モック位置: {mockLocationName}</p>
          )}
          <p>緯度: {phonePos.coords.latitude.toFixed(6)}</p>
          <p>経度: {phonePos.coords.longitude.toFixed(6)}</p>
          {phonePos.coords.accuracy && (
            <p>精度: {Math.round(phonePos.coords.accuracy)}m</p>
          )}
        </div>
      )}

      <MockLocationButton onSelectLocation={handleMockLocation} />

      <div className="debug-controls">
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="debug-toggle"
        >
          {showDebug ? "Debug を隠す" : "Debug を表示"}
        </button>
      </div>

      <DebugLogger visible={showDebug} />
    </div>
  );
}

export default App;
