import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StockHistoryData {
  time: string;
  price: number;
}

interface StockChartProps {
  history: Record<string, StockHistoryData[]>;
}

const lineColors = ["red", "blue", "black", "green", "orange"];

export function StockChart({ history }: StockChartProps) {
  const firstStockName = Object.keys(history)[0];
  const labels = firstStockName
    ? history[firstStockName].map((data) => data.time)
    : [];

  const chartData = {
    labels: labels,
    datasets: Object.keys(history).map((stockName, index) => {
      const stockHistoryData = history[stockName];
      return {
        label: stockName,
        data: stockHistoryData.map((data) => data.price),
        fill: false,
        borderColor: lineColors[index % lineColors.length],
        tension: 0.1,
      };
    }),
  };

  const chartOptions = {
    responsive: true,
    animation: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Stock Prices (Live)",
      },
    },
  } as const;

  return <Line options={chartOptions} data={chartData} />;
}
