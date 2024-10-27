import { useEffect, useState } from 'react';
import axiosInstance from '../../utilis/axiosInstance';
import { IoMdClose } from 'react-icons/io';
import UserSearchBar from '../SearchBar/UserSearchBar';

const AddTeamCard = ({ isOpen, onClose, onTeamAddedOrUpdated, teamData }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    members: []
  });

  useEffect(() => {
    if (teamData) {
      setFormData({
        name: teamData.name || '',
        description: teamData.description || '',
        members: teamData.members || []
      });
    }
  }, [teamData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleMembersUsersChange = (users) => {
    setFormData({
      ...formData,
      members: users
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const membersToUserIds = formData.members.map(user => user._id);
    const teamDataToSend = {
      ...formData,
      members: membersToUserIds,
    };
  
    const { name, description, members } = teamDataToSend;
    if (!name || !description || !members.length) {
      console.error('All fields are required');
      return;
    }
  
    try {
      let response;
      if (teamData) {
        response = await axiosInstance.put(`/teams/update-team/${teamData._id}`, teamDataToSend);
      } else {
        response = await axiosInstance.post('/teams/add-team', teamDataToSend);
      }
  
      if (onTeamAddedOrUpdated) onTeamAddedOrUpdated();
      onClose();
    } catch (error) {
      console.error('Error adding or updating team:', error.response?.data || error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          <IoMdClose size={24} />
        </button>
        <h2 className="text-lg font-semibold mb-4">{teamData ? 'Edit Team' : 'Add New Team'}</h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input-box w-full mb-4 p-2 border border-gray-300 rounded"
          />
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-input-box w-full mb-4 p-2 border border-gray-300 rounded"
          />
          <label className="block text-sm font-medium text-gray-700 mb-1">Add Members</label>
          <UserSearchBar
            assignedUsers={formData.members}  
            onAssignUsers={handleMembersUsersChange}
            showSelectedUsers={true}
          />

          <div className="mt-6 flex justify-end">
            <button
              className="btn-primary w-32 flex items-center justify-center space-x-2 h-8 px-3"
              type="submit"
            >
              {teamData ? 'Save Changes' : 'Create Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeamCard;
