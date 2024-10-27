import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="flex w-80 items-center px-3 bg-slate-100 rounded-md">
      <input
        type="text"
        placeholder="Search"
        className="w-full text-xs bg-transparent py-2 outline-none"
        value={value}
        onChange={onChange}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch && handleSearch()} 
        aria-label="Search input"
      />
      {value && onClearSearch && (
        <IoMdClose 
          className="text-lg text-slate-500 cursor-pointer hover:text-black mr-2" 
          onClick={onClearSearch} 
          aria-label="Clear search"
        />
      )}
      <FaMagnifyingGlass 
        className="text-slate-400 cursor-pointer hover:text-black" 
        onClick={handleSearch} 
        aria-label="Search"
      />
    </div>
  );
}

export default SearchBar;
