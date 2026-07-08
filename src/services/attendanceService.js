import axios from "axios";
import { apiRoot } from "./api";

const API = `${apiRoot}/attendance`;

const getToken = () => localStorage.getItem("token");

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// Get all attendance (Admin)
export const getAttendance = async () => {
  const res = await axios.get(API, authHeader());
  return res.data;
};

// Get attendance by ID
export const getAttendanceById = async (id) => {
  const res = await axios.get(`${API}/${id}`, authHeader());
  return res.data;
};

// Get logged-in user's attendance
export const getMyAttendance = async () => {
  const res = await axios.get(`${API}/my`, authHeader());
  return res.data;
};

// Create single attendance
export const createAttendance = async (data) => {
  const res = await axios.post(API, data, authHeader());
  return res.data;
};

// Bulk mark attendance
export const markAttendance = async (data) => {
  const res = await axios.post(`${API}/mark`, data, authHeader());
  return res.data;
};

// Update attendance
export const updateAttendance = async (id, data) => {
  const res = await axios.put(`${API}/${id}`, data, authHeader());
  return res.data;
};

// Delete attendance
export const deleteAttendance = async (id) => {
  const res = await axios.delete(`${API}/${id}`, authHeader());
  return res.data;
};