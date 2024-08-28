import { defineStore } from "pinia";
import { supabase } from "../../lib/supabaseClient.js";

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    totalEmployees: null,
    employeesCurrentBirthdays: null,
  }),

  getters: {
    getTotalEmployees() {
      return this.totalEmployees;
    },
  },

  actions: {
    async fetchTotalEmployees() {
      try {
        const { count, error } = await supabase
          .from("employee")
          .select("*", { count: "exact", head: true });
        if (error) {
          throw error;
        }
        // console.log(count);
        this.totalEmployees = count;
      } catch (error) {
        console.log("Error getting total employees:", error.message);
      }
    },
    async fetchEmployeesBornInCurrentMonth() {
      try {
        const { data, error } = await supabase
          .from("employees_born_in_current_month")
          .select("*");
        if (error) {
          throw error;
        }
        console.log(data);
        this.employeesCurrentBirthdays = data;
      } catch (error) {
        console.log(
          "Error getting employees with birthdays in January:",
          error.message
        );
      }
    },
  },
});
