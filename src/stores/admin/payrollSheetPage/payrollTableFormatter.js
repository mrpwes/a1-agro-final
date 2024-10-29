import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";

export const usePayrollTableFormatterStore = defineStore(
  "payrollTableFormatter",
  {
    state: () => ({
      // Define your state properties here
      payrollData: [],
      sssContributionTableRanges: [],
      philhealthContributionRate: null,
      pagibigContributionRate: null,
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

      formatToTwoDecimalPlaces(num) {
        // Multiply by 100, truncate to an integer, then divide by 100
        return Math.floor(num * 100) / 100;
      },

      capitalizeFirstLetterOfEachWord(str) {
        return str
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      },

      calculateTotalHours(row) {
        // Check if attendance_type.id is not 1
        if (row.attendance_type == undefined) {
          return 0;
        }

        if (row.attendance_type.id !== 1) {
          return this.convertDecimalToHoursMinutes(8); // Return 8 hours as a numeric value
        }

        // Parse the time_in and time_out strings into Date objects
        let timeIn = new Date(row.time_in);
        timeIn.setMilliseconds(0); // Set milliseconds to 0

        let timeOut = new Date(row.time_out);
        timeOut.setMilliseconds(0); // Set milliseconds to 0

        // Set timeIn to 8 AM if it's before 8 AM
        const eightAM = new Date(timeIn);
        eightAM.setHours(8, 0, 0);
        if (timeIn < eightAM) {
          timeIn.setHours(8, 0, 0);
        }

        // Set timeOut to 5 PM if it's after 5 PM
        const fivePM = new Date(timeOut);
        fivePM.setHours(17, 0, 0);
        if (timeOut > fivePM) {
          timeOut.setHours(17, 0, 0);
        }

        // Calculate total minutes between adjusted timeIn and timeOut
        let minutes = (timeOut - timeIn) / (1000 * 60); // Convert milliseconds to minutes

        // Subtract 60 minutes if timeOut is after 1 PM
        const onePM = new Date(timeOut);
        onePM.setHours(13, 0, 0);
        const twelvePM = new Date(timeOut);
        twelvePM.setHours(12, 0, 0);
        if (timeOut > onePM && timeIn < twelvePM) {
          minutes -= 60; // Subtract 1 hour
        }

        // Convert total minutes to hours
        const totalHours = Math.floor(minutes / 60) + (minutes % 60) / 60; // Total hours in decimal format

        // Return the total hours as a numeric value
        return this.convertDecimalToHoursMinutes(totalHours);
      },

      sumArray(arr) {
        return arr.reduce(
          (accumulator, currentValue) => accumulator + Number(currentValue),
          0
        );
      },

      calculateTotalAttendanceHours(attendance) {
        let totalHours = 0;

        let listOfHours = [];

        attendance.forEach((record) => {
          // totalHours += this.calculateTotalHours(record);
          listOfHours.push(this.calculateTotalHours(record));
        });

        console.log(listOfHours);
        totalHours = this.sumArray(listOfHours);
        console.log(totalHours);
        return totalHours;
      },

      convertDecimalToHoursMinutes(decimalHours) {
        // Get the whole number of hours
        const hours = Math.floor(decimalHours);

        // Get the remaining decimal part and convert it to minutes
        const minutes = Math.floor((decimalHours - hours) * 60);

        return hours + "." + minutes;
      },

      noDaysWorkedFormattersss(attendance) {
        let totalHours = 0;

        attendance.forEach((entry) => {
          if (entry.time_out === null && entry.time_in !== null) {
            // Handle case where there is no time out
            // console.log("No Time Out for entry:", entry);
            totalHours += 0; // or handle it differently if needed
          } else if (
            entry.attendance_type_id !== 1 &&
            entry.attendance_type_id !== undefined
          ) {
            // Handle different attendance types
            // const attendanceTypeName = this.capitalizeFirstLetterOfEachWord(
            //   entry.attendance_type.attendance_type_name
            // );
            // console.log("Attendance Type:", attendanceTypeName);
            totalHours += 8; // or handle it differently if needed
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

            let hours = (timeOut - timeIn) / (1000 * 60 * 60); // Convert milliseconds to hours

            // Subtract 1 hour if timeOut is after 1 PM
            const onePM = new Date(timeOut);
            onePM.setHours(13, 0, 0, 0);
            if (timeOut > onePM) {
              hours -= 1; // Subtract 1 hour
              // console.log("Subtract 1 hour for entry:", entry);
            }

            totalHours += hours;
          }
        });

        return totalHours / 8;
      },

      grossIncomeFormatter(ratePerDay, attendance) {
        const noDaysWorked = this.calculateTotalAttendanceHours(attendance) / 8;
        return (ratePerDay * noDaysWorked).toFixed(2);
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
          console.log(data);
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
  }
);
