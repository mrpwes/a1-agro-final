import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";
import { useAuthenticationStore } from "stores/authentication.js";

const authenticationStore = useAuthenticationStore();

export const useViewVoucherStore = defineStore("emp_viewVoucher", {
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
      return state.rows.filter(
        (row) =>
          row.is_archive === false &&
          row.recipient.id === authenticationStore.getEmployeeId
      );
    },
    getInactive(state) {
      return state.rows.filter(
        (row) =>
          row.is_archive === true &&
          row.recipient.id === authenticationStore.getEmployeeId
      );
    },
  },

  actions: {
    async fetchListOfVouchers() {
      try {
        const { data, error } = await supabase.from("voucher").select(
          `
              id,
              admin_employee_id(company_employee_id, first_name, middle_name, last_name),
              subject,
              description,
              date_issued,
              recipient(id, company_employee_id, first_name, middle_name, last_name),
              issuer(company_employee_id, first_name, middle_name, last_name), 
              amount,
              is_archive
            `
        );
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

    async archivedVoucher(id, isArchive) {
      try {
        const { data, error } = await supabase
          .from("voucher")
          .update({
            is_archive: !isArchive,
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
