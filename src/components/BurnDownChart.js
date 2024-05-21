import React from "react";
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

const BurnDownChart = ({ data, labels, taskNames, totalTasks }) => {
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Task Progress",
        data: data.actual,
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.3)",
        fill: true,
        stepped: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: "Burn Down Chart",
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Tasks",
        },
        beginAtZero: true,
        min: 0,
        max: totalTasks,
        ticks: {
          callback: function (value) {
            const index = totalTasks - value;
            return taskNames[index - 1] || "";
          },
          stepSize: 1,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default BurnDownChart;
