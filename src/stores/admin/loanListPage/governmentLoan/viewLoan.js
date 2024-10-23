import { defineStore } from "pinia";
import { supabase } from "../../../../lib/supabaseClient";

export const useGovtViewLoanStore = defineStore("govtViewLoan", {
  state: () => ({
    selected_row: null,

    employeeOption: null,
    employeeOptions: null,

    type: null,
    typeOptions: null,

    date_start: null,
    date_end: null,

    half_month_indicator: null,

    names: "",
    defaultData: null,
    buttonEdit: false,
  }),

  getters: {},
  actions: {
    async fetchEmployeeOptions() {
      try {
        const { data, error } = await supabase
          .from("employee")
          .select(
            "id, company_employee_id, first_name, middle_name, last_name"
          );
        if (error) {
          throw error;
        } else {
          this.employeeOptions = data;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async fetchGovernmentLoanType() {
      try {
        const { data, error } = await supabase
          .from("government_loan_type")
          .select("id, government_loan_type_name");
        if (error) {
          throw error;
        }
        this.typeOptions = data;
      } catch (error) {
        console.log(error);
      }
    },
  },
});
