import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";
// import { useAuthenticationStore } from "../../authentication.js";

// const storeAuthentication = useAuthenticationStore();

export const useViewApprovalStore = defineStore("viewApproval", {
  state: () => ({
    rows: [],

    columns: [
      {
        name: "id",
        align: "center",
        label: "Request ID",
        field: (row) => row.id,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "request_type_name",
        align: "center",
        label: "Request Type",
        field: (row) => row.request_type_id.request_type_name,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "Subject",
        align: "center",
        label: "Subject",
        field: (row) => row.request_subject,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "Description",
        align: "center",
        label: "Description",
        field: (row) => row.request_description,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "Recipient",
        align: "center",
        label: "Recipient",
        field: (row) =>
          row.request_employee_id.company_employee_id +
          " - " +
          row.request_employee_id.last_name +
          " " +
          row.request_employee_id.first_name,
        sortable: true,
      },
      {
        name: "Application Date",
        align: "center",
        label: "Application Date",
        field: (row) => row.request_application_date,
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
  }),

  getters: {
    getArchivedApprovalList(state) {
      return state.rows.filter((row) => row.is_archive === true);
    },
    getUnarchivedApprovalList(state) {
      return state.rows.filter((row) => row.is_archive === false);
    },
  },

  actions: {
    async getRequestList() {
      try {
        const { data, error } = await supabase.from("request").select(
          `
            id,
            request_employee_id(company_employee_id, first_name, middle_name, last_name),
            request_type_id(request_type_name),
            request_approval_status(request_approval_status_name),
            request_application_date,
            request_subject,
            request_description,
            is_archive
        `
        );
        if (error) throw error;
        this.rows = data;
      } catch (error) {
        console.log(error);
      }
    },
  },
});
