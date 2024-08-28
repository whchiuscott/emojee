"use client";

import React, { useEffect, useState } from "react";
import { Fugaz_One } from "next/font/google";
import Calendar from "./Calendar";
import { useAuth } from "@/app/context/AuthContext";
import { average, doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Loading from "./Loading";
import LoginPage from "@/app/login/page";

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ["400"] });

export default function Dashboard() {
  //這邊引入useAuth()並解構currentUser, userDataObj, setUserDataObj, loading
  const { currentUser, userDataObj, setUserDataObj, loading } = useAuth();

  const [data, setData] = useState({});
  const now = new Date();

  function countValues() {
    let total_number_of_days = 0;
    let sum_moods = 0;
    for (let year in data) {
      for (let month in data[year]) {
        for (let day in data[year][month]) {
          let days_mood = data[year][month][day];
          total_number_of_days++;
          sum_moods += days_mood;
        }
      }
    }
    return {
      num_of_days: total_number_of_days,
      average_mood: sum_moods / total_number_of_days,
    };
  }

  const statuses = {
    ...countValues(),
    time_remaining: `${23 - now.getHours()}H ${60 - now.getMinutes()}M`,
  };

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
      const docRef = doc(db, "users", currentUser.uid);
      const res = await setDoc(
        docRef,
        {
          [year]: {
            [month]: {
              [day]: mood,
            },
          },
        },
        { merge: true }
      );
    } catch (error) {
      console.log("Failed to set data: ", error.message);
    }
  }

  const moods = {
    Tragic: "😭",
    "%$#&": "😵‍💫",
    Meh: "😐",
    Joyful: "😄",
    Delighted: "🥳",
  };

  // let average_mood_emoji = null;
  // if (statuses.average_mood >= 4.5) {
  //   return (average_mood_emoji = "🥳");
  // }
  // if (statuses.average_mood >= 3.5 && statuses.average_mood < 4.5) {
  //   return (average_mood_emoji = "😄");
  // }
  // if (statuses.average_mood >= 2.5 && statuses.average_mood < 3.5) {
  //   return (average_mood_emoji = "😐");
  // }
  // if (statuses.average_mood >= 1.5 && statuses.average_mood < 2.5) {
  //   return (average_mood_emoji = "😵‍💫");
  // }
  // if (statuses.average_mood < 1.5) {
  //   return (average_mood_emoji = "😭");
  // }

  // 計算 average_mood_emoji
  const getAverageMoodEmoji = (averageMood) => {
    if (averageMood >= 4.5) return "🥳";
    if (averageMood >= 3.5) return "😄";
    if (averageMood >= 2.5) return "😐";
    if (averageMood >= 1.5) return "😵‍💫";
    return "😭";
  };
  const average_mood_emoji = getAverageMoodEmoji(statuses.average_mood);

  //當currentUser, userDataObj改變時都會重新執行useEffect裡的函式
  useEffect(() => {
    if (!currentUser || !userDataObj) {
      return;
    }
    setData(userDataObj);
  }, [currentUser, userDataObj]);

  //邏輯：是否載入中、是否目前未登入
  if (loading) {
    return <Loading />;
  }
  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <div className="flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16">
      <div className="grid grid-cols-3 p-4 gap-4 bg-blue-50 text-blue-500 rounded-lg ">
        {Object.keys(statuses).map((status, statusIndex) => {
          return (
            <div
              key={statusIndex}
              className=" flex flex-col justify-center items-center gap-1 sm:gap-2"
            >
              <p className="font-medium capitalize text-xs sm:text-sm truncate">
                {status.replaceAll("_", " ")}
              </p>
              <p className={"text-base sm:text-lg " + fugaz.className}>
                {statuses[status]}
                {status === "num_of_days" ? " 🗓️" : ""}
                {status === "average_mood" ? ` ${average_mood_emoji}` : ""}
              </p>
            </div>
          );
        })}
      </div>
      <h4
        className={`text-4xl sm:text-5xl md:text-6xl text-center ${fugaz.className}`}
      >
        How are you <span className="textGradient">feeling</span> today? 💭
      </h4>
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
              <p className="text-4xl sm:text-5xl md:text-6xl">{moods[mood]}</p>
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
      <Calendar completeData={data} handleSetMood={handleSetMood} />
    </div>
  );
}
