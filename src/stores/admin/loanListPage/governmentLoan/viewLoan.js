import { defineStore } from "pinia";
import { supabase } from "../../../../lib/supabaseClient";
import { useGlobalNotificationStore } from "stores/globalNotification";
import { useAuthenticationStore } from "stores/authentication";
import { useGovernmentLoan } from "./governmentLoan";

const globalNotificationStore = useGlobalNotificationStore();
const authenticationStore = useAuthenticationStore();
const governmentLoanStore = useGovernmentLoan();

export const useGovtViewLoanStore = defineStore("govtViewLoan", {
  state: () => ({
    selected_row: null,

    id: null,

    employeeOption: null,
    employeeOptions: null,

    type: null,
    typeOptions: null,

    date_start: null,
    date_end: null,

    half_month_indicator: null,
    additional_info: null,
    amortization: null,
    total_amount: null,

    is_uploading: false,
    is_editing: false,
    viewPrompt: false,

    emp_id_modified_by: authenticationStore.getEmployeeId,
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

    async updateLoan() {
      console.log("INSIDE");
      try {
        this.is_uploading = true;
        const { error } = await supabase
          .from("government_loan")
          .update({
            date_start: this.date_start,
            date_end: this.date_end,
            half_month_indicator:
              this.half_month_indicator === "2nd Half" ? true : false,
            additional_info: this.additional_info,
            amortization: this.amortization,
            total_amount: this.total_amount,
            emp_id_modified_by: this.emp_id_modified_by,
          })
          .eq("id", this.id);
        if (error) {
          throw error;
        }
        globalNotificationStore.showSuccessNotification(
          "Successfully updated loan"
        );
        this.is_uploading = false;
        this.is_editing = false;
        this.viewPrompt = false;
        governmentLoanStore.fetchGovernmentLoanList();
      } catch (error) {
        console.log(error);
      }
    },
  },
});
