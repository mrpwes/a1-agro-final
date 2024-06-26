import { defineStore } from "pinia";
import { supabase } from "../lib/supabaseClient.js";

export const useAuthenticationStore = defineStore("authentication", {
  state: () => ({
    error: false,
    errorMessage: "",
    loginLoading: false,
    email: null,
    password: null,
    data: null,
    isAuthenticated: true,
    loginOption: "admin",

    logoutLoading: false,
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
    async logout() {
      try {
        this.logoutLoading = true;
        let { error } = await supabase.auth.signOut();
        if (error) {
          throw error;
        } else {
          console.log("logged out");
          this.router.push("/");
          this.isAuthenticated = false;
          this.logoutLoading = false;
        }
      } catch (error) {
        alert("Error logging out:", error.message);
        this.logoutLoading = false;
      }
    },
    async handleLogin() {
      try {
        this.loginLoading = true;
        const { data, error } = await supabase.auth.signInWithPassword({
          email: `${this.email}`,
          password: `${this.password}`,
        });
        if (error) {
          this.error = true;
          throw error;
        } else {
          this.error = false;
          this.data = data;
          console.log(this.getUserRole());
          console.log(data);

          this.isAuthenticated = true;

          if (this.loginOption === "employee") {
            this.router.push("/employee/dashboard");
          } else if (this.loginOption === "admin") {
            this.router.push("/admin/dashboard");
          }
        }
      } catch (error) {
        if (error) {
          this.errorMessage = error.message;
        }
      } finally {
        this.loginLoading = false;
      }
    },
    getUserRole() {
      return this.data.user.app_metadata.userrole;
    },
    // setUserType(setUserType) {
    //   this.userType = setUserType;
    // },
    // setEmployeeId(setEmployeeId) {
    //   this.employeeId = setEmployeeId;
    // },
    // setPassword(setPassword) {
    //   this.password = setPassword;
    // },
    // logoutUser() {
    //   this.employeeId = null;
    //   this.password = null;
    //   this.firstSubmit = false;
    //   this.userType = "employee";
    // },
  },
});
