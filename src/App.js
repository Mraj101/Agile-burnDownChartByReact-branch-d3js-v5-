// import React from "react";
// // import ApexCharts from "apexcharts";
// import { Chart as ChartJS } from "chart.js/auto";
// import { Bar, Doughnut, Line } from "react-chartjs-2";
// import revenueData from "./data/revenueData.json";
// import sourceData from "./data/sourceData.json";

// ChartJS.defaults.maintainAspectRatio = false;
// ChartJS.defaults.responsive = true;

// ChartJS.defaults.plugins.title.display = true;
// ChartJS.defaults.plugins.title.align = "start";
// ChartJS.defaults.plugins.title.font.size = 20;
// ChartJS.defaults.plugins.title.color = "red";

// const App = () => {
//   return (
//     <div className="App">
//       <div></div>
//       <div className="dataCard revenueCard">
//         <Line
//           data={{
//             labels: revenueData.map((data) => data.label),
//             datasets: [
//               {
//                 label: "Revenue",
//                 data: revenueData.map((data) => data.revenue),
//                 backgroundColor: "#064FF0",
//                 borderColor: "#064FF0",
//               },
//               {
//                 label: "Cost",
//                 data: revenueData.map((data) => data.cost),
//                 backgroundColor: "#FF3030",
//                 borderColor: "#FF3030",
//               },
//             ],
//           }}
//           options={{
//             elements: {
//               line: {
//                 tension: 0.5,
//               },
//             },
//             plugins: {
//               title: {
//                 text: "Monthly Revenue & Cost",
//               },
//             },
//           }}
//         />
//       </div>

//       <div className="dataCard customerCard">
//         <Bar
//           data={{
//             labels: sourceData.map((data) => data.label),
//             datasets: [
//               {
//                 label: "count",
//                 data: sourceData.map((data) => data.value),
//                 backgroundColor: [
//                   "rgba(43, 63, 229, 0.8)",
//                   "rgba(250, 192, 19, 0.8)",
//                   "rgba(253, 135, 135, 0.8)",
//                 ],
//                 borderRadius: 5,
//               },
//             ],
//           }}
//           options={{
//             plugins: {
//               title: {
//                 text: "Revenue Source",
//               },
//             },
//           }}
//         />
//       </div>

//       <div className="dataCard categoryCard">
//         <Doughnut
//           data={{
//             labels: sourceData.map((data) => data.label),
//             datasets: [
//               {
//                 label: "Count",
//                 data: sourceData.map((data) => data.value),
//                 backgroundColor: [
//                   "rgba(43, 63, 229, 0.8)",
//                   "rgba(250, 192, 19, 0.8)",
//                   "rgba(253, 135, 135, 0.8)",
//                 ],
//                 borderColor: [
//                   "rgba(43, 63, 229, 0.8)",
//                   "rgba(250, 192, 19, 0.8)",
//                   "rgba(253, 135, 135, 0.8)",
//                 ],
//               },
//             ],
//           }}
//           options={{
//             plugins: {
//               title: {
//                 text: "Revenue Sources",
//               },
//             },
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default App;

// App.js
import React, { useState, useEffect } from "react";
import BurnDownChart from "./components/BurnDownChart";
import "./App.css";

const generateDateRange = (startDate, endDate) => {
  const dateArray = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dateArray.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dateArray;
};

const calculateBurnDownData = (tasks) => {
  const startDate = tasks[0]?.startDate;
  const endDate =
    tasks[tasks.length - 1]?.endDate || new Date().toISOString().split("T")[0];
  const labels = generateDateRange(startDate, endDate);

  console.log("Labels:", labels);

  const totalTasks = tasks.length;
  const actualBurnDown = Array(labels.length).fill(null);

  console.log("Initial actualBurnDown:", actualBurnDown);

  const taskEndDates = new Map();

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (task.isFinished) {
      const endDate = task.endDate;
      if (taskEndDates.has(endDate)) {
        taskEndDates.set(endDate, taskEndDates.get(endDate) + 1);
      } else {
        taskEndDates.set(endDate, 1);
      }
    }
  }

  console.log("Task end dates:", taskEndDates);

  let completedTasks = 0;
  let lastCompletedDateIndex = -1;

  for (let i = 0; i < labels.length; i++) {
    const date = labels[i];
    console.log("Current Date:", date);

    if (taskEndDates.has(date)) {
      completedTasks += taskEndDates.get(date);
      lastCompletedDateIndex = i;
    }

    console.log("Completed Tasks:", completedTasks);

    // Check if the current date is the first date, then set the totalTasks as the initial value
    if (i === 0) {
      actualBurnDown[i] = totalTasks;
    } else {
      // Update the actualBurnDown array with the remaining tasks
      actualBurnDown[i] = totalTasks - completedTasks;
    }

    console.log("Actual Burn Down:", actualBurnDown);
  }

  for (let i = lastCompletedDateIndex + 1; i < actualBurnDown.length; i++) {
    actualBurnDown[i] = null;
  }

  return { labels, data: { actual: actualBurnDown } };
};

const App = () => {
  const [tasks, setTasks] = useState([
    {
      taskName: "Task 1",
      taskId: 1,
      startDate: "2023-01-01",
      endDate: "2023-01-02",
      isFinished: true,
    },
    {
      taskName: "Task 2",
      taskId: 2,
      startDate: "2023-01-02",
      endDate: "2023-01-03",
      isFinished: true,
    },
    {
      taskName: "Task 3",
      taskId: 3,
      startDate: "2023-01-03",
      endDate: "2023-01-10",
      isFinished: true,
    },
    {
      taskName: "Task 4",
      taskId: 4,
      startDate: "2023-01-10",
      endDate: "2023-01-25",
      isFinished: true,
    },
    {
      taskName: "Task 5",
      taskId: 5,
      startDate: "2023-01-05",
      endDate: "2023-01-30",
      isFinished: true,
    },
  ]);

  const [burnDownData, setBurnDownData] = useState(
    calculateBurnDownData(tasks)
  );

  useEffect(() => {
    setBurnDownData(calculateBurnDownData(tasks));
  }, [tasks]);

  return (
    <div className="container">
      <h1 className="text-2xl font-bold text-center">Agile Burn Down Chart</h1>
      <BurnDownChart labels={burnDownData.labels} data={burnDownData.data} />
    </div>
  );
};

export default App;
