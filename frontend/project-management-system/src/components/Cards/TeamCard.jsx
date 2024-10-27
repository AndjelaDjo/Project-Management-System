import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utilis/axiosInstance';

const TeamCard = ({ team, onEdit, onDelete, onRemove, showEditAndDelete }) => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(team._id);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
        await axiosInstance.delete(`http://localhost:8000/api/teams/delete-team/${team._id}`);
        if (onDelete) {
            onDelete(team._id);
        }
    } catch (error) {
        if (error.response && error.response.status === 403) {
            window.alert(error.response.data.message);
        } else {
            window.alert("An unexpected error occurred. Please try again.");
        }
    }
};

  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(team._id);
    }
  };

  const handleViewDetails = () => {
    navigate(`/team-details/${team._id}`);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setPopupMessage('');
  };

  return (
    <>
      <tr
        className="bg-white hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
        onClick={handleViewDetails}
      >
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs overflow-hidden overflow-ellipsis">
          {team?.name}
        </td>
        <td className="px-6 py-4 whitespace-normal text-sm text-gray-900 break-words max-w-md overflow-hidden overflow-ellipsis">
          {team?.description}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs overflow-hidden overflow-ellipsis">
          {team?.createdBy?.fullName}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {showEditAndDelete ? (
            <>
              <button className="text-blue-500 hover:text-blue-700 mr-2" onClick={handleEdit}>
                Edit
              </button>
              <button className="text-red-500 hover:text-red-700" onClick={handleDelete}>
                Delete
              </button>
            </>
          ) : (
            <button className="text-red-500 hover:text-red-700" onClick={handleRemove}>
              Remove
            </button>
          )}
        </td>
      </tr>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">Error</h3>
            <p>{popupMessage}</p>
            <button
              onClick={handleClosePopup}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TeamCard;
