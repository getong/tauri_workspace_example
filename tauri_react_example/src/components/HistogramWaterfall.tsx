import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface HistogramWaterfallProps {
  className?: string;
}

// Generate random data for the histogram waterfall
const generateData = (numBuckets: number, numSeries: number) => {
  const data = [];

  // Create time series with random distributions
  for (let i = 0; i < numBuckets; i++) {
    const entry: Record<string, any> = {
      bucket: `Bucket ${i + 1}`,
    };

    // Generate series data with varying distributions
    for (let j = 0; j < numSeries; j++) {
      // Create different patterns for each series
      if (j === 0) {
        // Normal-ish distribution
        const center = numBuckets / 2;
        const distance = Math.abs(i - center);
        entry[`series${j}`] = Math.max(0, 50 - distance * distance);
      } else if (j === 1) {
        // Increasing trend with noise
        entry[`series${j}`] = Math.max(0, i * 3 + Math.random() * 20);
      } else {
        // Random values with bias based on bucket
        entry[`series${j}`] = Math.max(
          0,
          (numBuckets - i) * Math.random() * 10,
        );
      }
    }

    data.push(entry);
  }

  return data;
};

const HistogramWaterfall = ({ className = "" }: HistogramWaterfallProps) => {
  const [data, setData] = useState<any[]>([]);
  const [seriesCount] = useState(3); // Reduced for better performance

  useEffect(() => {
    console.log("Generating chart data");
    // Generate initial data
    const initialData = generateData(10, seriesCount);
    console.log("Data generated:", initialData);
    setData(initialData);
  }, [seriesCount]);

  // Create array of series names for the chart
  const seriesNames = Array.from(
    { length: seriesCount },
    (_, i) => `series${i}`,
  );

  // Generate a color for each series
  const getColor = (index: number) => {
    const colors = [
      "#8884d8",
      "#82ca9d",
      "#ffc658",
      "#ff7300",
      "#0088fe",
      "#00C49F",
      "#FFBB28",
      "#FF8042",
      "#a4de6c",
      "#d0ed57",
    ];
    return colors[index % colors.length];
  };

  console.log("Rendering HistogramWaterfall with data length:", data.length);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading chart data...
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col ${className}`}
      style={{ width: "100%", height: "100%" }}
    >
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h3 className="text-lg font-medium mb-2">
          Histogram Waterfall Visualization
        </h3>
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bucket" />
              <YAxis />
              <Tooltip />
              <Legend />
              {seriesNames.map((series, index) => (
                <Bar
                  key={series}
                  dataKey={series}
                  fill={getColor(index)}
                  stackId="stack"
                  name={`Series ${index}`}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-2">Unstacked Histogram</h3>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bucket" />
              <YAxis />
              <Tooltip />
              <Legend />
              {seriesNames.map((series, index) => (
                <Bar
                  key={series}
                  dataKey={series}
                  fill={getColor(index)}
                  name={`Series ${index}`}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HistogramWaterfall;
