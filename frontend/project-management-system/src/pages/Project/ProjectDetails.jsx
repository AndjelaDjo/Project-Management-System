import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from "../../utilis/axiosInstance";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useUserInfo } from '../../hooks/userInfo';
import { getInitials } from "../../utilis/Helper";
import TeamCard from '../../components/Cards/TeamCard';
import TaskTableView from "../../pages/Task/TaskTableView";
import AddTaskCard from '../../components/Cards/AddTaskCard';
import TeamSearchBar from '../../components/SearchBar/TeamSearchBar';
import { FiPlus } from 'react-icons/fi';
import AddTeamCard from '../../components/Cards/AddTeamCard';
import UserSearchBar from '../../components/SearchBar/UserSearchBar';
import FileUpload from '../../components/FileUpload/FileUpload';
import { MdKeyboardDoubleArrowUp, MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md';

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

const ProjectDetails = ({ onTaskAdded, onTeamAdded }) => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const userInfo = useUserInfo();
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
    const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);

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

    const fetchProjectDetails = async () => {
        try {
            const response = await axiosInstance.get(`/projects/project-details/${id}`);
            setProject(response.data);
        } catch (error) {
            console.error("Error fetching project details:", error.response?.data || error.message);
        }
    };
    useEffect(() => {
        fetchProjectDetails();
    }, [id, onTaskAdded, onTeamAdded]);   


    const handleAddTaskClick = () => {
        setIsAddTaskOpen(true);
    };

    const handleAssignTeams = async (teams) => {
        const newTeams = teams.filter(team => !project.teams.some(t => t._id === team._id));
        if (newTeams.length > 0) {
            const updatedTeams = [...project.teams, ...newTeams];
            setProject(prevProject => ({ ...prevProject, teams: updatedTeams }));

            try {
                const response = await axiosInstance.put(`/projects/update-project/${id}`, {
                    name: project.name,
                    description: project.description,
                    startDate: project.startDate,
                    dueDate: project.dueDate,
                    status: project.status,
                    priority: project.priority,
                    assignedTo: project.assignedTo,
                    teams: updatedTeams
                });
                if (response.status !== 200) {
                    throw new Error('Failed to update teams');
                }
                console.log("Teams updated successfully");
            } catch (error) {
                console.error("Error updating teams:", error);
                setProject(prevProject => ({ ...prevProject, teams: prevProject.teams }));
            }
        }
    };

    const handleRemoveTeam = async (teamId) => {
        const updatedTeams = project.teams.filter(team => team._id !== teamId);
        setProject(prevProject => ({ ...prevProject, teams: updatedTeams }));

        try {
            const response = await axiosInstance.put(`/projects/update-project/${id}`, {
                name: project.name,
                description: project.description,
                startDate: project.startDate,
                dueDate: project.dueDate,
                status: project.status,
                priority: project.priority,
                assignedTo: project.assignedTo,
                teams: updatedTeams
            });
            if (response.status === 200) {
                console.log("Team removed successfully");
            }
        } catch (error) {
            console.error("Error removing team:", error.response?.data || error.message);
            setProject(prevProject => ({ ...prevProject, teams: prevProject.teams }));
        }
    };

    const handleDelete = (taskId) => {
        console.log('Deleting task with ID:', taskId);
    };

    const handleTaskAdded = (task) => {
        console.log('Task added:', task);
        setIsAddTaskOpen(false);
        if (onTaskAdded) onTaskAdded(task);
    };

    const handleRemoveUser = async (userId) => {
        const updatedUsers = project.assignedTo.filter(user => user._id !== userId);
        setProject(prevProject => ({ ...prevProject, assignedTo: updatedUsers }));

        try {
            const response = await axiosInstance.put(`/projects/update-project/${id}`, {
                name: project.name,
                description: project.description,
                startDate: project.startDate,
                dueDate: project.dueDate,
                status: project.status,
                priority: project.priority,
                assignedTo: updatedUsers,
                teams: project.teams
            });
            if (response.status === 200) {
                console.log("User removed successfully");
            }
        } catch (error) {
            console.error("Error removing user:", error.response?.data || error.message);
            setProject(prevProject => ({ ...prevProject, assignedTo: prevProject.assignedTo }));
        }
    };

    const handleAssignUser = async (users) => {
        const newUsers = users.filter(user => !project.assignedTo.some(u => u._id === user._id));
        if (newUsers.length > 0) {
            const updatedUsers = [...project.assignedTo, ...newUsers];
            setProject(prevProject => ({ ...prevProject, assignedTo: updatedUsers }));

            try {
                const response = await axiosInstance.put(`/projects/update-project/${id}`, {
                    name: project.name,
                    description: project.description,
                    startDate: project.startDate,
                    dueDate: project.dueDate,
                    status: project.status,
                    priority: project.priority,
                    assignedTo: updatedUsers,
                    teams: project.teams
                });
                if (response.status !== 200) {
                    throw new Error('Failed to update users');
                }
                console.log("Users updated successfully");
            } catch (error) {
                console.error("Error updating users:", error);
                setProject(prevProject => ({ ...prevProject, assignedTo: prevProject.assignedTo }));
            }
        }
    };

    const handleDeleteFile = async (fileId) => {
        try {
            // Make the DELETE request to the backend
            const response = await axiosInstance.delete(`/projects/${project._id}/files/${fileId}`);
    
            // Check if the delete request was successful (status 200)
            if (response.status === 200) {
                // Update the project state to remove the deleted file from the files array
                setProject(prevProject => ({
                    ...prevProject,
                    files: prevProject.files.filter(file => file._id !== fileId)
                }));
    
                console.log('File deleted successfully');
            } else {
                console.error('Failed to delete file: ', response);
            }
        } catch (error) {
            console.error('Error deleting file:', error);
            // Optionally show a user-friendly error message
        }
    };
    



    if (!project) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex flex-col h-full bg-slate-200">
            <Navbar userInfo={userInfo} />
            <div className="flex flex-1 pt-12">
                <Sidebar />
                <div className="flex-1 overflow-y-auto p-8 ml-56 bg-slate-200">
                    <div className="mx-auto">

                        {/* Project Information Section */}
                        <section className="mb-8">
                            <div className="flex flex-col lg:flex-row lg:gap-8">
                                {/* Left Section */}
                                <div className="flex-1 bg-white p-6 rounded-md">
                                    <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
                                    <p className="text-base">{project.description}</p>
                                    <div className="flex items-center gap-2 mt-4">
                                        <h3 className="text-base font-semibold text-black">Created By:</h3>
                                        <p className="text-black text-md">{project.createdBy?.fullName || 'Unknown'}</p>
                                    </div>
                                </div>

                                {/* Right Section */}
                                <div className="flex-1 bg-white p-6 rounded-md">
                                    <div className="mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className='text-sm text-gray-500'>Start Date</span>
                                            <p className='text-md font-medium text-gray-800'>
                                                {new Date(project.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className='text-sm text-gray-500'>Due Date</span>
                                            <p className='text-md font-medium text-gray-800'>
                                                {new Date(project.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className='text-sm text-gray-500'>Priority</span>
                                            <div className={`flex items-center justify-center w-36 p-1 rounded-md ${PRIORITYSTYLES[project.priority]}`}>
                                                {ICONS[project.priority]}
                                                <span className="text-sm font-medium ml-1">{project.priority} Priority</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <span className='text-sm text-gray-500'>Status</span>
                                            <div className={`flex items-center justify-center w-24 p-1 rounded-md ${getStatusClasses(project.status)}`}>
                                                <span className="text-sm font-medium">{project.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Assigned Users Section */}
                        <div className="bg-white p-6 rounded-md mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Assigned To</h3>
                            </div>

                            <UserSearchBar
                                assignedUsers={project.assignedTo}
                                onAssignUsers={handleAssignUser}
                                showSelectedUsers={false}
                                projectId={project._id}
                            />

                            <div className="overflow-x-auto mt-4">
                                <table className="min-w-full w-full ">
                                    <thead className="bg-slate-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Initials</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {project.assignedTo.map(user => (
                                            <tr key={user._id} className="bg-white hover:bg-slate-100 transition-colors duration-200">
                                                <td className="py-2 px-4 text-sm text-gray-700">
                                                    <div className="w-8 h-8 flex items-center justify-center bg-purple-500 text-white text-xs rounded-full">
                                                        {getInitials(user.fullName)}
                                                    </div>
                                                </td>
                                                <td className="py-2 px-4 text-sm text-gray-700">{user.fullName}</td>
                                                <td className="py-2 px-4 text-sm text-gray-700">{user.email}</td>
                                                <td className="py-2 px-4 text-sm text-gray-600">{user.role}</td>
                                                <td className="py-2 px-4 text-sm text-red-500 cursor-pointer"
                                                    onClick={() => handleRemoveUser(user._id)}>
                                                    Remove
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Teams Section */}
                        <div className="bg-white p-6 rounded-md mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-semibold text-gray-800">Teams</h3>
                                </div>
                                <button
                                    onClick={() => setIsAddTeamOpen(true)}
                                    className="flex items-center text-white bg-purple-500 hover:bg-purple-600 rounded-md p-1"
                                >
                                    <FiPlus className="text-sm" />
                                </button>
                            </div>
                            <TeamSearchBar
                                assignedTeams={project.teams}
                                onAssignTeams={handleAssignTeams}
                                showSelectedTeams={false}
                                projectId={project._id} 
                            />
                            <div className="overflow-x-auto">
                                <table className="min-w-full w-full  rounded-md">
                                    <thead className="bg-slate-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Team Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/4">Description</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Created By</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white ">
                                        {project.teams.map(team => (
                                            <TeamCard
                                                key={team._id}
                                                team={team}
                                                onRemove={handleRemoveTeam}
                                                onEdit={() => { }}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Tasks Section */}
                        <div className="bg-white p-6 rounded-md mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-semibold text-gray-800">Tasks</h3>
                                </div>
                                <button
                                    onClick={handleAddTaskClick}
                                    className="flex items-center text-white bg-purple-500 hover:bg-purple-600 rounded-md p-1"
                                >
                                    <FiPlus className="text-sm" />
                                </button>
                            </div>
                            <TaskTableView tasks={project.tasks} onTaskDeleted={handleDelete} />
                        </div>

                        {/* Uploaded Files Section */}
                        <div className="bg-white p-6 rounded-md mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Uploaded Files</h3>
                            </div>
                            <FileUpload
                                projectId={project._id}
                                onFileUploaded={(fileData) => {
                                    console.log('File uploaded:', fileData);
                                    setProject(prevProject => ({
                                        ...prevProject,
                                        files: [...prevProject.files, fileData]
                                    }));
                                }}
                            />
                            <div className="space-y-2 mt-4">
                                {project.files && project.files.length > 0 ? (
                                    project.files.map((file) => (
                                        <div
                                            key={file._id || file.fileName} 
                                            className="bg-gray-100 py-2 px-4 rounded-lg flex items-center justify-between shadow-sm">
                                            <a
                                                href={file.filePath}
                                                download 
                                                className="text-blue-600 hover:underline">
                                                {file.fileName}
                                            </a>
                                            <button
                                                onClick={() => handleDeleteFile(file._id)}
                                                className="text-red-500 hover:text-red-700 text-sm">
                                                Delete
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500">No files uploaded</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                isAddTaskOpen && (
                    <AddTaskCard
                        isOpen={isAddTaskOpen}
                        onClose={() => setIsAddTaskOpen(false)}
                        onTaskAdded={handleTaskAdded}
                    />
                )
            }
            {
                isAddTeamOpen && (
                    <AddTeamCard
                        isOpen={isAddTeamOpen}
                        onClose={() => setIsAddTeamOpen(false)}
                        onTeamAssigned={handleAssignTeams}
                    />
                )
            }
        </div>
    );
};

export default ProjectDetails;
