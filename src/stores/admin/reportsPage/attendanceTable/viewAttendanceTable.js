import { defineStore } from "pinia";
import { supabase } from "../../../../lib/supabaseClient.js";
import { useAuthenticationStore } from "../../../authentication.js";

const storeAuthentication = useAuthenticationStore();

export const useViewReportsAttendanceTable = defineStore(
  "viewReportsAttendanceTable",
  {
    state: () => ({
        attendanceID: null,
        attendanceDate: null,
        attendanceRemarks: null,
        attendanceTimeIn: null,
        attendanceTimeOut: null,
        attendanceEmployeeID: null,
        attendanceType: null,
        attendanceAdjustmentSalaryID: null,

        listOfAttendanceType: [],
        listOfAdjustmentSalary: [],
    }),
    getters: {},
    actions: {
      async fetchAttendanceTable() {
        const { data, error } = await supabase
          .from("attendance")
          .select("*")
          .eq("id", );
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
      }

      async fetchAdjustmentSalary() {
        const { data, error } = await supabase
          .from("adjustment_salary")
          .select("*");
        if (error) {
          console.log(error);
        } else {
          this.listOfAdjustmentSalary = data;
        }
      }
    },
  }
);
