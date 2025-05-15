import { createFileRoute } from "@tanstack/react-router";
import HistogramWaterfall from "../components/HistogramWaterfall";
import KLineChart from "../components/KLineChart";

export const Route = createFileRoute("/charts")({
  component: Charts,
});

function Charts() {
  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold mb-4">Data Visualization</h2>

      {/* K-Line Chart Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">
          Stock Market Visualization
        </h3>
        <p className="mb-4">
          Candlestick chart showing OHLC (Open-High-Low-Close) price data with
          moving averages and volume indicators.
        </p>
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50 p-4">
          <KLineChart />
        </div>
      </div>

      {/* Histogram Section */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Statistical Distribution</h3>
        <p className="mb-4">
          Histogram and Waterfall charts demonstrate distribution of values
          across categories.
        </p>
        <div
          className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50 p-4"
          style={{ minHeight: "800px" }}
        >
          <HistogramWaterfall />
        </div>
      </div>
    </div>
  );
}
