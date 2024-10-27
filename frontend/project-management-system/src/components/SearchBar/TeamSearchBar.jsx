import { useState, useEffect } from 'react';
import axiosInstance from '../../utilis/axiosInstance';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { IoMdClose } from 'react-icons/io';

const TeamSearchBar = ({ assignedTeams = [], onAssignTeams = () => { }, showSelectedTeams = true }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [teamList, setTeamList] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedTeams, setSelectedTeams] = useState(assignedTeams);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        setSelectedTeams(assignedTeams);
    }, [assignedTeams]);

    useEffect(() => {
        if (searchQuery.length > 0) {
            const fetchTeams = async () => {
                try {
                    const response = await axiosInstance.get(`/teams/search?search=${searchQuery}`);
                    const filteredTeams = (response.data || []).filter(team =>
                        team && !selectedTeams.some(t => t._id === team._id)
                    );
                    setTeamList(filteredTeams);
                    setShowDropdown(true);
                } catch (error) {
                    console.error('Error fetching teams:', error);
                }
            };

            fetchTeams();
        } else {
            setTeamList([]);
            setShowDropdown(false);
        }
    }, [searchQuery, selectedTeams]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleTeamSelect = (team) => {
        if (team && !selectedTeams.find(t => t._id === team._id)) {
            const updatedTeams = [...selectedTeams, team];
            setSelectedTeams(updatedTeams);
            onAssignTeams(updatedTeams);
        }
        setSearchQuery('');
        setShowDropdown(false);
    };

    const handleRemoveTeam = (teamId) => {
        const updatedTeams = selectedTeams.filter(team => team._id !== teamId);
        setSelectedTeams(updatedTeams);
        onAssignTeams(updatedTeams);
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                className={`form-input-box w-full rounded-md px-4 py-2 transition-colors duration-300 ${isFocused || searchQuery ? 'border-purple-500' : 'border-gray-300'}`}
                placeholder="Search teams..."
            />
            <FaMagnifyingGlass className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500" />
            {showDropdown && (
                <ul className="absolute z-10 mt-2 text-sm w-full bg-white border rounded-lg shadow-lg">
                    {teamList.length > 0 ? (
                        teamList.map(team => (
                            team ? (
                                <li
                                    key={team._id}
                                    onClick={() => handleTeamSelect(team)}
                                    className="p-2 hover:bg-purple-100 cursor-pointer"
                                >
                                    {team.name || 'Unnamed Team'}
                                </li>
                            ) : null
                        ))
                    ) : (
                        <li className="p-2 text-gray-500">No results found</li>
                    )}
                </ul>
            )}
            {showSelectedTeams && selectedTeams.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {selectedTeams.filter(team => team).map(team => (
                        <div key={team._id} className="flex items-center bg-purple-100 border border-purple-300 text-purple-800 p-2 px-4 rounded-md shadow-md">
                            <span className="text-xs truncate">{team.name || 'Unnamed Team'}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveTeam(team._id)}
                                className="ml-2 text-red-500 hover:text-red-700"
                            >
                                <IoMdClose size={13} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeamSearchBar;
