"use client";
import { baseRating, gradients } from "@/utils";
import { Fugaz_One } from "next/font/google";
import React, { useState } from "react";

const monthsArr = [
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
  const currMonth = now.getMonth(); //current month, 0-11 (index)
  const [selectedMonth, setSelectedMonth] = useState(monthsArr[currMonth]); //using currently "selected" month index to show initial UI
  const [selectedYear, setSelectedYear] = useState(now.getFullYear()); //currently "selected" year

  const numericMonth = monthsArr.indexOf(selectedMonth); // currently "selected" month index
  const data = completeData?.[selectedYear]?.[numericMonth] || {}; //get "selected" year & month data from completeData, set to {} if unavailable

  function handleIncrementMonth(val) {
    //val can be +1 or -1
    if (numericMonth + val < 0) {
      // set month value = 11 (Dec) and decrement the year
      setSelectedYear((curr) => curr - 1); //go to prev year
      setSelectedMonth(monthsArr[monthsArr.length - 1]); //set to Dec
    } else if (numericMonth + val > 11) {
      // set month val = 0 (Jan) and increment the year
      setSelectedYear((curr) => curr + 1); //go to next year
      setSelectedMonth(monthsArr[0]); //set to Jan
    } else {
      setSelectedMonth(monthsArr[numericMonth + val]);
    }
  }

  const monthNow = new Date(selectedYear, monthsArr.indexOf(selectedMonth), 1); //create a date obj, with currently "selected" year/month/1st/day
  const firstDayOfMonth = monthNow.getDay(); //what day it is for the 1st
  const daysInMonth = new Date(selectedYear, numericMonth + 1, 0).getDate(); //create a date obj, with "0" being the last day of this month, getting the total days of this month

  const daysToDisplay = firstDayOfMonth + daysInMonth; //including the empty cells

  const numRows = Math.floor(daysToDisplay / 7) + (daysToDisplay % 7 ? 1 : 0);

  return (
    <div className="flex flex-col gap-2">
      {/* buttons and month/day */}
      <div className="grid grid-cols-5 gap-4">
        <button
          onClick={() => {
            handleIncrementMonth(-1);
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
            handleIncrementMonth(+1);
          }}
          className="ml-auto text-blue-400 text-lg sm:text-xl duration-200 hover:opacity-60"
        >
          <i className="fa-solid fa-circle-chevron-right"></i>
        </button>
      </div>

      {/* calendar cells */}
      <div className="flex flex-col overflow-hidden gap-1 py-4 sm:py-6 md:py-10">
        {/* each row (week) */}
        {[...Array(numRows).keys()].map((row, rowIndex) => {
          return (
            <div key={rowIndex} className="grid grid-cols-7 gap-1">
              {/* every day of the week */}
              {dayList.map((dayOfWeek, dayOfWeekIndex) => {
                let dayIndex =
                  rowIndex * 7 + dayOfWeekIndex - (firstDayOfMonth - 1); //date for each cell

                let dayDisplay = dayIndex > 0 && dayIndex <= daysInMonth; //display if cell is within this month

                //if it is today, has different style
                let isToday =
                  dayIndex === now.getDate() &&
                  selectedYear === now.getFullYear() &&
                  numericMonth === now.getMonth();

                //blank if cell not within this month
                if (!dayDisplay) {
                  return <div className="bg-white" key={dayOfWeekIndex} />;
                }

                //deciding color: check if demo or not, then check if within month (blue, otherwise blank)
                let color = demo
                  ? gradients.blue[baseRating[dayIndex] || 0]
                  : data[dayIndex]
                  ? gradients.blue[data[dayIndex]]
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
                    <p>{dayIndex}</p>
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
