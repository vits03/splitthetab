import { useState, useRef, useEffect } from 'react';

const TeamDropdown = ({
  formData,
  name,
  index,
  updateDropdown,
  selectedMembers = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const teamMembers = [...formData.personsList];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (memberId) => {
    const newSelected = selectedMembers.includes(memberId)
      ? selectedMembers.filter(id => id !== memberId)
      : [...selectedMembers, memberId];

    updateDropdown(name, index, newSelected);
  };

  const handleSelectAll = () => {
    const allSelected = selectedMembers.length === teamMembers.length;
    const newSelectedMembers = allSelected ? [] : [...teamMembers];
    updateDropdown(name, index, newSelectedMembers);
  };

  return (
    <div className="relative inline-block w-40 md:w-45" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex justify-between items-center w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        <span className='text-xs font-bold md:text-sm'>
          {selectedMembers.length > 0
            ? `${selectedMembers.length} selected`
            : 'Select'}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="py-1 max-h-60 overflow-y-auto">
            <div className="flex text-sm md:text-md text-bold items-center px-1 py-2 border-b border-gray-100 hover:bg-gray-100 cursor-pointer">
              <span className="ml-3 block min-w-1/2 text-gray-700 font-medium">
                {selectedMembers.length === teamMembers.length ? 'Unselect All' : 'Select All'}
              </span>
              <input
                type="checkbox"
                checked={selectedMembers.length === teamMembers.length}
                onChange={handleSelectAll}
                className="h-4 w-4 border-gray-300 rounded"
              />
            </div>

            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="flex text-sm md:text-md items-center px-1 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <span className="ml-3 block min-w-5/10 text-gray-700">{member}</span>
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(member)}
                  onChange={() => handleCheckboxChange(member)}
                  className="h-4 w-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDropdown;
