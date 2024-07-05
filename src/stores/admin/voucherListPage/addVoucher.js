import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";
import { useViewVoucherStore } from "./viewVoucher.js";
import { Notify } from "quasar";

const storeViewVoucher = useViewVoucherStore();

export const useAddVoucherStore = defineStore("addVoucher", {
  state: () => ({
    employee_id: null,
    type: null,
    date_issued: null,
    recipient: null,
    recipientOptions: [],
    issuer: null,
    issuerOptions: [],
    description: null,
    amount: null,
    is_archive: null,
    loading: false,
  }),

  getters: {},

  actions: {
    addVoucher() {
      Promise.all([this.getCurrentUser()]).then(() => {
        this.addVoucherData();
      });
    },

    async addVoucherData() {
      this.loading = true;
      try {
        const { data, error } = await supabase.from("voucher").insert([
          {
            employee_id: this.employee_id,
            type: this.type,
            date_issued: this.date_issued,
            recipient: this.recipient.id,
            issuer: this.issuer.id,
            description: this.description,
            amount: this.amount,
            is_archive: false,
          },
        ]);
        if (error) {
          throw error;
        } else {
          console.log(data);
          this.loading = false;
          this.success();
          storeViewVoucher.fetchListOfVouchers();
        }
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    },

    async getCurrentUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      this.employee_id = user.id;
    },

    async fetchReferenceData() {
      try {
        const { data, error } = await supabase
          .from("employee")
          .select("id, first_name, middle_name, last_name");
        if (error) {
          throw error;
        } else {
          this.recipientOptions = data;
          this.issuerOptions = data;
          // console.table(data);
        }
      } catch (error) {
        console.log(error);
      }
    },
    success() {
      Notify.create({
        icon: "done",
        color: "positive",
        message: "Added Voucher Successfully!",
      });
    },
  },
});
