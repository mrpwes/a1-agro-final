import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";
import { useAuthenticationStore } from "../../authentication.js";
import { useViewLoan } from "./viewLoan.js";

const storeAuthentication = useAuthenticationStore();
const storeViewLoan = useViewLoan();
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

    disableButtonExisting: false,
  }),

  getters: {},
  actions: {
    async getDetails() {
      try {
        const { data, error } = await supabase.from("employee").select();
        if (error) {
          throw error;
        } else {
          // console.log("employee", data);
          this.employeeOptions = data;
        }
      } catch (error) {
        // alert(error + "line 33");
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
        .then(() => {
          this.resetForm();
        })
        .then(() => {
          storeViewLoan.getLoanList();
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
              is_archive: false,
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
              employee_id: this.employeeOption.id,
              amount: this.amount,
              balance: this.amount,
              emp_id_modified_by: this.employee_id,
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
              employee_id: this.employeeOption.id,
              amount: this.amount,
              balance: this.amount,
              emp_id_modified_by: this.employee_id,
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

    async checkValidity() {
      try {
        if (this.type == "Partial to A/R") {
          const { data, error } = await supabase
            .from("partial_to_ar")
            .select()
            .eq("employee_id", this.employeeOption.id);

          if (data.length > 0) {
            alert("Employee already has an existing Partial To A/R");
            this.disableButtonExisting = true;
          } else {
            this.disableButtonExisting = false;
          }
          if (error) {
            throw error;
          } else {
            console.log("data ar", data);
          }
        } else if (this.type == "Vale") {
          const { data, error } = await supabase
            .from("vale")
            .select()
            .eq("employee_id", this.employeeOption.id);

          if (data.length > 0) {
            alert("Employee already has an existing vale");
            this.disableButtonExisting = true;
          } else {
            this.disableButtonExisting = false;
          }
          if (error) {
            throw error;
          } else {
            console.log("data vale", data);
          }
        } else {
          this.disableButtonExisting = false;
        }
      } catch (error) {
        alert(error + "line 142");
        console.log(error);
      }
    },

    resetForm() {
      this.employeeOption = null;
      this.type = null;
      this.description = null;
      this.amount = null;
    },
  },
});
