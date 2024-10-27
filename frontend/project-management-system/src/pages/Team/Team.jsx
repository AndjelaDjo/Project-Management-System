import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useUserInfo } from '../../hooks/userInfo';
import { IoMdAdd } from "react-icons/io";
import axiosInstance from '../../utilis/axiosInstance';
import TeamCard from '../../components/Cards/TeamCard';
import AddTeamCard from '../../components/Cards/AddTeamCard';

const Team = () => {
  const userInfo = useUserInfo();
  const [teams, setTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [teamToEdit, setTeamToEdit] = useState(null); // State for the team being edited

  const fetchTeams = async () => {
    try {
      const response = await axiosInstance.get('/teams/get-team');
      setTeams(response.data.teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const deleteTeam = (deletedTeamId) => {
    setTeams((prevTeams) =>
        prevTeams.filter((team) => team._id !== deletedTeamId)
    );
};

  

  const handleEditTeam = (teamId) => {
    const team = teams.find(t => t._id === teamId);
    setTeamToEdit(team); 
    setShowAddTeamModal(true); 
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleSearch = () => {
    const filteredTeams = teams.filter(team =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setTeams(filteredTeams);
  };

  const onClearSearch = () => {
    setSearchQuery('');
    fetchTeams();
  };

  return (
    <div className="flex flex-col h-screen bg-slate-200">
      <Navbar
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />
      <div className="flex flex-1 pt-12">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-6 ml-56">
          <div className="w-full flex justify-between items-center gap-4 md:gap-x-12 py-2">
            <h2 className="text-xl font-semibold">Teams</h2>
            <button
              className="btn-primary w-32 flex items-center space-x-2 h-8 px-3"
              onClick={() => {
                setTeamToEdit(null); 
                setShowAddTeamModal(true);
              }}
            >
              <IoMdAdd size={18} />
              <span>Add Team</span>
            </button>
          </div>
          <div className="bg-white p-6 rounded-md mt-4">
            {teams.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map(team => (
                    <TeamCard
                      key={team._id}
                      team={team}
                      onDelete={deleteTeam}
                      onEdit={handleEditTeam}
                      showEditAndDelete={true} // Show edit and delete icons
                    />
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center py-4">No teams available.</p>
            )}
          </div>
        </div>
      </div>
      {showAddTeamModal && (
        <AddTeamCard
          isOpen={showAddTeamModal}
          onClose={() => setShowAddTeamModal(false)}
          onTeamAddedOrUpdated={fetchTeams}
          teamData={teamToEdit} 
        />
      )}
    </div>
  );
};

export default Team;
