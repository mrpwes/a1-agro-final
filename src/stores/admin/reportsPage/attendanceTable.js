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
              attendance(*, attendance_type(*))`
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
              // field: (row) => {
              //   const currentDate = new Date();
              //   const rowDate = new Date(row.attendance[currentCounter].date);

              //   if (rowDate >= currentDate) {
              //     return "N/A";
              //   }

              //   var totalHours;

              //   if (
              //     row.attendance[currentCounter].time_out === null &&
              //     row.attendance[currentCounter].time_in !== null
              //   ) {
              //     totalHours = "No Time Out";
              //   } else if (
              //     row.attendance[currentCounter].attendance_type_id !== 1 &&
              //     row.attendance[currentCounter].attendance_type_id !==
              //       undefined
              //   ) {
              //     totalHours = this.capitalizeFirstLetterOfEachWord(
              //       row.attendance[currentCounter].attendance_type
              //         .attendance_type_name
              //     );
              //   } else {
              //     const timeIn = new Date(
              //       row.attendance[currentCounter].time_in
              //     );
              //     const timeOut = new Date(
              //       row.attendance[currentCounter].time_out
              //     );

              //     // Set timeIn to 8 AM if it's before 8 AM
              //     const eightAM = new Date(timeIn);
              //     eightAM.setHours(8, 0, 0, 0);
              //     if (timeIn < eightAM) {
              //       timeIn.setHours(8, 0, 0, 0);
              //     }

              //     // Set timeOut to 5 PM if it's after 5 PM
              //     const fivePM = new Date(timeOut);
              //     fivePM.setHours(17, 0, 0, 0);
              //     if (timeOut > fivePM) {
              //       timeOut.setHours(17, 0, 0, 0);
              //     }

              //     totalHours = ((timeOut - timeIn) / (1000 * 60 * 60)).toFixed(
              //       2
              //     );

              //     const onePM = new Date(timeOut);
              //     onePM.setHours(13, 0, 0, 0);
              //     if (timeOut > onePM) {
              //       totalHours = (parseFloat(totalHours) - 1).toFixed(2); // Subtract 1 hour
              //       // console.log("Subtract 1 hour");
              //     }
              //   }
              //   return totalHours;
              // },
              // classes: (row) => {
              //   // const currentDate = new Date();
              //   // const rowDate = new Date(row.attendance[currentCounter].date);

              //   // if (rowDate >= currentDate) {
              //   //   return "!tw-bg-gray-300 !tw-w-[50px] !tw-h-[50px] tw-rounded-lg";
              //   // }

              //   // return row.attendance[currentCounter] &&
              //   //   row.attendance[currentCounter].time_in &&
              //   //   row.attendance[currentCounter].time_out
              //   //   ? "!tw-bg-[#82ff72ad] !tw-w-[50px] !tw-h-[50px] tw-rounded-lg"
              //   //   : "!tw-bg-[#ff8787b0] !tw-w-[50px] !tw-h-[50px] tw-rounded-lg";
              //   const currentDate = new Date();
              //   const rowDate = new Date(row.attendance[currentCounter].date);

              //   if (rowDate >= currentDate) {
              //     return "N/A";
              //   }
              //   var totalHours;
              //   var classContent;

              //   if (
              //     row.attendance[currentCounter].time_out === null &&
              //     row.attendance[currentCounter].time_in !== null
              //   ) {
              //     totalHours = "No Time Out";
              //     classContent = "!tw-bg-[#e11d48]"; // Assuming absent if no time out    /RED
              //   } else if (
              //     row.attendance[currentCounter].attendance_type_id !== 1 &&
              //     row.attendance[currentCounter].attendance_type_id !==
              //       undefined
              //   ) {
              //     classContent = "!tw-bg-[#3b82f6]";
              //   } else {
              //     const timeIn = new Date(
              //       row.attendance[currentCounter].time_in
              //     );
              //     const timeOut = new Date(
              //       row.attendance[currentCounter].time_out
              //     );

              //     // Set timeIn to 8 AM if it's before 8 AM
              //     const eightAM = new Date(timeIn);
              //     eightAM.setHours(8, 0, 0, 0);
              //     if (timeIn < eightAM) {
              //       timeIn.setHours(8, 0, 0, 0);
              //     }

              //     // Set timeOut to 5 PM if it's after 5 PM
              //     const fivePM = new Date(timeOut);
              //     fivePM.setHours(17, 0, 0, 0);
              //     if (timeOut > fivePM) {
              //       timeOut.setHours(17, 0, 0, 0);
              //     }

              //     totalHours = ((timeOut - timeIn) / (1000 * 60 * 60)).toFixed(
              //       2
              //     );

              //     const onePM = new Date(timeOut);
              //     onePM.setHours(13, 0, 0, 0);
              //     if (timeOut > onePM) {
              //       totalHours = (parseFloat(totalHours) - 1).toFixed(2); // Subtract 1 hour
              //       // console.log("Subtract 1 hour");
              //     }

              //     // Check for late arrival
              //     const eightTenAM = new Date(timeIn);
              //     eightTenAM.setHours(8, 10, 0, 0);

              //     // Determine classContent based on totalHours
              //     if (parseFloat(totalHours) >= 8) {
              //       classContent = "!tw-bg-[#4ade80]"; // IF PRESENT 8HRS / Green
              //       // console.log("Present");
              //     } else if (parseFloat(totalHours) == 0) {
              //       classContent = "!tw-bg-[#f87171]"; // IF ABSENT / Red
              //       // console.log("Absent");
              //     } else if (timeIn > eightTenAM) {
              //       classContent = "!tw-bg-[#fb923c]";
              //       if (parseFloat(totalHours) < 5) {
              //         classContent = "!tw-bg-[#ec4899]"; // IF LATE AND UNDERTIME / Pink
              //       }
              //     }
              //   }
              //   return (
              //     classContent + " !tw-w-[50px] !tw-h-[50px] tw-rounded-lg"
              //   );
              // },
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
            let totalHours = 0;

            row.attendance.forEach((entry) => {
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
