import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";
import { useAuthenticationStore } from "../../authentication.js";

const storeAuthentication = useAuthenticationStore();

export const useAddApprovalStore = defineStore("addApproval", {
  state: () => ({
    recipient: null,
    recipientOptions: null,
    issuer: null,
    issuerOptions: null,

    type: null,
    typeOptions: ["LeaveTODO!!!!", "Other"],

    subject: null,
    description: null,

    current_user_id: storeAuthentication.getEmployeeId,
    insertRequestConfirmationID: null,
  }),

  getters: {},

  actions: {
    async fetchEmployeeOptions() {
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
        }
      } catch (error) {
        console.log(error);
      }
    },

    insertRequestForm() {
      this.insertRequestConfirmation()
        .then(() => {
          return this.insertRequestFormToRequest();
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
    },

    async insertRequestFormToRequest() {
      try {
        const { error } = await supabase.from("request").insert([
          {
            employee_id: this.recipient.id,
            request_type_id: 3,
            request_confirmation_id: this.insertRequestConfirmationID,
            request_date: new Date().toLocaleDateString("en-US"),
            subject: this.subject,
            description: this.description,
            remarks: "Pending",
            is_archive: false,
          },
        ]);
        if (error) {
          throw error;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async insertRequestConfirmation() {
      try {
        const { data, error } = await supabase
          .from("request_confirmation")
          .insert([
            {
              employee_id: this.current_user_id,
              application_date: new Date().toLocaleDateString("en-US"),
              request_confirmation_date: new Date().toLocaleDateString("en-US"),
              status: "Pending",
              remarks: "Pending",
              is_archive: false,
            },
          ])
          .select("id");
        if (error) {
          throw error;
        } else {
          console.log(data[0].id);
          this.insertRequestConfirmationID = data[0].id;
        }
      } catch (error) {
        alert(error + "line 81");
        console.log(error);
      }
    },
  },
});
