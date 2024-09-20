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
            employee_audit(*),
            emp_sss_contrib!emp_sss_contrib_employee_id_fkey(
              emp_sss_contrib_audit(*)
            ),
            emp_pagibig_contrib!emp_pagibig_contrib_employee_id_fkey(
              emp_pagibig_contrib_audit(*)
            ),
            emp_philhealth_contrib!emp_philhealth_contrib_employee_id_fkey(
              emp_philhealth_contrib_audit(*)
            ),
            emp_incometax_contrib!emp_incometax_contrib_employee_id_fkey(
              emp_incometax_contrib_audit(*)
            )
            `
          )
          .eq("is_archive", false)
          .gte("attendance.date", dateStart) // Greater than or equal to dateStart
          .lte("attendance.date", dateEnd); // Less than or equal to dateEnd
        if (error) {
          console.error(error);
        }
        data.forEach((employee) => {
          if (
            !employee.employee_audit ||
            employee.employee_audit.length === 0
          ) {
            return; // Exit if there are no audits
          }

          // Filter audits to find those with dates <= dateEnd
          const filteredAudits = employee.employee_audit.filter((audit) => {
            const auditDate = new Date(audit.change_timestamp);
            return auditDate <= new Date(dateEnd);
          });

          if (filteredAudits.length > 0) {
            // Find the nearest date
            const groupedByDate = filteredAudits.reduce((acc, audit) => {
              const date = audit.change_timestamp.split("T")[0]; // Get the date part
              if (!acc[date]) {
                acc[date] = [];
              }
              acc[date].push(audit);
              return acc;
            }, {});

            // Find the latest date
            const nearestDate = Object.keys(groupedByDate).sort().pop();

            // Get the audits for the nearest date
            const nearestAudits = groupedByDate[nearestDate];

            // Find the audit with the highest audit_id
            const highestAudit = nearestAudits.reduce((max, audit) => {
              return audit.audit_id > max.audit_id ? audit : max;
            });

            // Update the employee's rate_per_day based on the highest audit
            employee.rate_per_day = highestAudit.rate_per_day;

            // Optionally, you can add custom logic here if needed
            // For example, if you want to check some condition before updating
            // if (this.customLogic(...)) { ... }
          }
        });
        data.forEach((employee) => {
          if (!employee.emp_sss_contrib[0]) {
            return; // Exit the function if emp_pagibig_contrib does not exist
          }
          employee.emp_sss_contrib.forEach((contrib) => {
            const audits = contrib.emp_sss_contrib_audit;

            // Filter audits to find those with dates <= dateEnd
            const filteredAudits = audits.filter((audit) => {
              const auditDate = new Date(audit.change_timestamp);
              return auditDate <= new Date(dateEnd);
            });

            if (filteredAudits.length > 0) {
              // Find the nearest date and highest audit_id
              const groupedByDate = filteredAudits.reduce((acc, audit) => {
                const date = audit.change_timestamp.split("T")[0]; // Get the date part
                if (!acc[date]) {
                  acc[date] = [];
                }
                acc[date].push(audit);
                return acc;
              }, {});

              // Find the latest date
              const nearestDate = Object.keys(groupedByDate).sort().pop();

              // Get the audits for the nearest date
              const nearestAudits = groupedByDate[nearestDate];

              // Find the audit with the highest audit_id
              const highestAudit = nearestAudits.reduce((max, audit) => {
                return audit.audit_id > max.audit_id ? audit : max;
              });

              // Check if highestAudit half_month_indicator is true
              if (
                this.customLogic(
                  highestAudit.half_month_indicator,
                  dateEnd.split("-")[2] === "15"
                )
              ) {
                // This condition checks if half_month_indicator is false and the day is 15
                contrib.emp_sss_contrib_audit = [highestAudit];
              } else {
                // This will handle all other cases

                contrib.emp_sss_contrib_audit = [];
              }
            } else {
              // If no audits are found, clear the array
              contrib.emp_sss_contrib_audit = [];
            }
          });
        });
        data.forEach((employee) => {
          if (!employee.emp_philhealth_contrib[0]) {
            return; // Exit the function if emp_pagibig_contrib does not exist
          }
          employee.emp_philhealth_contrib.forEach((contrib) => {
            const audits = contrib.emp_philhealth_contrib_audit;

            // Filter audits to find those with dates <= dateEnd
            const filteredAudits = audits.filter((audit) => {
              const auditDate = new Date(audit.change_timestamp);
              return auditDate <= new Date(dateEnd);
            });

            if (filteredAudits.length > 0) {
              // Find the nearest date and highest audit_id
              const groupedByDate = filteredAudits.reduce((acc, audit) => {
                const date = audit.change_timestamp.split("T")[0]; // Get the date part
                if (!acc[date]) {
                  acc[date] = [];
                }
                acc[date].push(audit);
                return acc;
              }, {});

              // Find the latest date
              const nearestDate = Object.keys(groupedByDate).sort().pop();

              // Get the audits for the nearest date
              const nearestAudits = groupedByDate[nearestDate];

              // Find the audit with the highest audit_id
              const highestAudit = nearestAudits.reduce((max, audit) => {
                return audit.audit_id > max.audit_id ? audit : max;
              });

              // Check if highestAudit half_month_indicator is true
              if (
                this.customLogic(
                  highestAudit.half_month_indicator,
                  dateEnd.split("-")[2] === "15"
                )
              ) {
                contrib.emp_philhealth_contrib_audit = [highestAudit];
              } else {
                // This will handle all other cases

                contrib.emp_philhealth_contrib_audit = [];
              }
            } else {
              // If no audits are found, clear the array
              contrib.emp_philhealth_contrib_audit = [];
            }
          });
        });
        data.forEach((employee) => {
          if (!employee.emp_pagibig_contrib[0]) {
            return; // Exit the function if emp_pagibig_contrib does not exist
          }
          employee.emp_pagibig_contrib.forEach((contrib) => {
            const audits = contrib.emp_pagibig_contrib_audit;

            // Filter audits to find those with dates <= dateEnd
            const filteredAudits = audits.filter((audit) => {
              const auditDate = new Date(audit.change_timestamp);
              return auditDate <= new Date(dateEnd);
            });

            if (filteredAudits.length > 0) {
              // Find the nearest date and highest audit_id
              const groupedByDate = filteredAudits.reduce((acc, audit) => {
                const date = audit.change_timestamp.split("T")[0]; // Get the date part
                if (!acc[date]) {
                  acc[date] = [];
                }
                acc[date].push(audit);
                return acc;
              }, {});

              // Find the latest date
              const nearestDate = Object.keys(groupedByDate).sort().pop();

              // Get the audits for the nearest date
              const nearestAudits = groupedByDate[nearestDate];

              // Find the audit with the highest audit_id
              const highestAudit = nearestAudits.reduce((max, audit) => {
                return audit.audit_id > max.audit_id ? audit : max;
              });

              // Check if highestAudit half_month_indicator is true
              if (
                this.customLogic(
                  highestAudit.half_month_indicator,
                  dateEnd.split("-")[2] === "15"
                )
              ) {
                // This condition checks if half_month_indicator is false and the day is 15
                contrib.emp_pagibig_contrib_audit = [highestAudit];
              } else {
                // This will handle all other cases

                contrib.emp_pagibig_contrib_audit = [];
              }
            } else {
              // If no audits are found, clear the array
              contrib.emp_pagibig_contrib_audit = [];
            }
          });
        });
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
      this.getNearestDateRange();
      this.fetchAttendanceInRange();
    },
  },
});
