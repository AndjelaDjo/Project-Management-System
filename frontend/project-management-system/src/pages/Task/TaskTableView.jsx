import { useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardDoubleArrowUp } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import AddTaskCard from '../../components/Cards/AddTaskCard';
import TaskTitle from "../../components/TaskTitle/TaskTitle";
import axiosInstance from "../../utilis/axiosInstance";

export const PRIORITYSTYLES = {
    High: "bg-red-100 text-red-600",
    Medium: "bg-yellow-100 text-yellow-600",
    Low: "bg-blue-100 text-blue-600",
};

const ICONS = {
    High: <MdKeyboardDoubleArrowUp />,
    Medium: <MdKeyboardArrowUp />,
    Low: <MdKeyboardArrowDown />,
};

const groupTasksByStatus = (tasks) => {
    return tasks.reduce((acc, task) => {
        if (!acc[task.status]) {
            acc[task.status] = [];
        }
        acc[task.status].push(task);
        return acc;
    }, {});
};


const getStatusClasses = (status) => {
    switch (status) {
        case "Completed":
            return "bg-blue-600 text-green-600 font-semibold text-sm";
        case "To Do":
            return "bg-green-600 text-blue-600 font-semibold text-sm";
        case "In Progress":
            return "bg-yellow-600 text-orange-600 font-semibold text-sm";
        default:
            return "";
    }
};

const TaskTableView = ({ tasks, onDelete }) => {
    const navigate = useNavigate();
    const [isAddTaskCardOpen, setIsAddTaskCardOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);

    const handleEditClick = (task) => {
        setTaskToEdit(task);
        setIsAddTaskCardOpen(true);
    };

    const handleDelete = async (taskId) => {
        try {
            await axiosInstance.delete(`http://localhost:8000/api/tasks/delete-task/${taskId}`);
        } catch (error) {
            if (error.response && error.response.status === 403) {
                alert(error.response.data.message);
            } else {
                alert("An unexpected error occurred. Please try again.");
            }
        }
    };

    const handleCloseAddTaskCard = () => {
        setIsAddTaskCardOpen(false);
        setTaskToEdit(null);
    };

    const groupedTasks = groupTasksByStatus(tasks);

    return (
        <div className="flex-1 overflow-y-auto ">
            {Object.keys(groupedTasks).map(status => (
                <div key={status} className="bg-white mb-4 p-3 rounded-md">
                    <TaskTitle label={status} className={getStatusClasses(status)} />
                    <div className="overflow-x-auto mt-2">
                        <table className="min-w-full w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="w-1/6 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Name</th>
                                    <th className="w-1/2 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="w-1/6 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                    <th className="w-1/6 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {groupedTasks[status].map((task) => (
                                    <tr
                                        key={task._id}
                                        className="bg-white hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
                                        onClick={() => navigate(`/task-details/${task._id}`)}
                                    >
                                        <td className="w-1/5 px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {task.title}
                                        </td>
                                        <td className="w-1/2 px-4 py-4 whitespace-normal text-sm text-gray-900 break-words">
                                            {task.description}
                                        </td>
                                        <td className="w-1/6 px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className={`flex items-center text-sm font-medium ${PRIORITYSTYLES[task?.priority]} p-2 rounded-md`}>
                                                <span className='text-base'>{ICONS[task?.priority]}</span>
                                                <span className='ml-2 text-sm'>{task?.priority} Priority</span>
                                            </div>
                                        </td>
                                        <td className="w-1/6 px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <button
                                                className="text-blue-500 hover:text-blue-700 mr-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditClick(task);
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-700"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(task._id); 
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
            {isAddTaskCardOpen && (
                <AddTaskCard
                    isOpen={isAddTaskCardOpen}
                    onClose={handleCloseAddTaskCard}
                    onTaskAdded={() => { }}
                    task={taskToEdit}
                />
            )}
        </div>
    );
};

export default TaskTableView;
