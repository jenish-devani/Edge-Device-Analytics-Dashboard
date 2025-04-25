import React, { useState } from "react";
import Highcharts, { pad, Tick } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const BarChart = ({
  barData,
  pieData,
  filterdeviceData,
  filterFaultData,
  categoryIndex,
  setCategoryIndex,
  totalSum,
}) => {
  const [activeButton, setActiveButton] = useState("alarmCode");

  const rowData = barData;

  const totalCount = pieData.reduce((acc, curr) => acc + curr.count, 0);

  // Transform the data into the format required by the pie chart
  const pieChartData = pieData
    .filter((item) => item.category) // Exclude any items with empty categories
    .map((item) => ({
      name: item.category,
      y: (item.count / totalCount) * 100, // Calculate the percentage for each category
    }));

  const pData = pieChartData;

  const pieChartOptions = {
    chart: {
      type: "pie",
    },
    title: {
      text: "Frequency of Alarms by Category",
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f} %",
        },
      },
    },
    series: [
      {
        name: "Share",
        colorByPoint: true,
        data: pData,
      },
    ],
  };

  // Highcharts options
  const barChartOptions = {
    chart: {
      type: "column",
      spacing: [20, 10, 20, 10],
    },
    title: {
      text: `Total Alarm Duration: ${totalSum.h} hrs, ${totalSum.m} min, ${totalSum.rs} sec`,
      align: "left", // Align title to the left
      x: 10,
      margin: 20,

      // Adjust vertical position (distance from the top)
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      categories: rowData.map((row) => {
        if (categoryIndex === 0) {
          return `Code:${row.code} - ${row.description}`;
        } else if (categoryIndex === 1) {
          return row.category;
        } else if (categoryIndex === 2) {
          return row.code;
        } else if (categoryIndex === 3) {
          return row.code;
        }
      }),
    },
    yAxis: {
      min: 0, // Starting value of the Y-axis
      tickInterval: categoryIndex === 0 ? 1 : 5, // Set the tick interval to 5
      title: {
        text: "Duration (Hours)",
      },
    },
    plotOptions: {
      bar: {
        colorByPoint: false,
      },
      series: {
        color: "#63b58a",
        // Set a single color for all bars
      },
    },
    series: [
      {
        name: "Duration",
        data: rowData.map(
          (row) => Math.round((row.total_duration / 3600) * 100) / 100
        ),
      },
    ],
  };

  const mergedData = filterFaultData.map((item1) => {
    const item2 = filterdeviceData.find(
      (item2) => item2.id === item1.device_id
    );
    return { ...item1, ...item2 }; // Merging two objects
  });

  // console.log("Merged Data", mergedData);

  const sheetData = mergedData;

  const columnDefs = [
    {
      headerName: "Device",
      field: "device_name",
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Location",
      field: "asset",
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Start Time",
      field: "time_stamp",
      filter: "agDateColumnFilter",
    },
    {
      headerName: "Resolution Time",
      field: "resolution_time_stamp",
      filter: "agDateColumnFilter",
    },
    {
      headerName: "Duration",
      field: "duration_seconds",
      filter: "agTextColumnFilter",
    },
    { headerName: "Category", field: "category", filter: "agTextColumnFilter" },
    {
      headerName: "Alarm Code",
      field: "code",
      filter: "agNumberColumnFilter",
    },
    {
      headerName: "Description",
      field: "description",
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Fault Type",
      field: "fault_type",
      filter: "agTextColumnFilter",
    },
  ];

  const setButtonCategory = (num, active) => {
    setCategoryIndex(num);
    setActiveButton(active);
  };

  return (
    <div className="mt-4 px-2">
      <div className="flex justify-between">
        <div className="flex gap-1">
          <button
            type="button"
            className={` ${
              activeButton === "alarmCode"
                ? "bg-[#5e9da7] text-white"
                : "bg-[#cccccc] text-black"
            } rounded-sm px-2`}
            onClick={() => setButtonCategory(0, "alarmCode")}
          >
            By Alarm Code
          </button>
          <button
            type="button"
            className={`${
              activeButton === "category"
                ? "bg-[#5e9da7] text-white"
                : "bg-[#cccccc] text-black"
            } rounded-sm px-2`}
            onClick={() => setButtonCategory(1, "category")}
          >
            By Category
          </button>
        </div>
        <div className="flex gap-1">
          {/* <button
            type="button"
            className={`${
              activeButton === "duration"
                ? "bg-[#5e9da7] text-white"
                : "bg-[#cccccc] text-black"
            } rounded-sm px-2`}
            onClick={() => setButtonCategory(2, "duration")}
          >
            By Duration
          </button> */}
          <button
            type="button"
            className={`${
              activeButton === "frequency"
                ? "bg-[#5e9da7] text-white"
                : "bg-[#cccccc] text-black"
            } rounded-sm px-2`}
            onClick={() => setButtonCategory(3, "frequency")}
          >
            By Frequency
          </button>
        </div>
      </div>

      <div className="w-full">
        {categoryIndex === 3 ? (
          <HighchartsReact highcharts={Highcharts} options={pieChartOptions} />
        ) : (
          <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
        )}
      </div>

      <div
        className="ag-theme-alpine mt-4"
        style={{ height: "500px", width: "100%" }}
      >
        <AgGridReact
          rowData={sheetData}
          columnDefs={columnDefs}
          defaultColDef={{ filter: true }}
        />
      </div>
    </div>
  );
};

export default BarChart;
