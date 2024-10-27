import { FaRegClock } from "react-icons/fa"; 

const RecentActivityCard = ({ activities }) => {
  return (
    <div className="bg-white p-6 rounded-md mb-6 h-full max-h-[500px] overflow-y-auto">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Recent Activities</h3>
      <ul className="space-y-2">
        {activities.map((activity, index) => (
          <li
            key={index}
            className="flex items-center justify-between bg-gray-100 p-4 border border-gray-300 rounded-md"
          >
            <div className="flex items-center space-x-3">
              <FaRegClock className="text-gray-500" />
              <p className="text-gray-800 text-sm font-medium flex-1">{activity.message}</p>
            </div>
            <span className="text-xs text-gray-500 ml-2">{new Date(activity.timestamp).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivityCard;
