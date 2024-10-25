<script setup>
import { ref } from "vue";
import { useAttendanceTableStore } from "stores/admin/reportsPage/attendanceTable";
import ViewAttendance from "./AttendanceTable/ViewAttendance.vue";

//FIXME: PROFILE IMAGE ATTENDANCE REPORT

//FIXME: https://stackoverflow.com/questions/70720370/display-value-derived-from-field-instead-of-field-itself-in-q-table-column
// BETTER CODE FOR DISPLAYING VALUE DERIVED FROM FIELD IN Q-TABLE COLUMN

const attendanceListStore = useAttendanceTableStore();

const tableSearch = ref("");
// const popupEdit = ref(false);
// CSV SAVE

function exportTableToCSV(tableId) {
  const table = document.getElementById(tableId);
  let csvContent = "";

  // Get the table headers and remove "arrow_upward"
  const headers = Array.from(table.querySelectorAll("th")).map((th) =>
    th.innerText.replace(/arrow_upward/g, "")
  );
  csvContent += headers.join(",") + "\n";

  // Get the table rows, excluding the last column
  const rows = Array.from(table.querySelectorAll("tr")).slice(1); // Skip the header row
  rows.forEach((row) => {
    const cells = Array.from(row.querySelectorAll("td")).map(
      (td) => td.innerText
    );
    csvContent += cells.join(",") + "\n";
  });

  // Get today's date in the desired format
  const today = new Date();
  const options = { month: "short", day: "2-digit", year: "numeric" };
  const formattedDate = today
    .toLocaleDateString("en-US", options)
    .replace(",", "")
    .replace(/\s+/g, "-");

  // Create a link to download the CSV file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  // Create a temporary link element
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Attendance-Report-${formattedDate}.csv`);

  // Append the link to the body (not visible)
  document.body.appendChild(link);

  // Automatically click the link to trigger the download
  link.click();

  // Clean up: remove the link and revoke the object URL
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

attendanceListStore.fetchAttendanceReports();

function getTotalHours(array, targetObject, row) {
  const targetColumnIndex = findIndexInArray(array, targetObject);
  const targetRow = row.row.attendance[targetColumnIndex - 1];
  return calculateTotalHours(targetRow);
}

function capitalizeFirstLetterOfEachWord(str) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

function findIndexInArray(array, targetObject) {
  return array.findIndex(
    (item) =>
      item.name === targetObject.name &&
      item.align === targetObject.align &&
      item.label === targetObject.label &&
      item.sortable === targetObject.sortable &&
      item.__iconClass === targetObject.__iconClass &&
      item.__thClass === targetObject.__thClass
  );
}

function calculateTotalHours(row) {
  const currentDate = new Date();
  const rowDate = new Date(row.date);

  // Check if the row date is today or in the future
  if (rowDate >= currentDate) {
    return "N/A";
  }

  let totalHours;

  const timeIn = row.time_in ? new Date(row.time_in) : null;
  const timeOut = row.time_out ? new Date(row.time_out) : null;

  // Check if time_in is null and time_out is also null
  if (timeOut === null && timeIn !== null) {
    return "No Time Out";
  } else if (
    row.attendance_type_id !== 1 &&
    row.attendance_type_id !== undefined
  ) {
    return capitalizeFirstLetterOfEachWord(
      row.attendance_type.attendance_type_name
    );
  } else {
    // Set timeIn to 8 AM if it's before 8 AM
    if (timeIn) {
      const eightAM = new Date(timeIn);
      eightAM.setHours(8, 0, 0, 0);
      if (timeIn < eightAM) {
        timeIn.setHours(8, 0, 0, 0);
      }
    }

    // Set timeOut to 5 PM if it's after 5 PM
    if (timeOut) {
      const fivePM = new Date(timeOut);
      fivePM.setHours(17, 0, 0, 0);
      if (timeOut > fivePM) {
        timeOut.setHours(17, 0, 0, 0);
      }

      // Calculate total hours worked
      if (timeIn && timeOut) {
        totalHours = ((timeOut - timeIn) / (1000 * 60 * 60)).toFixed(2);

        const onePM = new Date(timeOut);
        onePM.setHours(13, 0, 0, 0);
        if (timeOut > onePM) {
          totalHours = (parseFloat(totalHours) - 1).toFixed(2); // Subtract 1 hour for lunch
        }
      } else {
        totalHours = "No Time Out";
      }
    } else {
      totalHours = "No Time Out";
    }
  }

  return totalHours;
}
</script>

<!-- 
    class="my-sticky-header-table tw-w-11/12 tw-mx-auto tw-mt-6 tw-bg-white tw-shadow-lg tw-border tw-rounded-3xl tw-border-collapse" -->

<template>
  <q-table
    id="attendance-table"
    class="tw-border tw-rounded-3xl tw-shadow-lg"
    flat
    bordered
    dense
    title="Attendance Report"
    :title-class="['tw-text-xl', 'tw-font-bold']"
    :filter="tableSearch"
    :columns="attendanceListStore.attendanceColumns['columns']"
    :rows="attendanceListStore.rows"
    :rows-per-page-options="[0]"
    separator="cell"
    row-key="name"
  >
    <template v-slot:top-right>
      <q-btn
        color="blue"
        icon-right="archive"
        label="Export to CSV"
        no-caps
        @click="exportTableToCSV('attendance-table')"
        class="tw-mr-16"
    /></template>
    <template v-slot:body-cell-actions="props">
      <q-td key="actions" class="tw-w-2/12" :props="props">
        <ViewAttendance
          :rows="props"
          :columns="props.cols"
          :qBtnLabel="getTotalHours(props.cols, props.col, props)"
          :column="props.col"
        ></ViewAttendance>
      </q-td>
    </template>
    <template v-slot:top-left>
      <div class="tw-text-xl, tw-font-bold">Attendance Report</div>
      <div class="tw-w-3"></div>
      <q-select
        rounded
        standout
        v-model="attendanceListStore.selectedDate"
        @update:model-value="attendanceListStore.fetchAttendanceReports()"
        use-input
        hide-selected
        fill-input
        hide-bottom-space
        input-debounce="0"
        :options="attendanceListStore.selectedDateOptions"
        :option-label="(opt) => opt.date_start + ' ' + opt.date_end"
        class="!tw-pb-0"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select></template
    >

    <template v-slot:bottom
      ><div class="tw-flex tw-items-center tw-ml-5">
        <div class="tw-flex tw-items-center tw-mr-3">
          <div class="tw-rounded-lg tw-w-3 tw-h-6 !tw-bg-[#4ade80]"></div>
          <div class="tw-ml-2">Present</div>
        </div>
        <div class="tw-flex tw-items-center tw-mr-3">
          <div class="tw-rounded-lg tw-w-3 tw-h-6 !tw-bg-[#f87171]"></div>
          <div class="tw-ml-2">Absent</div>
        </div>
        <div class="tw-flex tw-items-center tw-mr-3">
          <div class="tw-rounded-lg tw-w-3 tw-h-6 !tw-bg-[#fb923c]"></div>
          <div class="tw-ml-2">Late</div>
        </div>
        <div class="tw-flex tw-items-center tw-mr-3">
          <div class="tw-rounded-lg tw-w-3 tw-h-6 !tw-bg-[#ec4899]"></div>
          <div class="tw-ml-2">Undertime</div>
        </div>
        <div class="tw-flex tw-items-center tw-mr-3">
          <div class="tw-rounded-lg tw-w-3 tw-h-6 !tw-bg-[#3b82f6]"></div>
          <div class="tw-ml-2">Leave</div>
        </div>
        <div class="tw-flex tw-items-center tw-mr-3">
          <div class="tw-rounded-lg tw-w-3 tw-h-6 !tw-bg-[#fef08a]"></div>
          <div class="tw-ml-2">Holiday</div>
        </div>
      </div>
    </template>
  </q-table>
</template>
