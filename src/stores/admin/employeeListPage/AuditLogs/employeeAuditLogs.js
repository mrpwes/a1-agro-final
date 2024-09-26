import { defineStore } from "pinia";
import { format } from "date-fns";
import { supabase } from "../../../../lib/supabaseClient.js";

export const useEmployeeAuditLogs = defineStore("employeeAuditLogs", {
  state: () => ({
    selectedRow: null,
    logs: [],
    formattedLogs: [],
    employeeAuditColumns: {
      columns: [
        {
          name: "audit_id",
          align: "center",
          label: "Audit ID",
          sortable: true,
          field: (row) => {
            row.audit_id;
          },
          format: (val) => `${val}`,
        },
        {
          name: "operation_type",
          align: "center",
          label: "Operation Type",
          sortable: true,
          field: (row) => {
            return row.operation_type;
          },
          format: (val) => `${val}`,
        },
        {
          name: "changes",
          align: "center",
          label: "Changes",
          sortable: true,
          field: (row) => {
            row.changes;
          },
          format: (val) => `${val}`,
        },
        {
          name: "modified_by",
          align: "center",
          label: "Modified By",
          sortable: true,
          field: (row) => {
            row.modified_by;
          },
          format: (val) => `${val}`,
        },
        {
          name: "timestamp",
          align: "center",
          label: "Timestamp",
          sortable: true,
          field: (row) => {
            row.timestamp;
          },
          format: (val) => `${val}`,
        },
      ],
    },
  }),

  getters: {},
  actions: {
    async callLogs() {
      await this.getEmployeeAuditLogs();
      await this.getPhilhealthContrib();
      await this.getSSSContrib();
      await this.getPagibigContrib();
      await this.getIncomeTaxContrib();
      this.transformLogs(this.logs);
    },

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
        data.forEach((record) => {
          record.table_name = "Employee"; // Add the new field
        });

        console.log(data);
        this.logs.push(...data);
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
        data.forEach((record) => {
          record.table_name = "PhilHealth"; // Add the new field
        });

        console.log(data);
        this.logs.push(...data);
      } catch (error) {
        console.log("Error", error);
      }
    },

    async getSSSContrib() {
      try {
        const { data, error } = await supabase
          .from("emp_sss_contrib_audit")
          .select(
            "*, modified_by:employee!emp_sss_contrib_audit_emp_id_modified_by_fkey(first_name, last_name, company_employee_id)"
          )
          .eq("employee_id", this.selectedRow.id);

        if (error) {
          // console.log(selectedRow);
          throw error;
        }
        data.forEach((record) => {
          record.table_name = "SSS"; // Add the new field
        });

        console.log(data);
        this.logs.push(...data);
      } catch (error) {
        console.log("Error", error);
      }
    },

    async getPagibigContrib() {
      try {
        const { data, error } = await supabase
          .from("emp_pagibig_contrib_audit")
          .select(
            "*, modified_by:employee!emp_pagibig_contrib_audit_emp_id_modified_by_fkey(first_name, last_name, company_employee_id)"
          )
          .eq("employee_id", this.selectedRow.id);

        if (error) {
          // console.log(selectedRow);
          throw error;
        }
        data.forEach((record) => {
          record.table_name = "Pag-IBIG"; // Add the new field
        });

        console.log(data);
        this.logs.push(...data);
      } catch (error) {
        console.log("Error", error);
      }
    },

    async getIncomeTaxContrib() {
      try {
        const { data, error } = await supabase
          .from("emp_incometax_contrib_audit")
          .select(
            "*, modified_by:employee!emp_incometax_contrib_audit_emp_id_modified_by_fkey(first_name, last_name, company_employee_id)"
          )
          .eq("employee_id", this.selectedRow.id);

        if (error) {
          // console.log(selectedRow);
          throw error;
        }
        data.forEach((record) => {
          record.table_name = "Income Tax"; // Add the new field
        });

        console.log(data);
        this.logs.push(...data);
      } catch (error) {
        console.log("Error", error);
      }
    },

    transformLogs(auditLogs) {
      const formattedLogs = [];

      // Create a map to store the last seen values for each employee_id
      const lastSeen = {};

      auditLogs.forEach((log) => {
        const {
          audit_id,
          operation_type,
          employee_id,
          change_timestamp,
          modified_by,
          table_name,
        } = log;

        // Initialize the changes object
        const changes = {};

        // Check if we have seen this employee_id before
        if (lastSeen[employee_id]) {
          const previousLog = lastSeen[employee_id];

          // Compare current log with the previous log to find changes
          for (const key in log) {
            if (
              key !== "audit_id" &&
              key !== "operation_type" &&
              key !== "employee_id" &&
              key !== "change_timestamp" &&
              key !== "modified_by" &&
              key !== "table_name"
            ) {
              if (log[key] !== previousLog[key]) {
                changes[key] = {
                  current: log[key],
                  previous: previousLog[key],
                };
              }
            }
          }
        }

        // Update the last seen log for this employee_id
        lastSeen[employee_id] = log;

        // Only add to formattedLogs if there are actual changes
        if (Object.keys(changes).length > 0) {
          formattedLogs.push({
            audit_id,
            changes,
            modified_by,
            operation_type,
            table_name,
            timestamp: format(
              new Date(change_timestamp),
              "MMMM dd yyyy hh:mm a"
            ),
          });
        }
      });

      this.formattedLogs = formattedLogs;
    },

    reset() {
      this.selectedRow = null;
      this.logs = [];
      this.formattedLogs = [];
    },
  },
});
