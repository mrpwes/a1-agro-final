import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";
import { useAuthenticationStore } from "src/stores/authentication.js";

const authenticationStore = useAuthenticationStore();

export const useIncomeTaxRatesStore = defineStore("incomeTaxRates", {
  state: () => ({
    tableData: [
      {
        over: "-",
        notOver: "P250,000",
        basicAmount: "-",
        additionalRate: "-",
        excessOver: "-",
      },
      {
        over: "P250,000",
        notOver: "P400,000",
        basicAmount: "-",
        additionalRate: "20%",
        excessOver: "P250,000",
      },
      {
        over: "P400,000",
        notOver: "P800,000",
        basicAmount: "P30,000",
        additionalRate: "25%",
        excessOver: "P400,000",
      },
      {
        over: "P800,000",
        notOver: "P2,000,000",
        basicAmount: "P130,000",
        additionalRate: "30%",
        excessOver: "P800,000",
      },
      {
        over: "P2,000,000",
        notOver: "P8,000,000",
        basicAmount: "P490,000",
        additionalRate: "32%",
        excessOver: "P2,000,000",
      },
      {
        over: "P8,000,000",
        notOver: "-",
        basicAmount: "P2,410,000",
        additionalRate: "35%",
        excessOver: "P8,000,000",
      },
    ],
    currentUser: authenticationStore.getEmployeeId,

    isEditing: false,
  }),
  getters: {
    // Define your getters here
  },
  actions: {
    async insertIncomeTaxRates() {
      try {
        const { data, error } = await supabase
          // .from("pagibig_contribution_table")
          .from("income_tax_rates_table")
          .insert({
            emp_id_modified_by: this.currentUser,
            data: this.tableData,
          });
        if (error) {
          console.error(error);
          throw error;
        }
        this.fetchIncomeTaxRates();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    },
    async fetchIncomeTaxRates() {
      try {
        const { data, error } = await supabase
          .from("income_tax_rates_table_audit")
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
});
