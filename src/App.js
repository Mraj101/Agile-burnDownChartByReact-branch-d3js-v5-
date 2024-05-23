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

  const totalTasks = tasks.length;
  const actualBurnDown = Array(labels.length).fill(null);

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

  let completedTasks = 0;
  let lastCompletedDateIndex = -1;

  for (let i = 0; i < labels.length; i++) {
    const date = labels[i];

    if (taskEndDates.has(date)) {
      completedTasks += taskEndDates.get(date);
      lastCompletedDateIndex = i;
    }

    if (i === 0) {
      actualBurnDown[i] = totalTasks;
    } else {
      actualBurnDown[i] = totalTasks - completedTasks;
    }
  }

  for (let i = lastCompletedDateIndex + 1; i < actualBurnDown.length; i++) {
    actualBurnDown[i] = null;
  }

  const taskNames = tasks.map((task) => task.taskName).reverse();

  return { labels, data: { actual: actualBurnDown }, taskNames };
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
      isFinished: false,
    },
    {
      taskName: "Task 5",
      taskId: 5,
      startDate: "2023-01-05",
      endDate: "2023-01-30",
      isFinished: false,
    },
  ]);

  const [burnDownData, setBurnDownData] = useState(
    calculateBurnDownData(tasks)
  );

  useEffect(() => {
    setBurnDownData(calculateBurnDownData(tasks));
  }, [tasks]);

  const deadline = "2023-01-08"; // Set your specific deadline date here

  return (
    <div className="container">
      <h1 className="text-2xl font-bold text-center">Agile Burn Down Chart</h1>
      <BurnDownChart
        labels={burnDownData.labels}
        data={burnDownData.data}
        taskNames={burnDownData.taskNames}
        deadline={deadline}
      />
    </div>
  );
};

export default App;
