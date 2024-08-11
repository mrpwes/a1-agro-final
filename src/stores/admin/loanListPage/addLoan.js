import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";
import { useAuthenticationStore } from "../../authentication.js";

const storeAuthentication = useAuthenticationStore();
export const useAddLoan = defineStore("addLoan", {
  state: () => ({
    employee_id: storeAuthentication.getEmployeeId,

    employeeOption: null,
    employeeOptions: null,
    type: null,
    typeOptions: ["Vale", "Partial to A/R"],
    description: null,
    amount: null,

    insertRequestConfirmationID: null,
    insertRequestID: null,
  }),

  getters: {},
  actions: {
    async getDetails() {
      try {
        const { data, error } = await supabase.from("employee").select();
        if (error) {
          throw error;
        } else {
          console.log("employee", data);
          this.employeeOptions = data;
        }
      } catch (error) {
        alert(error + "line 33");
        console.log(error);
      }
    },
    addLoan() {
      this.insertRequestConfirmation()
        .then(() => {
          return this.insertRequest();
        })
        .then(() => {
          return this.insertCompanyLoan();
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
    },

    async insertRequestConfirmation() {
      try {
        const { data, error } = await supabase
          .from("request_confirmation")
          .insert([
            {
              employee_id: this.employee_id,
              application_date: new Date().toLocaleDateString("en-US"),
              request_confirmation_date: new Date().toLocaleDateString("en-US"),
              status: "Approved",
              remarks: "Approved",
              is_active: false,
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
        alert(error + "line 66");
        console.log(error);
      }
    },

    async insertRequest() {
      try {
        const { data, error } = await supabase
          .from("request")
          .insert([
            {
              employee_id: this.employeeOption.id,
              request_type_id: this.type == "Vale" ? 1 : 2,
              request_confirmation_id: this.insertRequestConfirmationID,
              request_date: new Date().toLocaleDateString("en-US"),
              description: this.description,
              remarks: "Pending",
              is_active: true,
            },
          ])
          .select("id");
        if (error) {
          throw error;
        } else {
          console.log("Insert Request ID", data[0].id);
          this.insertRequestID = data[0].id;
        }
      } catch (error) {
        alert(error + "line 94");
        console.log(error);
      }
    },

    async insertCompanyLoan() {
      try {
        if (this.type == "Vale") {
          const { data, error } = await supabase.from("vale").insert([
            {
              request_id: this.insertRequestID,
              amount: this.amount,
              date: new Date().toLocaleDateString("en-US"),
              is_archive: false,
            },
          ]);
          if (error) {
            throw error;
          } else {
            console.log("data", data);
          }
        } else {
          const { data, error } = await supabase.from("partial_to_ar").insert([
            {
              request_id: this.insertRequestID,
              amount: this.amount,
              date: new Date().toLocaleDateString("en-US"),
              is_archive: false,
            },
          ]);
          if (error) {
            throw error;
          } else {
            console.log("data", data);
          }
        }
      } catch (error) {
        alert(error + "line 131");
        console.log(error);
      }
    },
  },
});
