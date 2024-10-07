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
        // {
        //   name: "VALE",
        //   align: "center",
        //   label: "VALE",
        //   sortable: true,
        //   classes: "!tw-bg-neutral-300",
        // },
        // {
        //   name: "AR",
        //   align: "center",
        //   label: "AR",
        //   sortable: true,
        // },
        {
          name: "NetPay",
          align: "center",
          label: "NetPay",
          sortable: true,

          classes: "!tw-bg-neutral-300",
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

    customLogic(a, b) {
      return !(a && b);
    },

    async fetchAttendanceInRange(
      dateStart = this.selectedDate.date_start,
      dateEnd = this.selectedDate.date_end
    ) {
      try {
        const { data, error } = await supabase
          .from("employee")
          .select(
            `*,
            attendance(*),
            employee_audit!employee_audit_employee_id_fkey(*),
            emp_sss_contrib_audit!emp_sss_contrib_audit_employee_id_fkey(*),
            emp_philhealth_contrib_audit!emp_philhealth_contrib_audit_employee_id_fkey(*),
            emp_pagibig_contrib_audit!emp_pagibig_contrib_audit_employee_id_fkey(*),
            vale_audit!vale_audit_employee_id_fkey(*),
            partial_to_ar_audit!partial_to_ar_audit_employee_id_fkey(*)
            `
          )
          .eq("is_archive", false)
          .gte("attendance.date", dateStart) // Greater than or equal to dateStart
          .lte("attendance.date", dateEnd) // Less than or equal to dateEnd// Greater than or equal to dateStart
          .lte("emp_sss_contrib_audit.change_date", dateEnd) // Greater than or equal to dateStart
          .lte("emp_philhealth_contrib_audit.change_date", dateEnd) // Greater than or equal to dateStart
          .lte("emp_pagibig_contrib_audit.change_date", dateEnd) // Less than or equal to dateEnd
          .lte("vale_audit.change_date", dateEnd); // Less than or equal to dateEnd

        // Use forEach to iterate over the data
        data.forEach((employee) => {
          const empSssContribAudit = employee.emp_sss_contrib_audit;

          // Check if the emp_sss_contrib_audit array is not empty
          if (empSssContribAudit.length > 0) {
            // Get the last element
            const lastElement =
              empSssContribAudit[empSssContribAudit.length - 1];
            if (
              lastElement.half_month_indicator == true &&
              [28, 29, 30, 31].includes(parseInt(dateEnd.split("-")[2]))
            ) {
              console.log("is true.");
            } else if (
              lastElement.half_month_indicator == false &&
              [15].includes(parseInt(dateEnd.split("-")[2]))
            ) {
              console.log("is true 2.");
            } else {
              console.log("EMPLOYEE SSS is false.");
              employee.emp_sss_contrib_audit = [];
            }
          } else {
            console.log("emp_sss_contrib_audit array is empty.");
          }
        });

        data.forEach((employee) => {
          const empPhilhealthContribAudit =
            employee.emp_philhealth_contrib_audit;

          if (empPhilhealthContribAudit.length > 0) {
            // Get the last element
            const lastElement =
              empPhilhealthContribAudit[empPhilhealthContribAudit.length - 1];
            if (
              lastElement.half_month_indicator == true &&
              [28, 29, 30, 31].includes(parseInt(dateEnd.split("-")[2]))
            ) {
              console.log("Philhealth is true.");
            } else if (
              lastElement.half_month_indicator == false &&
              [15].includes(parseInt(dateEnd.split("-")[2]))
            ) {
              console.log("Philhealth is true 2.");
            } else {
              employee.emp_philhealth_contrib_audit = [];
            }
          } else {
            console.log("emp_philhealth_contrib_audit array is empty.");
          }
        });

        data.forEach((employee) => {
          const empPagibigContribAudit = employee.emp_pagibig_contrib_audit;

          if (empPagibigContribAudit.length > 0) {
            // Get the last element
            const lastElement =
              empPagibigContribAudit[empPagibigContribAudit.length - 1];
            if (
              lastElement.half_month_indicator == true &&
              [28, 29, 30, 31].includes(parseInt(dateEnd.split("-")[2]))
            ) {
              console.log("Pagibig is true.");
            } else if (
              lastElement.half_month_indicator == false &&
              [15].includes(parseInt(dateEnd.split("-")[2]))
            ) {
              console.log("Pagibig is true 2.");
            } else {
              employee.emp_pagibig_contrib_audit = [];
            }
          } else {
            console.log("emp_pagibig_contrib_audit array is empty.");
          }
        });

        if (error) {
          console.error(error);
        }
        this.rows = data;
        // console.log(JSON.stringify(data));
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
      // console.log("fetching attendance reports");
      await this.getSalaryHistory();
      await this.getNearestDateRange();
      await this.fetchAttendanceInRange();
    },
  },
});
