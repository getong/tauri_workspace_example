import { createFileRoute } from "@tanstack/react-router";
import ThreeJsComparison from "../components/ThreeJsComparison";

export const Route = createFileRoute("/data")({
  component: Data,
});

function Data() {
  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold mb-4">3D Visualization</h2>
      <p className="mb-4">
        This page demonstrates different approaches to 3D visualization in a
        React and Tauri application. Compare React Three Fiber (R3F) with
        traditional Three.js implementation.
      </p>
      <div className="border border-gray-300 rounded-lg overflow-hidden p-4">
        <ThreeJsComparison />
      </div>
    </div>
  );
}
