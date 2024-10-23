import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";

export const useViewLoan = defineStore("viewLoan", {
  state: () => ({
    rows: [],
    paymentButton: false,
    payment: null,
  }),

  getters: {
    getArchivedLoanList(state) {
      return state.rows.filter((row) => row.is_archive);
    },
    getUnarchivedLoanList(state) {
      return state.rows.filter((row) => !row.is_archive);
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
        request_approval_status_id (id, request_approval_status_name),
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
      // console.log(data);
      this.rows = data;
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

    async insertPayment(companyLoan) {
      if (companyLoan.vale.length > 0) {
        // console.log(companyLoan.vale[0].id);
        // console.log(companyLoan.vale[0].balance);
        const { data } = await supabase
          .from("vale")
          .update({ balance: companyLoan.vale[0].balance - this.payment })
          .select()
          .eq("id", companyLoan.vale[0].id);
        console.log(data);
      } else if (companyLoan.partial_to_ar.length > 0) {
        // console.log(companyLoan.partial_to_ar[0].id);
        // console.log(companyLoan.partial_to_ar[0].balance);
        const { data } = await supabase
          .from("partial_to_ar")
          .update({
            balance: companyLoan.partial_to_ar[0].balance - this.payment,
          })
          .select()
          .eq("id", companyLoan.partial_to_ar[0].id);
        console.log(data);
      }

      this.getLoanList();
      // TODO: SUCCESSFULLY INSERT PAYMENT
    },
  },
});
