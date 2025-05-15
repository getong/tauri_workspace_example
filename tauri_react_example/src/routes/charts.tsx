import { createFileRoute } from "@tanstack/react-router";
import HistogramWaterfall from "../components/HistogramWaterfall";

export const Route = createFileRoute("/charts")({
  component: Charts,
});

function Charts() {
  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold mb-4">Data Visualization</h2>
      <p className="mb-4">
        Histogram and Waterfall charts demonstrate distribution of values across
        categories.
      </p>
      <div
        className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50 p-4"
        style={{ minHeight: "800px" }}
      >
        <HistogramWaterfall />
      </div>
    </div>
  );
}
