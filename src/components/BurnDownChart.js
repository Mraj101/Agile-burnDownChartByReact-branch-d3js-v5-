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

const BurnDownChart = ({ data, labels, taskNames }) => {
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
        callbacks: {
          label: function (tooltipItem) {
            const labels = tooltipItem?.chart?.data?.labels;
            const datasets = tooltipItem?.chart?.data?.datasets;

            if (!labels || !datasets) {
              return "No data";
            }

            const label = labels[tooltipItem.dataIndex];
            const value =
              datasets[tooltipItem.datasetIndex].data[tooltipItem.dataIndex];

            if (tooltipItem.dataIndex === labels.length - 1) {
              return `Deadline: ${label}`;
            }

            const taskName = taskNames[value - 1] || "Unknown task";
            return `Task: ${taskName}`;
          },
        },
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
        ticks: {
          callback: function (value) {
            const taskName = taskNames[value - 1] || "";
            return `${taskName}`;
          },
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default BurnDownChart;
