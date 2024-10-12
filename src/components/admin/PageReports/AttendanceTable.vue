<script setup>
import { ref } from "vue";
// import { exportFile, useQuasar, date } from "quasar";
import { useAttendanceTableStore } from "stores/admin/reportsPage/attendanceTable";
// import { format } from "date-fns";

//FIXME: PROFILE IMAGE ATTENDANCE REPORT

//FIXME: https://stackoverflow.com/questions/70720370/display-value-derived-from-field-instead-of-field-itself-in-q-table-column
// BETTER CODE FOR DISPLAYING VALUE DERIVED FROM FIELD IN Q-TABLE COLUMN

const attendanceListStore = useAttendanceTableStore();

const tableSearch = ref("");
// const popupEdit = ref(false);
// CSV SAVE

// function wrapCsvValue(val, formatFn, row) {
//   let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

//   formatted =
//     formatted === void 0 || formatted === null ? "" : String(formatted);

//   formatted = formatted.split('"').join('""');
//   /**
//    * Excel accepts \n and \r in strings, but some other CSV parsers do not
//    * Uncomment the next two lines to escape new lines
//    */
//   // .split('\n').join('\\n')
//   // .split('\r').join('\\r')

//   return `"${formatted}"`;
// }

// function exportTable() {
//   const $q = useQuasar();
//   const today = Date.now();
//   const todayTimeStamp = date.formatDate(today, "MMM-D-YYYY");
//   // naive encoding to csv format
//   const content = [columns.map((col) => wrapCsvValue(col.label))]
//     .concat(
//       attendanceListStore.rows.map((row) =>
//         columns
//           .map((col) =>
//             wrapCsvValue(
//               typeof col.field === "function"
//                 ? col.field(row)
//                 : row[col.field === void 0 ? col.name : col.field],
//               col.format,
//               row
//             )
//           )
//           .join(",")
//       )
//     )
//     .join("\r\n");

//   const status = exportFile(
//     `Attendance-Report-${todayTimeStamp}.csv`,
//     content,
//     "text/csv"
//   );

//   if (status !== true) {
//     $q.notify({
//       message: "Browser denied file download...",
//       color: "negative",
//       icon: "warning",
//     });
//   }
// }

// function getNumberOfColumns() {
//   return columns.length;
// }

attendanceListStore.fetchAttendanceReports();
</script>

<!-- 
    class="my-sticky-header-table tw-w-11/12 tw-mx-auto tw-mt-6 tw-bg-white tw-shadow-lg tw-border tw-rounded-3xl tw-border-collapse" -->

<template>
  <q-table
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
    <template v-slot:top-left>
      <q-select
        filled
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
