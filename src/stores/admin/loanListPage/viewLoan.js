import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";

export const useViewLoan = defineStore("viewLoan", {
  state: () => ({
    rows: [],
  }),

  getters: {
    getArchivedLoanList(state) {
      return state.rows.filter((row) =>
        row.request_type.request_type_name === "VALE"
          ? row.vale.is_archive == true
          : row.partial_to_ar.is_archive == true
      );
    },
    getUnarchivedLoanList(state) {
      return state.rows.filter((row) =>
        row.request_type.request_type_name === "VALE"
          ? row.vale.is_archive == false
          : row.partial_to_ar.is_archive == false
      );
    },
  },
  actions: {
    async getLoanList() {
      const { data, error } = await supabase.from("request").select(`
        id,
    employee_id,
    employee (
      id,
      first_name,
      last_name
    ),
    request_type_id,
    request_confirmation_id,
    request_date,
    description,
    remarks,
    is_archive,
    request_type (
        id,
        request_type_name
    ),
    request_confirmation (
        id,
        employee_id,
        application_date,
        request_confirmation_date,
        status,
        remarks,
        is_archive,
        employee (
            id,
            first_name,
            last_name
        )
    ),
    vale (
        id,
        request_id,
        amount,
        date,
        is_archive
    ),
    partial_to_ar(
        id,
        company_loan_payment,
        request_id,
        amount,
        date,
        is_archive
    )
  `);
      if (error) {
        throw error;
      } else {
        this.rows = data;
        // console.table(this.rows);
        // console.log(this.rows[0].vale[0].id);
        return data;
      }
    },
    async archivedLoan(
      loanID,
      loanTable,
      loanIsArchive,
      requestID,
      requestIsArchive,
      requestConfirmationID,
      requestConfirmationIsArchive
    ) {
      try {
        // Call archivedRequest
        await this.archivedRequest(requestID, requestIsArchive);

        // Call archivedRequestConfirmation
        await this.archivedRequestConfirmation(
          requestConfirmationID,
          requestConfirmationIsArchive
        );

        const { error } = await supabase
          .from(loanTable)
          .update({
            is_archive: !loanIsArchive,
          })
          .eq("id", loanID);
        if (error) {
          throw error;
        } else {
          // console.log(table, id);
          // console.log("This is what you need:" + data);
          this.getLoanList();
        }
      } catch (error) {
        console.log(error);
      }
    },
    async archivedRequest(requestID, requestIsArchive) {
      try {
        const { error } = await supabase
          .from("request")
          .update({
            is_archive: !requestIsArchive,
          })
          .eq("id", requestID);
        if (error) throw error;
      } catch (error) {
        console.log(error);
      }
    },
    async archivedRequestConfirmation(
      requestConfirmationID,
      requestConfirmationIsArchive
    ) {
      try {
        const { error } = await supabase
          .from("request_confirmation")
          .update({
            is_archive: !requestConfirmationIsArchive,
          })
          .eq("id", requestConfirmationID);
        if (error) throw error;
      } catch (error) {
        console.log(error);
      }
    },
  },
});
