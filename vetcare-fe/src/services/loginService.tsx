
const URL = "http://localhost:8060"

// export const redirectToGoogleLogin = () => {
//   window.location.href = `${URL}/oauth2/authorization/google`;
// };
export async function redirectToGoogleLogin() {
  fetch(`${URL}/api/animals/`, {
    method: "GET"
  });
}

export const logout = () => {
  localStorage.removeItem('jwt');
  window.location.href = "http://localhost:3000/home"

};

export const isLoggedIn = () => {
  return !!localStorage.getItem('jwt');
};
