import { useState } from "react";
import axiosInstance from "../../utilis/axiosInstance";
import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate } from 'react-router-dom';
import SearchBar from "../SearchBar/SearchBar";

const Navbar = ({ userInfo, searchType = "projects" }) => { 
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const onLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
        console.log(`Searching for ${searchQuery} with type ${searchType}`);
        try {
            const response = await axiosInstance.get(`/search?q=${encodeURIComponent(searchQuery)}&type=${encodeURIComponent(searchType)}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error("Error during search:", error.response?.data || error.message);
        }
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div className="bg-white flex items-center justify-between px-4 py-1 shadow-sm fixed top-0 w-full z-50">
      <h2 className="text-lg font-medium text-black py-1">Project Management System</h2>
{/*
      <SearchBar
        value={searchQuery}
        onChange={({ target }) => setSearchQuery(target.value)}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />*/}
      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  );
};

export default Navbar;
