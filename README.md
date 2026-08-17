# Portfolio & Task Manager — 24AIML016

A full-stack **Task Management** application built with **React + Node.js + Express + MongoDB**, integrated as part of the Advanced Web Development Frameworks course (Practical 6).

The React frontend communicates with the Express backend through RESTful API calls. All task data is persisted in MongoDB.

---

## Technologies

| Layer     | Technology                     |
| --------- | ------------------------------ |
| Frontend  | React 19, Vite, React Router   |
| Backend   | Node.js, Express 5             |
| Database  | MongoDB, Mongoose              |
| Middleware| CORS                           |
| Styling   | Vanilla CSS, Glassmorphism     |

---

## Requirements

- **Node.js** v18+
- **npm**
- **MongoDB** (running locally on port 27017, or a remote URI)

---

## Project Structure

```
24AIML016-Portfolio/
│
├── src/                          # React Frontend
│   ├── components/
│   │   ├── TaskForm.jsx          # Create/Edit task form
│   │   ├── TaskItem.jsx          # Individual task card
│   │   ├── TaskList.jsx          # Grid of task cards
│   │   ├── Toast.jsx             # Toast notifications
│   │   ├── Navbar.jsx            # Navigation bar
│   │   ├── Footer.jsx            # Footer
│   │   └── ...
│   ├── pages/
│   │   ├── Tasks.jsx             # Task Manager page (CRUD)
│   │   ├── Home.jsx              # Home / About page
│   │   ├── Projects.jsx          # GitHub Projects page
│   │   ├── Contact.jsx           # Contact form page
│   │   └── NotFound.jsx          # 404 page
│   ├── api.js                    # Centralized API functions
│   ├── App.jsx                   # Router setup
│   └── main.jsx                  # Entry point
│
├── Backhand-24AIML016/
│   └── jeel -api/
│       └── mongoDB_24AIML016/    # Express Backend
│           ├── models/
│           │   └── task.js       # Mongoose Task model
│           ├── routes/
│           │   └── tasks.js
│           ├── server_new.js     # Express server (CORS + CRUD)
│           ├── package.json
│           └── .env              # MongoDB URI + PORT
│
├── package.json                  # Root (concurrently runs both)
└── README.md
```

---

## Environment Variables

Create a `.env` file in `Backhand-24AIML016/jeel -api/mongoDB_24AIML016/`:

```env
MONGO_URI=mongodb://localhost:27017/24AIML016
PORT=5000
```

> ⚠️ Do NOT commit `.env` to version control.

---

## Installation

### Backend

```bash
cd "Backhand-24AIML016/jeel -api/mongoDB_24AIML016"
npm install
```

### Frontend

```bash
# From the project root
npm install
```

---

## Running the Application

### Option 1: Run Both Together (Recommended)

```bash
npm run dev
```

This uses `concurrently` to start both servers simultaneously.

### Option 2: Run Separately

**Terminal 1 — Backend:**

```bash
cd "Backhand-24AIML016/jeel -api/mongoDB_24AIML016"
npm start
```

Backend runs at: `http://localhost:5000`

**Terminal 2 — Frontend:**

```bash
npm run dev:frontend
```

Frontend runs at: `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint       | Description           |
| ------ | -------------- | --------------------- |
| GET    | `/tasks`       | Get all tasks         |
| GET    | `/tasks/:id`   | Get task by ID        |
| POST   | `/tasks`       | Create a new task     |
| PUT    | `/tasks/:id`   | Update a task         |
| PATCH  | `/tasks/:id`   | Partially update task |
| DELETE | `/tasks/:id`   | Delete a task         |

### Task Schema

```json
{
  "_id": "MongoDB ObjectId",
  "title": "string (required)",
  "description": "string",
  "completed": "boolean (default: false)",
  "priority": "low | medium | high (default: medium)",
  "createdAt": "Date"
}
```

---

## Features

- ✅ **Create Task** — Add new tasks with title, description, and priority
- ✅ **View Tasks** — Display all tasks from MongoDB in a responsive grid
- ✅ **Update Task** — Edit task details and mark as completed
- ✅ **Delete Task** — Remove tasks with confirmation dialog
- ✅ **MongoDB Persistence** — Data survives browser refresh
- ✅ **Loading States** — Spinners and disabled buttons during API operations
- ✅ **Error Handling** — User-friendly error messages for all operations
- ✅ **Delete Confirmation** — Modal dialog before deleting a task
- ✅ **Toast Notifications** — Success/error notifications with auto-dismiss
- ✅ **Dark/Light Theme** — Toggle between themes
- ✅ **Responsive Design** — Works on all screen sizes
- ✅ **Glassmorphism UI** — Premium frosted-glass design

---

## Practical 6 — Full Stack Integration

This project demonstrates the integration of:

```
React Frontend (port 5173)
        ↓ fetch API
Express Backend (port 5000)
        ↓ Mongoose
MongoDB (port 27017)
```

**Student:** Jeel Kankadiya  
**Enrollment:** 24AIML016
