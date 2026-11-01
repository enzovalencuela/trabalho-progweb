import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";

export interface CustomChartProps {
  labels: string[];
  data: number[];
  type: "line" | "bar";
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function CustomChart(props: CustomChartProps) {
  const { data, labels, type } = props;
  const options = {
    responsive: true,
    scaleShowVerticalLines: false,
    scales: {
      x: {
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
      y: {
        border: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  const chartData = {
    labels,
    datasets: [
      {
        data: data,
        borderColor: "rgb(12, 112, 242)",
        backgroundColor: "rgba(12, 112, 242, 1)",
      },
    ],
  };
  return type === "bar" ? (
    <Bar options={options} data={chartData} />
  ) : (
    <Line options={options} data={chartData} />
  );
}

export default CustomChart;
