import { useState, useEffect } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface KLineChartProps {
  className?: string;
}

interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ma5: number;
  ma20: number;
}

// Generate mock stock data
const generateKLineData = (days: number): StockData[] => {
  const data: StockData[] = [];
  let date = new Date(2023, 0, 1);
  let lastClose = 100 + Math.random() * 50;

  // Moving average helpers
  const closes: number[] = [];

  for (let i = 0; i < days; i++) {
    // Generate realistic price movement
    const changePercent = (Math.random() - 0.5) * 0.06; // -3% to 3% daily change
    const open = lastClose;
    const close = Math.max(open * (1 + changePercent), 1); // Don't go below 1

    // High is the highest of either open or close, plus some random movement
    const highFromPrice = Math.max(open, close);
    const high = highFromPrice * (1 + Math.random() * 0.02); // 0-2% above highest

    // Low is the lowest of either open or close, minus some random movement
    const lowFromPrice = Math.min(open, close);
    const low = Math.max(lowFromPrice * (1 - Math.random() * 0.02), 0.1); // 0-2% below lowest

    // Generate realistic increasing volume
    const volumeBase = 1000000;
    const volumeChange = Math.abs(close - open) / open; // More change = more volume
    const volume = Math.round(volumeBase * (1 + volumeChange * 10));

    // Format date
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    // Add to closes array for moving averages
    closes.push(close);

    // Calculate moving averages
    const ma5 =
      closes.slice(Math.max(0, i - 4), i + 1).reduce((a, b) => a + b, 0) /
      Math.min(i + 1, 5);
    const ma20 =
      closes.slice(Math.max(0, i - 19), i + 1).reduce((a, b) => a + b, 0) /
      Math.min(i + 1, 20);

    // Add entry
    data.push({
      date: formattedDate,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
      ma5: parseFloat(ma5.toFixed(2)),
      ma20: parseFloat(ma20.toFixed(2)),
    });

    // Move to next day and set last close price
    date.setDate(date.getDate() + 1);
    lastClose = close;
  }

  return data;
};

// Custom tooltip for price display
const KLineTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded shadow-md border border-gray-200 text-sm">
        <p className="font-semibold">{data.date}</p>
        <p className="text-gray-600">
          Open: <span className="font-semibold">${data.open}</span>
        </p>
        <p className="text-gray-600">
          High: <span className="font-semibold">${data.high}</span>
        </p>
        <p className="text-gray-600">
          Low: <span className="font-semibold">${data.low}</span>
        </p>
        <p className="text-gray-600">
          Close: <span className="font-semibold">${data.close}</span>
        </p>
        <p className="text-gray-600">
          Volume:{" "}
          <span className="font-semibold">{data.volume.toLocaleString()}</span>
        </p>
        <p className="text-blue-600">
          MA5: <span className="font-semibold">${data.ma5}</span>
        </p>
        <p className="text-purple-600">
          MA20: <span className="font-semibold">${data.ma20}</span>
        </p>
      </div>
    );
  }
  return null;
};

// Candlestick renderer (vertical rectangles for OHLC)
const renderCandlestick = (props: any) => {
  const { x, y, width, height, open, close } = props;

  // Determine if this is a bullish (close > open) or bearish (close < open) candle
  const isBullish = close > open;
  const color = isBullish ? "#22c55e" : "#ef4444";

  return (
    <g key={`candlestick-${x}`}>
      {/* Body of the candlestick */}
      <rect
        x={x - width / 2}
        y={isBullish ? y : y - height}
        width={width}
        height={Math.abs(height)}
        fill={color}
        stroke={color}
      />
    </g>
  );
};

// Define the shape props interface
interface CandlestickProps {
  x: number;
  y: number;
  width: number;
  height: number;
  index: number;
  payload?: any;
  // Add other properties that might be needed
}

