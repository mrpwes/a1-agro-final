import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";
import { useAuthenticationStore } from "src/stores/authentication.js";

const authenticationStore = useAuthenticationStore();

export const usePagibigContributionTable = defineStore(
  "pagibigContributionTable",
  {
    state: () => ({
      tableData: [
        {
          monthly_compensation: "P1,500 and below",
          employee_rate: "1.0%",
          employer_rate: "2.0%",
        },
        {
          monthly_compensation: "Over P1,500",
          employee_rate: "2.0%",
          employer_rate: "2.0%",
        },
      ],
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
            .from("pagibig_contribution_table")
            .insert({
              emp_id_modified_by: this.currentUser,
              data: this.tableData,
            });
          if (error) {
            console.error(error);
            throw error;
          }
          this.fetchPagibigContributionTable();
          console.log(data);
        } catch (error) {
          console.error(error);
        }
      },
      async fetchPagibigContributionTable() {
        try {
          const { data, error } = await supabase
            .from("pagibig_contribution_table_audit")
            .select("*")
            .order("audit_id", { ascending: false })
            .limit(1);
          if (error) {
            console.error(error);
            throw error;
          }
          console.log(data[0].data);
          this.tableData = data[0].data;
        } catch (error) {
          console.error(error);
        }
      },
    },
  }
);
