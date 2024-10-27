import { useState, useEffect } from "react";
import axiosInstance from '../../utilis/axiosInstance';
import UserSearchBar from '../SearchBar/UserSearchBar';
import { IoMdClose } from "react-icons/io";

const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - (offset * 60 * 1000)); 
    return localDate.toISOString().slice(0, 16); 
};

const parseDateFromInput = (date) => {
    if (!date) return "";
    return new Date(date).toISOString(); 
};

const AddTaskCard = ({ isOpen, onClose, onTaskAdded, task }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "To Do",
        assignedTo: [],
        dueDate: "",
        priority: "Medium",
        project: ""
    });

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axiosInstance.get('/projects/get-projects');
                setProjects(response.data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || "",
                description: task.description || "",
                status: task.status || "To Do",
                assignedTo: task.assignedTo || [],
                dueDate: formatDateForInput(task.dueDate) || "",
                priority: task.priority || "Medium",
                project: task.project?._id || ""
            });
        }
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAssignedUsersChange = (users) => {
        setFormData(prevState => ({
            ...prevState,
            assignedTo: users
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const assignedToUserIds = formData.assignedTo.map(user => user._id);
        const taskData = {
            ...formData,
            dueDate: parseDateFromInput(formData.dueDate),
            assignedTo: assignedToUserIds
        };

        const { title, description, status, dueDate, priority, project } = taskData;

        if (!title || !description || !status || !assignedToUserIds.length || !dueDate || !priority || !project) {
            console.error('All fields are required');
            return;
        }

        try {
            if (task) {
                const response = await axiosInstance.put(`/tasks/edit-task/${task._id}`, taskData);
                console.log('Task updated:', response.data);
            } else {
                const response = await axiosInstance.post('/tasks/add-task', taskData);
                console.log('Task added:', response.data);
            }

            onTaskAdded();  
            onClose();     
        } catch (error) {
            console.error('Error saving task:', error.response?.data || error.message);
        }
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-4 rounded-lg w-2/4 relative z-60">
                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                        >
                            <IoMdClose />
                        </button>
                        <h3 className="text-lg font-medium mb-2">{task ? "Edit Task" : "Add Task"}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
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
                                <div className="w-1/3">
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="form-input-box"
                                        required
                                    >
                                        <option value="In Progress">In Progress</option>
                                        <option value="To Do">To Do</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                                <div className="w-1/3">
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
                                <div className="w-1/3">
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
                            </div>
                            <div className="mb-4">
                                <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                                <select
                                    id="project"
                                    name="project"
                                    value={formData.project}
                                    onChange={handleChange}
                                    className="form-input-box"
                                    required
                                >
                                    <option value="">Select a project</option>
                                    {projects.map(project => (
                                        <option key={project._id} value={project._id}>{project.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Users</label>
                                <UserSearchBar
                                    assignedUsers={formData.assignedTo}
                                    onAssignUsers={handleAssignedUsersChange}
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="btn-primary w-32 flex items-center justify-center space-x-2 h-8 px-3"
                                >
                                    {task ? "Save Changes" : "Create Task"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddTaskCard;
