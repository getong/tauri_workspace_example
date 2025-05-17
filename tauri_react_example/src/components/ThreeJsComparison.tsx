import { useState } from "react";
import ReactThreeFiberScene from "./ReactThreeFiberScene";
import ThreeScene from "./ThreeScene";

interface ThreeJsComparisonProps {
  className?: string;
}

const ThreeJsComparison = ({ className = "" }: ThreeJsComparisonProps) => {
  const [activeTab, setActiveTab] = useState<"r3f" | "vanilla">("r3f");

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex border-b mb-4">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "r3f"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("r3f")}
        >
          React Three Fiber
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "vanilla"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("vanilla")}
        >
          Vanilla Three.js
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden bg-gray-50">
        {activeTab === "r3f" ? (
          <ReactThreeFiberScene className="h-[500px]" />
        ) : (
          <ThreeScene className="h-[500px]" />
        )}
      </div>

      <div className="mt-4 p-4 bg-white rounded-lg border">
        <h3 className="font-medium mb-2">
          {activeTab === "r3f"
            ? "React Three Fiber Approach"
            : "Vanilla Three.js Approach"}
        </h3>
        {activeTab === "r3f" ? (
          <div className="text-sm text-gray-700">
            <p className="mb-2">
              <strong>Advantages:</strong> Declarative syntax, React component
              model, automatic disposal, easier integration with React state and
              props.
            </p>
            <p>
              <strong>Best for:</strong> React applications that need 3D
              visualizations, when you prefer component-oriented design, and
              when you want to leverage React's ecosystem.
            </p>
          </div>
        ) : (
          <div className="text-sm text-gray-700">
            <p className="mb-2">
              <strong>Advantages:</strong> Full control over the render loop,
              potentially better performance for complex scenes, direct access
              to Three.js APIs.
            </p>
            <p>
              <strong>Best for:</strong> When you need maximum control over the
              rendering process, when integrating with other low-level graphics
              APIs, or for learning Three.js fundamentals.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreeJsComparison;
