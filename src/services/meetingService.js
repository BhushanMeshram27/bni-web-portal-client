import axios from "axios";
import { apiRoot } from "./api";

const API_URL = `${apiRoot}/meetings`;

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get All Meetings
export const getMeetings = async () => {
  const res = await axios.get(
    API_URL,
    getAuthConfig()
  );

  return res.data;
};

// Get Meeting By ID
export const getMeetingById = async (id) => {
  const res = await axios.get(
    `${API_URL}/${id}`,
    getAuthConfig()
  );

  return res.data;
};

// Create Meeting
export const createMeeting = async (data) => {
  const res = await axios.post(
    API_URL,
    data,
    getAuthConfig()
  );

  return res.data;
};

// Update Meeting
export const updateMeeting = async (
  id,
  data
) => {
  const res = await axios.put(
    `${API_URL}/${id}`,
    data,
    getAuthConfig()
  );

  return res.data;
};

// Delete Meeting
export const deleteMeeting = async (
  id
) => {
  const res = await axios.delete(
    `${API_URL}/${id}`,
    getAuthConfig()
  );

  return res.data;
};