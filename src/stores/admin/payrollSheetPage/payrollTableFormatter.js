import { defineStore } from "pinia";

export const usePayrollTableFormatterStore = defineStore(
  "payrollTableFormatter",
  {
    state: () => ({
      // Define your state properties here
      payrollData: [],
    }),
    getters: {
      // Define your getters here
      formattedPayrollData: (state) => {
        // Example getter to format payroll data
        return state.payrollData.map((data) => {
          // Format data as needed
          return {
            ...data,
            formattedDate: new Date(data.date).toLocaleDateString(),
          };
        });
      },
    },
    actions: {
      noDaysWorkedFormatter(attendance) {
        let totalHours = 0;

        attendance.forEach((entry) => {
          if (entry.time_in && entry.time_out) {
            const timeIn = new Date(entry.time_in);
            const timeOut = new Date(entry.time_out);
            const hours = (timeOut - timeIn) / (1000 * 60 * 60); // Convert milliseconds to hours
            totalHours += hours;
          }
        });

        return (totalHours / 8).toFixed(2);
      },

      grossIncomeFormatter(ratePerDay, attendance) {
        const noDaysWorked = this.noDaysWorkedFormatter(attendance);
        return (ratePerDay * noDaysWorked).toFixed(2);
      },
    },
  }
);
