import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";

//NOT USING THIS CONTRIBUTION TABLE YET

export const useContributionStore = defineStore("contribution", {
  state: () => ({}),

  getters: {},
  actions: {
    async getContributions() {
      const { data, error } = await supabase.from("deductions").select(
        `id,
         date_start,
         date_end,
         employee_id,
         emp_philhealth_contrib ( id, amount, update_datetime),
         emp_sss_contrib ( id, amount, update_datetime),
         emp_pagibig_contrib ( id, amount, update_datetime),
         emp_incometax_contrib ( id, amount, update_datetime)`
      );
      if (error) {
        console.error(error);
      }
      console.log(data);
      return data;
    },
  },
});
