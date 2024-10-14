import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";

export const usePhilhealthTableStore = defineStore("philhealthTable", {
  state: () => ({
    rows: [],
    columns: [
      {
        name: "employeeId",
        required: true,
        label: "Emp. Id",
        field: (row) => row.employee.company_employee_id,
        align: "left",
        sortable: true,
      },
      {
        name: "employeeName",
        align: "center",
        label: "Name",
        field: (row) =>
          row.employee.last_name +
          " " +
          row.employee.first_name +
          " " +
          row.employee.middle_name,
        sortable: true,
        classes: "!tw-bg-neutral-300",
      },
      {
        name: "philhealthNumber",
        align: "center",
        label: "PhilHealth No.",
        field: (row) => row.employee.phil_health_number,
        sortable: true,
        classes: "!tw-bg-neutral-300",
      },
      {
        name: "employeeShare",
        align: "center",
        label: "Employee Share",
        field: (row) => row.amount,
        sortable: true,
        classes: "!tw-bg-neutral-300",
      },
      {
        name: "employerShare",
        align: "center",
        label: "Employer Share",
        field: (row) => row.amount,
        sortable: true,
        classes: "!tw-bg-neutral-300",
      },
    ],

    selectedDate: null,
    selectedDateOptions: null,

    employeeIds: [],

    philhealthAudit: [],
    philhealthContributionTableAudit: [],
  }),

  getters: {
    getSelectedDate() {
      return this.selectedDate;
    },
    getTotalEmployeeShare() {
      let totalAmount = 0;

      this.philhealthAudit.forEach((item) => {
        totalAmount += item.amount;
      });

      return totalAmount;
    },
  },

  actions: {
    capitalizeFirstLetterOfEachWord(str) {
      return str
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    getEmployeeIds(data) {
      return data.map((employee) => employee.employee_id);
    },

    getAndCheckDateRangesForCurrentMonth() {
      const today = new Date();

      const year = today.getFullYear();
      const month = today.getMonth(); // Months are 0-indexed in JavaScript (0 = January, 11 = December)

      const firstDayOfMonth = new Date(year, month, 1);

      const fifteenthDayOfMonth = new Date(year, month, 15);

      const sixteenthDayOfMonth = new Date(year, month, 16);

      const lastDayOfMonth = new Date(year, month + 1, 0);

      const dateRanges = {
        firstHalf: {
          start: this.formatDate(firstDayOfMonth),
          end: this.formatDate(fifteenthDayOfMonth),
        },
        secondHalf: {
          start: this.formatDate(sixteenthDayOfMonth),
          end: this.formatDate(lastDayOfMonth),
        },
      };

      const todayDate = this.formatDate(today);

      const firstHalfStart = new Date(dateRanges.firstHalf.start);
      const firstHalfEnd = new Date(dateRanges.firstHalf.end);
      const secondHalfStart = new Date(dateRanges.secondHalf.start);
      const secondHalfEnd = new Date(dateRanges.secondHalf.end);

      let startDate;
      let endDate;

      if (today >= firstHalfStart && today <= firstHalfEnd) {
        startDate = this.formatDate(firstHalfStart);
        endDate = this.formatDate(firstHalfEnd);
      } else if (today >= secondHalfStart && today <= secondHalfEnd) {
        startDate = this.formatDate(secondHalfStart);
        endDate = this.formatDate(secondHalfEnd);
      } else {
        startDate = "out of range";
        endDate = "out of range";
      }
      return {
        todayDate,
        startDate,
        endDate,
      };
    },

    async getSalaryHistory() {
      try {
        const { data, error } = await supabase.from("salary_history").select();
        if (error) {
          console.error(error);
        }
        this.selectedDateOptions = data.sort(
          (a, b) => new Date(a.date_start) - new Date(b.date_start)
        );
      } catch (error) {
        console.error(error);
      }
    },

    filterHighestAuditId(data) {
      // Create a map to hold the highest audit_id for each employee_id
      const highestAuditIdMap = data.reduce((acc, curr) => {
        const { employee_id, audit_id } = curr;
        if (!acc[employee_id] || acc[employee_id].audit_id < audit_id) {
          acc[employee_id] = curr; // Store the object with the highest audit_id
        }
        return acc;
      }, {});

      // Convert the map back to an array
      return Object.values(highestAuditIdMap);
    },

    getHighestAuditId(auditRecords) {
      // Check if the input array is empty
      if (auditRecords.length === 0) {
        return null; // or you can return an empty object or any other value as per your requirement
      }

      // Use the reduce method to find the record with the highest audit_id
      const highestRecord = auditRecords.reduce((maxRecord, currentRecord) => {
        return currentRecord.audit_id > maxRecord.audit_id
          ? currentRecord
          : maxRecord;
      });

      return highestRecord;
    },

    async fetchEmployeeInRange(
      // dateStart = this.selectedDate.date_start,
      dateEnd = this.selectedDate.date_end
    ) {
      try {
        const { data, error } = await supabase
          .from("employee_audit") // Replace with your table name
          .select(`*`) // Select all columns or specify the columns you need
          // .gte("change_date", dateStart) // Greater than or equal to dateStart
          .lte("change_date", dateEnd) // Less than or equal to dateEnd
          .eq("is_archive", false); // Equal to false

        if (error) {
          console.error(error);
        }
        this.rows = this.filterHighestAuditId(data);
        this.employeeIds = this.getEmployeeIds(this.rows);
        // console.log(data);
      } catch (error) {
        console.error(error);
      }
    },

    async fetchPhilhealthContribAudit(
      // dateStart = this.selectedDate.date_start,
      dateEnd = this.selectedDate.date_end
    ) {
      try {
        const { data, error } = await supabase
          .from("emp_philhealth_contrib_audit") // Replace with your table name
          .select(
            `*, employee!emp_philhealth_contrib_audit_employee_id_fkey(last_name, first_name, middle_name, company_employee_id, phil_health_number)`
          ) // Select all columns or specify the columns you need
          // .gte("change_date", dateStart) // Greater than or equal to dateStart
          .lte("change_date", dateEnd) // Less than or equal to dateEnd
          .in("employee_id", this.employeeIds); // Equal to false
        if (error) {
          console.error(error);
        }
        this.philhealthAudit = this.filterHighestAuditId(data);
        // console.log(data);
        // console.log(this.employeeIds);
      } catch (error) {
        console.error(error);
      }
    },

    async fetchPhilhealthContributionTableAudit(
      // dateStart = this.selectedDate.date_start,
      dateEnd = this.selectedDate.date_end
    ) {
      try {
        const { data, error } = await supabase
          .from("philhealth_contribution_table_audit") // Replace with your table name
          .select(`*`) // Select all columns or specify the columns you need
          // .gte("change_date", dateStart) // Greater than or equal to dateStart
          .lte("change_date", dateEnd); // Less than or equal to dateEnd
        if (error) {
          console.error(error);
        }
        this.philhealthContributionTableAudit = this.getHighestAuditId(data);
        // console.log(data);
      } catch (error) {
        console.error(error);
      }
    },

    getNearestDateRange() {
      if (this.selectedDate != null) {
        return;
      }
      const today = new Date();

      function parseDate(dateStr) {
        return new Date(dateStr);
      }

      function getDistance(date) {
        return Math.abs(today - date);
      }

      let nearestRange = null;
      let minDistance = Infinity;

      for (const range of this.selectedDateOptions) {
        const startDate = parseDate(range.date_start);
        const endDate = parseDate(range.date_end);

        const distanceToStart = getDistance(startDate);
        const distanceToEnd = getDistance(endDate);

        const nearestDistance = Math.min(distanceToStart, distanceToEnd);

        if (nearestDistance < minDistance) {
          minDistance = nearestDistance;
          nearestRange = range;
        }
      }
      this.selectedDate = nearestRange;
    },

    async fetchEmployeeReports() {
      // console.log("Called fetchEmployeeReports");
      await this.getSalaryHistory();
      await this.getNearestDateRange();
      await this.fetchEmployeeInRange();
      await this.fetchPhilhealthContribAudit();
      await this.fetchPhilhealthContributionTableAudit();
    },
  },
});
