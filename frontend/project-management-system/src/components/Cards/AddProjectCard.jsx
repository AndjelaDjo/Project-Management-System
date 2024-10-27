import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import axiosInstance from '../../utilis/axiosInstance';
import UserSearchBar from '../SearchBar/UserSearchBar';
import TeamSearchBar from '../SearchBar/TeamSearchBar';

const AddProjectCard = ({ isOpen, onClose, onProjectAdded, project }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        startDate: "",
        dueDate: "",
        status: "Not Started",
        priority: "Medium",
        assignedTo: [],
        teams: [],
    });

    useEffect(() => {
        if (isOpen && project) {
            setFormData({
                name: project.name || '',
                description: project.description || '',
                startDate: project.startDate ? formatDateForInput(project.startDate) : '',
                dueDate: project.dueDate ? formatDateForInput(project.dueDate) : '',
                status: project.status || 'Not Started',
                priority: project.priority || 'Medium',
                assignedTo: project.assignedTo || [],
                teams: project.teams || []
            });
        } else if (isOpen && !project) {
            setFormData({
                name: "",
                description: "",
                startDate: "",
                dueDate: "",
                status: "Not Started",
                priority: "Medium",
                assignedTo: [],
                teams: [],
            });
        }
    }, [isOpen, project]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAssignedUsersChange = (users) => {
        setFormData({
            ...formData,
            assignedTo: users
        });
    };

    const handleAssignedTeamsChange = (teams) => {
        setFormData({
            ...formData,
            teams: teams
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const assignedToUserIds = formData.assignedTo.map(user => user._id);
        const assignedToTeamIds = formData.teams.map(team => team._id);

        const projectDataToSend = {
            ...formData,
            assignedTo: assignedToUserIds,
            teams: assignedToTeamIds,
        };

        const { name, description, startDate, dueDate, status, priority } = projectDataToSend;

        if (!name || !description || !status || !assignedToUserIds.length || !dueDate || !priority || !startDate) {
            console.error('All fields are required');
            return;
        }

        try {
            let response;
            if (project) {
                response = await axiosInstance.put(`/projects/update-project/${project._id}`, projectDataToSend);
            } else {
                response = await axiosInstance.post('/projects/add-project', projectDataToSend);
            }
            if (onProjectAdded) onProjectAdded();
            onClose();
        } catch (error) {
            console.error('Error saving project:', error.response?.data || error.message);
        }
    };

    const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = date.toISOString().slice(0, 16);
        return formattedDate;
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 mt-10">
                    <div className="bg-white p-4 rounded-lg w-2/4 relative overflow-y-auto max-h-[90vh]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                        >
                            <IoMdClose size={20} />
                        </button>
                        <h3 className="text-lg font-medium mb-2">
                            {project ? "Edit Project" : "Add Project"}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            {/* Form fields */}
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-input-box"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                    className="form-input-box"
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-4 flex gap-4">
                                <div className="w-1/2">
                                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                    <input
                                        type="datetime-local"
                                        id="startDate"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        className="form-input-box"
                                        required
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                    <input
                                        type="datetime-local"
                                        id="dueDate"
                                        name="dueDate"
                                        value={formData.dueDate}
                                        onChange={handleChange}
                                        className="form-input-box"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-4 flex gap-4">
                                <div className="w-1/2">
                                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                    <select
                                        id="priority"
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        className="form-input-box"
                                        required
                                    >
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                                <div className="w-1/2">
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="form-input-box"
                                        required
                                    >
                                        <option value="Not Started">Not Started</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="On Hold">On Hold</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Users</label>
                                <UserSearchBar
                                    assignedUsers={formData.assignedTo}
                                    onAssignUsers={handleAssignedUsersChange}
                                    showSelectedUsers={true}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Teams</label>
                                <TeamSearchBar
                                    assignedTeams={formData.teams}
                                    onAssignTeams={handleAssignedTeamsChange}
                                    showSelectedTeams={true}
                                />
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" className="btn-primary w-32 flex items-center justify-center space-x-2 h-8 px-3">
                                    {project ? "Save Changes" : "Create Project"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddProjectCard;
