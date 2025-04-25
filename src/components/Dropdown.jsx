// DropdownFilter.js
import React from "react";

const Dropdown = ({ options, selected, onChange }) => {
  return (
    <div>
      <select
        className="
            border border-gray-400 rounded-md 
          p-1 cursor-pointer 
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
        value={selected}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
