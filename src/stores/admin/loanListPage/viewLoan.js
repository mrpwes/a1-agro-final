import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";
import { useGlobalNotificationStore } from "stores/globalNotification";
const globalNotificationStore = useGlobalNotificationStore();

export const useViewLoan = defineStore("viewLoan", {
  state: () => ({
    rows: [],

    is_paying: false,

    employeeOption: null,
    employeeOptions: null,

    type: null,
    subject: null,
    description: null,
    amount: null,
    balance: null,
    payment: null,
    expectedNewBalance: null,

    vale: null,
    partial_to_ar: null,
  }),

  getters: {
    getArchivedLoanList(state) {
      return state.rows.filter((row) => row.is_archive);
    },
    getUnarchivedLoanList(state) {
      return state.rows.filter((row) => !row.is_archive);
    },
    expectedNewBalance(state) {
      // Check if balance and payment are not null
      if (state.balance === null || state.payment === null) {
        return null; // Return null if either value is null
      }

      // Check if payment is greater than balance
      if (state.payment > state.balance) {
        return "Negative"; // Return 'Too Much' if payment exceeds balance
      }

      // Calculate expected new balance
      return state.balance - state.payment;
    },
  },
  actions: {
    async getLoanList() {
      const { data, error } = await supabase
        .from("request")
        .select(
          `
          id,
        partial_to_ar!partial_to_ar_request_id_fkey(id, amount, balance, is_archive),
        vale!vale_request_id_fkey(id, amount, balance, is_archive),
        request_employee_id (id, company_employee_id, first_name, last_name),
        request_type_id (id, request_type_name),
        request_subject,
        request_description,
        request_application_date,
        admin_employee_id (id, company_employee_id, first_name, last_name),
        admin_comments,
        admin_confirmation_date,
        change_date,
        is_archive
      `
        )
        .in("request_type_id.id", ["1", "2"]);
      // .eq("is_archive", false);
      if (error) {
        throw error;
      }
      this.fetchEmployeeOptions();
      // console.log(data);
      this.rows = data;
    },

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

    async getSelectedLoan(requestID) {
      const { data, error } = await supabase
        .from("request")
        .select(
          `
          id,
        partial_to_ar!partial_to_ar_request_id_fkey(id, amount, balance),
        vale!vale_request_id_fkey(id, amount, balance),
        request_employee_id (id, company_employee_id, first_name, last_name),
        request_type_id (id, request_type_name),
        request_subject,
        request_description,
        request_application_date,
        admin_employee_id (id, company_employee_id, first_name, last_name),
        admin_approval_status,
        admin_comments,
        admin_confirmation_date,
        change_date,
        is_archive
      `
        )
        .eq("id", requestID);
      if (error) {
        throw error;
      }
      // console.log(data);
      // this.rows = data;
      return data[0];
    },

    async archivedLoan(requestID, requestTypeID, companyLoanID) {
      try {
        const { error } = await supabase
          .from("request")
          .update({
            is_archive: true,
          })
          .eq("id", requestID);
        if (error) {
          throw error;
        }
        if (requestTypeID == 1) {
          const { error2 } = await supabase
            .from("vale")
            .update({
              is_archive: true,
            })
            .eq("id", companyLoanID);
          console.log(error2);
        } else if (requestTypeID == 2) {
          const { error2 } = await supabase
            .from("partial_to_ar")
            .update({
              is_archive: true,
            })
            .eq("id", companyLoanID);

          console.log(error2);
        }
        this.getLoanList();
      } catch (error) {
        console.log(error);
      }
    },

    async unarchivedLoan(requestID, requestTypeID, companyLoanID) {
      try {
        const { error } = await supabase
          .from("request")
          .update({
            is_archive: false,
          })
          .eq("id", requestID);
        if (error) {
          throw error;
        }
        if (requestTypeID == 1) {
          const { error2 } = await supabase
            .from("vale")
            .update({
              is_archive: false,
            })
            .eq("id", companyLoanID);
          console.log(error2);
        } else if (requestTypeID == 2) {
          const { error2 } = await supabase
            .from("partial_to_ar")
            .update({
              is_archive: false,
            })
            .eq("id", companyLoanID);

          console.log(error2);
        }
        this.getLoanList();
      } catch (error) {
        console.log(error);
      }
    },

    async insertPayment() {
      if (this.type.id == 1) {
        try {
          const { error } = await supabase
            .from("vale")
            .update({ balance: this.vale[0].balance - this.payment })
            .select()
            .eq("id", this.vale[0].id);
          if (error) {
            throw error;
          }
          this.is_paying = false;
          this.getLoanList();
          this.resetForm();
          globalNotificationStore.showSuccessNotification(
            "Payment successfully deducted."
          );
        } catch (error) {
          globalNotificationStore.showErrorNotification(error.message);
        }
      } else if (this.type.id == 2) {
        try {
          const { error } = await supabase
            .from("partial_to_ar")
            .update({
              balance: this.partial_to_ar[0].balance - this.payment,
            })
            .select()
            .eq("id", this.partial_to_ar[0].id);
          if (error) {
            throw error;
          }
          this.is_paying = false;
          this.getLoanList();
          this.resetForm();
          globalNotificationStore.showSuccessNotification(
            "Payment successfully deducted."
          );
        } catch (error) {
          globalNotificationStore.showErrorNotification(error.message);
        }
      }
    },

    resetForm() {
      this.employeeOption = null;
      this.type = null;
      this.subject = null;
      this.description = null;
      this.amount = null;
      this.balance = null;
      this.payment = null;
      // this.expectedNewBalance = null
      this.vale = null;
      this.partial_to_ar = null;
    },
  },
});
