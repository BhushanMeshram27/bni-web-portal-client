import api, { apiRoot } from "./api";

import axios from "axios";

const API_URL = `${apiRoot}/auth`;

export const changePassword = async (data) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${API_URL}/change-password`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const resgisterUser = 
async (data) => {
     const response = await api.post(
        "/auth/register",
        data
     );
        return response.data;
};

export const loginUser =
async (data) => {
    const response = await api.post(
        "/auth/login",
        data
    );
    return response.data;
}

