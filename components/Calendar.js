"use client";
import { baseRating, gradients } from "@/utils";
import { Fugaz_One } from "next/font/google";
import React, { useState } from "react";

const monthList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dayList = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ["400"] });

export default function Calendar(props) {
  const { demo, completeData } = props;
  const now = new Date();
  const currentMonthIndex = now.getMonth(); //current month, 0-11 (index)
  const [selectedMonth, setSelectedMonth] = useState(
    monthList[currentMonthIndex]
  ); //currently "selected" month index to display, initially current month
  const [selectedYear, setSelectedYear] = useState(now.getFullYear()); //currently "selected" year index to display, initially current year

  const selectedMonthIndex = monthList.indexOf(selectedMonth); // currently "selected" month index
  const data = completeData?.[selectedYear]?.[selectedMonthIndex] || {}; //get "selected" year & month data from completeData, set to {} if unavailable

  function adjustMonth(val) {
    //val can be +1 or -1
    if (selectedMonthIndex + val < 0) {
      // set month value = 11 (Dec) and decrement the year
      setSelectedYear((curr) => curr - 1); //go to prev year
      setSelectedMonth(monthList[monthList.length - 1]); //set to Dec
    } else if (selectedMonthIndex + val > 11) {
      // set month val = 0 (Jan) and increment the year
      setSelectedYear((curr) => curr + 1); //go to next year
      setSelectedMonth(monthList[0]); //set to Jan
    } else {
      setSelectedMonth(monthList[selectedMonthIndex + val]);
    }
  }

  const selectedMonthObj = new Date(
    selectedYear,
    monthList.indexOf(selectedMonth),
    1
  ); //create a date obj, with currently "selected" year/month/1st/day
  const firstDayOfMonth = selectedMonthObj.getDay(); //what day it is for the 1st, 0-6
  const daysInMonth = new Date(
    selectedYear,
    selectedMonthIndex + 1,
    0
  ).getDate(); //create a date obj, with "0" of the next month being the "last" day of this month, getting the total days of this month

  const daysToDisplay = firstDayOfMonth + daysInMonth; // empty cells at the front (equals firstDayofMonth) & days in this month

  const numRows = Math.floor(daysToDisplay / 7) + (daysToDisplay % 7 ? 1 : 0);

  return (
    <div className="flex flex-col gap-2">
      {/* buttons and month/year */}
      <div className="grid grid-cols-5 gap-4">
        <button
          onClick={() => {
            adjustMonth(-1);
          }}
          className="mr-auto text-blue-400 text-lg sm:text-xl duration-200 hover:opacity-60"
        >
          <i className="fa-solid fa-circle-chevron-left"></i>
        </button>
        <p
          className={
            "text-center col-span-3 capitalized whitespace-nowrap textGradient " +
            fugaz.className
          }
        >
          {selectedMonth}, {selectedYear}
        </p>
        <button
          onClick={() => {
            adjustMonth(+1);
          }}
          className="ml-auto text-blue-400 text-lg sm:text-xl duration-200 hover:opacity-60"
        >
          <i className="fa-solid fa-circle-chevron-right"></i>
        </button>
      </div>

      {/* calendar cells */}
      <div className="flex flex-col overflow-hidden gap-1 py-4 sm:py-6 md:py-10">
        {/* each row (week) */}
        {[...Array(numRows).keys()].map((_row, rowIndex) => {
          return (
            <div key={rowIndex} className="grid grid-cols-7 gap-1">
              {/* every day of the week */}
              {dayList.map((_dayOfWeek, dayOfWeekIndex) => {
                let date =
                  rowIndex * 7 + dayOfWeekIndex - (firstDayOfMonth - 1); //date for each cell

                let dayDisplay = date > 0 && date <= daysInMonth; //display if cell date is within this month

                //checking if it is date/month/year is today, if so apply different style
                let isToday =
                  date === now.getDate() &&
                  selectedYear === now.getFullYear() &&
                  selectedMonthIndex === now.getMonth();

                //blank if cell not within this month
                if (!dayDisplay) {
                  return <div className="bg-white" key={dayOfWeekIndex} />;
                }

                // color for each cell: check if demo or not, then check if within month (blue, otherwise blank)
                let color = demo
                  ? gradients.blue[baseRating[date] || 0]
                  : data[date]
                  ? gradients.blue[data[date]]
                  : "white";

                return (
                  //display each cell
                  <div
                    style={{ background: color }}
                    className={
                      "text-xs sm:text-sm border border-solid p-2 flex items-center gap-2 justify-center rounded-lg " +
                      (isToday ? " border-blue-400" : " border-blue-100") +
                      (color === "white" ? " text-blue-400" : " text-black")
                    }
                    key={dayOfWeekIndex}
                  >
                    <p>{date}</p>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
