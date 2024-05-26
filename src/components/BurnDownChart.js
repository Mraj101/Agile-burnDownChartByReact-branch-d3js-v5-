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
import annotationPlugin from "chartjs-plugin-annotation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

const BurnDownChart = ({ data, labels, taskNames, deadline }) => {
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
      annotation: {
        annotations: {
          deadlineLine: {
            type: "line",
            mode: "vertical",
            scaleID: "x",
            value: deadline,
            borderColor: "red",
            borderWidth: 2,
            label: {
              content: "Deadline",
              enabled: true,
              position: "center",
              yAdjust: -20, // Adjust the label's vertical position
              backgroundColor: "rgba(255, 255, 255, 0.8)", // Background for better visibility
              font: {
                size: 12,
                weight: "bold",
              },
              padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
              },
            },
          },
        },
      },
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
        grid: {
          display: false,
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
    fill: true,
  };

  return <Line data={chartData} options={options} />;
};

export default BurnDownChart;
