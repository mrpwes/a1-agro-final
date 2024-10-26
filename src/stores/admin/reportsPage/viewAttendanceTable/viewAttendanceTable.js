import { defineStore } from "pinia";
import { supabase } from "../../../../lib/supabaseClient.js";
import { useAttendanceTableStore } from "stores/admin/reportsPage/attendanceTable.js";

import { useGlobalNotificationStore } from "stores/globalNotification";
const globalNotificationStore = useGlobalNotificationStore();

const attendanceTableStore = useAttendanceTableStore();

export const useReportsViewAttendanceTable = defineStore(
  "reportsViewAttendanceTable",
  {
    state: () => ({
      attendanceID: null,
      attendanceDate: null,
      attendanceRemarks: null,
      attendanceTimeIn: null,
      attendanceTimeInProxy: null,
      attendanceTimeOut: null,
      attendanceTimeOutProxy: null,
      attendanceEmployeeID: null,
      attendanceType: null,
      attendanceAdjustmentSalaryID: null,

      listOfAttendanceType: [],
      listOfAdjustmentSalary: [],

      hourOptions: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
      is_editing: false,
    }),
    getters: {
      getIsEditing(state) {
        return state.is_editing;
      },

      getFormattedTimeIn(state) {
        if (state.attendanceTimeOut === null) {
          return null;
        }

        // Create a Date object from the date string
        const date = new Date(state.attendanceTimeIn);

        // Get hours and minutes
        let hours = date.getHours();
        const minutes = date.getMinutes();

        // Determine AM or PM suffix
        const ampm = hours >= 12 ? "PM" : "AM";

        // Convert hours from 24-hour to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'

        // Format minutes to always be two digits
        const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

        // Return the formatted time
        return `${hours}:${formattedMinutes} ${ampm}`;
      },

      getFormattedTimeOut(state) {
        // Create a Date object from the date string

        if (state.attendanceTimeOut === null) {
          return null;
        }

        const date = new Date(state.attendanceTimeOut);

        // Get hours and minutes
        let hours = date.getHours();
        const minutes = date.getMinutes();

        // Determine AM or PM suffix
        const ampm = hours >= 12 ? "PM" : "AM";

        // Convert hours from 24-hour to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'

        // Format minutes to always be two digits
        const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

        // Return the formatted time
        return `${hours}:${formattedMinutes} ${ampm}`;
      },
    },
    actions: {
      updateProxy(is_timeIn) {
        if (is_timeIn == true) {
          this.attendanceTimeInProxy = this.attendanceTimeIn;
        } else {
          this.attendanceTimeOutProxy = this.attendanceTimeOut;
        }
      },

      saveProxy(is_timeIn) {
        if (is_timeIn == true) {
          this.attendanceTimeIn = this.attendanceTimeInProxy;
        } else {
          this.attendanceTimeOut = this.attendanceTimeOutProxy;
        }
      },

      async fetchAttendanceTable() {
        const { data, error } = await supabase
          .from("attendance")
          .select("*")
          .eq("id");
        if (error) {
          console.log(error);
        } else {
          return data;
        }
      },

      async fetchAttendanceType() {
        const { data, error } = await supabase
          .from("attendance_type")
          .select("*");
        if (error) {
          console.log(error);
        } else {
          this.listOfAttendanceType = data;
        }
      },

      async fetchAdjustmentSalary() {
        const { data, error } = await supabase
          .from("adjustment_salary")
          .select("*");
        if (error) {
          console.log(error);
        } else {
          this.listOfAdjustmentSalary = data;
        }
      },

      async updateAttendance() {
        const { error } = await supabase
          .from("attendance")
          .update({
            date: this.attendanceDate,
            remarks: this.attendanceRemarks,
            time_in: this.attendanceTimeIn,
            time_out: this.attendanceTimeOut,
            employee_id: this.attendanceEmployeeID,
            attendance_type_id: this.attendanceType,
            adjustment_salary_id: this.attendanceAdjustmentSalaryID,
          })
          .eq("id", this.attendanceID);
        if (error) {
          globalNotificationStore.showErrorNotification(
            "Failed to update attendance"
          );
        } else {
          attendanceTableStore.fetchAttendanceReports();
          globalNotificationStore.showSuccessNotification(
            "Attendance updated successfully"
          );
          this.is_editing = false;
        }
      },

      resetForm() {
        this.attendanceID = null;
        this.attendanceDate = null;
        this.attendanceRemarks = null;
        this.attendanceTimeIn = null;
        this.attendanceTimeInProxy = null;
        this.attendanceTimeOut = null;
        this.attendanceTimeOutProxy = null;
        this.attendanceEmployeeID = null;
        this.attendanceType = null;
        this.attendanceAdjustmentSalaryID = null;

        this.is_editing = false;
      },
    },
  }
);
