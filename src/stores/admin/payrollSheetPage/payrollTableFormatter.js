import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";

export const usePayrollTableFormatterStore = defineStore(
  "payrollTableFormatter",
  {
    state: () => ({
      // Define your state properties here
      payrollData: [],
      sssContributionTableRanges: [],
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
        let totalHours = 0;

        attendance.forEach((entry) => {
          if (entry.time_out === null && entry.time_in !== null) {
            // Handle case where there is no time out
            console.log("No Time Out for entry:", entry);
            totalHours += 0; // or handle it differently if needed
          } else if (
            entry.attendance_type_id !== 1 &&
            entry.attendance_type_id !== undefined
          ) {
            // Handle different attendance types
            const attendanceTypeName = this.capitalizeFirstLetterOfEachWord(
              entry.attendance_type.attendance_type_name
            );
            console.log("Attendance Type:", attendanceTypeName);
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
              console.log("Subtract 1 hour for entry:", entry);
            }

            totalHours += hours;
          }
        });

        return this.twoDecimalWithoutRounding(totalHours / 8);
      },

      grossIncomeFormatter(ratePerDay, attendance) {
        const noDaysWorked = this.noDaysWorkedFormatter(attendance);
        return this.twoDecimalWithoutRounding(ratePerDay * noDaysWorked);
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
      findRange(value) {
        for (const range of this.sssContributionTableRanges) {
          if (value >= range.min && value < range.max) {
            return range.sss_bracket;
          }
        }
        return "Value is out of range";
      },
    },
  }
);
