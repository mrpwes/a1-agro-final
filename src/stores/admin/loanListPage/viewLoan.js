import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";

export const useViewLoan = defineStore("viewLoan", {
  state: () => ({
    rows: [],
  }),

  getters: {},
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
    is_active,
    request_type (
        id,
        request_type_name
    ),
    request_confirmation (
        employee_id,
        application_date,
        request_confirmation_date,
        status,
        remarks,
        is_active,
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
        console.table(this.rows);
        console.log(this.rows[0].vale[0].id);
        return data;
      }
    },
  },
});
