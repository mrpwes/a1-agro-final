import { defineStore } from "pinia";
import { supabase } from "../lib/supabaseClient.js";

export const useAuthenticationStore = defineStore("authentication", {
  state: () => ({
    error: false,
    errorMessage: "",
    loading: false,
    email: null,
    password: null,
    data: null,
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
    async handleLogin() {
      try {
        this.loading = true;
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
        }
      } catch (error) {
        if (error) {
          this.errorMessage = error.message;
        }
      } finally {
        this.loading = false;
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
