import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";
import { useAuthenticationStore } from "src/stores/authentication.js";

const authenticationStore = useAuthenticationStore();

export const usePhilhealthContributionTable = defineStore(
  "philhealthContributionTable",
  {
    state: () => ({
      philHealthRateModel: null,
      philhealthContributionHistory: [],
      philHealthContribution: null,
      currentUser: authenticationStore.getEmployeeId,

      isEditing: false,
    }),
    getters: {
      // Define your getters here
    },
    actions: {
      async insertPhilhealthContributionTable() {
        try {
          const { data, error } = await supabase
            .from("philhealth_contribution_table")
            .insert({
              emp_id_modified_by: this.currentUser,
              data: { value: parseFloat(this.philHealthRateModel) },
            });
          if (error) {
            console.error(error);
            throw error;
          }
          this.fetchPhilhealthContributionTable();
          console.log(data);
        } catch (error) {
          console.error(error);
        }
      },

      async fetchPhilhealthContributionTable() {
        try {
          const { data, error } = await supabase
            .from("philhealth_contribution_table_audit")
            .select("*")
            .order("audit_id", { ascending: false })
            .limit(1);
          if (error) {
            console.error(error);
            throw error;
          }
          //   console.log(data);
          this.philhealthContributionHistory = data;
        } catch (error) {
          console.error(error);
        }
      },
    },
  }
);
