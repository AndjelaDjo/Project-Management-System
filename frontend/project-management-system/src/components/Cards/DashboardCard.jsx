const DashboardCard = ({ title, number, subTitle }) => {
  return (
    <div className="w-72 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h5 className="text-lg font-semibold mb-2">{title}</h5>
        <p className="text-4xl font-bold mb-2 text-center">{number}</p>
        <p className="text-sm text-center">{subTitle}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
