import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";
import { useAuthenticationStore } from "src/stores/authentication.js";

const authenticationStore = useAuthenticationStore();

export const useSssContributionTableStore = defineStore(
  "sssContributionTable",
  {
    state: () => ({
      sssContributionHistory: [],
      currentUser: authenticationStore.getEmployeeId,

      isEditing: false,
    }),
    getters: {
      // Define your getters here
    },
    actions: {
      async insertSssContributionTable(newData) {
        try {
          const { data, error } = await supabase
            .from("sss_contribution_table")
            .insert({
              emp_id_modified_by: this.currentUser,
              data: newData,
            });
          if (error) {
            console.error(error);
            throw error;
          }
          console.log(data);
        } catch (error) {
          console.error(error);
        }
      },

      async fetchSssContributionTable() {
        try {
          const { data, error } = await supabase
            .from("sss_contribution_table_audit")
            .select("*")
            .order("audit_id", { ascending: false })
            .limit(1);
          if (error) {
            console.error(error);
            throw error;
          }
          //   console.log(data);
          this.sssContributionHistory = data;
        } catch (error) {
          console.error(error);
        }
      },
    },
  }
);
