import React from "react";
import Chart from "react-apexcharts";

const BurnDownChart = ({ data, labels, taskNames }) => {
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
