import { useEffect, useState } from "react";
import BarChart from "./parts/BarChart";

import PageFilter from "./parts/PageRegionfilter";
import StatesHeader from "./parts/StatesHeader";
import deviceDataJson from "./jsonData/device.json";
import faultDataJson from "./jsonData/fault.json";
import PageRegionfilter from "./parts/PageRegionfilter";

function App() {
  let deviceDatajson = deviceDataJson;
  let faultDatajson = faultDataJson;
  const [location, setLocation] = useState("Minneapolis");
  const [status, setStatus] = useState("All");

  const locations = ["Minneapolis", "Colorado Windfarms"];
  const statuses = ["All", "Active", "Inactive"];

  const [deviceData, setDeviceData] = useState(deviceDatajson);
  const [faultData, setFaultData] = useState(faultDatajson);

  const [filterdeviceData, setFilterDeviceData] = useState(deviceDatajson);
  const [filterFaultData, setFilterFaultData] = useState(faultDatajson);

  const [categoryIndex, setCategoryIndex] = useState(0);

  const [totalAlarmDuration, setTotalAlarmDuration] = useState({
    h: 0,
    m: 0,
    rs: 0,
  });

  const [totalAlarmCount, setTotalAlarmCount] = useState(0);
  const [deviceWithMaxDuration, setDeviceWithMaxDuration] = useState("");
  const [maxDurationAlarmTime, setMaxDurationAlarmTime] = useState(0);

  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);

  const [totalSum, setTotalSum] = useState({
    h: 0,
    m: 0,
    rs: 0,
  });
  const [selectedRegion, setSelectedRegion] = useState("Minneapolis");

  // Callback function to handle the selected region from child
  const handleRegionChange = (region) => {
    setSelectedRegion(region);
    console.log("Selected region in parent:", region);
  };

  // Filter the devices based on the selected region
  const filteredDevices = deviceData.filter(
    (device) => device.asset === selectedRegion
  );

  let assetId = filteredDevices[0].asset_id;
  const filteredFaults = faultData.filter(
    (fault) => fault.asset_id === assetId
  );

  useEffect(() => {
    if (filteredFaults && filteredFaults.length > 0) {
      let totalDuration = filteredFaults.reduce(
        (acc, curr) => acc + curr.duration_seconds,
        0
      );

      const hours = Math.floor(totalDuration / 3600);
      const minutes = Math.floor((totalDuration % 3600) / 60);
      const remainingSeconds = Math.round(totalDuration % 60);

      //console.log(hours, minutes, remainingSeconds); // Only log when calculation is done

      // Update state only if the calculated values are different
      setTotalAlarmDuration((prevState) => {
        if (
          prevState.h !== hours ||
          prevState.m !== minutes ||
          prevState.rs !== remainingSeconds
        ) {
          return { h: hours, m: minutes, rs: remainingSeconds };
        }
        return prevState; // No change, no state update, hence no re-render
      });

      setTotalAlarmCount((prev) => filteredFaults.length);

      let maxDurationFaultDevice = filteredFaults.reduce((max, current) => {
        return current.duration_seconds > max.duration_seconds ? current : max;
      }, filteredFaults[0]);

      let deviceEntry = filteredDevices.find(
        (device) => device.id === maxDurationFaultDevice.device_id
      );

      setDeviceWithMaxDuration(deviceEntry.device_name);
      setMaxDurationAlarmTime(
        Math.round(maxDurationFaultDevice.duration_seconds)
      );
      const durationSum = {};

      if (categoryIndex === 0) {
        const durationSum = {};
        // Iterate through the faultData array
        // Iterate through the faultData array
        filteredFaults.forEach((fault) => {
          const { code, duration_seconds, description } = fault;

          // If the code already exists in the durationSum object, add the duration_seconds to the existing value
          if (durationSum[code]) {
            durationSum[code].total_duration += duration_seconds;
          } else {
            // Otherwise, initialize it with the current duration_seconds and description
            durationSum[code] = {
              total_duration: duration_seconds,
              description: description,
            };
          }
        });

        // Convert the object into an array of entries and sort it in descending order of total_duration
        const sortedDurationSum = Object.entries(durationSum)
          .map(([code, data]) => ({ code, ...data }))
          .sort((a, b) => b.total_duration - a.total_duration);

        // Get the top 10 entries
        const top10Entries = sortedDurationSum.slice(0, 10);

        const totalSum = top10Entries.reduce(
          (acc, curr) => acc + curr.total_duration,
          0
        );

        const hours = Math.floor(totalSum / 3600);
        const minutes = Math.floor((totalSum % 3600) / 60);
        const remainingSeconds = Math.round(totalSum % 60);

        setTotalSum((prevState) => {
          if (
            prevState.h !== hours ||
            prevState.m !== minutes ||
            prevState.rs !== remainingSeconds
          ) {
            return { h: hours, m: minutes, rs: remainingSeconds };
          }
          return prevState; // No change, no state update, hence no re-render
        });

        console.log("Total Sum", totalSum);

        // Display the top 10 results

        setBarChartData((prev) => top10Entries);
        console.log(top10Entries);
        // console.log(top10Entries);
      } else if (categoryIndex === 1) {
        const durationSum = {};
        // Iterate through the faultData array
        filteredFaults.forEach((fault) => {
          const { category, duration_seconds, description } = fault;
          // If the code already exists in the durationSum object, add the duration_seconds to the existing value
          if (durationSum[category]) {
            durationSum[category].total_duration += duration_seconds;
          } else {
            // Otherwise, initialize it with the current duration_seconds and description
            durationSum[category] = {
              total_duration: duration_seconds,
              description: description,
            };
          }
        });

        // Convert the object into an array of entries and sort it in descending order of total_duration
        const sortedDurationSum = Object.entries(durationSum)
          .map(([category, data]) => ({ category, ...data }))
          .sort((a, b) => b.total_duration - a.total_duration);
        // Get the top 10 entries
        const top10Entries = sortedDurationSum.slice(0, 10);

        const totalSum = top10Entries.reduce(
          (acc, curr) => acc + curr.total_duration,
          0
        );

        const hours = Math.floor(totalSum / 3600);
        const minutes = Math.floor((totalSum % 3600) / 60);
        const remainingSeconds = Math.round(totalSum % 60);

        setTotalSum((prevState) => {
          if (
            prevState.h !== hours ||
            prevState.m !== minutes ||
            prevState.rs !== remainingSeconds
          ) {
            return { h: hours, m: minutes, rs: remainingSeconds };
          }
          return prevState; // No change, no state update, hence no re-render
        });

        console.log("Total Sum", totalSum);

        // Display the top 10 results
        setBarChartData((prev) => top10Entries);
        console.log(top10Entries);
      } else if (categoryIndex === 3) {
        // Iterate through the faultData array
        // Iterate through the faultData array
        filteredFaults.forEach((fault) => {
          const { category } = fault;

          // If the code already exists in the durationSum object, add the duration_seconds to the existing value
          if (durationSum[category]) {
            durationSum[category].count = durationSum[category].count + 1;
          } else {
            // Otherwise, initialize it with the current duration_seconds and description
            durationSum[category] = {
              count: 0,
            };
          }
        });

        // Convert the object into an array of entries and sort it in descending order of total_duration
        const sortedDurationSum = Object.entries(durationSum)
          .map(([category, data]) => ({ category, ...data }))
          .sort((a, b) => b.count - a.count);

        // Get the top 10 entries
        const top10Entries = sortedDurationSum.slice(0, 10);
        console.log(top10Entries);

        // Display the top 10 results

        setPieChartData((prev) => top10Entries);

        // console.log(top10Entries);
      } else {
        console.log("Invalid category index");
      }
    }
  }, [selectedRegion, categoryIndex]);

  // console.log(selectedRegion);
  // console.log(filteredDevices.length);
  // console.log(filteredFaults.length);
  // console.log(categoryIndex);

  return (
    <>
      <PageRegionfilter
        onRegionChange={handleRegionChange}
        locations={locations}
        statuses={statuses}
        location={location}
        setLocation={setLocation}
        status={status}
        setStatus={setStatus}
        deviceData={deviceData}
        faultData={faultData}
        filterdeviceData={filterdeviceData}
        filterFaultData={filterFaultData}
        setDeviceData={setDeviceData}
        setFaultData={setFaultData}
      />

      <StatesHeader
        totalAlarmDuration={totalAlarmDuration}
        totalAlarmCount={totalAlarmCount}
        maxDurationFaultDevice={deviceWithMaxDuration}
        maxDurationAlarmTime={maxDurationAlarmTime}
      />
      <BarChart
        barData={barChartData}
        pieData={pieChartData}
        filterFaultData={filterFaultData}
        filterdeviceData={filterdeviceData}
        categoryIndex={categoryIndex}
        setCategoryIndex={setCategoryIndex}
        totalSum={totalSum}
      />
    </>
  );
}

export default App;
