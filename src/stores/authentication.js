import { defineStore } from "pinia";

export const useAuthenticationStore = defineStore("authentication", {
  state: () => ({
    userType: "admin",
    employeeId: null,
    password: null,
    firstSubmit: false,
  }),

  getters: {
    getUserType(state) {
      return state.userType;
    },
    getEmployeeId(state) {
      return state.employeeId;
    },
    getPassword(state) {
      return state.password;
    },
  },

  actions: {
    setUserType(setUserType) {
      this.userType = setUserType;
    },
    setEmployeeId(setEmployeeId) {
      this.employeeId = setEmployeeId;
    },
    setPassword(setPassword) {
      this.password = setPassword;
    },
    logoutUser() {
      this.employeeId = null;
      this.password = null;
      this.firstSubmit = false;
      this.userType = "employee";
    },
  },
});
