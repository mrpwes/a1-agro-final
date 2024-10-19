<script setup>
import { usePageHeader } from "stores/pageHeader";
import { useAttendanceStore } from "stores/employee/attendancePage/fetchAttendanceDetails";

const storePageHeader = usePageHeader();
storePageHeader.currentPage = "Attendance";

const attendanceStore = useAttendanceStore();

const columns = [
  {
    name: "day",
    required: true,
    label: "Day",
    align: "center  ",
    field: (row) => row.date,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "Time-In",
    align: "center",
    label: "Time-In",
    field: (row) =>
      row.attendance_type && row.attendance_type.id === 2
        ? "Leave"
        : row.time_in,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "Time-Out",
    align: "center",
    label: "Time-Out",
    field: (row) =>
      row.attendance_type && row.attendance_type.id === 2
        ? "Leave"
        : row.time_out,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "Remarks",
    align: "center",
    label: "Remarks",
    field: (row) => row.remarks,
    format: (val) => `${val}`,
    sortable: true,
  },
];

attendanceStore.fetchAttendanceReports();
</script>

<template>
  <div>
    <q-table
      id="attendance-table"
      class="tw-border tw-rounded-3xl tw-shadow-lg"
      flat
      bordered
      dense
      :title-class="['tw-text-xl', 'tw-font-bold']"
      :filter="tableSearch"
      :columns="columns"
      :rows="attendanceStore.rows[0].attendance"
      :rows-per-page-options="[0]"
      separator="cell"
      row-key="name"
    >
      <template v-slot:top-left>
        <div class="tw-w-3"></div>
        <q-select
          rounded
          standout
          v-model="attendanceStore.selectedDate"
          @update:model-value="attendanceStore.fetchAttendanceReports()"
          use-input
          hide-selected
          fill-input
          hide-bottom-space
          input-debounce="0"
          :options="attendanceStore.selectedDateOptions"
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
    </q-table>
  </div>
</template>

<style scoped></style>
