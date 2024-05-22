import React from "react";
import Chart from "react-apexcharts";

const BurnDownChart = ({ data, labels, taskNames }) => {
  const deadline = labels[labels.length - 1]; // Get the last date in the labels array

  const chartOptions = {
    chart: {
      type: "line",
      height: 350,
    },
    title: {
      text: "Burn Down Chart",
      align: "left",
    },
    xaxis: {
      categories: labels,
      title: {
        text: "Time",
      },
    },
    yaxis: {
      title: {
        text: "Tasks",
      },
      labels: {
        formatter: function (value) {
          return taskNames[value - 1];
        },
      },
      min: 0,
      max: taskNames.length,
    },
    dataLabels: {
      enabled: true,
    },
    tooltip: {
      enabled: true,
    },
    stroke: {
      curve: "stepline", // This makes the line chart stepped
    },
    annotations: {
      xaxis: [
        {
          x: deadline,
          borderColor: "red",
          label: {
            borderColor: "red",
            style: {
              color: "#fff",
              background: "red",
            },
            text: "Deadline",
          },
        },
      ],
    },
  };

  const series = [
    {
      name: "Task Progress",
      data: data.actual,
    },
  ];

  return (
    <Chart options={chartOptions} series={series} type="line" height={350} />
  );
};

export default BurnDownChart;
