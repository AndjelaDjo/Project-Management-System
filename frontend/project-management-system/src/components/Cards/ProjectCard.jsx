import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardDoubleArrowUp } from "react-icons/md";
import axiosInstance from '../../utilis/axiosInstance';
import { useNavigate } from 'react-router-dom';

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

const ProjectCard = ({ project, onDelete, onEdit }) => {
    const navigate = useNavigate();

    const getStatusClasses = (status) => {
        switch (status) {
            case "Completed":
                return "bg-green-100 text-green-600 font-semibold text-sm";
            case "To Do":
                return "bg-blue-100 text-blue-600 font-semibold text-sm";
            case "In Progress":
                return "bg-orange-100 text-orange-600 font-semibold text-sm";
            case "Not Started":
                return "bg-red-100 text-red-600 font-semibold text-sm";
            case "On Hold":
                return "bg-gray-100 text-gray-600 font-semibold text-sm";
            default:
                return "";
        }
    };

    const statusClasses = getStatusClasses(project?.status);

    const handleDelete = async (e) => {
        e.stopPropagation();
        try {
            await axiosInstance.delete(`http://localhost:8000/api/projects/delete-project/${project._id}`);
            if (onDelete) {
                onDelete(project._id);
            }
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
        onEdit(project);
    };

    const handleViewDetails = () => {
        navigate(`/project-details/${project._id}`);
    };

    return (
        <tr className="bg-white hover:bg-gray-100 transition-colors duration-300 cursor-pointer" onClick={handleViewDetails}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {project?.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(project.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(project.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className={`flex items-center text-sm font-medium ${PRIORITYSTYLES[project?.priority]} p-2 rounded-md`}>
                    <span className='text-base'>{ICONS[project?.priority]}</span>
                    <span className='ml-2  text-sm'>{project?.priority} Priority</span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className={`inline-block p-2 rounded-md text-center ${statusClasses}`}>
                    <span className="font-medium">{project?.status}</span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="flex gap-5">
                    <button className="text-blue-500 hover:text-blue-700 mr-2" onClick={handleEdit}>
                        Edit
                    </button>
                    <button className="text-red-500 hover:text-red-700" onClick={handleDelete}>
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default ProjectCard;
