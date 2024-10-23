import { defineStore } from "pinia";
import { supabase } from "../../../../lib/supabaseClient.js";

export const useGovernmentLoan = defineStore("governmentLoan", {
  state: () => ({
    columns: [
      {
        name: "id",
        align: "center",
        label: "Loan ID",
        field: (row) => row.id,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "application_no",
        align: "center",
        label: "Application No.",
        field: (row) => row.application_no,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "Loan Type",
        align: "center",
        label: "Loan Type",
        field: (row) => row.government_loan_type.government_loan_type_name,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "date_start",
        align: "center",
        label: "Date Start",
        field: (row) => row.date_start,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "employee",
        align: "center",
        label: "Employee",
        field: (row) =>
          row.employee.company_employee_id +
          " - " +
          row.employee.first_name +
          " " +
          row.employee.last_name,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "date_end",
        align: "center",
        label: "Date End",
        field: (row) => row.date_end,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "amortization",
        align: "center",
        label: "Amortization",
        field: (row) => row.amortization,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "monthly_schedule",
        align: "center",
        label: "Monthly Schedule",
        field: (row) =>
          row.half_month_indicator === 1 ? "2nd Half" : "1st Half",
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "actions",
        align: "center",
        label: "",
        field: "",
      },
    ],
    rows: [],
  }),

  getters: {
    async getArchivedLoans() {
      return this.rows.filter((row) => row.archived === true);
    },
    async getUnarchivedLoans() {
      return this.rows.filter((row) => row.archived === false);
    },
  },
  actions: {
    async fetchGovernmentLoanList() {
      try {
        const { data, error } = await supabase
          .from("government_loan")
          .select(
            "*, employee!government_loan_employee_id_fkey(company_employee_id, first_name, middle_name, last_name), government_loan_type(id, government_loan_type_name)"
          );
        if (error) {
          throw error;
        }
        this.rows = data;
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    },
  },
});
