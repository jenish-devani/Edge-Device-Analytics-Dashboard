import React from "react";

const StatesHeader = ({
  totalAlarmDuration,
  totalAlarmCount,
  maxDurationFaultDevice,
  maxDurationAlarmTime,
}) => {
  return (
    <div className="p-2 mt-4">
      <div className="flex gap-4">
        <div className="border-t-4 border-orange-600 text-center w-1/4 p-4 rounded-md bg-white">
          <p className="text-2xl text-orange-600 font-semibold">
            {totalAlarmDuration.h} hrs, {totalAlarmDuration.m} min,{" "}
            {totalAlarmDuration.rs} sec
          </p>
          <p className="text-sm text-gray-600 mt-2">TOTAL ALARM DURATION</p>
        </div>
        <div className="border-t-4 border-[#63b58a] text-center w-1/4 p-4 rounded-md bg-white">
          <p className="text-2xl text-[#63b58a] font-semibold">
            {totalAlarmCount}
          </p>
          <p className="text-sm text-gray-600 mt-2">TOTAL COUNT OF ALARM</p>
        </div>
        <div className="border-t-4 border-[#63b58a] text-center w-1/4 p-4 rounded-md bg-white">
          <p className="text-2xl text-[#63b58a] font-semibold">
            {maxDurationFaultDevice}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            DIVICE WITH MAX DURATION ALARM
          </p>
        </div>
        <div className="border-t-4 border-[#63b58a] text-center w-1/4 p-4 rounded-md bg-white">
          <p className="text-2xl text-[#63b58a] font-semibold">
            {maxDurationAlarmTime} sec
          </p>
          <p className="text-sm text-gray-600 mt-2">MAX DURATION ALARM TIME</p>
        </div>
      </div>
    </div>
  );
};

export default StatesHeader;
