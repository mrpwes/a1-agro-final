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
        totalHours = capitalizeFirstLetterOfEachWord(
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
        this.selectedDateOptions = data.sort(
          (a, b) => new Date(a.date_start) - new Date(b.date_start)
        );
      } catch (error) {
        console.error(error);
      }
    },

    fillMissingDates(data, dateStart, dateEnd) {
      console.log("FILLING MISSING DATES" + dateStart + " " + dateEnd);
      // Helper function to format a date object as 'YYYY-MM-DD'
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      // Convert start and end dates to Date objects
      const startDate = new Date(dateStart);
      const endDate = new Date(dateEnd);
      endDate.setDate(endDate.getDate() + 1);

      // Create a set of existing attendance dates for quick lookup
      data.forEach((employee) => {
        const existingDates = new Set(
          employee.attendance.map((att) => att.date)
        );

        // Iterate through each date from startDate to endDate
        for (
          let d = new Date(startDate);
          d <= endDate;
          d.setDate(d.getDate() + 1)
        ) {
          const formattedDate = formatDate(d);

          // If the date is not in existing attendance, add a new entry
          if (!existingDates.has(formattedDate)) {
            employee.attendance.push({
              id: null, // You can generate a unique ID if needed
              date: formattedDate,
              employee: {
                first_name: employee.first_name,
                last_name: employee.first_name,
              },
              remarks: null,
              time_in: null,
              time_out: null,
              employee_id: employee.id,
              adjustment_salary_id: null, // Set this as needed
            });
          }
        }
        employee.attendance.sort((a, b) => new Date(a.date) - new Date(b.date));
      });

      return data;
    },

    calculateTotalAttendanceHours(attendance) {
      let totalMinutes = 0;

      attendance.forEach((record) => {
        if (record.time_in && record.time_out) {
          const timeIn = new Date(record.time_in);
          const timeOut = new Date(record.time_out);
          const minutesWorked = (timeOut - timeIn) / (1000 * 60); // Convert milliseconds to minutes
          totalMinutes += minutesWorked;
        }
      });

      const totalHours = totalMinutes / 60; // Convert minutes to hours
      return totalHours;
    },

    async fetchAttendanceInRange(
      dateStart = this.selectedDate.date_start,
      dateEnd = this.selectedDate.date_end
    ) {
      try {
        const { data, error } = await supabase
          .from("employee") // Replace with your table name
          .select(
            `*,
             is_archive,
              attendance(*, attendance_type(*), employee(first_name, last_name, company_employee_id))`
          ) // Select all columns or specify the columns you need
          .gte("attendance.date", dateStart) // Greater than or equal to dateStart
          .lte("attendance.date", dateEnd) // Less than or equal to dateEnd
          .eq("is_archive", false); // Equal to false

        if (error) {
          console.error(error);
        }
        this.rows = Object.values(
          this.fillMissingDates(data, dateStart, dateEnd)
        );
        // console.log(data);
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

      const dayAbbreviations = ["S", "M", "T", "W", "TH", "F", "S"];

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
        const dayIndex = currentDate.getDay();

        // Append the day abbreviation to the formatted date
        const dateWithAbbreviation = `${formattedDate} ${dayAbbreviations[dayIndex]}`;
        dayColumns.push(
          (() => {
            const currentCounter = counter;
            return {
              name: `actions`,
              align: "center",
              label: `${dateWithAbbreviation}`,
              sortable: true,
            };
          })()
        );
        counter++;
      }

      const newColumns = [
        {
          name: "employeeName",
          align: "center",
          label: "Name",
          sortable: true,
          field: (row) => {
            // for (let i = 0; i < row.length; i++) {
            //   if (row[i] && row[i].employee.first_name) {
            //     const employee = row[i].employee;
            //     return (
            //       employee.last_name +
            //       ", " +
            //       employee.first_name +
            //       " " +
            //       (employee.middle_name ? employee.middle_name[0] + "." : "")
            //     );
            //   }
            // }
            return (
              row.company_employee_id +
              " - " +
              row.last_name +
              ", " +
              row.first_name
            ); // Return 'N/A' if no valid employee is found
          },
          format: (val) => `${val}`,
        },
        ...dayColumns,
        {
          name: "totalHours",
          align: "center",
          label: "Total Hours",
          sortable: true,
          field: (row) => {
            let totalMinutes = 0;

            row.attendance.forEach((entry) => {
              if (entry.time_out === null && entry.time_in !== null) {
                // Handle case where there is no time out
                // console.log("No Time Out for entry:", entry);
                totalMinutes += 0; // or handle it differently if needed
              } else if (
                entry.attendance_type_id !== 1 &&
                entry.attendance_type_id !== undefined
              ) {
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
            return totalHours.toFixed(2);
          },
        },
        {
          name: "totalAbsent",
          align: "center",
          label: "A",
          sortable: true,
          field: (row) => {
            let absentCounter = 0;
            const currentDate = new Date();

            for (let i = 0; i < row.attendance.length; i++) {
              const rowDate = new Date(row.attendance[i].date);

              if (rowDate <= currentDate) {
                if (!row.attendance[i].time_in || !row.attendance[i].time_out) {
                  absentCounter++;
                }
              }
            }

            return absentCounter;
          },
        },
        {
          name: "totalLeave",
          align: "center",
          label: "LVE",
          field: (row) => {
            let leaveCounter = 0;
            for (let i = 0; i < row.attendance.length; i++) {
              if (row.attendance[i].attendance_type_id == 2) {
                leaveCounter++;
              }
            }
            return leaveCounter;
          },
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
