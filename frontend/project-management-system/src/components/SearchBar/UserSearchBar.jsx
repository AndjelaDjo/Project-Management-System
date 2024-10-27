import { useState, useEffect } from 'react';
import axiosInstance from '../../utilis/axiosInstance';
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from 'react-icons/io';

const UserSearchBar = ({ assignedUsers = [], onAssignUsers = () => { }, showSelectedUsers = true }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [userList, setUserList] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState(assignedUsers || []);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        setSelectedUsers(assignedUsers);
    }, [assignedUsers]);

    useEffect(() => {
        if (searchQuery.length > 0) {
            const fetchUsers = async () => {
                try {
                    const response = await axiosInstance.get(`/users/search?search=${searchQuery}`);
                    const filteredUsers = response.data.filter(user =>
                        !selectedUsers.some(u => u._id === user._id)
                    );
                    setUserList(filteredUsers);
                    setShowDropdown(true);
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            };
            fetchUsers();
        } else {
            setUserList([]);
            setShowDropdown(false);
        }
    }, [searchQuery]); // Updated dependency array    

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleUserSelect = (user) => {
        if (!selectedUsers.find(u => u._id === user._id)) {
            const updatedUsers = [...selectedUsers, user];
            setSelectedUsers(updatedUsers);
            onAssignUsers(updatedUsers);
        }
        setSearchQuery('');
        setShowDropdown(false);
    };

    const handleRemoveUser = (userId) => {
        const updatedUsers = selectedUsers.filter(user => user._id !== userId);
        setSelectedUsers(updatedUsers);
        onAssignUsers(updatedUsers);
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`form-input-box w-full rounded-md px-4 py-2 transition-colors duration-300 ${isFocused || searchQuery ? 'border-purple-500' : 'border-gray-300'}`}
                placeholder="Search users..."
            />
            <FaMagnifyingGlass className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500" />
            {showDropdown && (
                <ul className="absolute z-10 mt-2 text-sm w-full bg-white border rounded-lg shadow-lg">
                    {userList.length > 0 ? (
                        userList.map(user => (
                            <li
                                key={user._id}
                                onClick={() => handleUserSelect(user)}
                                className="p-2 hover:bg-purple-100 cursor-pointer"
                            >
                                {user.fullName} ({user.email})
                            </li>
                        ))
                    ) : (
                        <li className="p-2 text-gray-500">No results found</li>
                    )}
                </ul>
            )}
            {showSelectedUsers && selectedUsers.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {selectedUsers.map(user => (
                        <div key={user._id} className="flex items-center bg-purple-100 border border-purple-300 text-purple-800 p-2 px-4 rounded-md shadow-md">
                            <span className="text-xs truncate">{user.fullName}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveUser(user._id)}
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

export default UserSearchBar;
