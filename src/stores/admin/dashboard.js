import { defineStore } from "pinia";
import { supabase } from "../../lib/supabaseClient.js";

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    totalEmployees: null,
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
        console.log(count);
        this.totalEmployees = count;
      } catch (error) {
        console.log("Error getting total employees:", error.message);
      }
    },
  },
});
