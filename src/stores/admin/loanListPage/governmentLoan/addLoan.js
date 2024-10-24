import { defineStore } from "pinia";
import { supabase } from "../../../../lib/supabaseClient";
import { useGlobalNotificationStore } from "stores/globalNotification";
import { useAuthenticationStore } from "stores/authentication";
import { useGovernmentLoan } from "./governmentLoan";

const authenticationStore = useAuthenticationStore();
const governmentLoanStore = useGovernmentLoan();
const globalNotificationStore = useGlobalNotificationStore();

export const useAddGovernmentLoanStore = defineStore("addGovernmentLoan", {
  state: () => ({
    employeeOption: null,
    employeeOptions: null,

    type: null,
    typeOptions: null,

    employee_id: null,
    government_loan_type_id: null,
    application_no: null,
    additional_info: null,
    payments_made: null,
    date_start: null,
    date_end: null,
    amortization: null,
    total_amount: null,
    half_month_indicator: null,
    emp_id_modified_by: authenticationStore.getEmployeeId,
    //   change_date

    addLoanDialog: false,
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

    async addLoan() {
      try {
        const { error } = await supabase.from("government_loan").insert([
          {
            employee_id: this.employeeOption.id,
            government_loan_type_id: this.type.id,
            application_no: this.application_no,
            additional_info: this.additional_info,
            date_start: this.date_start,
            date_end: this.date_end,
            amortization: this.amortization,
            total_amount: this.total_amount,
            half_month_indicator:
              this.half_month_indicator === "2nd Half" ? true : false,
            emp_id_modified_by: this.emp_id_modified_by,
            is_archive: false,
          },
        ]);
        if (error) {
          throw error;
        }
        globalNotificationStore.showSuccessNotification(
          "Government Loan Added Successfully"
        );
        this.resetForm();
        this.addLoanDialog = false;
        governmentLoanStore.fetchGovernmentLoanList();
      } catch (error) {
        console.log(error);
        globalNotificationStore.showErrorNotification(
          "Failed to add Government Loan" + " " + error.message
        );
      }
    },

    resetForm() {
      this.employeeOption = null;
      // this.employeeOptions = null;
      this.type = null;
      // this.typeOptions = null;
      this.employee_id = null;
      this.government_loan_type_id = null;
      this.application_no = null;
      this.additional_info = null;
      this.payments_made = null;
      this.date_start = null;
      this.date_end = null;
      this.amortization = null;
      this.total_amount = null;
      this.half_month_indicator = null;
      this.emp_id_modified_by = null;
    },
  },
});
