import { defineStore } from "pinia";
import { supabase } from "../../lib/supabaseClient.js";

export const useEmployeeListStore = defineStore("employeeList", {
  state: () => ({
    rows: [],
  }),

  getters: {
    getHighestEmployeeIDNumber(state) {
      return Math.max.apply(
        Math,
        state.rows.map(function (o) {
          return (parseInt(o.employeeId) + 1).toString();
        })
      );
    },
    getActive(state) {
      return state.rows.filter((row) => row.is_archive === false);
    },
    getInactive(state) {
      return state.rows.filter((row) => row.is_archive === true);
    },
  },

  actions: {
    async fetchListOfEmployee() {
      try {
        const { data, error } = await supabase.from("employee").select(`
          date_of_birth,
          martial_status,
          address (
            region,
            province,
            city,
            barangay,
            postal_code,
            street,
            house_number,
            additional_information
          ),

          company_employee_id,
          first_name,
          middle_name,
          last_name,
          gender,
          phone_number (
            phone_number
          ),

          hired_date,
          employment_type_id,
          position,
          department,
          rate_per_day,

          phil_health_number,
          pag_ibig_number,
          sss_number,
          bir_tin,
          is_archive
        `);
        if (error) {
          throw error;
        } else {
          this.rows = data;
          // console.table(data);
          // console.log(data);
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
});