const KLineChart = ({ className = "" }: KLineChartProps) => {
  const [data, setData] = useState<StockData[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [sortField, setSortField] = useState<keyof StockData>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    console.log("Generating K-line data");
    const stockData = generateKLineData(40);
    setData(stockData);
    setLoaded(true);
    console.log("K-line data generated", stockData.length);
  }, []);

  // Sort the data based on the current sort field and direction
  const sortedData = [...data].sort((a, b) => {
    if (sortField === "date") {
      // Special case for date sorting
      return sortDirection === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }

    return sortDirection === "asc"
      ? a[sortField] - b[sortField]
      : b[sortField] - a[sortField];
  });

  // Get current page data
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Handle sorting
  const handleSort = (field: keyof StockData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Pagination controls
  const paginate = (pageNumber: number) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading K-line chart...
      </div>
    );
  }

  // Generate statistical data
  const statsData = {
    minPrice: Math.min(...data.map((d) => d.low)),
    maxPrice: Math.max(...data.map((d) => d.high)),
    avgPrice:
      data.reduce((sum, d) => sum + (d.close + d.open) / 2, 0) / data.length,
    totalVolume: data.reduce((sum, d) => sum + d.volume, 0),
    volatility:
      Math.sqrt(
        data.reduce(
          (sum, d) => sum + Math.pow((d.high - d.low) / d.low, 2),
          0,
        ) / data.length,
      ) * 100,
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h3 className="text-lg font-medium mb-2">
          Stock Price Candlestick Chart
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          OHLC (Open-High-Low-Close) candlestick chart with moving averages and
          volume
        </p>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-5 gap-3 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500">Low</div>
            <div className="text-lg font-semibold text-blue-700">
              ${statsData.minPrice.toFixed(2)}
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500">High</div>
            <div className="text-lg font-semibold text-green-700">
              ${statsData.maxPrice.toFixed(2)}
            </div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500">Average</div>
            <div className="text-lg font-semibold text-purple-700">
              ${statsData.avgPrice.toFixed(2)}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500">Volume</div>
            <div className="text-lg font-semibold text-gray-700">
              {(statsData.totalVolume / 1000000).toFixed(2)}M
            </div>
          </div>
          <div className="bg-amber-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500">Volatility</div>
            <div className="text-lg font-semibold text-amber-700">
              {statsData.volatility.toFixed(2)}%
            </div>
          </div>
        </div>

        <div style={{ width: "100%", height: 500 }}>
          <ResponsiveContainer width="100%" height="80%">
            <ComposedChart
              data={data}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="date" scale="band" tickLine={false} />
              <YAxis
                yAxisId="price"
                domain={["auto", "auto"]}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="volume"
                orientation="right"
                domain={["auto", "auto"]}
                tickFormatter={(value) => `${value / 1000000}M`}
                tickLine={false}
                axisLine={false}
                hide
              />
              <Tooltip content={<KLineTooltip />} />
              <Legend />

              {/* Fix: Use Bar component with shape prop properly */}
              <Bar
                dataKey="close"
                yAxisId="price"
                name="Price"
                shape={(props: any) => {
                  // Type safety with casting
                  const typedProps = props as CandlestickProps;
                  const index = typedProps.index;

                  // Calculate the height from open to close
                  const entry = data[index];
                  const height = Math.abs(entry.close - entry.open);
                  const y = Math.min(entry.open, entry.close);

                  return renderCandlestick({
                    ...typedProps,
                    height,
                    y,
                    open: entry.open,
                    close: entry.close,
                  });
                }}
              />

              {/* Moving averages */}
              <Line
                type="monotone"
                dataKey="ma5"
                stroke="#3b82f6"
                yAxisId="price"
                dot={false}
                strokeWidth={2}
                name="MA5"
              />
              <Line
                type="monotone"
                dataKey="ma20"
                stroke="#8b5cf6"
                yAxisId="price"
                dot={false}
                strokeWidth={2}
                name="MA20"
              />
            </ComposedChart>
          </ResponsiveContainer>

          {/* Volume chart */}
          <ResponsiveContainer width="100%" height="20%">
            <ComposedChart
              data={data}
              margin={{ top: 0, right: 20, bottom: 0, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="date" tick={false} axisLine={false} height={0} />
              <YAxis
                domain={["auto", "auto"]}
                tickFormatter={(value) => `${value / 1000000}M`}
                tickCount={3}
                axisLine={false}
                tickLine={false}
                fontSize={10}
              />
              <Tooltip content={<KLineTooltip />} />
              <Bar
                dataKey="volume"
                fill="#64748b"
                opacity={0.5}
                name="Volume"
                barSize={8}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Data Table */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-2">Detailed Price Data</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer ${sortField === "date" ? "bg-gray-100" : ""}`}
                  onClick={() => handleSort("date")}
                >
                  Date{" "}
                  {sortField === "date" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer ${sortField === "open" ? "bg-gray-100" : ""}`}
                  onClick={() => handleSort("open")}
                >
                  Open{" "}
                  {sortField === "open" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer ${sortField === "high" ? "bg-gray-100" : ""}`}
                  onClick={() => handleSort("high")}
                >
                  High{" "}
                  {sortField === "high" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer ${sortField === "low" ? "bg-gray-100" : ""}`}
                  onClick={() => handleSort("low")}
                >
                  Low{" "}
                  {sortField === "low" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer ${sortField === "close" ? "bg-gray-100" : ""}`}
                  onClick={() => handleSort("close")}
                >
                  Close{" "}
                  {sortField === "close" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer ${sortField === "volume" ? "bg-gray-100" : ""}`}
                  onClick={() => handleSort("volume")}
                >
                  Volume{" "}
                  {sortField === "volume" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer ${sortField === "ma5" ? "bg-gray-100" : ""}`}
                  onClick={() => handleSort("ma5")}
                >
                  MA5{" "}
                  {sortField === "ma5" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer ${sortField === "ma20" ? "bg-gray-100" : ""}`}
                  onClick={() => handleSort("ma20")}
                >
                  MA20{" "}
                  {sortField === "ma20" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRows.map((row, idx) => {
                const isPriceUp = row.close > row.open;
                const priceColor = isPriceUp
                  ? "text-green-600"
                  : "text-red-600";

                return (
                  <tr key={`${row.date}-${idx}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      ${row.open.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      ${row.high.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                      ${row.low.toFixed(2)}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${priceColor}`}
                    >
                      ${row.close.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {(row.volume / 1000000).toFixed(2)}M
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                      ${row.ma5.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-medium">
                      ${row.ma20.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="py-3 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? "text-gray-300 bg-gray-50"
                  : "text-gray-700 bg-white hover:bg-gray-50"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? "text-gray-300 bg-gray-50"
                  : "text-gray-700 bg-white hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{indexOfFirstRow + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastRow, data.length)}
                </span>{" "}
                of <span className="font-medium">{data.length}</span> results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => paginate(1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-300"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  First
                </button>
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-300"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages
                      ? "text-gray-300"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
                <button
                  onClick={() => paginate(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages
                      ? "text-gray-300"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Last
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KLineChart;
