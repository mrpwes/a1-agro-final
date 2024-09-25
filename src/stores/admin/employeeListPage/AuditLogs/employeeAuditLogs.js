import { defineStore } from "pinia";
import { supabase } from "../../../../lib/supabaseClient.js";

export const useEmployeeAuditLogs = defineStore("employeeAuditLogs", {
  state: () => ({
    selectedRow: null,
    logs: [],
    formattedLogs: [],
  }),

  getters: {},
  actions: {
    async getEmployeeAuditLogs() {
      try {
        const { data, error } = await supabase
          .from("employee_audit")
          .select(
            "*, modified_by:employee!employee_audit_emp_id_modified_by_fkey(first_name, last_name, company_employee_id)"
          )
          .eq("employee_id", this.selectedRow.id);

        if (error) {
          // console.log(selectedRow);
          throw error;
        }

        this.logs = data;
        await this.getPhilhealthContrib();
        this.getChangedValues(this.logs);
      } catch (error) {
        console.log("Error", error);
      }
    },

    async getPhilhealthContrib() {
      try {
        const { data, error } = await supabase
          .from("emp_philhealth_contrib_audit")
          .select(
            "*, modified_by:employee!emp_philhealth_contrib_audit_emp_id_modified_by_fkey(first_name, last_name, company_employee_id)"
          )
          .eq("employee_id", this.selectedRow.id);

        if (error) {
          // console.log(selectedRow);
          throw error;
        }

        this.logs.push(...data);
        // this.getChangedValues(this.logs);
      } catch (error) {
        console.log("Error", error);
      }
    },

    getChangedValues(auditLogs) {
      const changes = [];

      const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { month: "long", day: "2-digit", year: "numeric" };
        const formattedDate = date.toLocaleDateString("en-US", options);
        const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
        const minutes = String(date.getMinutes()).padStart(2, "0"); // Ensure two digits
        const ampm = date.getHours() >= 12 ? "PM" : "AM"; // Determine AM/PM

        return `${formattedDate} ${hours}:${minutes} ${ampm}`;
      };

      for (let i = 0; i < auditLogs.length; i++) {
        const current = auditLogs[i];

        if (current.operation_type === "INSERT") {
          // Log the initial values for the INSERT operation
          const initialValues = {};
          for (const key in current) {
            if (
              key !== "audit_id" &&
              key !== "operation_type" &&
              key !== "change_timestamp"
            ) {
              initialValues[key] = {
                previous: null,
                current: current[key],
              };
            }
          }
          changes.push({
            audit_id: current.audit_id,
            operation_type: current.operation_type,
            timestamp: formatDate(current.change_timestamp),
            changes: initialValues,
          });
        } else if (current.operation_type === "UPDATE") {
          const previous = auditLogs[i - 1];
          const changed = {};
          for (const key in current) {
            if (
              key !== "audit_id" &&
              key !== "operation_type" &&
              key !== "change_timestamp"
            ) {
              if (current[key] !== previous[key]) {
                changed[key] = {
                  previous: previous[key],
                  current: current[key],
                };
              }
            }
          }
          if (Object.keys(changed).length > 0) {
            changes.push({
              audit_id: current.audit_id,
              operation_type: current.operation_type,
              timestamp: formatDate(current.change_timestamp),
              modified_by:
                (current.modified_by?.first_name ?? "") +
                " " +
                (current.modified_by?.last_name ?? "") +
                " " +
                (current.modified_by?.company_employee_id ?? "") +
                "",
              changes: changed,
            });
          }
        }
      }

      this.formattedLogs = changes;
    },

    reset() {
      this.selectedRow = null;
      this.logs = [];
      this.formattedLogs = [];
    },
  },
});
