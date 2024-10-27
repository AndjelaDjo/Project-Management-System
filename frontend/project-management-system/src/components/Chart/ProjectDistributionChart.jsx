import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const ProjectDistributionChart = ({ data }) => {
  const projectStatusCounts = {
    'Not Started': 0,
    'In Progress': 0,
    'Completed': 0,
    'On Hold': 0
  };

  const projectPriorityCounts = {
    'High': 0,
    'Medium': 0,
    'Low': 0
  };

  data.forEach(project => {
    if (project.status in projectStatusCounts) {
      projectStatusCounts[project.status]++;
    }
    if (project.priority in projectPriorityCounts) {
      projectPriorityCounts[project.priority]++;
    }
  });

  const statusChartData = {
    labels: Object.keys(projectStatusCounts),
    datasets: [
      {
        label: 'Projects by Status',
        data: Object.values(projectStatusCounts),
        backgroundColor: ['#9b59b6', '#3498db', '#e74c3c', '#2ecc71'], // Purple, Blue, Red, Green
        borderWidth: 1,
        borderColor: '#fff',
      }
    ]
  };

  const priorityChartData = {
    labels: Object.keys(projectPriorityCounts),
    datasets: [
      {
        label: 'Projects by Priority',
        data: Object.values(projectPriorityCounts),
        backgroundColor: ['#8e44ad', '#2980b9', '#e67e22'], // Dark Purple, Dark Blue, Orange
        borderWidth: 1,
        borderColor: '#fff',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 14,
            family: 'Roboto, sans-serif',
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw} projects`;
          }
        },
        bodyFont: {
          size: 14,
        }
      },
      datalabels: {
        color: '#333', 
        display: true,
        formatter: (value) => {
          return `${value}`; 
        },
        font: {
          weight: 'bold',
          size: 16, 
        },
        padding: {
          bottom: 10,
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-md h-full">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Project Distribution</h3>
      <div className="flex flex-col md:flex-row gap-8 mt-12">
        <div className="w-full md:w-1/2 max-w-sm">
          <Doughnut data={statusChartData} options={chartOptions} />
        </div>
        <div className="w-full md:w-1/2 max-w-sm">
          <Doughnut data={priorityChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default ProjectDistributionChart;
