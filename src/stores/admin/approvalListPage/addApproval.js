import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";
import { useAuthenticationStore } from "../../authentication.js";
// import { request } from "express";

const storeAuthentication = useAuthenticationStore();

export const useAddApprovalStore = defineStore("addApproval", {
  state: () => ({
    recipient: null,
    recipientOptions: null,
    issuer: null,
    issuerOptions: null,

    type: null,
    typeOptions: null,

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

    async fetchRequestTypeOptions() {
      try {
        const { data, error } = await supabase
          .from("request_type")
          .select("id, request_type_name");
        if (error) {
          throw error;
        }
        this.typeOptions = data;
      } catch (error) {
        console.log(error);
      }
    },

    // insertRequestForm() {
    //   this.insertRequestConfirmation()
    //     .then(() => {
    //       return this.insertRequestFormToRequest();
    //     })
    //     .catch((error) => {
    //       console.error("An error occurred:", error);
    //     });
    // },

    // async insertRequestFormToRequest() {
    //   try {
    //     const { error } = await supabase.from("request").insert([
    //       {
    //         employee_id: this.recipient.id,
    //         request_type_id: 3,
    //         request_confirmation_id: this.insertRequestConfirmationID,
    //         request_date: new Date().toLocaleDateString("en-US"),
    //         subject: this.subject,
    //         description: this.description,
    //         remarks: "Pending",
    //         is_archive: false,
    //       },
    //     ]);
    //     if (error) {
    //       throw error;
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },

    // async insertRequestConfirmation() {
    //   try {
    //     const { data, error } = await supabase
    //       .from("request_confirmation")
    //       .insert([
    //         {
    //           employee_id: this.current_user_id,
    //           application_date: new Date().toLocaleDateString("en-US"),
    //           request_confirmation_date: new Date().toLocaleDateString("en-US"),
    //           status: "Pending",
    //           remarks: "Pending",
    //           is_archive: false,
    //         },
    //       ])
    //       .select("id");
    //     if (error) {
    //       throw error;
    //     } else {
    //       console.log(data[0].id);
    //       this.insertRequestConfirmationID = data[0].id;
    //     }
    //   } catch (error) {
    //     alert(error + "line 81");
    //     console.log(error);
    //   }
    // },

    async insertRequestForm() {
      try {
        const { data, error } = await supabase.from("request").insert([
          {
            // employee_id: this.recipient.id,
            // request_type_id: 3,
            // request_confirmation_id: this.insertRequestConfirmationID,
            // request_date: new Date().toLocaleDateString("en-US"),
            // subject: this.subject,
            // description: this.description,
            // remarks: "Pending",
            // is_archive: false,

            // id: autoGenerated,
            request_employee_id: this.recipient.id,
            request_type_id: this.type.id,
            request_date: new Date().toLocaleDateString("en-US"),
            request_subject: this.subject,
            request_description: this.description,
            request_application_date: new Date().toLocaleDateString("en-US"),

            admin_employee_id: this.issuer.id,
            admin_approval_status: "Pending",

            admin_comments: "Pending",
            admin_confirmation_date: new Date().toLocaleDateString("en-US"),
            change_date: new Date().toLocaleDateString("en-US"),
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
  },
});
