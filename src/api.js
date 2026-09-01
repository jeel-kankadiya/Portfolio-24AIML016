/* api.js — Centralized API functions for Task Management */

const BASE_URL = "http://localhost:5000";


// ==========================================
// AUTH HELPERS
// ==========================================

/**
 * Get the stored JWT token
 */
const getToken = () => localStorage.getItem("token");

/**
 * Get auth headers for protected API calls
 */
const authHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Handle 401 responses — clear token and redirect to login
 */
const handleUnauthorized = (response) => {
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new Error("Session expired. Please login again.");
  }
};


// ==========================================
// AUTH API
// ==========================================

/**
 * POST /register — Register a new user
 */
export const register = async (email, password) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Registration failed");
  }

  return response.json();
};

/**
 * POST /login — Login and receive JWT token
 */
export const login = async (email, password) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Login failed");
  }

  const data = await response.json();

  // Store token and user info
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
};

/**
 * Logout — Clear token from client
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/**
 * GET /me — Get current logged-in user details
 */
export const getMe = async () => {
  const response = await fetch(`${BASE_URL}/me`, {
    headers: authHeaders(),
  });

  handleUnauthorized(response);

  if (!response.ok) {
    throw new Error("Failed to fetch user details");
  }

  return response.json();
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getToken();
};


// ==========================================
// TASK API (Protected)
// ==========================================

/**
 * GET /tasks — Fetch all tasks from MongoDB
 */
export const getTasks = async () => {
  const response = await fetch(`${BASE_URL}/tasks`, {
    headers: authHeaders(),
  });

  handleUnauthorized(response);

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
    headers: authHeaders(),
    body: JSON.stringify(taskData),
  });

  handleUnauthorized(response);

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
    headers: authHeaders(),
    body: JSON.stringify(taskData),
  });

  handleUnauthorized(response);

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
    headers: authHeaders(),
  });

  handleUnauthorized(response);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete task");
  }

  return response.json();
};
