import axios from "axios";
import { apiRoot } from "./api";

const API_URL = `${apiRoot}/visitor`;

export const getVisitorDashboard = async (token) => {
  const { data } = await axios.get(`${API_URL}/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};