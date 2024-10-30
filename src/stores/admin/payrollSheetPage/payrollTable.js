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
          label: "SSS Salary Loan",
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
    rows: [],

    selectedDate: null,
    selectedDateOptions: null,
  }),

  getters: {
    getArchived(state) {
      return state.rows.filter((row) => row.is_archive === true);
    },
    getUnarchived(state) {
      return state.rows.filter((row) => row.is_archive === false);
    },
  },
  actions: {
    customFilter(rows, terms) {
      console.log("customFilter", rows, terms);
      return rows.filter((row) => {
        const searchTerm = terms.toLowerCase();
        return (
          row.last_name.toLowerCase().includes(searchTerm) ||
          row.first_name.toLowerCase().includes(searchTerm) ||
          row.middle_name.toLowerCase().includes(searchTerm)
        );
      });
    },

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
        this.selectedDateOptions = data.sort(
          (a, b) => new Date(a.date_start) - new Date(b.date_start)
        );
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
            attendance(*, attendance_type(*)),
            employee_audit!employee_audit_employee_id_fkey(*),
            emp_sss_contrib_audit!emp_sss_contrib_audit_employee_id_fkey(*),
            emp_philhealth_contrib_audit!emp_philhealth_contrib_audit_employee_id_fkey(*),
            emp_pagibig_contrib_audit!emp_pagibig_contrib_audit_employee_id_fkey(*),
            government_loan_audit!government_loan_audit_employee_id_fkey(*)
            `
          )
          .gte("attendance.date", dateStart) // Greater than or equal to dateStart
          .lte("attendance.date", dateEnd) // Less than or equal to dateEnd// Greater than or equal to dateStart
          .gte("government_loan_audit.date_end", dateEnd)
          .lte("government_loan_audit.change_date", dateEnd) // Less than or equal to dateEnd
          .gte("emp_sss_contrib_audit.change_date", dateEnd)
          .lte("emp_sss_contrib_audit.change_date", dateEnd)
          .gte("emp_philhealth_contrib_audit.change_date", dateStart)
          .lte("emp_philhealth_contrib_audit.change_date", dateEnd)
          .gte("emp_pagibig_contrib_audit.change_date", dateStart)
          .lte("emp_pagibig_contrib_audit.change_date", dateEnd);
        console.log(dateEnd);
        // Use forEach to iterate over the data
        console.log(data);
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

        // Process Government Loan Audit
        data.forEach((employee) => {
          const governmentLoanAudit = employee.government_loan_audit;

          if (governmentLoanAudit.length > 0) {
            // Create a map to hold the latest entries
            const latestLoans = {};

            governmentLoanAudit.forEach((loan) => {
              const loanId = loan.government_loan_id;

              // Check if this loanId is already in the map
              if (
                !latestLoans[loanId] ||
                loan.audit_id > latestLoans[loanId].audit_id
              ) {
                latestLoans[loanId] = loan; // Update to the latest loan based on audit_id
              }
            });

            // Convert the map back to an array
            employee.government_loan_audit = Object.values(latestLoans);
          } else {
            console.log("government_loan_audit array is empty.");
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
