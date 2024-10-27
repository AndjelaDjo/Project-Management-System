import { useState, useEffect } from 'react';
import axiosInstance from '../../utilis/axiosInstance';

import { IoMdClose } from 'react-icons/io';

const ProjectSearchBar = ({ assignedProjects, onAssignProjects }) => {

    const [searchQuery, setSearchQuery] = useState('');
    const [projectList, setProjectList] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedProjects, setSelectedProjects] = useState(assignedProjects || []);

    useEffect(() => {
        if (searchQuery.length > 0) {
            const fetchProjects = async () => {
                try {
                    const response = await axiosInstance.get(`/projects/search?search=${searchQuery}`);
                    setProjectList(response.data);
                } catch (error) {
                    console.error('Error fetching projects:', error);
                }
            };
            fetchProjects();
        } else {
            setProjectList([]);
        }
    }, [searchQuery]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setShowDropdown(true);
    };

    const handleProjectSelect = (project) => {
        if (!selectedProjects.find((u) => u._id === project._id)) {
            const updatedProjects = [...selectedProjects, project];
            setSelectedProjects(updatedProjects);
            onAssignProjects(updatedProjects);
        }
        setSearchQuery('');
        setShowDropdown(false);
    };

    const handleRemoveProject = (projectId) => {
        const updatedProjects = selectedProjects.filter((project) => project._id !== projectId);
        setSelectedProjects(updatedProjects);
        onAssignProjects(updatedProjects);
    };
    return (
        <div className="relative">
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="form-input-box"
                placeholder="Search projects..."
            />

            {showDropdown && (
                <div className="absolute z-10 mt-2 text-sm w-full bg-white border rounded-lg shadow-lg">
                    {projectList.length > 0 ? (
                        <ul>
                            {projectList.map((project) => (
                                <li
                                    key={project._id}
                                    onClick={() => handleProjectSelect(project)}
                                    className="p-2 cursor-pointer hover:bg-gray-200"
                                >
                                    {project.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-2 text-gray-500">No projects found.</div>
                    )}
                </div>
            )}
            {selectedProjects.length > 0 && (
                <div className="mt-2">
                    <h4 className="font-medium">Assigned Projects:</h4>
                    <ul className="flex flex-wrap">
                        {selectedProjects.map((project) => (
                            <li
                                key={project._id}
                                className="bg-gray-200 rounded-full px-3 py-1 m-1 flex items-center"
                            >
                                {project.name}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveProject(project._id)}
                                    className="ml-2 text-red-500 hover:text-red-700"
                                >
                                    <IoMdClose />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default ProjectSearchBar
