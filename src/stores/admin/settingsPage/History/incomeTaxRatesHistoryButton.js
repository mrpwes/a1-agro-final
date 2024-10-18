import { defineStore } from "pinia";
import { supabase } from "../../../../lib/supabaseClient.js";

export const useIncomeTaxRatesStore = defineStore("incomeTaxRatesStore", {
  state: () => ({
    viewPrompt: false,
    historyDataRows: [],
    historyDataColumns: [
      {
        name: "audit_id",
        align: "center",
        label: "Audit ID",
        sortable: true,
        field: (row) => {
          return row.audit_id;
        },
        format: (val) => `${val}`,
      },
      {
        name: "operation_type",
        align: "center",
        label: "Operation Type",
        sortable: true,
        field: (row) => {
          return row.operation_type;
        },
        format: (val) => `${val}`,
      },
      {
        name: "Modified By",
        align: "center",
        label: "Operation Type",
        sortable: true,
        field: (row) => {
          return (
            row.modified_by.company_employee_id +
            " - " +
            row.modified_by.first_name +
            ", " +
            row.modified_by.last_name +
            " P."
          );
        },
        format: (val) => `${val}`,
      },
      {
        name: "change_date",
        align: "center",
        label: "Change Date",
        sortable: true,
        field: (row) => {
          return row.change_date;
        },
      },
    ],
  }),
  getters: {},
  actions: {
    triggerPrompt() {
      this.viewPrompt = true;
    },

    async fetchIncomeTaxRates() {
      try {
        const { data, error } = await supabase
          .from("income_tax_rates_table_audit")
          .select(
            "*, modified_by:employee!income_tax_rates_table_audit_emp_id_modified_by_fkey(first_name, last_name, company_employee_id)"
          )
          .order("audit_id", { ascending: false });
        if (error) {
          console.error(error);
          throw error;
        }
        this.historyDataRows = data;
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    },

    detectChanges() {
      console.log("Changes detected");
    },
  },
});
