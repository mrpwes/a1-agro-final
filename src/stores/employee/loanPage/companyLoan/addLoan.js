import { defineStore } from "pinia";
import { supabase } from "../../../../lib/supabaseClient.js";
import { useAuthenticationStore } from "../../../authentication.js";
import { useViewLoan } from "./viewLoan.js";
import { useGlobalNotificationStore } from "stores/globalNotification";

const globalNotificationStore = useGlobalNotificationStore();

const storeAuthentication = useAuthenticationStore();
const storeViewLoan = useViewLoan();

export const useAddLoan = defineStore("emp_addLoan", {
  state: () => ({
    admin_employee_id: storeAuthentication.getEmployeeId,

    employeeOption: null,
    employeeOptions: null,

    type: null,
    typeOptions: null,

    subject: null,

    description: null,
    amount: null,

    insertRequestID: null,

    disableButtonExisting: false,
    addLoanDialog: false,
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
          this.employeeOptions = data;
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

    async insertRequestForm() {
      try {
        const { data, error } = await supabase
          .from("request")
          .insert({
            request_employee_id: this.employeeOption.id,
            request_type_id: this.type.id,
            request_subject: this.subject,
            request_description: this.description,
            request_application_date: new Date().toLocaleDateString("en-US"),

            admin_employee_id: this.admin_employee_id,
            request_approval_status_id: 2,

            admin_comments: "Approved",
            admin_confirmation_date: new Date().toLocaleDateString("en-US"),
            change_date: new Date().toLocaleDateString("en-US"),
            is_archive: false,
          })
          .select("id");
        if (error) {
          throw error;
        }
        // console.log(data);
        this.insertRequestID = data[0].id;
        this.insertCompanyLoan();
      } catch (error) {
        console.log(error);
      }
    },

    async insertCompanyLoan() {
      try {
        if (this.type.id == 1) {
          const { error } = await supabase.from("vale").insert([
            {
              request_id: this.insertRequestID,
              employee_id: this.employeeOption.id,
              amount: this.amount,
              balance: this.amount,
              emp_id_modified_by: this.admin_employee_id,
              date: new Date().toLocaleDateString("en-US"),
              is_archive: false,
            },
          ]);

          if (error) {
            throw error;
          }
        } else if (this.type.id == 2) {
          const { error } = await supabase.from("partial_to_ar").insert([
            {
              request_id: this.insertRequestID,
              employee_id: this.employeeOption.id,
              amount: this.amount,
              balance: this.amount,
              emp_id_modified_by: this.admin_employee_id,
              date: new Date().toLocaleDateString("en-US"),
              is_archive: false,
            },
          ]);
          if (error) {
            throw error;
          }
        }
        this.addLoanDialog = false;
        storeViewLoan.getLoanList();
        console.log("SUCCESSFULLY ADDED LOAN");
        globalNotificationStore.showSuccessNotification(
          "Successfully added loan"
        );
      } catch (error) {
        globalNotificationStore.showErrorNotification(
          "Failed to add loan. Please try again."
        );
      }
    },
  },
});
