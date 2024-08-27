import { defineStore } from "pinia";
import { supabase } from "../lib/supabaseClient.js";

export const useAttendanceTest = defineStore("attendanceTest", {
  state: () => ({}),

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

    async checkAdjustmentSalary() {
      try {
        const { count, error } = await supabase
          .from("adjustment_salary")
          .select("*", { count: "exact", head: true })
          .eq("employee_id", "75bfee88-fb93-45dd-8723-9f52916cd3ab")
          .eq("date_start", "2024-08-16")
          .eq("date_end", "2024-08-31");
        console.log("Checking Adjustment Salary");
        if (error) {
          throw error;
        }
        console.log(count);
        return count;
      } catch (error) {
        console.log(error);
        return 0;
      }
    },

    async createAdjustmentSalary() {
      let { todayDate, startDate, endDate } =
        this.getAndCheckDateRangesForCurrentMonth();
      console.log(todayDate, startDate, endDate);

      try {
        const { data, error } = await supabase
          .from("adjustment_salary")
          .insert({
            employee_id: "75bfee88-fb93-45dd-8723-9f52916cd3ab",
            date_start: startDate,
            date_end: endDate,
          })
          .select();
        console.log("Created Adjustment Salary");
        if (error) {
          throw error;
        }
        // return data;
        console.log(data[0].id);
        return data[0].id;
      } catch (error) {
        console.log(error);
      }
    },

    async inputAttendance(id) {
      try {
        // Get the current date
        const today = new Date();
        const { data, error } = await supabase
          .from("attendance")
          .insert({
            adjustment_salary_id: id,
            employee_id: "75bfee88-fb93-45dd-8723-9f52916cd3ab",
            time_in: "08:00:00",
            time_out: "16:00:00",
            date: this.formatDate(today),
          })
          .select();
        console.log("Input Attendance");
        if (error) {
          throw error;
        }
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    },

    async processAttendance() {
      try {
        const count = await this.checkAdjustmentSalary();
        if (count === 0) {
          const id = await this.createAdjustmentSalary();
          await this.inputAttendance(id);
        } else {
          await this.inputAttendance(count);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    },
  },
});
