import { api } from "./api";
const endpoint = "/users";

export const getAll = async () => {
  const response = await api.get(endpoint);
  return response.data;
};

export const getById = async (id) => {
  const response = await api.get(`${endpoint}/${id}`);
  return response.data;
};

export const create = async (data) => {
  const response = await api.post(endpoint, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const update = async (data) => {
  const response = await api.patch(`${endpoint}/${data.id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteById = async (id) => {
  const response = await api.delete(`${endpoint}/${id}`);
  return response.data;
};
