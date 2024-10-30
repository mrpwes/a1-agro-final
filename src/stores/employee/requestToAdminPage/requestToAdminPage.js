import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";
import { useAuthenticationStore } from "../../authentication.js";
import { useGlobalNotificationStore } from "stores/globalNotification";
const globalNotificationStore = useGlobalNotificationStore();

const storeAuthentication = useAuthenticationStore();

export const useRequestToAdminPage = defineStore("requestToAdminPage", {
  state: () => ({
    request_type_id: 0,
    // request_approval_status_id: 0,
    request_subject: "",
    request_description: "",
    request_file_attachment: "",
    request_application_date: "",

    admin_employee_id: 0,
    admin_comments: "",
    admin_confirmation_date: "",
    change_date: "",

    viewPrompt: false,

    requestTypeOption: null,
    requestTypeOptions: [],

    rows: [],

    columns: [
      {
        name: "id",
        align: "center",
        label: "Request ID",
        field: (row) => row.id,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "request_type_name",
        align: "center",
        label: "Request Type",
        field: (row) => row.request_type_id.request_type_name,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "Subject",
        align: "center",
        label: "Subject",
        field: (row) => row.request_subject,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "Description",
        align: "center",
        label: "Description",
        field: (row) => row.request_description,
        format: (val) => `${val}`,
        sortable: true,
      },

      {
        name: "Application Date",
        align: "center",
        label: "Application Date",
        field: (row) => row.request_application_date,
        format: (val) => `${val}`,
        sortable: true,
      },
    ],

    dateList: [{}],
    selectedDate: "", // Data property for the date input
  }),
  getters: {
    getUnarchiveRows() {
      return this.rows.filter((row) => row.is_archive === false);
    },
  },
  actions: {
    addField(value, fieldType) {
      this.dateList.push({});
    },
    removeField(index, fieldType) {
      this.dateList.splice(index, 1);
    },

    async addRequestToAdminPage() {
      try {
        const { data, error } = await supabase.from("request").insert({
          request_subject: this.request_subject,
          request_description: this.request_description,
          // request_file_attachment: this.request_file_attachment,
          request_application_date: new Date(),
          request_type_id: this.requestTypeOption.id,
          request_approval_status_id: 1,
          request_employee_id: storeAuthentication.getEmployeeId,
          is_archive: false,
          request_contents: this.dateList,
        });
        if (error) {
          throw error;
        }
        this.resetForm();
        this.viewPrompt = false;
        globalNotificationStore.showSuccessNotification(
          "Request sent successfully"
        );
      } catch (error) {
        console.error("error", error);
        globalNotificationStore.showErrorNotification(
          "Failed to send request. Please try again later."
        );
      }
    },

    async getRequestTypeOptions() {
      const { data, error } = await supabase
        .from("request_type")
        .select("*")
        .in("id", ["3"]);
      if (error) {
        console.error("error", error);
      }
      this.requestTypeOptions = data;
    },

    resetForm() {
      this.request_subject = "";
      this.request_description = "";
      this.request_file_attachment = "";
      this.request_application_date = "";
      this.requestTypeOption = null;
    },

    async getRequestList() {
      const { data, error } = await supabase
        .from("request")
        .select("*, request_type_id(*), request_approval_status_id(*)")
        .eq("request_employee_id", storeAuthentication.getEmployeeId)
        .order("request_application_date", { ascending: false });

      this.rows = data;
    },
  },
});
