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

const BurnDownChart = ({ data, labels, taskCompletionStatus }) => {
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
        spanGaps: false, // Ensures gaps are created for null values
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
          title: (context) => {
            const index = context[0].dataIndex;
            return taskCompletionStatus[index]
              ? `Task Completed on ${context[0].label}`
              : `No Task Completed`;
          },
          label: (context) => {
            return taskCompletionStatus[context.dataIndex]
              ? `Remaining: ${context.raw}`
              : `No Task Completed`;
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
        ticks: {
          callback: (value, index) => {
            const label = labels[index];
            const isTaskCompleted = taskCompletionStatus[index];
            return isTaskCompleted ? `\u001b[31m${label}\u001b[0m` : label; // Highlight in red if task is completed
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Work Remaining",
        },
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default BurnDownChart;
