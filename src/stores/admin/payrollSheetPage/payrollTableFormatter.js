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
    },
  }
);
