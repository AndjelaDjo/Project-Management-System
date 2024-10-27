import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TaskDistributionChart = ({ data }) => {
  const chartData = {
    labels: ['Assigned', 'In Progress', 'Completed', 'To Do'],
    datasets: [
      {
        label: 'Number of Tasks',
        data: [
          data.assigned,
          data.inProgress,
          data.completed,
          data.toDo
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
      <h3 className="text-lg font-semibold mb-4">Task Distribution</h3>
      <Bar data={chartData} options={{ responsive: true }} />
    </div>
  );
};

export default TaskDistributionChart;
