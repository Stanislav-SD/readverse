"use client";
import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

// Register Chart.js modules
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function WeekStat({ daysData }: { daysData: number[] }) {

  // Memoize the data calculation and options to avoid unnecessary re-renders
  const data = useMemo(() => {
    const paddedData = [...daysData];

    return {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Pages read",
          data: paddedData,
          backgroundColor: ["#AC483B"],
          borderColor: ["#000000"],
          borderWidth: 0,
          borderRadius: 7,
        },
      ],
    };
  }, [daysData]); // Only recalculate when daysData changes

  const options = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        onClick: ()=>{},
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  }), []); // Options don't change, so this is memoized once

  return <Bar data={data} options={options} />;
}

export default WeekStat;
