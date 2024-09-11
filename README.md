# EMO記🖋️EMOJEE

EMOJEE 是一個讓使用者可以記錄每天心情的 APP，幫助你追蹤長期心情的變化趨勢。
你可以在這邊查看已部署的網站：[EMO記🖋️EMOJEE](https://emojee.vercel.app/)
EMOJEE is an app that allows users to record their daily moods, helping you track long-term mood changes. You can view the deployed site here: [EMO記🖋️EMOJEE](https://emojee.vercel.app/)

## 目錄

- [中文](#中文介紹)
- [English](#english-description)

## 中文介紹

### 功能介紹

- **註冊及登入**：使用者可以透過註冊帳號或登入，所有使用者的註冊及登入資料都安全儲存在 Firebase。
- **記錄心情**：進入 Dashboard 後，使用者可以透過五個 emoji 按鈕來記錄當天的心情，心情從低到高以 emoji 表示，每個 emoji 對應一個心情數值來打分數（滿分 5 分）。
- **心情數據**：
  - Num Of Days：顯示目前已經記錄了幾天心情。
  - Average Mood：歷史以來的心情平均值。
  - Time Remaining：顯示今天距離午夜的剩餘時間，提醒使用者今日心情的紀錄時間即將結束。
- **心情月曆總覽圖**：除了顯示當月的心情紀錄，也可以點擊左右鍵回溯歷史心情紀錄。每天心情以淺至深的顏色來表示心情分數的高低。若當天沒有記錄心情，該日期將顯示為白色。

### 使用技術

- **前端框架**：React.js、Next.js
- **語言**：HTML、JavaScript
- **樣式**：Tailwind CSS
- **後端與資料庫**：Firebase
- **部署**：Vercel


### 專案目的＆靈感起源

此專案目的是為了練習 HTML、Tailwind CSS、JavaScript、React.js 以及 Next.js 的開發技能，並且在沒有完整後端的情況下，嘗試構建一個具備基本商業邏輯的小型應用程式。此外，這也是為了記錄我自己在自學前端知識過程中的心情變化。

### 未來可添加的功能

- 除了歷史心情分數平均，也許可以有每週平均心情分數的統計。
- 每天能添加一小段心情備註，點擊月曆中的日期可以查看當天的心情與備註。

### 安裝與使用

1. Clone 專案至本地：
   ```bash
   git clone https://github.com/your-username/emojee.git
2. 安裝相關依賴套件：
   ```bash
   npm install
3. 啟動開發伺服器：
   ```bash
   npm run dev
4. 開啟瀏覽器並前往 http://localhost:3000 查看此專案。

__🙇🏻‍♂️感謝撥冗閱讀！🙏🏻__

## English Description

### Features

- **Registration and Login**: Users can register or log in, with all registration and login data securely stored in Firebase.
- **Mood Recording**: After entering the Dashboard, users can record their daily mood by selecting one of five emoji buttons, with each emoji representing a mood score from low to high (max score of 5).
- **Mood Data**:
  - **Num Of Days**: Shows the number of days for which mood data has been recorded.
  - **Average Mood**: Displays the historical average mood score.
  - **Time Remaining**: Shows the remaining time until midnight today, reminding users that the time to record today's mood is ending soon.
- **Mood Calendar Overview**: Besides showing mood records for the current month, you can click the left and right arrows to navigate through historical mood records. Each day’s mood is displayed with colors ranging from light to dark, representing mood scores from low to high. If no mood is recorded for a day, the date will be shown in white.

### Technologies Used

- **Frontend Frameworks**: React.js, Next.js
- **Languages**: HTML, JavaScript
- **Styling**: Tailwind CSS
- **Backend and Database**: Firebase
- **Deployment**：Vercel

### Project Goal & Inspiration

This project aims to practice development skills with HTML, Tailwind CSS, JavaScript, React.js, and Next.js, and to build a small application with basic business logic without a complete backend. Additionally, it serves as a way to document my mood changes during my self-learning journey in frontend development.

### Future Features

- Weekly average mood score statistics, in addition to historical mood averages.
- The ability to add a short mood note each day, with the option to view mood and notes by clicking on dates in the calendar.

### Installation and Usage

1. Clone the project locally:
   ```bash
   git clone https://github.com/your-username/emojee.git
2. Install dependencies:
   ```bash
   npm install
3. Start the development server:
   ```bash
   npm run dev
4. Open your browser and go to http://localhost:3000 to view the project.

__🙇🏻‍♂️Thank you for taking the time to read!🙏🏻__


_Copyright © Scott Chiu 2024_
