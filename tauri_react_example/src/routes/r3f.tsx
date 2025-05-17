import { createFileRoute } from "@tanstack/react-router";
import ReactThreeFiberScene from "../components/ReactThreeFiberScene";

export const Route = createFileRoute("/r3f")({
  component: R3FDemo,
});

function R3FDemo() {
  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold mb-4">React Three Fiber Demo</h2>
      <p className="mb-4">
        This is a demonstration of React Three Fiber - a React renderer for
        Three.js. Click on cubes to scale them, and hover to change their color
        to pink. You can also rotate and zoom using your mouse.
      </p>
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <ReactThreeFiberScene className="h-[500px]" />
      </div>
      <p className="mt-4 text-sm text-gray-600">
        React Three Fiber makes Three.js development more React-like by using
        declarative components instead of imperative commands.
      </p>
    </div>
  );
}
