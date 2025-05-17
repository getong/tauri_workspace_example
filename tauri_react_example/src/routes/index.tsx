import { createFileRoute } from "@tanstack/react-router";
import PhysicsScene from "../components/PhysicsScene";
import { useEffect } from "react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  useEffect(() => {
    // Log when the component mounts to help with debugging
    console.log("Index component mounted");
    return () => console.log("Index component unmounted");
  }, []);

  return (
    <div className="p-2">
      <h3 className="text-2xl font-bold mb-4">Welcome Home!</h3>

      <div className="mt-6">
        <h4 className="text-xl font-semibold mb-2">Physics Playground</h4>
        <div
          className="border border-gray-300 rounded-lg overflow-hidden shadow-lg w-full"
          style={{ height: "500px" }}
        >
          <PhysicsScene className="h-full" />
        </div>
        <p className="mt-2 text-sm text-gray-600">
          This is a physics simulation using Three.js and Cannon.js. Click
          anywhere in the scene to drop objects!
        </p>
      </div>
    </div>
  );
}
