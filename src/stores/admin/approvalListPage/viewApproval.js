import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";
// import { useAuthenticationStore } from "../../authentication.js";

// const storeAuthentication = useAuthenticationStore();

export const useViewApprovalStore = defineStore("viewApproval", {
  state: () => ({ rows: [] }),

  getters: {
    getArchivedApprovalList(state) {
      return state.rows.filter((row) => row.is_archive === true);
    },
    getUnarchivedApprovalList(state) {
      return state.rows.filter((row) => row.is_archive === false);
    },
  },

  actions: {
    async getApprovalList() {
      try {
        const { data, error } = await supabase
          .from("request")
          .select(
            `
            id,
            recipient:employee (id, first_name, middle_name, last_name),
            request_type_id,
            request_date,
            subject,
            description,
            remarks,
            is_archive,
            request_confirmation (
                id,
                employee_id,
                application_date,
                request_confirmation_date,
                status,
                remarks,
                is_archive
            )        
        `
          )
          .eq("request_type_id", 3);
        if (error) throw error;
        this.rows = data;
      } catch (error) {
        console.log(error);
      }
    },
  },
});
