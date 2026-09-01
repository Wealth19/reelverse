import api from "./axios";

// GET MY PROFILE

export const getProfile = async () => {
  const response = await api.get("/users/profile");

  return response.data;
};

// UPDATE MY PROFILE

export const updateProfile = async (data: { name: string; email: string }) => {
  const response = await api.put("/users/profile", data);

  return response.data;
};

// CHANGE PASSWORD

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await api.put("/users/change-password", data);

  return response.data;
};
