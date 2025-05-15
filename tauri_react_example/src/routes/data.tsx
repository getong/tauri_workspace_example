import { createFileRoute } from "@tanstack/react-router";
import ThreeScene from "../components/ThreeScene";

export const Route = createFileRoute("/data")({
  component: Data,
});

function Data() {
  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold mb-4">3D Visualization</h2>
      <p className="mb-4">
        This is a demonstration of Three.js integration with React and Tauri.
      </p>
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <ThreeScene className="h-[500px]" />
      </div>
    </div>
  );
}
