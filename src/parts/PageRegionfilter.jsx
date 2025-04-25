// PageFilter.js
import React, { useState } from "react";
// import Dropdown from "../components/Dropdown";

const PageRegionfilter = ({
  locations,
  statuses,
  location,
  setLocation,
  status,
  setStatus,
  deviceData,
  faultData,
  onRegionChange,
  setDeviceData,
  setFaultData,
}) => {
  const [selectedRegion, setSelectedRegion] = useState("Minneapolis");

  // Handle change in selection and pass the value to the parent
  const handleSelectChange = (e) => {
    const region = e.target.value;
    setSelectedRegion(region);
    // Pass the selected region value to the parent component via callback
    onRegionChange(region);
  };

  return (
    <div className="container flex border-spacing-2 gap-2 p-2">
      <select
        value={selectedRegion}
        onChange={handleSelectChange}
        className="
        border border-gray-400 rounded-md 
      p-1 cursor-pointer 
        focus:outline-none focus:ring-2 focus:ring-blue-500
      "
      >
        <option value="Minneapolis">Minneapolis</option>
        <option value="Colorado">Colorado Windfarms</option>
      </select>
    </div>
  );
};

export default PageRegionfilter;
