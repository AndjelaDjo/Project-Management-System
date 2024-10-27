import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import axiosInstance from "../../utilis/axiosInstance";
import { useUserInfo } from '../../hooks/userInfo';
import { IoMdAdd } from "react-icons/io";
import ProjectCard from "../../components/Cards/ProjectCard";
import AddProjectCard from "../../components/Cards/AddProjectCard";

const Project = () => {
    const [projects, setProjects] = useState([]);
    const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
    const userInfo = useUserInfo();
    const [projectToEdit, setProjectToEdit] = useState(null);

    const fetchProjects = async () => {
        try {
            const response = await axiosInstance.get("/projects/get-projects");
            setProjects(response.data);
        } catch (error) {
            console.error("Error fetching projects:", error.response?.data || error.message);
        }
    };

    const deleteProject = (deletedProjectId) => {
        setProjects((prevProjects) =>
            prevProjects.filter((project) => project._id !== deletedProjectId)
        );
    };  

    const handleProjectAdded = () => {
        fetchProjects();
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const openAddProjectModal = () => {
        setProjectToEdit(null); 
        setIsAddProjectModalOpen(true);
    };

    const closeAddProjectModal = () => {
        setIsAddProjectModalOpen(false);
    };

    const openEditProjectModal = (project) => {
        setProjectToEdit(project);
        setIsAddProjectModalOpen(true);
    };

    return (
        <div className="flex flex-col h-screen bg-slate-200">
            <Navbar userInfo={userInfo} />
            <div className="flex flex-1 pt-12">
                <Sidebar />
                <div className="flex-1 overflow-y-auto p-6 ml-56">
                    <div className="w-full flex justify-between items-center gap-4 md:gap-x-12 py-2">
                        <h2 className="text-xl font-semibold">Projects</h2>
                        <button
                            className="btn-primary w-36 flex items-center space-x-2 h-8 px-3"
                            onClick={openAddProjectModal}
                        >
                            <IoMdAdd size={20} />
                            <span>Add Project</span>
                        </button>
                    </div>

                    <AddProjectCard
                        isOpen={isAddProjectModalOpen}
                        onClose={closeAddProjectModal}
                        onProjectAdded={handleProjectAdded}
                        project={projectToEdit} 
                    />

                    <div className="bg-white p-6 rounded-md mt-4">
                        {projects.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map(project => (
                                        <ProjectCard key={project._id} project={project} onDelete={deleteProject} onEdit={openEditProjectModal} />
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-center py-4">No projects available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Project;
