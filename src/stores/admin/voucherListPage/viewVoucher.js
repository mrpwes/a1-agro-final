import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";

export const useViewVoucherStore = defineStore("viewVoucher", {
  state: () => ({
    rows: [],
  }),

  getters: {
    // getHighestEmployeeIDNumber(state) {
    //   return Math.max.apply(
    //     Math,
    //     state.rows.map(function (o) {
    //       return (parseInt(o.employeeId) + 1).toString();
    //     })
    //   );
    // },
    getActive(state) {
      return state.rows.filter((row) => row.is_archive === false);
    },
    getInactive(state) {
      return state.rows.filter((row) => row.is_archive === true);
    },
  },

  actions: {
    async fetchListOfVouchers() {
      try {
        const { data, error } = await supabase.from("voucher").select(`
              id,
              employee_id,
              type,
              date_issued,
              recipient:employee_id(first_name, middle_name, last_name),
              issuer:employee_id(first_name, middle_name, last_name), 
              issuer,
              description,
              amount,
              is_archive
            `);
        // TODO: recipient and issuer same code
        if (error) {
          throw error;
        } else {
          this.rows = data;
          //   console.table(data);
          //   console.log(data);
        }
      } catch (error) {
        console.log(error);
      }
    },

    async archivedVoucher(id) {
      try {
        const { data, error } = await supabase
          .from("voucher")
          .update({
            is_archive: true,
          })
          .eq("id", id);
        if (error) {
          throw error;
        } else {
          console.log(data);
          this.fetchListOfVouchers();
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
});
