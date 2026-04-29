import api from "./api";

export const login = async (email, password) => {
  const response = await api.post("/auth/login/", {
    email: email,
    password: password
  });

  const token = response.data.access;
  localStorage.setItem("token", token);

  return response;
};

export const logout = () => {
  localStorage.removeItem("token");
};