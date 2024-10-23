import { defineStore } from "pinia";
import { supabase } from "../../../../lib/supabaseClient";
import { useGlobalNotificationStore } from "stores/globalNotification";

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
    totalAmount: null,
    half_month_indicator: null,
    //   emp_id_modified_by: null,
    //   change_date
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
        const { data, error } = await supabase.from("government_loan").insert([
          {
            employee_id: this.employeeOption.id,
            government_loan_type_id: this.type.id,
            application_no: this.application_no,
            additional_info: this.additional_info,
            date_start: this.date_start,
            date_end: this.date_end,
            amortization: this.amortization,
            totalAmount: this.totalAmount,
            half_month_indicator:
              this.half_month_indicator === "2nd Half" ? true : false,
          },
        ]);
        if (error) {
          throw error;
        }
        // console.log(data);
        // globalNotificationStore.showSuccessNotification(
        //   "Government Loan Added Successfully"
        // );

        throw error;
      } catch (error) {
        console.log(error);
        globalNotificationStore.showErrorNotification(
          "Failed to add Government Loan" + " " + error.message
        );
      }
    },
  },
});
