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

attendanceListStore.getSalaryHistory();
attendanceListStore.fetchAttendanceInRange();

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

const columns = [
  {
    name: "employeeName",
    align: "center",
    label: "Name",
    sortable: true,
    field: (row) => row[0].id,
    format: (val) => `${val}`,
  },
  {
    name: "1",
    align: "center",
    label: "1",
    sortable: true,
    field: (row) => (row[1].time_in && row[1].time_out ? "Present" : "Absent"),
    format: (val) => `${val}`,
  },
  {
    name: "2",
    align: "center",
    label: "2",
    sortable: true,
  },
  {
    name: "3",
    align: "center",
    label: "3",
    sortable: true,
  },
  {
    name: "4",
    align: "center",
    label: "4",
    sortable: true,
  },
  {
    name: "5",
    align: "center",
    label: "5",
    sortable: true,
  },
  {
    name: "6",
    align: "center",
    label: "6",
    sortable: true,
  },
  {
    name: "7",
    align: "center",
    label: "7",
    sortable: true,
  },
  {
    name: "8",
    align: "center",
    label: "8",
    sortable: true,
  },
  {
    name: "9",
    align: "center",
    label: "9",
    sortable: true,
  },
  {
    name: "10",
    align: "center",
    label: "10",
    sortable: true,
  },
  {
    name: "11",
    align: "center",
    label: "11",
    sortable: true,
  },
  {
    name: "12",
    align: "center",
    label: "12",
    sortable: true,
  },
  {
    name: "13",
    align: "center",
    label: "13",
    sortable: true,
  },
  {
    name: "14",
    align: "center",
    label: "14",
    sortable: true,
  },
  {
    name: "15",
    align: "center",
    label: "15",
    sortable: true,
  },
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
    :columns="columns"
    :rows="attendanceListStore.rows"
    :rows-per-page-options="[0]"
    separator="cell"
    row-key="name"
    style="height: 400px"
  >
  </q-table>
</template>
