# 📝 Questionnaire Builder & Analytics Platform

This project is a full-featured questionnaire system that allows users to create, manage, complete, and analyze surveys.

---

## ✅ Features Implemented

### 🟢 Base Level
- **Questionnaire Catalog Page**
  - Paginated list of available questionnaires
  - Card displays:
    - Questionnaire name
    - Description
    - Number of questions
    - Number of completions
    - Actions: **Edit**, **Run**, **Delete**

- **Questionnaire Builder Page**
  - Create and update questionnaires
  - Support for 3 question types:
    - `Text` (free-form input)
    - `Single choice` (radio buttons)
    - `Multiple choice` (checkboxes)
  - Reusable components
  - Validations before saving
  - Data stored in the database

- **Interactive Questionnaire Page**
  - User-friendly form to complete questionnaire
  - All question types supported
  - Shows summary of user responses upon completion
  - Tracks and displays time taken to complete
  - Saves responses to the database

---

### 🟡 Middle Level
- **Catalog Sorting**
  - Sort by:
    - Name
    - Number of questions
    - Number of completions

- **Drag-and-Drop Builder**
  - Allows reordering of questions using drag-and-drop
  - Smooth animation and intuitive UX

- **Save Progress in Interactive Page**
  - Intermediate answers are saved to `localStorage`
  - User can refresh or close the page and continue later

---

### 🔵 Advanced Level
- **Infinite Scroll Pagination**
  - Automatically loads more questionnaires as the user scrolls

- **Questionnaire Statistics Page**
  - 📈 Metrics:
    - **Average Completion Time**
    - **Completions per Day** (line chart)
    - **Answer distribution** per question (pie charts)
  - Clean data visualizations using `Recharts`

- **Analytics UI**
  - Smooth UI with tooltips, colors, and icons for each question
  - Supports viewing which answers were most selected

---

## 📦 Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS + Framer Motion + @dnd-kit + Recharts
- **Backend**: Node.js + Express + Sequelize + MySQL
- **Persistence**: MySQL DB
- **State**: React Hooks + `localStorage`


