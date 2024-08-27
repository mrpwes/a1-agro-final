import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";

export const useAttendanceTableStore = defineStore("attendanceTable", {
  state: () => ({
    rows: [],
  }),

  getters: {},

  actions: {
    // Helper function to format date as "YYYY-MM-DD"
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

      // Get the first day of the current month
      const firstDayOfMonth = new Date(year, month, 1);

      // Get the 15th day of the current month
      const fifteenthDayOfMonth = new Date(year, month, 15);

      // Get the 16th day of the current month
      const sixteenthDayOfMonth = new Date(year, month, 16);

      // Get the last day of the current month
      const lastDayOfMonth = new Date(year, month + 1, 0);

      // Format the date ranges
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

      // Determine which half of the month today falls into
      const todayDate = this.formatDate(today);

      const firstHalfStart = new Date(dateRanges.firstHalf.start);
      const firstHalfEnd = new Date(dateRanges.firstHalf.end);
      const secondHalfStart = new Date(dateRanges.secondHalf.start);
      const secondHalfEnd = new Date(dateRanges.secondHalf.end);

      let startDate;
      let endDate;

      if (today >= firstHalfStart && today <= firstHalfEnd) {
        // halfOfMonth =
        //   this.formatDate(firstHalfStart) + " " + this.formatDate(firstHalfEnd);
        startDate = this.formatDate(firstHalfStart);
        endDate = this.formatDate(firstHalfEnd);
      } else if (today >= secondHalfStart && today <= secondHalfEnd) {
        // halfOfMonth =
        //   this.formatDate(secondHalfStart) +
        //   " " +
        //   this.formatDate(secondHalfEnd);
        startDate = this.formatDate(secondHalfStart);
        endDate = this.formatDate(secondHalfEnd);
      } else {
        startDate = "out of range";
        endDate = "out of range";
      }

      // console.log(
      //   `Today Date: ${todayDate}
      //    startDate kung saan pasok: ${startDate}
      //    endDate kung saan pasok: ${endDate}
      //    `
      //   // ${todayDate}) is within the ${startDate} ${endDate} of the month.`
      // );

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
        console.log(data);
        return data;
      } catch (error) {
        console.error(error);
      }
    },

    async fetchAttendanceInRange(
      dateStart = "2024-08-16",
      dateEnd = "2024-08-31"
    ) {
      try {
        const { data, error } = await supabase
          .from("attendance") // Replace with your table name
          .select(
            `
            *,
            employee:employee_id (
              first_name,
              last_name
            )
          `
          ) // Select all columns or specify the columns you need
          .gte("date", dateStart) // Greater than or equal to dateStart
          .lte("date", dateEnd); // Less than or equal to dateEnd

        if (error) {
          console.error("Error fetching data:", error);
        } else {
          const groupedByEmployeeId = data.reduce((acc, item) => {
            if (!acc[item.employee_id]) {
              acc[item.employee_id] = [];
            }
            acc[item.employee_id].push(item);
            return acc;
          }, {});

          // Convert the grouped object into an array of arrays (optional)
          this.rows = Object.values(groupedByEmployeeId);

          console.log(this.rows);
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
});
