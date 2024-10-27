import { useState, useEffect } from 'react';
import axiosInstance from '../../utilis/axiosInstance';

const TeamProjectAssign = ({ onTeamSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [teamList, setTeamList] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (searchQuery.length > 0) {
            const fetchTeams = async () => {
                try {
                    const response = await axiosInstance.get(`/teams/search?search=${searchQuery}`);
                    setTeamList(response.data);
                } catch (error) {
                    console.error('Error fetching teams:', error);
                }
            };
            fetchTeams();
        } else {
            setTeamList([]);
            setShowDropdown(false); // Close the dropdown when the search query is cleared
        }
    }, [searchQuery]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setShowDropdown(true); // Show the dropdown only when there is input
    };

    const handleTeamSelect = (team) => {
        onTeamSelect(team);
        setSearchQuery(''); // Clear the search input after selection
        setShowDropdown(false); // Hide the dropdown after team selection
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="form-input-box"
                placeholder="Search teams..."
            />
            {showDropdown && searchQuery.length > 0 && (
                <div className="absolute z-10 mt-2 text-sm w-full bg-white border rounded-lg shadow-lg">
                    {teamList.length > 0 ? (
                        <ul>
                            {teamList.map((team) => (
                                <li
                                    key={team._id}
                                    onClick={() => handleTeamSelect(team)}
                                    className="p-2 cursor-pointer hover:bg-gray-200"
                                >
                                    {team.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-2 text-gray-500">No teams found.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TeamProjectAssign;
