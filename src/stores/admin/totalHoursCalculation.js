import { defineStore } from "pinia";
import { supabase } from "../../lib/supabaseClient.js";
import { useAuthenticationStore } from "../authentication.js";

export const useTotalHoursCalculation = defineStore("totalHoursCalculation", {
  state: () => ({}),
  getters: {},
  actions: {
    convertDecimalToTime(decimalHours) {
      // Get the whole number part (hours)
      const hours = Math.floor(decimalHours);

      // Get the decimal part and convert it to minutes
      const minutes = Math.round((decimalHours - hours) * 60);

      return `${hours}:${minutes}`;
    },

    calculateTotalHours(row) {
      const currentDate = new Date();
      const rowDate = new Date(row.date);

      if (rowDate >= currentDate) {
        return "N/A";
      }

      var totalHours;

      if (row.time_out === null && row.time_in !== null) {
        totalHours = "No Time Out";
      } else if (
        row.attendance_type_id !== 1 &&
        row.attendance_type_id !== undefined
      ) {
        totalHours = this.capitalizeFirstLetterOfEachWord(
          row.attendance_type.attendance_type_name
        );
      } else {
        var timeIn = new Date(row.time_in);
        var timeOut = new Date(row.time_out);
        console.log(timeIn, timeOut);

        // Set timeIn to 8 AM if it's before 8 AM
        const eightAM = new Date(timeIn);
        eightAM.setHours(8, 0, 0, 0);
        if (timeIn < eightAM) {
          timeIn = eightAM; // Update timeIn to eightAM
        }

        // Set timeOut to 5 PM if it's after 5 PM
        const fivePM = new Date(timeOut);
        fivePM.setHours(17, 0, 0, 0);
        if (timeOut > fivePM) {
          timeOut = fivePM; // Update timeOut to fivePM
        }

        // If timeOut is after 1 PM, subtract 1 hour
        const onePM = new Date(timeOut);
        onePM.setHours(13, 0, 0, 0);
        const twelvePM = new Date(timeOut);
        twelvePM.setHours(12, 0, 0, 0);
        if (timeOut > onePM && timeIn < twelvePM) {
          timeOut = new Date(timeOut.getTime() - 3600000); // Subtract 1 hour
        }

        // Calculate total hours
        const totalHours = (timeOut - timeIn) / 1000 / 60 / 60;

        return totalHours;
      }
      return totalHours;
    },
    capitalizeFirstLetterOfEachWord(str) {
      return str
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },
  },
});
