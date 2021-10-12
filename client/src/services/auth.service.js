import axios from "axios";
const API_URL = "http://localhost:7777/api/user";

class AuthService {
  login(email, password) {
    return axios.post(API_URL + "/login", {
      email,
      password,
    });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(email, password) {
    return axios.post(API_URL + "/register", {
      email,
      password,
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  googleLogin(email, googleId) {
    return axios.post(API_URL + "/google", {
      email,
      googleId,
    });
  }
}

export default new AuthService();
