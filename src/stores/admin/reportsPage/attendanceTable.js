import { defineStore } from "pinia";
import { supabase } from "../../../lib/supabaseClient.js";

export const useAttendanceTableStore = defineStore("attendanceTable", {
  state: () => ({
    rows: [],

    selectedDate: null,
    selectedDateOptions: null,

    attendanceColumns: {
      columns: [],
    },
  }),

  getters: {
    getSelectedDate() {
      return this.selectedDate;
    },
  },

  actions: {
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

      const firstDayOfMonth = new Date(year, month, 1);

      const fifteenthDayOfMonth = new Date(year, month, 15);

      const sixteenthDayOfMonth = new Date(year, month, 16);

      const lastDayOfMonth = new Date(year, month + 1, 0);

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

      const todayDate = this.formatDate(today);

      const firstHalfStart = new Date(dateRanges.firstHalf.start);
      const firstHalfEnd = new Date(dateRanges.firstHalf.end);
      const secondHalfStart = new Date(dateRanges.secondHalf.start);
      const secondHalfEnd = new Date(dateRanges.secondHalf.end);

      let startDate;
      let endDate;

      if (today >= firstHalfStart && today <= firstHalfEnd) {
        startDate = this.formatDate(firstHalfStart);
        endDate = this.formatDate(firstHalfEnd);
      } else if (today >= secondHalfStart && today <= secondHalfEnd) {
        startDate = this.formatDate(secondHalfStart);
        endDate = this.formatDate(secondHalfEnd);
      } else {
        startDate = "out of range";
        endDate = "out of range";
      }
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
        this.selectedDateOptions = data;
      } catch (error) {
        console.error(error);
      }
    },

    async fetchAttendanceInRange(
      dateStart = this.selectedDate.date_start,
      dateEnd = this.selectedDate.date_end
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

          console.log("This is row", this.rows);
        }
      } catch (error) {
        console.error(error);
      }
    },

    columns(
      inputStartDate = this.selectedDate.date_start,
      inputEndDate = this.selectedDate.date_end
    ) {
      const startDate = new Date(inputStartDate);
      const endDate = new Date(inputEndDate);
      const dayColumns = [];
      const dateFormatOptions = { day: "numeric", month: "numeric" };

      //COUNTER FOR DATES
      let counter = 0;
      for (
        let currentDate = new Date(startDate);
        currentDate <= endDate;
        currentDate.setDate(currentDate.getDate() + 1)
      ) {
        const day = currentDate.getDate();
        const formattedDate = new Intl.DateTimeFormat(
          "en-US",
          dateFormatOptions
        ).format(currentDate);

        dayColumns.push(
          (() => {
            const currentCounter = counter;
            return {
              name: `${day}`,
              align: "center",
              label: `${formattedDate}`,
              sortable: true,
              field: (row) =>
                row[currentCounter] &&
                row[currentCounter].time_in &&
                row[currentCounter].time_out
                  ? "Present"
                  : row[currentCounter] === undefined ||
                    row[currentCounter] === null
                  ? "N/A"
                  : "Absent",
              format: (val) => `${val}`,
            };
          })()
        );

        counter++;
      }

      console.log(dayColumns);

      const newColumns = [
        {
          name: "employeeName",
          align: "center",
          label: "Name",
          sortable: true,
          field: (row) =>
            row[0].employee.first_name + " " + row[0].employee.last_name,
          format: (val) => `${val}`,
        },
        ...dayColumns,
        {
          name: "totalPresent",
          align: "center",
          label: "P",
          sortable: true,
        },
        {
          name: "totalLate",
          align: "center",
          label: "L",
          sortable: true,
        },
        {
          name: "totalAbsent",
          align: "center",
          label: "A",
          sortable: true,
        },
        {
          name: "totalLeave",
          align: "center",
          label: "LVE",
          sortable: true,
        },
      ];
      this.attendanceColumns.columns.push(...newColumns);
    },

    getNearestDateRange() {
      if (this.selectedDate != null) {
        return;
      }
      const today = new Date();

      function parseDate(dateStr) {
        return new Date(dateStr);
      }

      function getDistance(date) {
        return Math.abs(today - date);
      }

      let nearestRange = null;
      let minDistance = Infinity;

      for (const range of this.selectedDateOptions) {
        const startDate = parseDate(range.date_start);
        const endDate = parseDate(range.date_end);

        const distanceToStart = getDistance(startDate);
        const distanceToEnd = getDistance(endDate);

        const nearestDistance = Math.min(distanceToStart, distanceToEnd);

        if (nearestDistance < minDistance) {
          minDistance = nearestDistance;
          nearestRange = range;
        }
      }
      this.selectedDate = nearestRange;
    },

    async fetchAttendanceReports() {
      this.attendanceColumns["columns"] = [];
      await this.getSalaryHistory();
      this.getNearestDateRange();
      this.columns();
      this.fetchAttendanceInRange();
    },
  },
});
