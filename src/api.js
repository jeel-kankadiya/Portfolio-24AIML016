/* api.js — Centralized API functions for Task Management */

const BASE_URL = "http://localhost:5000";

/**
 * GET /tasks — Fetch all tasks from MongoDB
 */
export const getTasks = async () => {
  const response = await fetch(`${BASE_URL}/tasks`);

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return response.json();
};

/**
 * POST /tasks — Create a new task
 */
export const createTask = async (taskData) => {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create task");
  }

  return response.json();
};

/**
 * PUT /tasks/:id — Update an existing task
 */
export const updateTask = async (id, taskData) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update task");
  }

  return response.json();
};

/**
 * DELETE /tasks/:id — Delete a task
 */
export const deleteTask = async (id) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete task");
  }

  return response.json();
};
