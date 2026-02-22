import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components (Week 5 requirement)
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function SummaryChart({ chartData }) {
  const options = {
    responsive: true, maintainAspectRatio: false,
    layout: {
      padding: { left: 20, right: 50, top: 0, bottom: 0}},
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Different Boroughs Restricted Points Count', },},
      scales: {
        x: {
          ticks: { maxRotation: 45, minRotation: 45 }}}
  };

  return <Bar data={chartData} options={options} />;
}

export default SummaryChart;