const TaskTitle = ({ label, className }) => {
    return (
        <div className="w-full h-8 md:h-9 px-2 md:px-4 rounded bg-white flex items-center ">
            <div className={`w-3 h-3 rounded-full ${className || "bg-gray-500"}`}></div>
            <p className="text-xs md:text-sm text-gray-600 ml-3">{label}</p>
        </div>
    );
};


export default TaskTitle;
