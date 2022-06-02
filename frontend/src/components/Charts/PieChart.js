import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = (props) => {
  const labels = props.labels; // labels string array
  const datasets = props.datasets; // datasets array

  const data = {
    labels,
    datasets,
  };

  const options = {
    maintainAspectRatio: false,
  };

  return <Pie data={data} options={options} />;
};

export default PieChart;
