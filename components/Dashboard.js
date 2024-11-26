"use client";

import React, { useEffect, useState } from "react";
import { Fugaz_One } from "next/font/google";
import Calendar from "./Calendar";
import { useAuth } from "@/app/context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Loading from "./Loading";
import LoginPage from "@/app/login/page";

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ["400"] });

export default function Dashboard() {
  const { currentUser, userDataObj, setUserDataObj, loading } = useAuth();
  const [data, setData] = useState({}); //local state

  //logic for top of dashboard
  function countValues() {
    let totalNumberOfDays = 0;
    let sumMoods = 0;
    for (let year in data) {
      for (let month in data[year]) {
        for (let day in data[year][month]) {
          let daysMood = data[year][month][day];
          totalNumberOfDays++;
          sumMoods += daysMood;
        }
      }
    }
    let moodScore =
      totalNumberOfDays > 0
        ? (sumMoods / totalNumberOfDays).toPrecision(2)
        : "";
    return {
      num_of_days: totalNumberOfDays,
      average_mood: moodScore,
    };
  }

  const now = new Date();
  const statuses = {
    ...countValues(),
    time_remaining: `${23 - now.getHours()}H ${60 - now.getMinutes()}M`,
  };

  //logic for setting mood
  async function handleSetMood(mood) {
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();

    try {
      const newData = { ...userDataObj };
      if (!newData?.[year]) {
        newData[year] = {};
      }
      if (!newData?.[year]?.[month]) {
        newData[year][month] = {};
      }
      newData[year][month][day] = mood;

      //update the current state
      setData(newData);

      //update the global state
      setUserDataObj(newData);

      //update firebase
      //create a firebase doc and refer to it
      const docRef = doc(db, "users", currentUser.uid);
      //setting/updating the mood data into firebase doc
      await setDoc(
        docRef,
        {
          [year]: {
            [month]: {
              [day]: mood,
            },
          },
        },
        { merge: true } //only updating mood for this day/key, without affecting the rest
      );
    } catch (error) {
      console.log("Failed to set data: ", error.message);
    }
  }

  //moods obj
  const moods = {
    Tragic: "😭",
    "%$#&": "😵‍💫",
    Meh: "😐",
    Joyful: "😄",
    Delighted: "🥳",
  };

  // calculating averageMoodEmoji to show
  const getAverageMoodEmoji = (average_mood) => {
    if (average_mood >= 4.5) return "🥳";
    if (average_mood >= 3.5) return "😄";
    if (average_mood >= 2.5) return "😐";
    if (average_mood >= 1.5) return "😵‍💫";
    if (average_mood > 0) return "😭";
    return "❓";
  };
  const averageMoodEmoji = getAverageMoodEmoji(statuses.average_mood);

  useEffect(() => {
    if (!currentUser || !userDataObj) {
      return;
    }
    setData(userDataObj);
  }, [currentUser, userDataObj]);

  if (loading) {
    return <Loading />;
  }
  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <div className="flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16">
      {/* top of dashboard with three stats */}
      <div className="grid grid-cols-3 p-4 gap-4 bg-blue-50 text-blue-500 rounded-lg ">
        {Object.keys(statuses).map((status, statusIndex) => {
          return (
            <div
              key={statusIndex}
              className=" flex flex-col justify-center gap-1 sm:gap-2"
            >
              {/* show stats category */}
              <p className="font-medium text-center capitalize text-xs sm:text-sm truncate ">
                {status.replaceAll("_", " ")}
              </p>
              {/* show stats numerics & corresponding icons */}
              <p
                className={
                  "text-base text-center sm:text-lg " + fugaz.className
                }
              >
                {statuses[status]}
                {status === "num_of_days" ? " 🗓️" : ""}
                {status === "average_mood" ? ` ${averageMoodEmoji}` : ""}
                {status === "time_remaining" ? " ⏳" : ""}
              </p>
            </div>
          );
        })}
      </div>

      {/* center slogan */}
      <h4
        className={`text-3xl sm:text-4xl md:text-5xl text-center ${fugaz.className} leading-snug`}
      >
        How are you <span className="textGradient">feeling</span> 💭 today?
      </h4>

      {/* five emoji buttons */}
      <div className="flex items-stretch flex-wrap gap-4">
        {Object.keys(moods).map((mood, moodIndex) => {
          return (
            <button
              onClick={() => {
                const currentMoodValue = moodIndex + 1;
                handleSetMood(currentMoodValue);
              }}
              key={moodIndex}
              className={
                "p-4 px-5 rounded-2xl blueShadow duration-200 bg-blue-50 hover:bg-[#8bc6f6d7] text-center flex flex-col items-center gap-2 flex-1"
              }
            >
              {/* show emoji */}
              <p className="text-4xl sm:text-5xl md:text-6xl">{moods[mood]}</p>
              {/* show emoji description*/}
              <p
                className={
                  "text-blue-500 text-xs sm:text-sm md:text-base " +
                  fugaz.className
                }
              >
                {mood}
              </p>
            </button>
          );
        })}
      </div>

      <Calendar completeData={data} />
    </div>
  );
}
