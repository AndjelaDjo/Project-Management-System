import { useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardDoubleArrowUp } from "react-icons/md";
import { LuCalendarClock } from "react-icons/lu";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { getInitials } from "../../utilis/Helper";
import AddTaskCard from "../Cards/AddTaskCard";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utilis/axiosInstance';

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

const TaskCard = ({ task, onDelete, onTaskUpdated }) => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    const handleDelete = async (e) => {
        e.stopPropagation();
        try {
            await axiosInstance.delete(`http://localhost:8000/api/tasks/delete-task/${task._id}`);
            if (onDelete) {
                onDelete(task._id);
            }
            window.location.reload();
        } catch (error) {
            if (error.response && error.response.status === 403) {
                window.alert(error.response.data.message);
            } else {
                window.alert("An unexpected error occurred. Please try again.");
            }
        }
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        setIsEditing(true);
    };

    const closeEditModal = () => {
        setIsEditing(false);
        if (onTaskUpdated) {
            onTaskUpdated();
        }
    };

    const handleCardClick = () => {
        navigate(`/task-details/${task._id}`);
    };

    const handleTaskUpdated = () => {
        if (onTaskUpdated) {
            onTaskUpdated();
        }
        closeEditModal();
    };
    return (
        <>
            <div
                className="bg-white p-6 rounded-md mb-4 max-w-md mx-auto"
                onClick={handleCardClick}
            >
                <div className="flex justify-between items-center mb-4">
                    <div className={`flex items-center text-xs font-medium ${PRIORITYSTYLES[task?.priority]} px-2 py-1 rounded-md justify-center`}>
                        <span className='text-sm'>{ICONS[task?.priority]}</span>
                        <span className='ml-1 text-sm'>{task?.priority} Priority</span>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={handleEdit}
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                            aria-label="Edit Task"
                        >
                            <AiOutlineEdit />
                        </button>
                        <button
                            onClick={handleDelete}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            aria-label="Delete Task"
                        >
                            <AiOutlineDelete />
                        </button>
                    </div>
                </div>
                <h5 className="text-base font-semibold mb-2 text-gray-900">{task.title}</h5>
                {task.project && (
                    <p className="text-sm text-purple-700 mb-2 font-medium">{task.project.name}</p>
                )}
                <p className="flex items-center text-sm text-gray-500 mb-2">
                    <LuCalendarClock size={20} className="mr-2" />
                    {new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <hr className="mb-2 border-gray-300" />
                <p className="text-sm text-gray-700 mb-2">{task.description}</p>
                <div className="flex items-center -space-x-2 mb-2">
                    {task.assignedTo.map(user => (
                        <div key={user._id} className="relative group">
                            <div className="w-8 h-8 text-xs flex items-center justify-center bg-purple-500 text-white rounded-full border-2 border-white mr-1">
                                {getInitials(user.fullName)}
                            </div>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                {user.fullName}
                            </div>
                        </div>
                    ))}
                </div>
                {task.createdBy && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">Created By:</span>
                        <span className="text-sm text-gray-700">{task.createdBy.fullName}</span>
                    </div>
                )}
            </div>
            {isEditing && (
                <AddTaskCard
                    isOpen={isEditing}
                    onClose={closeEditModal}
                    onTaskAdded={handleTaskUpdated} 
                    task={task}
                />
            )}
        </>
    );
};

export default TaskCard;
