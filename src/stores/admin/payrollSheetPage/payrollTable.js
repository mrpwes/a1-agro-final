import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";

export const usePayrollTableStore = defineStore("payrollTable", {
  state: () => ({
    payrollColumns: {
      columns: [
        {
          name: "employeeId",
          required: true,
          label: "Emp. Id",
          align: "left",
          sortable: true,
        },
        {
          name: "employeeName",
          align: "center",
          label: "Name",
          sortable: true,
          classes: "!tw-bg-neutral-300",
        },
        {
          name: "noDaysWorked",
          align: "center",
          label: "Days Worked",
          sortable: true,
        },
        {
          name: "ratePerDay",
          align: "center",
          label: "Rate/Day",
          classes: "!tw-bg-neutral-300",
        },
        {
          name: "total",
          align: "center",
          label: "Total",
          sortable: true,
        },
        {
          name: "sss",
          align: "center",
          label: "SSS",
          sortable: true,
          classes: "!tw-bg-neutral-300",
        },
        {
          name: "philHealth",
          align: "center",
          label: "PhilHealth",
          sortable: true,
        },
        {
          name: "pagIbig",
          align: "center",
          label: "PagIBIG",
          sortable: true,
          classes: "!tw-bg-neutral-300",
        },
        {
          name: "sssCalamityLoan",
          align: "center",
          label: "SSS Calamity Loan",
          sortable: true,
        },
        {
          name: "sssLoan",
          align: "center",
          label: "SSS  Loan",
          sortable: true,
          classes: "!tw-bg-neutral-300",
        },
        {
          name: "pagIbigLoan",
          align: "center",
          label: "Pag-IBIG Loan",
          sortable: true,
          headerStyle: "width: 0px",
        },
        {
          name: "VALE",
          align: "center",
          label: "VALE",
          sortable: true,
          classes: "!tw-bg-neutral-300",
        },
        {
          name: "AR",
          align: "center",
          label: "AR",
          sortable: true,
        },
        {
          name: "NetPay",
          align: "center",
          label: "NetPay",
          sortable: true,

          classes: "!tw-bg-neutral-300",
        },
        {
          name: "overVale",
          align: "center",
          label: "Over VALE",
          sortable: true,
        },
        {
          name: "actions",
          align: "center",
          label: "",
        },
      ],
    },
    // rows: [
    //   {
    //     employeeId: "001",
    //     employeeName: "John Doe",
    //     noDaysWorked: 15.0,
    //     ratePerDay: 383.33,

    //     sss: 517.5,
    //     philHealth: 230.0,
    //     pagIbig: 0,
    //     sssCalamityLoan: 507.59,
    //     sssLoan: 969.04,
    //     pagIbigLoan: 0,
    //     VALE: 0,
    //     AR: 1500,
    //     productLoan: 0,

    //     overVale: 900,
    //     isPrinted: false,
    //   },
    // ],
    rows: [],

    selectedDate: null,
    selectedDateOptions: null,
  }),

  getters: {},
  actions: {
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
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
        this.selectedDateOptions = data;
      } catch (error) {
        console.error(error);
      }
    },

    async fetchAttendanceInRange(
      dateStart = this.selectedDate.date_start,
      dateEnd = this.selectedDate.date_end
    ) {
      try {
        const { data, error } = await supabase
          .from("attendance") // Replace with your table name
          .select(
            `
            *,
            employee:employee_id (
              first_name,
              last_name,
              middle_name,
              company_employee_id,
              rate_per_day
            ),
            adjustment_salary (
              id, 
              date_start,
              date_end,
              deductions (
                id,
                date_start,
                date_end,
                emp_philhealth_contrib ( id, amount, update_datetime),
                emp_sss_contrib ( id, amount, update_datetime),
                emp_pagibig_contrib ( id, amount, update_datetime),
                emp_incometax_contrib ( id, amount, update_datetime)
              )
            )
          `
          ) // Select all columns or specify the columns you need
          .gte("date", dateStart) // Greater than or equal to dateStart
          .lte("date", dateEnd); // Less than or equal to dateEnd

        if (error) {
          console.error("Error fetching data:", error);
        } else {
          console.log(data);
          const groupedByEmployeeId = data.reduce((acc, item) => {
            if (!acc[item.employee_id]) {
              acc[item.employee_id] = [];
            }
            acc[item.employee_id].push(item);
            return acc;
          }, {});

          // Convert the grouped object into an array of arrays (optional)
          // console.log(JSON.stringify(groupedByEmployeeId));
          this.rows = Object.values(groupedByEmployeeId);
        }
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

    async fetchAttendanceReports() {
      this.rows = [];
      console.log("fetching attendance reports");
      await this.getSalaryHistory();
      this.getNearestDateRange();
      this.fetchAttendanceInRange();
    },
  },
});
