import axios from "axios";
import { apiRoot } from "./api";

const API_URL = `${apiRoot}/referrals`;

export const getMyReferrals = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// Received referrals (assigned to logged-in member)
export const getReceivedReferrals = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${API_URL}/received`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// Get referral details
export const getReferralById = async (id) => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// Update referral status
export const updateReferralStatus = async (id, status) => {
  const token = localStorage.getItem("token");

  const res = await axios.put(
    `${API_URL}/status/${id}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};