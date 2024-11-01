import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";

export const usePayslipFormatterStore = defineStore("payslipFormatter", {
  state: () => ({
    // Define your state properties here
    payrollData: [],
    sssContributionTableRanges: [],
    philhealthContributionRate: null,
    pagibigContributionRate: null,

    totalHours: 0,
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
    twoDecimalWithoutRounding(num) {
      var with2Decimals = num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
      return parseFloat(with2Decimals);
    },
    capitalizeFirstLetterOfEachWord(str) {
      return str
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },
    noDaysWorkedFormatter(attendance) {
      // console.log("INSIDE noDaysWorkedFormatter");
      let totalMinutes = 0;

      attendance.forEach((entry) => {
        if (entry.time_out === null && entry.time_in !== null) {
          // Handle case where there is no time out
          // console.log("No Time Out for entry:", entry);
          totalMinutes += 0; // or handle it differently if needed
        } else if (
          entry.attendance_type_id !== 1 &&
          entry.attendance_type_id !== undefined
        ) {
          // Handle different attendance types
          totalMinutes += 480; // 8 hours in minutes
        } else if (entry.time_in && entry.time_out) {
          const timeIn = new Date(entry.time_in);
          const timeOut = new Date(entry.time_out);

          // Set timeIn to 8 AM if it's before 8 AM
          const eightAM = new Date(timeIn);
          eightAM.setHours(8, 0, 0, 0);
          if (timeIn < eightAM) {
            timeIn.setHours(8, 0, 0, 0);
          }

          // Set timeOut to 5 PM if it's after 5 PM
          const fivePM = new Date(timeOut);
          fivePM.setHours(17, 0, 0, 0);
          if (timeOut > fivePM) {
            timeOut.setHours(17, 0, 0, 0);
          }

          let minutes = (timeOut - timeIn) / (1000 * 60); // Convert milliseconds to minutes

          // Subtract 60 minutes if timeOut is after 1 PM
          const onePM = new Date(timeOut);
          onePM.setHours(13, 0, 0, 0);
          if (timeOut > onePM) {
            minutes -= 60; // Subtract 1 hour
            // console.log("Subtract 1 hour for entry:", entry);
          }

          totalMinutes += minutes;
        }
      });

      const totalHours = totalMinutes / 60;
      this.totalHours = this.twoDecimalWithoutRounding(totalHours);
      return (this.twoDecimalWithoutRounding(totalHours) / 8).toFixed(2);
    },

    grossIncomeFormatter(ratePerDay, attendance) {
      const noDaysWorked = this.noDaysWorkedFormatter(attendance);
      return ratePerDay * noDaysWorked;
    },

    monthlyIncomeFormatter(ratePerDay, numberOfDaysInMonth = 30) {
      return this.twoDecimalWithoutRounding(ratePerDay * numberOfDaysInMonth);
    },

    async fetchSssContributionTable() {
      try {
        const { data, error } = await supabase
          .from("sss_contribution_table_audit")
          .select("*")
          .order("audit_id", { ascending: false })
          .limit(1);
        if (error) {
          console.error(error);
          throw error;
        }
        //   console.log(data);
        this.sssContributionTableRanges = data[0].data.map((item) => {
          const range = item.combinedValue;
          let min, max, sss_bracket;

          // Extract the sss_bracket value from the 4th index of values
          sss_bracket = parseFloat(item.values[4].replace(",", ""));

          if (range.startsWith("Below")) {
            min = 0;
            max = parseFloat(range.split(" ")[1].replace(",", ""));
          } else if (range.includes("Over")) {
            min = parseFloat(range.split(" ")[0].replace(",", ""));
            max = null; // or you can set it to a very high number if needed
          } else {
            const [start, end] = range.split(" - ");
            min = parseFloat(start.replace(",", ""));
            max = parseFloat(end.replace(",", ""));
          }

          return { min, max, sss_bracket };
        });
      } catch (error) {
        console.error(error);
      }
    },
    findSSSRange(value) {
      for (const range of this.sssContributionTableRanges) {
        if (value >= range.min && value < range.max) {
          return range.sss_bracket;
        }
      }
      return "Value is out of range";
    },

    async fetchPhilhealthContributionTable() {
      try {
        const { data, error } = await supabase
          .from("philhealth_contribution_table_audit")
          .select("*")
          .order("audit_id", { ascending: false })
          .limit(1);
        if (error) {
          console.error(error);
          throw error;
        }
        //   console.log(data);
        this.philhealthContributionRate = data[0]["data"].value;
      } catch (error) {
        console.error(error);
      }
    },

    async fetchPagibigContributionTable() {
      try {
        const { data, error } = await supabase
          .from("pagibig_contribution_table_audit")
          .select("*")
          .order("audit_id", { ascending: false })
          .limit(1);
        if (error) {
          console.error(error);
          throw error;
        }
        // console.log(data);
        this.pagibigContributionRate = data;
      } catch (error) {
        console.error(error);
      }
    },

    calculatePagibigContribution(ratePerDay) {
      const monthlyIncome = this.monthlyIncomeFormatter(ratePerDay);
      let employeeRate, employeeContribution;
      // employerRate
      // console.log("Monthly Income:", monthlyIncome);
      if (monthlyIncome <= 1500) {
        employeeRate = 0.01; // 1.0%
        // employerRate = 0.02; // 2.0%
        const cappedMonthlyIncome = Math.min(monthlyIncome, 10000);
        employeeContribution = cappedMonthlyIncome * employeeRate;
      } else {
        employeeRate = 0.02; // 2.0%
        // employerRate = 0.02; // 2.0%
        const cappedMonthlyIncome = Math.min(monthlyIncome, 10000);
        employeeContribution = cappedMonthlyIncome * employeeRate;
      }

      return this.twoDecimalWithoutRounding(employeeContribution);
    },
  },
});
