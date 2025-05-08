export const logout = () => {
  localStorage.removeItem("jwt");
  window.location.href = "http://localhost:3000/home";
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("jwt");
};
