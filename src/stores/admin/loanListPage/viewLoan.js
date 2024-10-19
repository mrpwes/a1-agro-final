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
        admin_approval_status,
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

    //   async getLoanList() {
    //     const { data, error } = await supabase.from("request").select(`
    //       id,
    //   employee_id,
    //   employee (
    //     id,
    //     first_name,
    //     last_name
    //   ),
    //   request_type_id,
    //   request_confirmation_id,
    //   request_date,
    //   description,
    //   remarks,
    //   is_archive,
    //   request_type (
    //       id,
    //       request_type_name
    //   ),
    //   request_confirmation (
    //       id,
    //       employee_id,
    //       application_date,
    //       request_confirmation_date,
    //       status,
    //       remarks,
    //       is_archive,
    //       employee (
    //           id,
    //           first_name,
    //           last_name
    //       )
    //   ),
    //   vale (
    //       id,
    //       request_id,
    //       amount,
    //       balance,
    //       date,
    //       is_archive
    //   ),
    //   partial_to_ar(
    //       id,
    //       request_id,
    //       amount,
    //       balance,
    //       date,
    //       is_archive
    //   )
    // `);
    //     if (error) {
    //       throw error;
    //     } else {
    //       // Filter out rows where request_type_id is not 1 or 2
    //       this.rows = data.filter(
    //         (row) => row.request_type_id === 1 || row.request_type_id === 2
    //       );
    //       // console.table(this.rows);
    //       // console.log(this.rows[0].vale[0].id);
    //       return data;
    //     }
    //   },
    //   async archivedLoan(
    //     loanID,
    //     loanTable,
    //     loanIsArchive,
    //     requestID,
    //     requestIsArchive,
    //     requestConfirmationID,
    //     requestConfirmationIsArchive
    //   ) {
    //     try {
    //       // Call archivedRequest
    //       await this.archivedRequest(requestID, requestIsArchive);

    //       // Call archivedRequestConfirmation
    //       await this.archivedRequestConfirmation(
    //         requestConfirmationID,
    //         requestConfirmationIsArchive
    //       );

    //       const { error } = await supabase
    //         .from(loanTable)
    //         .update({
    //           is_archive: !loanIsArchive,
    //         })
    //         .eq("id", loanID);
    //       if (error) {
    //         throw error;
    //       } else {
    //         // console.log(table, id);
    //         // console.log("This is what you need:" + data);
    //         this.getLoanList();
    //       }
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   },
    //   async archivedRequest(requestID, requestIsArchive) {
    //     try {
    //       const { error } = await supabase
    //         .from("request")
    //         .update({
    //           is_archive: !requestIsArchive,
    //         })
    //         .eq("id", requestID);
    //       if (error) throw error;
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   },
    //   async archivedRequestConfirmation(
    //     requestConfirmationID,
    //     requestConfirmationIsArchive
    //   ) {
    //     try {
    //       const { error } = await supabase
    //         .from("request_confirmation")
    //         .update({
    //           is_archive: !requestConfirmationIsArchive,
    //         })
    //         .eq("id", requestConfirmationID);
    //       if (error) throw error;
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   },

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
