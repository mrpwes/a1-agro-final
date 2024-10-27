import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";
import { useViewVoucherStore } from "./viewVoucher.js";
import { useAuthenticationStore } from "stores/authentication.js";
import { useGlobalNotificationStore } from "stores/globalNotification";
const globalNotificationStore = useGlobalNotificationStore();

const authenticationStore = useAuthenticationStore();

const storeViewVoucher = useViewVoucherStore();

export const useAddVoucherStore = defineStore("addVoucher", {
  state: () => ({
    currentEmployeeID: authenticationStore.getEmployeeId,
    type: null,
    date_issued: null,
    recipient: null,
    recipientOptions: [],
    issuer: null,
    issuerOptions: [],
    description: null,
    amount: null,
    addVoucherDialog: false,
  }),

  getters: {},

  actions: {
    async addVoucherData() {
      try {
        const { data, error } = await supabase.from("voucher").insert([
          {
            admin_employee_id: this.currentEmployeeID,
            subject: this.subject,
            description: this.description,
            date_issued: this.date_issued,
            recipient: this.recipient.id,
            issuer: this.issuer.id,
            amount: this.amount,
            is_archive: false,
          },
        ]);
        if (error) {
          throw error;
        } else {
          console.log(data);
          this.addVoucherDialog = false;
          globalNotificationStore.showSuccessNotification(
            "Voucher added successfully"
          );
          storeViewVoucher.fetchListOfVouchers();
          this.resetForm();
        }
      } catch (error) {
        globalNotificationStore.showErrorNotification(
          "Error: " + error.message
        );
        this.resetForm();
      }
    },

    resetForm() {
      this.subject = null;
      this.description = null;
      this.date_issued = null;
      this.recipient = null;
      this.issuer = null;
      this.amount = null;
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
          .select(
            "id, company_employee_id, first_name, middle_name, last_name"
          );
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
  },
});
