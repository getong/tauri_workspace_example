import { useState } from "react";

// Predefined locations for testing
const LOCATIONS = [
  { name: "東京", lat: 35.6812, lng: 139.7671 },
  { name: "京都", lat: 35.0116, lng: 135.7681 },
  { name: "大阪", lat: 34.6937, lng: 135.5023 },
  { name: "札幌", lat: 43.0618, lng: 141.3545 },
  { name: "福岡", lat: 33.5902, lng: 130.4017 },
];

interface MockLocationButtonProps {
  onSelectLocation: (latitude: number, longitude: number, name: string) => void;
}

export default function MockLocationButton({
  onSelectLocation,
}: MockLocationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mock-location">
      <button className="mock-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "モック位置を隠す" : "モック位置を選択 (テスト用)"}
      </button>

      {isOpen && (
        <div className="mock-dropdown">
          <p>テスト用位置情報:</p>
          <div className="mock-options">
            {LOCATIONS.map((location) => (
              <button
                key={location.name}
                onClick={() => {
                  onSelectLocation(location.lat, location.lng, location.name);
                  setIsOpen(false);
                }}
              >
                {location.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
