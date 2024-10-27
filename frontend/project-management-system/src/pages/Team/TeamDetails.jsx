import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utilis/axiosInstance';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useUserInfo } from '../../hooks/userInfo';
import UserSearchBar from '../../components/SearchBar/UserSearchBar';

const TeamDetails = () => {
    const { id } = useParams();
    const [team, setTeam] = useState(null);
    const [projects, setProjects] = useState([]);
    const userInfo = useUserInfo();

    const fetchTeamDetails = async () => {
        try {
            const response = await axiosInstance.get(`/teams/get-team/${id}`);
            setTeam(response.data);
        } catch (error) {
            console.error("Error fetching team details:", error.response?.data || error.message);
        }
    };

    const handleAssignUser = async (users) => {
        try {
            const updatedMembers = [...team.members, ...users];
            const response = await axiosInstance.put(`/teams/update-team/${id}`, { members: updatedMembers });
            if (response.status === 200) {
                setTeam(prevTeam => ({ ...prevTeam, members: updatedMembers }));
            } else {
                console.error("Failed to assign users. Status code:", response.status);
            }
        } catch (error) {
            console.error("Error adding users to team:", error.response?.data || error.message);
        }
    };

    const handleRemoveUser = async (userId) => {
        try {
            const updatedMembers = team.members.filter(member => member._id !== userId);
            await axiosInstance.put(`/teams/update-team/${id}`, { members: updatedMembers });
            setTeam(prevTeam => ({ ...prevTeam, members: updatedMembers }));
        } catch (error) {
            console.error("Error removing user from team:", error.response?.data || error.message);
        }
    };

    const fetchTeamProjects = async () => {
        try {
            const response = await axiosInstance.get(`/teams/get-team-projects/${id}`);
            setProjects(response.data);
        } catch (error) {
            console.error("Error fetching team projects:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        fetchTeamDetails();
        fetchTeamProjects();
    }, [id]);

    if (!team) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex flex-col h-screen bg-slate-200">
            <Navbar userInfo={userInfo} />
            <div className="flex flex-1 pt-12">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-6 ml-56 bg-slate-200">
                    <div className="w-full mx-auto">
                        {/* Header Section */}
                        <section className="bg-white text-black p-6 rounded-md mb-8">
                            <h2 className="text-xl font-semibold mb-2">{team.name}</h2>
                            <p className="text-base">{team.description}</p>
                            <div className="flex items-center gap-2 mt-4">
                                <h3 className="text-base font-semibold text-black">Created By:</h3>
                                <p className='text-black text-md'>{team.createdBy?.fullName}</p>
                            </div>
                        </section>

                        {/* Grid Layout for Members and Projects */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Members Section */}
                            <section className="bg-white p-6 rounded-md">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Members</h3>
                                <UserSearchBar showSelectedUsers={false} onAssignUsers={handleAssignUser} />
                                <div className="overflow-x-auto">
                                    <table className="min-w-full mt-4">
                                        <thead className="bg-slate-200">
                                            <tr>
                                                <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">Full Name</th>
                                                <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[250px]">Email</th>
                                                <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">Role</th>
                                                <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white">
                                            {team.members?.length > 0 ? (
                                                team.members.map(member => (
                                                    <tr key={member._id} className="hover:bg-gray-100 transition-colors duration-300">
                                                        <td className="px-8 py-4 text-sm text-gray-700">{member.fullName}</td>
                                                        <td className="px-8 py-4 text-sm text-gray-700">{member.email}</td>
                                                        <td className="px-8 py-4 text-sm text-gray-600">{member.role}</td>
                                                        <td className="px-8 py-4 text-sm text-gray-600">
                                                            <button
                                                                onClick={() => handleRemoveUser(member._id)}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                Remove
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="px-8 py-4 text-sm text-gray-600">No members found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <section className="bg-white p-6 rounded-md w-auto">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Projects</h3>
                                {projects.length > 0 ? (
                                    <div className="space-y-4">
                                        {projects.map(project => (
                                            <div
                                                key={project._id}
                                                className=""
                                            >
                                                <div className="flex flex-col">
                                                    <h4 className="text-base font-semibold text-gray-900">{project.name}</h4>
                                                    <p className="text-gray-600 mt-2 text-sm">{project.description || 'No description available'}</p>

                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-600">No projects found for this team.</p>
                                )}
                            </section>


                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default TeamDetails;
